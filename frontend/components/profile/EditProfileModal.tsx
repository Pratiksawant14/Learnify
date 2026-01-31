'use client';

import { useState, useEffect } from 'react';
import { X, Save, Loader2, User, FileText, AtSign } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { profileService, UserProfile } from '@/services/profileService';

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentProfile: UserProfile | null;
    onProfileUpdated: () => void;
}

export default function EditProfileModal({ isOpen, onClose, currentProfile, onProfileUpdated }: EditProfileModalProps) {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    // Form State
    const [name, setName] = useState('');
    // const [username, setUsername] = useState(''); // Backend has no username col
    const [bio, setBio] = useState('');

    // Load initial data when valid profile is passed
    useEffect(() => {
        if (currentProfile) {
            setName(currentProfile.name || '');
            // setUsername(currentProfile.username || '');
            setBio(currentProfile.bio || '');
        }
    }, [currentProfile, isOpen]);

    if (!isOpen || !user) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await profileService.updateProfile(user.id, {
                name: name,
                // username: username,
                bio: bio
            });
            onProfileUpdated();
            onClose();
        } catch (error) {
            console.error(error);
            alert("Failed to update profile");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-slate-950">
                    <h3 className="text-xl font-bold text-white">Edit Profile</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="space-y-4">
                        {/* Display Name */}
                        <div className="space-y-2">
                            <label className="text-xs text-slate-500 font-bold uppercase tracking-wider">Display Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-700"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                        </div>

                        {/* Bio */}
                        <div className="space-y-2">
                            <label className="text-xs text-slate-500 font-bold uppercase tracking-wider pl-1">Bio</label>
                            <div className="relative">
                                <FileText className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                                <textarea
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-700 min-h-[100px] resize-none"
                                    placeholder="Tell us about yourself..."
                                />
                            </div>
                            <p className="text-xs text-slate-600 text-right">{bio.length}/160</p>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> Save Changes</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
