import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { forumService } from '../services/forumService';
import { ArrowLeft, ShieldAlert } from 'lucide-react';
import { getProfileColor } from '../typescriptfile/utils';
import { useLanguage } from '../contexts/LanguageContext';

const BlockedUsersPage: React.FC = () => {
    const [blockedUsers, setBlockedUsers] = useState<any[]>([]);
    const navigate = useNavigate();
    const { lang } = useLanguage();

    useEffect(() => {
        const fetchBlockedUsers = async () => {
            try {
                const data = await forumService.getBlockedUsers();
                setBlockedUsers(data);
            } catch (err) {
                console.error("Error fetching blocked users:", err);
            }
        };
        fetchBlockedUsers();
    }, []);

    const handleUnblock = async (blockedUserId: string) => {
        try {
            await forumService.unblockUser(blockedUserId);
            setBlockedUsers(prev => prev.filter(u => u.id !== blockedUserId));
        } catch {
            alert("Failed to unblock");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-gray-900 p-4 pt-10">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-blue-500 mb-6 font-black text-[10px] tracking-widest uppercase transition-colors">
                <ArrowLeft size={16} /> Back
            </button>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                <ShieldAlert className="text-red-600" size={24} />
                {lang === "bn" ? "ব্লক লিস্ট" : "Blocked Users"}
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="space-y-3">
                    {blockedUsers.map((blockedUser) => (
                        <div key={blockedUser.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                            <div className="flex items-center gap-3">
                                <div className={`h-10 w-10 rounded-lg bg-gradient-to-tr ${getProfileColor(blockedUser.name)} flex items-center justify-center text-white font-black text-sm border border-white dark:border-gray-700 uppercase shadow-sm`}>
                                    {blockedUser.name[0]}
                                </div>
                                <div>
                                    <p className="font-black text-gray-800 dark:text-gray-200 text-sm">{blockedUser.name}</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">@{blockedUser.username}</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => handleUnblock(blockedUser.id)}
                                className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg text-xs font-bold hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                            >
                                {lang === "bn" ? "আনব্লক" : "Unblock"}
                            </button>
                        </div>
                    ))}
                    {blockedUsers.length === 0 && (
                        <p className="text-center py-10 text-gray-400 text-sm">No blocked users.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BlockedUsersPage;
