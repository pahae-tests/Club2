import { useState, useEffect } from 'react';
import { Crown, Shield, Trophy, Plus, Edit2, Trash2, Save, X, Calendar, Users, Award, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';

export default function AdminProjets({ isDark }) {
    const [mounted, setMounted] = useState(false);
    const [projects, setProjects] = useState([]);
    const [currentProject, setCurrentProject] = useState({});

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch('/api/projets/get');
                if (!response.ok) throw new Error("Erreur lors de la récupération des projets");
                const data = await response.json();
                setProjects(data || []);
                const current = data.length > 0 ? data.find(p => p.current) : null;
                setCurrentProject(current || {});
            } catch (error) {
                console.error("Erreur:", error);
            }
        };

        fetchProjects();

        if (window.localStorage.getItem("session") == null)
            window.location.href = "./";
    }, []);

    const [showAddModal, setShowAddModal] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [expandedProject, setExpandedProject] = useState(null);
    const [formData, setFormData] = useState({
        titre: '',
        descr: '',
        date: '',
        groupes: [[]],
    });

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        setCurrentProject(projects.length > 0 ? projects.filter(p => p.current)[0] : null);
    }, [projects]);

    const getGroupeRank = (groupe, projet) => {
        if (!projet || !Array.isArray(projet.groupes)) return null;
        const sortedGroupes = [...projet.groupes].sort((a, b) => b.points - a.points);
        const rank = sortedGroupes.findIndex(g => g === groupe) + 1;
        if (rank === 0) return null;
        return rank;
    };

    const getRankBadge = (rank) => {
        if (rank === 1) return { bg: 'bg-gradient-to-r from-yellow-400 to-orange-500', text: '1er', icon: <Trophy className="w-4 h-4" /> };
        if (rank === 2) return { bg: 'bg-gradient-to-r from-gray-300 to-gray-400', text: '2ème', icon: <Award className="w-4 h-4" /> };
        if (rank === 3) return { bg: 'bg-gradient-to-r from-orange-600 to-orange-700', text: '3ème', icon: <Award className="w-4 h-4" /> };
        return null;
    };

    const handleAddProject = () => {
        setFormData({
            titre: '',
            descr: '',
            date: '',
            groupes: [[]],
        });
        setShowAddModal(true);
        setEditingProject(null);
    };

    const handleEditProject = (project) => {
        setFormData({ ...project });
        setEditingProject(project._id);
        setShowAddModal(true);
    };

    const handleDeleteProject = async (id) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
            try {
                const response = await fetch(`/api/projets/delete?id=${id}`, {
                    method: 'DELETE',
                });

                if (!response.ok) throw new Error("Erreur lors de la suppression");

                setProjects(projects.filter(p => p._id !== id));
            } catch (error) {
                console.error("Erreur:", error);
                alert("Erreur lors de la suppression");
            }
        }
    };

    const handleSaveProject = async () => {
        if (!formData.titre || !formData.date) {
            alert('Veuillez remplir tous les champs obligatoires');
            return;
        }

        try {
            const url = editingProject
                ? `/api/projets/update?id=${editingProject}`
                : '/api/projets/add';

            const method = editingProject ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error("Erreur lors de l'enregistrement");

            const result = await response.json();

            if (editingProject) {
                setProjects(projects.map(p => p._id === editingProject ? result : p));
            } else {
                setProjects([...projects, result]);
            }

            setShowAddModal(false);
        } catch (error) {
            console.error("Erreur:", error);
            alert("Erreur lors de l'enregistrement");
        }
    };

    const handleEditCurrentProject = () => {
        setFormData({ ...currentProject });
        setEditingProject('current');
        setShowAddModal(true);
    };

    const handleSaveCurrentProject = async () => {
        if (!formData.titre || !formData.date) {
            alert('Veuillez remplir tous les champs obligatoires');
            return;
        }

        try {
            const response = await fetch(`/api/projets/update?id=${currentProject._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error("Erreur lors de la mise à jour");

            const result = await response.json();

            setCurrentProject(result);
            setProjects(projects.map(p => p._id === result._id ? result : { ...p, current: false }));

            setShowAddModal(false);
        } catch (error) {
            console.error("Erreur:", error);
            alert("Erreur lors de la mise à jour");
        }
    };

    if (!mounted) return null;

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
                                Gestion des Projets
                            </span>
                        </h1>
                    </div>
                    <p className={`text-lg md:text-xl font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                        <Shield className="inline-block w-5 h-5 mr-2" />
                        Club de Cybersécurité Universitaire
                    </p>
                </div>

                {/* Projet Actuel */}
                {currentProject && currentProject.titre && (
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
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleEditCurrentProject}
                                        className="p-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 transition-all"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <Link
                                        href="finaliser"
                                        className="flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-sm font-bold transition-all"
                                    >
                                        <Save className="w-4 h-4 inline mr-2" />
                                        <span className='hidden md:block'>Finaliser</span>
                                    </Link>
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
                                            <div className="flex items-center gap-2 mb-3">
                                                <Users className={`w-5 h-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                                                <h4 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                    Groupe {idx + 1}
                                                </h4>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                                {groupe.members.map((member) => (
                                                    <div key={member._id} className={`flex items-center gap-3 p-3 rounded-lg ${member.admin
                                                        ? 'bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-cyan-500/20 border-2 border-purple-400/50'
                                                        : isDark ? 'bg-gray-700/50' : 'bg-white/70'
                                                        }`}>
                                                        <div className="relative">
                                                            <div className={`w-10 h-10 rounded-full overflow-hidden ring-2 ${member.admin ? 'ring-purple-400' : isDark ? 'ring-gray-600' : 'ring-gray-300'
                                                                }`}>
                                                                <div className={`w-full h-full flex items-center justify-center text-sm font-bold ${isDark ? 'bg-gradient-to-br from-purple-600 to-cyan-600' : 'bg-gradient-to-br from-purple-400 to-cyan-400'
                                                                    } text-white`}>
                                                                    <img src={member.img} className='h-full' />
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
                            </div>
                        </div>
                    </div>
                )}

                {/* Historique des Projets */}
                <div className="max-w-6xl mx-auto">
                    <div className={`rounded-3xl overflow-hidden backdrop-blur-xl ${isDark
                        ? 'bg-black/40 border border-white/10'
                        : 'bg-white/60 border border-gray-200/50'
                        } shadow-2xl`}>
                        <div className="h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500"></div>
                        <div className={`px-6 py-5 flex justify-between items-center border-b ${isDark ? 'bg-gradient-to-r from-purple-900/30 to-cyan-900/30 border-white/10' : 'bg-gradient-to-r from-purple-100/50 to-cyan-100/50 border-gray-200'
                            }`}>
                            <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                Historique des Projets
                            </h2>
                            <button
                                onClick={handleAddProject}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-pink-600 via-purple-500 to-cyan-500 hover:from-pink-700 hover:via-purple-600 hover:to-cyan-600 text-white font-bold transition-all"
                            >
                                <Plus className="w-4 h-4" />
                                <span className="hidden sm:inline">Ajouter</span>
                            </button>
                        </div>
                        <div className="divide-y divide-white/5">
                            {projects.filter(p => !p.current).map((project, index) => (
                                <div key={project._id} className="p-6" style={{ animation: `fadeIn 0.5s ease-out ${index * 0.1}s both` }}>
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                                        <div className="flex-1">
                                            <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                {project.titre}
                                            </h3>
                                            <p className={`text-sm mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                                {project.descr}
                                            </p>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Calendar className={`w-4 h-4 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
                                                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                                                    {new Date(project.date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setExpandedProject(expandedProject === project._id ? null : project._id)}
                                                className={`p-2 rounded-lg ${isDark ? 'bg-gray-700/50 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'} transition-all`}
                                            >
                                                {expandedProject === project._id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                            </button>
                                            <button
                                                onClick={() => handleEditProject(project)}
                                                className="p-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 transition-all"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteProject(project._id)}
                                                className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    {expandedProject === project._id && (
                                        <div className="mt-4 space-y-4">
                                            {project.groupes.map((groupe, idx) => {
                                                const groupRank = getGroupeRank(groupe, project);
                                                const rankBadge = groupRank ? getRankBadge(groupRank) : null;
                                                return (
                                                    <div key={idx} className={`rounded-xl p-4 ${rankBadge
                                                        ? 'border-2 border-yellow-400/50'
                                                        : isDark ? 'bg-gray-800/50' : 'bg-gray-100/50'
                                                        }`}>
                                                        <div className="flex items-center justify-between mb-3">
                                                            <div className="flex items-center gap-2">
                                                                <Users className={`w-5 h-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                                                                <h4 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                                    Groupe {idx + 1}
                                                                </h4>
                                                            </div>
                                                            {rankBadge && (
                                                                <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${rankBadge.bg} text-white text-sm font-bold`}>
                                                                    {rankBadge.icon}
                                                                    {rankBadge.text}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                                            {groupe.members.map((member) => (
                                                                <div key={member._id} className={`flex items-center gap-3 p-3 rounded-lg ${member.admin
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
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className={`rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto ${isDark ? 'bg-gray-900 border border-white/10' : 'bg-white border border-gray-200'
                        }`}>
                        <div className={`sticky top-0 px-6 py-4 border-b flex justify-between items-center ${isDark ? 'bg-gray-900 border-white/10' : 'bg-white border-gray-200'
                            } z-10`}>
                            <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                {editingProject === 'current' ? 'Modifier le projet actuel' : editingProject ? 'Modifier le projet' : 'Ajouter un projet'}
                            </h3>
                            <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-700/50 rounded-lg transition-all">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className={`block text-sm font-bold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Titre *
                                </label>
                                <input
                                    type="text"
                                    value={formData.titre}
                                    onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                                    className={`w-full px-4 py-2 rounded-lg ${isDark ? 'bg-gray-800 text-white border-gray-700' : 'bg-gray-100 text-gray-900 border-gray-300'
                                        } border focus:outline-none focus:ring-2 focus:ring-purple-500`}
                                />
                            </div>
                            <div>
                                <label className={`block text-sm font-bold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Description
                                </label>
                                <textarea
                                    value={formData.descr}
                                    onChange={(e) => setFormData({ ...formData, descr: e.target.value })}
                                    rows="3"
                                    className={`w-full px-4 py-2 rounded-lg ${isDark ? 'bg-gray-800 text-white border-gray-700' : 'bg-gray-100 text-gray-900 border-gray-300'
                                        } border focus:outline-none focus:ring-2 focus:ring-purple-500`}
                                />
                            </div>
                            <div>
                                <label className={`block text-sm font-bold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Date *
                                </label>
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    className={`w-full px-4 py-2 rounded-lg ${isDark ? 'bg-gray-800 text-white border-gray-700' : 'bg-gray-100 text-gray-900 border-gray-300'
                                        } border focus:outline-none focus:ring-2 focus:ring-purple-500`}
                                />
                            </div>
                        </div>
                        <div className={`sticky bottom-0 px-6 py-4 border-t flex justify-end gap-2 ${isDark ? 'bg-gray-900 border-white/10' : 'bg-white border-gray-200'
                            }`}>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className={`px-4 py-2 rounded-lg font-bold transition-all ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                                    }`}
                            >
                                Annuler
                            </button>
                            <button
                                onClick={editingProject === 'current' ? handleSaveCurrentProject : handleSaveProject}
                                className="px-4 py-2 rounded-lg bg-gradient-to-r from-pink-600 via-purple-500 to-cyan-500 hover:from-pink-700 hover:via-purple-600 hover:to-cyan-600 text-white font-bold transition-all"
                            >
                                Enregistrer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}