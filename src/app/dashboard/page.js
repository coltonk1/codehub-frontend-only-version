"use client";

import { useEffect, useRef, useState } from "react";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { db, storage } from "@/lib/firebase";
import {
    getDownloadURL,
    ref as storageRef,
    uploadBytes,
} from "firebase/storage";
import {
    getDatabase,
    ref,
    onValue,
    push,
    set,
    remove,
    update,
} from "firebase/database";

export default function Page() {
    const [user, setUser] = useState(null);
    const [checkingAuth, setCheckingAuth] = useState(true);
    const [active, setActive] = useState("templates");

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (u) => {
            if (!u || !u.email) {
                window.location.href = "/auth";
                return;
            }

            const safeEmail = u.email.replaceAll(".", ",");
            const adminRef = ref(db, `admins/${safeEmail}`);

            onValue(adminRef, (snapshot) => {
                if (!snapshot.exists()) {
                    alert("Access denied: admin only");
                    window.location.href = "/";
                    return;
                }
                setUser(u);
                setCheckingAuth(false);
            });
        });

        return () => unsubscribe();
    }, []);

    if (checkingAuth) return null;

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="w-48 p-4 border-r border-gray-200">
                <h2 className="font-bold mb-4 text-lg">Dashboard</h2>
                <nav className="space-y-2">
                    <button
                        onClick={() => setActive("templates")}
                        className={`block w-full text-left px-2 py-1 rounded ${
                            active === "templates"
                                ? "bg-blue-600 text-white"
                                : "hover:bg-gray-200"
                        }`}
                    >
                        Templates
                    </button>
                    <button
                        onClick={() => setActive("projects")}
                        className={`block w-full text-left px-2 py-1 rounded ${
                            active === "projects"
                                ? "bg-blue-600 text-white"
                                : "hover:bg-gray-200"
                        }`}
                    >
                        Projects
                    </button>
                    <button
                        onClick={() => setActive("forms")}
                        className={`block w-full text-left px-2 py-1 rounded ${
                            active === "forms"
                                ? "bg-blue-600 text-white"
                                : "hover:bg-gray-200"
                        }`}
                    >
                        Forms
                    </button>
                    <button
                        onClick={() => setActive("faqs")}
                        className={`block w-full text-left px-2 py-1 rounded ${
                            active === "faqs"
                                ? "bg-blue-600 text-white"
                                : "hover:bg-gray-200"
                        }`}
                    >
                        FAQs
                    </button>
                    <button
                        onClick={() => setActive("users")}
                        className={`block w-full text-left px-2 py-1 rounded ${
                            active === "users"
                                ? "bg-blue-600 text-white"
                                : "hover:bg-gray-200"
                        }`}
                    >
                        User Manager
                    </button>
                    <button
                        onClick={() => setActive("alert")}
                        className={`block w-full text-left px-2 py-1 rounded ${
                            active === "alert"
                                ? "bg-blue-600 text-white"
                                : "hover:bg-gray-200"
                        }`}
                    >
                        Change Alert
                    </button>
                    <LogoutButton />
                </nav>
            </aside>

            {/* Main content */}
            <main className="flex-1 p-6 overflow-y-auto">
                {active === "templates" && <TemplateManager />}
                {active === "projects" && <ProjectEditing />}
                {active === "forms" && <FormManager />}
                {active === "faqs" && <FAQManager />}
                {active === "users" && <UserManager />}
                {active === "alert" && <AlertEditor />}
            </main>
        </div>
    );
}

function LogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.push("/");
        } catch (e) {
            console.error("Logout failed:", e);
        }
    };

    return (
        <button
            onClick={handleLogout}
            className="block w-full bg-red-500 text-white text-left px-2 py-1 rounded hover:bg-gray-200"
        >
            Log out
        </button>
    );
}

