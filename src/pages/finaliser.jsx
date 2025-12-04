import { useState, useEffect } from 'react';
import { Crown, Shield, Trophy, Save, Calendar, Users, Award, ThumbsUp } from 'lucide-react';
import Link from 'next/link';

export default function Finaliser({ isDark }) {
    const [mounted, setMounted] = useState(false);
    const [currentProject, setCurrentProject] = useState(null);
    const [votes, setVotes] = useState([]);

    useEffect(() => {
        const fetchCurrentProject = async () => {
            try {
                const response = await fetch('/api/projets/getOne');
                if (!response.ok) throw new Error("Erreur lors de la récupération du projet");
                const data = await response.json();
                console.log(data)
                setCurrentProject(data);
                setVotes(data.groupes.map(() => 0));
            } catch (error) {
                alert("Erreur:" + error);
            }
        };
        fetchCurrentProject();

        if (window.localStorage.getItem("session") == null)
            window.location.href = "./";
    }, []);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        console.log(currentProject)
    }, [currentProject])

    const handleVoteChange = (groupIndex, value) => {
        const newVotes = [...votes];
        newVotes[groupIndex] = Math.max(0, parseInt(value) || 0);
        setVotes(newVotes);
    };

    const handleSave = async () => {
        try {
            const response = await fetch('/api/projets/finaliser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    projectId: currentProject._id,
                    votes,
                }),
            });

            if (!response.ok) throw new Error("Erreur lors de l'enregistrement des votes");

            alert('Votes enregistrés avec succès !');
        } catch (error) {
            console.error("Erreur:", error);
            alert("Erreur lors de l'enregistrement des votes");
        }
    };

    if (!mounted || !currentProject) return null;

    return (
        <div className={`min-h-screen transition-all duration-700 ${isDark
            ? 'bg-gradient-to-br from-[#0a0a0a] via-[#1a0a2e] to-[#0a0a0a]'
            : 'bg-gradient-to-br from-[#f4f4f4] via-[#e8e8f5] to-[#f4f4f4]'
            }`}>
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className={`absolute top-20 left-10 w-96 h-96 rounded-full blur-3xl opacity-20 animate-pulse ${isDark ? 'bg-purple-600' : 'bg-purple-400'
                    }`} style={{ animationDuration: '4s' }}></div>
                <div className={`absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl opacity-20 animate-pulse ${isDark ? 'bg-cyan-600' : 'bg-cyan-400'
                    }`} style={{ animationDuration: '6s' }}></div>
            </div>
            <div className="relative z-10 container mx-auto px-4 py-12">
                <div className="text-center mb-12 mt-20">
                    <div className="inline-block mb-6">
                        <h1 className={`relative text-4xl md:text-6xl font-black tracking-tight ${isDark ? 'text-white' : 'text-gray-900'
                            }`}>
                            <span className="bg-gradient-to-r from-pink-600 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
                                Finaliser le Projet
                            </span>
                        </h1>
                    </div>
                    <p className={`text-lg md:text-xl font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                        <Shield className="inline-block w-5 h-5 mr-2" />
                        Attribuer les votes pour le meilleur projet
                    </p>
                </div>

                <div className="max-w-6xl mx-auto mb-12">
                    <div className={`rounded-3xl overflow-hidden backdrop-blur-xl ${isDark
                        ? 'bg-black/40 border border-white/10'
                        : 'bg-white/60 border border-gray-200/50'
                        } shadow-2xl`}>
                        <div className="h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500"></div>

                        <div className={`px-6 py-5 flex justify-between items-center border-b ${isDark ? 'bg-gradient-to-r from-purple-900/30 to-cyan-900/30 border-white/10' : 'bg-gradient-to-r from-purple-100/50 to-cyan-100/50 border-gray-200'
                            }`}>
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                                <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    Projet en cours
                                </h2>
                            </div>
                        </div>
                        <div className="p-6">
                            <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                {currentProject.titre}
                            </h3>
                            <p className={`mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                {currentProject.descr}
                            </p>
                            <div className="flex items-center gap-2 text-sm mb-6">
                                <Calendar className={`w-4 h-4 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
                                <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                                    {new Date(currentProject.date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </span>
                            </div>
                            <div className="space-y-4">
                                {currentProject.groupes.map((groupe, idx) => (
                                    <div key={idx} className={`rounded-xl p-4 ${isDark ? 'bg-gray-800/50' : 'bg-gray-100/50'}`}>
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <Users className={`w-5 h-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                                                <h4 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                    Groupe {idx + 1}
                                                </h4>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <label className={`text-sm font-bold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                                    <ThumbsUp className="w-4 h-4 inline mr-2" />
                                                    Votes:
                                                </label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={votes[idx]}
                                                    onChange={(e) => handleVoteChange(idx, e.target.value)}
                                                    className={`w-20 px-3 py-2 rounded-lg text-center font-bold ${isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'
                                                        } border focus:outline-none focus:ring-2 focus:ring-purple-500`}
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                            {groupe.members.map((member) => (
                                                <div key={member.id} className={`flex items-center gap-3 p-3 rounded-lg ${member.admin
                                                    ? 'bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-cyan-500/20 border-2 border-purple-400/50'
                                                    : isDark ? 'bg-gray-700/50' : 'bg-white/70'
                                                    }`}>
                                                    <div className="relative">
                                                        <div className={`w-10 h-10 rounded-full overflow-hidden ring-2 ${member.admin ? 'ring-purple-400' : isDark ? 'ring-gray-600' : 'ring-gray-300'
                                                            }`}>
                                                            <div className={`w-full h-full flex items-center justify-center text-sm font-bold ${isDark ? 'bg-gradient-to-br from-purple-600 to-cyan-600' : 'bg-gradient-to-br from-purple-400 to-cyan-400'
                                                                } text-white`}>
                                                                {member.prenom[0]}{member.nom[0]}
                                                            </div>
                                                        </div>
                                                        {member.admin && (
                                                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                                                                <Shield className="w-3 h-3 text-white" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className={`text-sm font-semibold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                            {member.prenom} {member.nom}
                                                        </div>
                                                        {member.admin && (
                                                            <div className="text-xs text-purple-400 font-bold">ADMIN</div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 flex justify-end gap-3">
                                <Link
                                    href="projets"
                                    className={`px-6 py-3 rounded-lg font-bold transition-all ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                                        }`}
                                >
                                    Retour
                                </Link>
                                <button
                                    onClick={handleSave}
                                    className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold transition-all"
                                >
                                    <Save className="w-5 h-5" />
                                    Enregistrer les votes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}