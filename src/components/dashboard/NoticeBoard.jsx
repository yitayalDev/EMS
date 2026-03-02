import { useState, useEffect } from "react";
import { format } from "date-fns";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import { Bell, AlertCircle, PlusCircle, Trash2 } from "lucide-react";
import { useTranslation } from 'react-i18next';

const NoticeBoard = () => {
    const { t } = useTranslation();
    const { user, can } = useAuth();
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newNotice, setNewNotice] = useState({ title: "", content: "", isImportant: false });

    const canManage = can('manage_notices');

    const fetchNotices = async () => {
        try {
            const { data } = await api.get("notices");
            setNotices(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotices();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await api.post("notices", newNotice);
            setNewNotice({ title: "", content: "", isImportant: false });
            setShowModal(false);
            fetchNotices();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this announcement?")) return;
        try {
            await api.delete(`notices/${id}`);
            fetchNotices();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="bg-white/5 dark:bg-gray-900/40 backdrop-blur-xl rounded-2xl border-2 border-white/10 p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold flex items-center text-gray-900 dark:text-white uppercase tracking-wider">
                    <Bell className="w-5 h-5 mr-2 text-indigo-500" />
                    {t('dashboard.announcements')}
                </h2>
                {canManage && (
                    <button
                        onClick={() => setShowModal(true)}
                        className="text-sm flex items-center bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-900/40 dark:text-indigo-300 px-3 py-1.5 rounded-lg transition"
                    >
                        <PlusCircle className="w-4 h-4 mr-1" /> New
                    </button>
                )}
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-4 max-h-[400px]">
                {loading ? (
                    <p className="text-gray-500 text-sm">Loading announcements...</p>
                ) : notices.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-gray-400 py-10">
                        <Bell className="w-10 h-10 mb-2 opacity-50" />
                        <p>{t('dashboard.noAnnouncements')}</p>
                    </div>
                ) : (
                    notices.map((notice) => (
                        <div
                            key={notice._id}
                            className={`p-4 rounded-xl border ${notice.isImportant
                                ? "bg-red-500/10 border-red-500/30 text-red-100 shadow-[0_0_15px_rgba(239,68,68,0.1)]"
                                : "bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300"
                                } relative group`}
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className={`font-semibold text-base mb-1 flex items-center ${notice.isImportant ? 'text-red-700 dark:text-red-400' : 'text-gray-900 dark:text-gray-100'}`}>
                                        {notice.isImportant && <AlertCircle className="w-4 h-4 mr-1.5" />}
                                        {notice.title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm whitespace-pre-wrap">{notice.content}</p>
                                </div>
                                {canManage && (
                                    <button
                                        onClick={() => handleDelete(notice._id)}
                                        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition ml-2"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                            <div className="mt-3 flex items-center text-xs text-gray-400 dark:text-gray-500">
                                <span className="font-medium mr-2">{notice.createdBy?.name || "Admin"}</span>
                                <span>• {format(new Date(notice.createdAt), "MMM d, h:mm a")}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">Post Announcement</h3>
                        <form onSubmit={handleCreate}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 rounded-lg px-3 py-2 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={newNotice.title}
                                    onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Content</label>
                                <textarea
                                    required
                                    rows="4"
                                    className="w-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 rounded-lg px-3 py-2 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={newNotice.content}
                                    onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
                                />
                            </div>
                            <div className="mb-6 flex items-center">
                                <input
                                    type="checkbox"
                                    id="urgent"
                                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                    checked={newNotice.isImportant}
                                    onChange={(e) => setNewNotice({ ...newNotice, isImportant: e.target.checked })}
                                />
                                <label htmlFor="urgent" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                    Mark as Important (Red Highlight)
                                </label>
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition"
                                >
                                    Post
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NoticeBoard;