function UserManager() {
    const [adminEmails, setAdminEmails] = useState([]);
    const [newAdminEmail, setNewAdminEmail] = useState("");

    useEffect(() => {
        const refAdmins = ref(db, "admins");
        const unsubscribe = onValue(refAdmins, (snap) => {
            const data = snap.val() || {};
            setAdminEmails(Object.keys(data));
        });
        return () => unsubscribe();
    }, []);

    const handleAddAdmin = async (e) => {
        e.preventDefault();
        if (!newAdminEmail.trim()) return;

        const sanitizedEmail = newAdminEmail.trim().replaceAll(".", ",");
        await set(ref(db, `admins/${sanitizedEmail}`), true);
        setNewAdminEmail("");
    };

    return (
        <section className="max-w-4xl mx-auto px-4 py-16 space-y-10">
            <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                    Admin User Manager
                </h1>
                <form onSubmit={handleAddAdmin} className="flex gap-3 max-w-md">
                    <input
                        type="email"
                        placeholder="Enter admin email"
                        value={newAdminEmail}
                        onChange={(e) => setNewAdminEmail(e.target.value)}
                        className="flex-1 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                    >
                        Add
                    </button>
                </form>
            </div>

            <div>
                <h2 className="text-xl font-semibold text-gray-700 mb-3">
                    Current Admins
                </h2>
                <ul className="space-y-2 text-sm">
                    {adminEmails.map((email) => (
                        <li
                            key={email}
                            className="border border-gray-200 rounded px-4 py-2 bg-gray-50"
                        >
                            {email.replaceAll(",", ".")}
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}

const CATEGORIES = [
    "front end only",
    "back end only",
    "full stack",
    "console",
    "other",
];

function TemplateManager() {
    const [user, setUser] = useState(null);
    const [checkingAuth, setCheckingAuth] = useState(true);
    const [templates, setTemplates] = useState([]);
    const [form, setForm] = useState({
        title: "",
        description: "",
        technology: "",
        github: "",
        category: CATEGORIES[0],
    });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (u) => {
            if (!u) {
                window.location.href = "/auth";
            } else {
                setUser(u);
                setCheckingAuth(false);
            }
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!user) return;
        const templatesRef = ref(db, "templates");
        const unsubscribe = onValue(templatesRef, (snapshot) => {
            const data = snapshot.val() || {};
            const loaded = Object.entries(data).map(([id, val]) => ({
                id,
                ...val,
            }));
            setTemplates(loaded);
        });
        return () => unsubscribe();
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const entry = {
            ...form,
            createdBy: user.uid,
            createdAt: Date.now(),
        };
        if (editingId) {
            await update(ref(db, `templates/${editingId}`), entry);
            setEditingId(null);
        } else {
            const newRef = push(ref(db, "templates"));
            await set(newRef, entry);
        }
        setForm({
            title: "",
            description: "",
            technology: "",
            github: "",
            category: CATEGORIES[0],
        });
    };

    const handleEdit = (template) => {
        setForm({
            title: template.title,
            description: template.description,
            technology: template.technology,
            github: template.github,
            category: template.category,
        });
        setEditingId(template.id);
    };

    const handleDelete = async (id) => {
        if (confirm("Are you sure you want to delete this template?")) {
            await remove(ref(db, `templates/${id}`));
        }
    };

    if (checkingAuth) return null;

    return (
        <section className="max-w-4xl mx-auto px-4 py-16 space-y-12">
            <div>
                <h1 className="text-3xl font-bold mb-6 text-gray-800">
                    Starter Code Templates
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Title"
                        value={form.title}
                        onChange={(e) =>
                            setForm({ ...form, title: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <textarea
                        placeholder="Description"
                        value={form.description}
                        onChange={(e) =>
                            setForm({ ...form, description: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <input
                        placeholder="Technology"
                        value={form.technology}
                        onChange={(e) =>
                            setForm({ ...form, technology: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded px-4 py-2"
                        required
                    />
                    <input
                        placeholder="GitHub Link"
                        value={form.github}
                        onChange={(e) =>
                            setForm({ ...form, github: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded px-4 py-2"
                        required
                    />
                    <select
                        value={form.category}
                        onChange={(e) =>
                            setForm({ ...form, category: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded px-4 py-2"
                    >
                        {CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                    >
                        {editingId ? "Update Template" : "Submit Template"}
                    </button>
                </form>
            </div>

            <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-700 mb-2">
                    Existing Templates
                </h2>
                {templates.map((t) => (
                    <div
                        key={t.id}
                        className="border border-gray-200 rounded-xl px-4 py-3 bg-gray-50"
                    >
                        <h3 className="font-bold text-lg text-gray-800">
                            {t.title}
                        </h3>
                        <p className="text-sm text-gray-700 mb-1">
                            {t.description}
                        </p>
                        <p className="text-sm text-gray-600">
                            <strong>Tech:</strong> {t.technology}
                        </p>
                        <p className="text-sm text-gray-500">
                            <strong>Category:</strong> {t.category}
                        </p>
                        <a
                            href={t.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 text-sm underline mt-1 inline-block"
                        >
                            View GitHub Repo
                        </a>
                        <div className="flex gap-2 mt-3">
                            <button
                                onClick={() => handleEdit(t)}
                                className="text-yellow-700 border border-yellow-600 text-sm px-2 py-1 rounded hover:bg-yellow-50"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(t.id)}
                                className="text-red-700 border border-red-600 text-sm px-2 py-1 rounded hover:bg-red-50"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

function FormManager() {
    const [user, setUser] = useState(null);
    const [checkingAuth, setCheckingAuth] = useState(true);
    const [formEmbeds, setFormEmbeds] = useState([]);
    const [formEmbedData, setFormEmbedData] = useState({ title: "", url: "" });
    const [editingFormId, setEditingFormId] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (u) => {
            if (!u) {
                window.location.href = "/auth";
            } else {
                setUser(u);
                setCheckingAuth(false);
            }
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!user) return;
        const formsRef = ref(db, "forms");
        const unsubscribe = onValue(formsRef, (snapshot) => {
            const data = snapshot.val() || {};
            const loadedForms = Object.entries(data).map(([id, val]) => ({
                id,
                ...val,
            }));
            setFormEmbeds(loadedForms);
        });
        return () => unsubscribe();
    }, [user]);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const entry = {
            title: formEmbedData.title,
            url: formEmbedData.url,
            createdAt: Date.now(),
            createdBy: user.uid,
        };
        if (editingFormId) {
            await update(ref(db, `forms/${editingFormId}`), entry);
            setEditingFormId(null);
        } else {
            const newRef = push(ref(db, "forms"));
            await set(newRef, entry);
        }
        setFormEmbedData({ title: "", url: "" });
    };

    const handleEditForm = (form) => {
        setFormEmbedData({ title: form.title, url: form.url });
        setEditingFormId(form.id);
    };

    const handleDeleteForm = async (id) => {
        if (confirm("Are you sure you want to delete this form?")) {
            await remove(ref(db, `forms/${id}`));
        }
    };

    if (checkingAuth) return null;

    return (
        <section className="max-w-4xl mx-auto px-4 py-16 space-y-12">
            <div>
                <h1 className="text-3xl font-bold mb-6 text-gray-800">
                    Google Forms Manager
                </h1>

                <form onSubmit={handleFormSubmit} className="space-y-4">
                    <input
                        placeholder="Form Title"
                        value={formEmbedData.title}
                        onChange={(e) =>
                            setFormEmbedData({
                                ...formEmbedData,
                                title: e.target.value,
                            })
                        }
                        className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <input
                        placeholder="Google Form Embed URL"
                        value={formEmbedData.url}
                        onChange={(e) =>
                            setFormEmbedData({
                                ...formEmbedData,
                                url: e.target.value,
                            })
                        }
                        className="w-full border border-gray-300 rounded px-4 py-2"
                        required
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-green-700 transition w-full"
                    >
                        {editingFormId ? "Update Form" : "Submit Form"}
                    </button>
                </form>
            </div>

            <div>
                <h2 className="text-xl font-semibold text-gray-700 mb-4">
                    All Uploaded Forms
                </h2>
                <div className="space-y-6">
                    {formEmbeds.map((form) => (
                        <div key={form.id} className="border-b pb-4">
                            <a
                                href={`/forms/${form.title
                                    .toLowerCase()
                                    .replaceAll(" ", "-")}`}
                                className="text-lg font-bold text-blue-700 hover:underline"
                            >
                                {form.title}
                            </a>
                            <p className="text-sm text-gray-600 break-words mt-1 mb-2">
                                {form.url}
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEditForm(form)}
                                    className="text-sm text-yellow-700 border border-yellow-600 px-2 py-1 rounded hover:bg-yellow-50"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDeleteForm(form.id)}
                                    className="text-sm text-red-700 border border-red-600 px-2 py-1 rounded hover:bg-red-50"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function ProjectEditing() {
    const [user, setUser] = useState(null);
    const [checkingAuth, setCheckingAuth] = useState(true);
    const [projects, setProjects] = useState([]);
    const [form, setForm] = useState({
        title: "",
        description: "",
        github: "",
        live: "",
        year: "",
        semester: "",
        technologies: "",
        developers: "",
        imageFile: null,
        imageUrl: "",
    });
    const [editingId, setEditingId] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (u) => {
            if (!u) {
                window.location.href = "/auth";
            } else {
                setUser(u);
                setCheckingAuth(false);
            }
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!user) return;
        const projectsRef = ref(db, "projects");

        const unsubscribe = onValue(projectsRef, (snapshot) => {
            const data = snapshot.val() || {};
            const loadedProjects = Object.entries(data).map(([id, val]) => ({
                id,
                ...val,
            }));
            setProjects(loadedProjects);
        });

        return () => unsubscribe();
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        let imageUrl = form.imageUrl || "";
        if (form.imageFile) {
            const imgRef = storageRef(
                storage,
                `projects/${Date.now()}-${form.imageFile.name}`
            );
            await uploadBytes(imgRef, form.imageFile);
            imageUrl = await getDownloadURL(imgRef);
        }

        const projectData = {
            ...form,
            technologies: form.technologies.split(",").map((t) => t.trim()),
            developers: form.developers.split(",").map((d) => d.trim()),
            imageUrl,
            createdBy: user.uid,
            createdAt: Date.now(),
        };

        delete projectData.imageFile;

        if (editingId) {
            await update(ref(db, `projects/${editingId}`), projectData);
            setEditingId(null);
        } else {
            const newProjectRef = push(ref(db, "projects"));
            await set(newProjectRef, projectData);
        }

        setForm({
            title: "",
            description: "",
            github: "",
            live: "",
            year: "",
            semester: "",
            technologies: "",
            developers: "",
            imageFile: null,
            imageUrl: "",
        });
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleDelete = async (id) => {
        if (confirm("Are you sure you want to delete this project?")) {
            await remove(ref(db, `projects/${id}`));
        }
    };

    const handleEdit = (project) => {
        setForm({
            ...project,
            technologies: project.technologies.join(", "),
            developers: project.developers.join(", "),
            imageFile: null,
        });
        setEditingId(project.id);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    if (checkingAuth) return null;

    return (
        <div className="max-w-4xl mx-auto px-4 py-16">
            <h1 className="text-3xl font-bold mb-8">Project Dashboard</h1>

            <form onSubmit={handleSubmit} className="space-y-4 mb-12 max-w-2xl">
                <input
                    placeholder="Title"
                    value={form.title}
                    onChange={(e) =>
                        setForm({ ...form, title: e.target.value })
                    }
                    className="w-full border border-gray-300 px-4 py-2 rounded"
                />
                <textarea
                    placeholder="Description"
                    value={form.description}
                    onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                    }
                    className="w-full border border-gray-300 px-4 py-2 rounded"
                />
                <input
                    placeholder="GitHub URL"
                    value={form.github}
                    onChange={(e) =>
                        setForm({ ...form, github: e.target.value })
                    }
                    className="w-full border border-gray-300 px-4 py-2 rounded"
                />
                <input
                    placeholder="Live URL"
                    value={form.live}
                    onChange={(e) => setForm({ ...form, live: e.target.value })}
                    className="w-full border border-gray-300 px-4 py-2 rounded"
                />
                <div className="flex gap-4">
                    <select
                        value={form.semester}
                        onChange={(e) =>
                            setForm({ ...form, semester: e.target.value })
                        }
                        className="w-1/2 border border-gray-300 px-4 py-2 rounded"
                    >
                        <option value="">Select Semester</option>
                        <option value="Fall">Fall</option>
                        <option value="Spring">Spring</option>
                    </select>
                    <input
                        type="number"
                        placeholder="Year"
                        value={form.year}
                        onChange={(e) =>
                            setForm({ ...form, year: e.target.value })
                        }
                        className="w-1/2 border border-gray-300 px-4 py-2 rounded"
                        min="1900"
                        max="2100"
                    />
                </div>
                <input
                    placeholder="Technologies (comma separated)"
                    value={form.technologies}
                    onChange={(e) =>
                        setForm({ ...form, technologies: e.target.value })
                    }
                    className="w-full border border-gray-300 px-4 py-2 rounded"
                />
                <input
                    placeholder="Developers (comma separated)"
                    value={form.developers}
                    onChange={(e) =>
                        setForm({ ...form, developers: e.target.value })
                    }
                    className="w-full border border-gray-300 px-4 py-2 rounded"
                />
                <label>Choose an image: </label>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) =>
                        setForm({ ...form, imageFile: e.target.files[0] })
                    }
                    className="text-sm border-gray-200 border px-4"
                />
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
                >
                    {editingId ? "Update Project" : "Submit Project"}
                </button>
            </form>

            <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">
                    All Projects
                </h2>
                {projects.map((p) => (
                    <div
                        key={p.id}
                        className="border-b pb-6 flex gap-4 items-start"
                    >
                        {p.imageUrl && (
                            <img
                                src={p.imageUrl}
                                alt={`${p.title} preview`}
                                className="w-32 h-auto rounded-lg object-cover"
                            />
                        )}
                        <div className="flex-1">
                            <a
                                href={`/projects/${p.title
                                    .toLowerCase()
                                    .replaceAll(" ", "-")}`}
                                className="block hover:underline"
                            >
                                <h3 className="text-lg font-bold text-gray-800">
                                    {p.title}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    {p.semester} {p.year}
                                </p>
                                <p className="text-sm text-gray-700 mt-1 line-clamp-2">
                                    {p.description}
                                </p>
                            </a>
                            <div className="flex gap-2 mt-3">
                                <button
                                    onClick={() => handleEdit(p)}
                                    className="text-sm text-yellow-700 border border-yellow-600 px-3 py-1 rounded hover:bg-yellow-50"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(p.id)}
                                    className="text-sm text-red-700 border border-red-600 px-3 py-1 rounded hover:bg-red-50"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function FAQManager() {
    const [user, setUser] = useState(null);
    const [checkingAuth, setCheckingAuth] = useState(true);
    const [faqs, setFaqs] = useState([]);
    const [form, setForm] = useState({ question: "", answer: "" });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (u) => {
            if (!u) {
                window.location.href = "/auth";
            } else {
                setUser(u);
                setCheckingAuth(false);
            }
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!user) return;
        const faqRef = ref(db, "faqs");
        const unsubscribe = onValue(faqRef, (snapshot) => {
            const data = snapshot.val() || {};
            const loaded = Object.entries(data).map(([id, val]) => ({
                id,
                ...val,
            }));
            setFaqs(loaded);
        });
        return () => unsubscribe();
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const entry = {
            question: form.question,
            answer: form.answer,
            createdBy: user.uid,
            createdAt: Date.now(),
        };
        if (editingId) {
            await update(ref(db, `faqs/${editingId}`), entry);
            setEditingId(null);
        } else {
            const newRef = push(ref(db, "faqs"));
            await set(newRef, entry);
        }
        setForm({ question: "", answer: "" });
    };

    const handleEdit = (faq) => {
        setForm({ question: faq.question, answer: faq.answer });
        setEditingId(faq.id);
    };

    const handleDelete = async (id) => {
        if (confirm("Are you sure you want to delete this FAQ?")) {
            await remove(ref(db, `faqs/${id}`));
        }
    };

    if (checkingAuth) return null;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Manage FAQs
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 mb-10">
                <input
                    placeholder="Question"
                    value={form.question}
                    onChange={(e) =>
                        setForm({ ...form, question: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-md p-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                    placeholder="Answer"
                    value={form.answer}
                    onChange={(e) =>
                        setForm({ ...form, answer: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-md p-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                />
                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition w-full"
                >
                    {editingId ? "Update FAQ" : "Submit FAQ"}
                </button>
            </form>

            <div className="divide-y">
                {faqs.map((f) => (
                    <div key={f.id} className="py-4">
                        <h3 className="font-semibold text-gray-900 mb-1">
                            Q: {f.question}
                        </h3>
                        <p className="text-sm text-gray-700 mb-2">
                            A: {f.answer}
                        </p>
                        <div className="flex gap-2 mt-1">
                            <button
                                onClick={() => handleEdit(f)}
                                className="text-sm text-yellow-700 border border-yellow-600 px-3 py-1 rounded hover:bg-yellow-50"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(f.id)}
                                className="text-sm text-red-700 border border-red-600 px-3 py-1 rounded hover:bg-red-50"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

async function updateSiteAlert({ message, expiresAt }) {
    try {
        const alertRef = ref(db, "siteAlert");
        await set(alertRef, { message, expiresAt });
        return { success: true };
    } catch (err) {
        console.error("Failed to update alert:", err);
        return { success: false, error: err };
    }
}

function AlertEditor() {
    const [message, setMessage] = useState("");
    const [expires, setExpires] = useState("");

    const handleSubmit = async () => {
        const expiresAt = new Date(expires).getTime();

        if (!message || isNaN(expiresAt)) {
            alert("Invalid input.");
            return;
        }

        const res = await updateSiteAlert({ message, expiresAt });
        if (res.success) {
            alert("Alert updated!");
        } else {
            alert("Failed to update.");
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-4 ">
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Alert message"
                className="w-full border border-gray-300 rounded-md p-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
                type="datetime-local"
                value={expires}
                onChange={(e) => setExpires(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
                onClick={handleSubmit}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition w-full"
            >
                Update Alert
            </button>
        </div>
    );
}
