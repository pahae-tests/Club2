import { useState, useEffect, useRef } from 'react'; 
import { Users, Plus, Edit2, Trash2, Save, X, Shield, Crown, Award, Flag, ChevronDown, ChevronUp, Search, ArrowUpDown, ArrowUp, ArrowDown, UserCheck, CheckCircle2, Circle } from 'lucide-react';

export default function AdminMembres({ isDark }) {
  const [mounted, setMounted] = useState(false);
  const [membres, setMembres] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'points', direction: 'desc' });

  useEffect(() => {
    const fetchMembres = async () => {
      try {
        const response = await fetch('/api/membres/get');
        if (!response.ok) throw new Error("Erreur lors de la récupération des membres");
        const data = await response.json();
        setMembres(data);
      } catch (error) {
        console.error("Erreur:", error);
      }
    };
    fetchMembres();
  }, []);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMembre, setEditingMembre] = useState(null);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    tel: '',
    email: '',
    dateN: '1989-01-01',
    ville: 'walo',
    points: 0,
    admin: false,
    img: ''
  });
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const [session, setSession] = useState(null);

  // Attendance state
  const [showPresenceModal, setShowPresenceModal] = useState(false);
  const [presentIds, setPresentIds] = useState(new Set());
  const [presenceSearchQuery, setPresenceSearchQuery] = useState('');
  const [presenceSubmitting, setPresenceSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (window.localStorage.getItem("session") != null)
      setSession(true);
  }, []);

  const handleAddMembre = () => {
    setFormData({ nom: '', prenom: '', tel: '', email: '', dateN: '1989-01-01', ville: 'walo', points: 0, admin: false, img: '' });
    setImagePreview(null);
    setShowAddModal(true);
    setEditingMembre(null);
  };

  const handleEditMembre = (membre) => {
    setFormData({ ...membre });
    setImagePreview(membre.img);
    setShowAddModal(true);
    setEditingMembre(membre._id);
  };

  const handleDeleteMembre = async (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce membre ?')) {
      try {
        const response = await fetch(`/api/membres/delete?id=${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error("Erreur lors de la suppression");
        setMembres(membres.filter(m => m._id !== id));
      } catch (error) {
        console.error("Erreur:", error);
        alert("Erreur lors de la suppression");
      }
    }
  };

  const handleSaveMembre = async () => {
    if (!formData.nom || !formData.prenom || !formData.email) {
      alert('Veuillez remplir les champs obligatoires');
      return;
    }
    try {
      const url = editingMembre ? `/api/membres/update?id=${editingMembre}` : '/api/membres/add';
      const method = editingMembre ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Erreur lors de l'enregistrement");
      const result = await response.json();
      if (editingMembre) {
        setMembres(membres.map(m => m._id === editingMembre ? { ...formData, _id: editingMembre } : m));
      } else {
        setMembres([...membres, result]);
      }
      setShowAddModal(false);
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de l'enregistrement");
    }
  };

  const getRankFlag = (index, total) => {
    if (index === 0 || index === 1 || index === 2) return { color: 'bg-green-500', icon: <Crown className="w-4 h-4" /> };
    if (index === total - 1 || index === total - 2 || index === total - 3) return { color: 'bg-red-500', icon: <Flag className="w-4 h-4" /> };
    if (index === 4) return { color: 'bg-blue-500', icon: <Award className="w-4 h-4" /> };
    return null;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.match('image.*')) { alert('Veuillez sélectionner un fichier image valide.'); return; }
    const reader = new FileReader();
    reader.onloadend = () => { setFormData({ ...formData, img: reader.result }); setImagePreview(reader.result); };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => { fileInputRef.current.click(); };

  // Sort handler
  const handleSort = (key) => {
    setSortConfig(prev =>
      prev.key === key
        ? { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
        : { key, direction: key === 'points' ? 'desc' : 'asc' }
    );
  };

  const SortIcon = ({ colKey }) => {
    if (sortConfig.key !== colKey) return <ArrowUpDown className="w-3 h-3 opacity-40" />;
    return sortConfig.direction === 'asc'
      ? <ArrowUp className="w-3 h-3 text-purple-400" />
      : <ArrowDown className="w-3 h-3 text-purple-400" />;
  };

  // Attendance handlers
  const handleOpenPresence = () => {
    setPresentIds(new Set());
    setPresenceSearchQuery('');
    setShowPresenceModal(true);
  };

  const togglePresence = (id) => {
    setPresentIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    setPresentIds(new Set(filteredPresence.map(m => m._id)));
  };

  const deselectAll = () => {
    setPresentIds(new Set());
  };

  const handleSubmitPresence = async () => {
    const confirmMsg = `${presentIds.size} présent(s) → +1 pt\n${membres.length - presentIds.size} absent(s) → -3 pts\n\nConfirmer ?`;
    if (!confirm(confirmMsg)) return;
    setPresenceSubmitting(true);
    try {
      const updates = membres.map(m => ({
        id: m._id,
        points: Math.max(0, (m.points || 0) + (presentIds.has(m._id) ? 1 : -3))
      }));
      // Batch update each member
      await Promise.all(updates.map(({ id, points }) =>
        fetch(`/api/membres/update?id=${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ points }),
        })
      ));
      // Update local state
      setMembres(prev => prev.map(m => {
        const u = updates.find(u => u.id === m._id);
        return u ? { ...m, points: u.points } : m;
      }));
      setShowPresenceModal(false);
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de la mise à jour des points");
    } finally {
      setPresenceSubmitting(false);
    }
  };

  if (!mounted) return null;

  // Filter + sort
  const filtered = membres
    .filter(m => {
      const q = searchQuery.toLowerCase();
      return (
        m.nom?.toLowerCase().includes(q) ||
        m.prenom?.toLowerCase().includes(q) ||
        `${m.prenom} ${m.nom}`.toLowerCase().includes(q) ||
        `${m.nom} ${m.prenom}`.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      const { key, direction } = sortConfig;
      let valA = a[key];
      let valB = b[key];
      if (key === 'nom' || key === 'prenom') {
        valA = (valA || '').toLowerCase();
        valB = (valB || '').toLowerCase();
        return direction === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      if (key === 'points') {
        valA = Number(valA) || 0;
        valB = Number(valB) || 0;
      }
      return direction === 'asc' ? valA - valB : valB - valA;
    });

  // Filtered presence list
  const filteredPresence = membres.filter(m => {
    const q = presenceSearchQuery.toLowerCase();
    return (
      !q ||
      m.nom?.toLowerCase().includes(q) ||
      m.prenom?.toLowerCase().includes(q) ||
      `${m.prenom} ${m.nom}`.toLowerCase().includes(q) ||
      `${m.nom} ${m.prenom}`.toLowerCase().includes(q)
    );
  });

  const sortButtons = [
    { key: 'points', label: 'Points' },
    { key: 'nom', label: 'Nom' },
    { key: 'prenom', label: 'Prénom' },
  ];

  return (
    <div className={`min-h-screen transition-all duration-700 ${isDark
      ? 'bg-gradient-to-br from-[#0a0a0a] via-[#1a0a2e] to-[#0a0a0a]'
      : 'bg-gradient-to-br from-[#f4f4f4] via-[#e8e8f5] to-[#f4f4f4]'
      }`}>
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-20 left-10 w-96 h-96 rounded-full blur-3xl opacity-20 animate-pulse ${isDark ? 'bg-purple-600' : 'bg-purple-400'}`} style={{ animationDuration: '4s' }}></div>
        <div className={`absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl opacity-20 animate-pulse ${isDark ? 'bg-cyan-600' : 'bg-cyan-400'}`} style={{ animationDuration: '6s' }}></div>
      </div>
      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="text-center mb-12 mt-20">
          <div className="inline-block mb-6">
            <h1 className={`relative text-4xl md:text-6xl font-black tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
              <span className="bg-gradient-to-r from-pink-600 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
                Gestion des Membres
              </span>
            </h1>
          </div>
          <p className={`text-lg md:text-xl font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            <Users className="inline-block w-5 h-5 mr-2" />
            Club de Cybersécurité Universitaire
          </p>
        </div>
        <div className="max-w-6xl mx-auto">
          <div className={`rounded-3xl overflow-hidden backdrop-blur-xl ${isDark
            ? 'bg-black/40 border border-white/10'
            : 'bg-white/60 border border-gray-200/50'
            } shadow-2xl`}>
            <div className="h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500"></div>

            {/* Header */}
            <div className={`px-6 py-5 border-b ${isDark ? 'bg-gradient-to-r from-purple-900/30 to-cyan-900/30 border-white/10' : 'bg-gradient-to-r from-purple-100/50 to-cyan-100/50 border-gray-200'}`}>
              <div className="flex justify-between items-center mb-4">
                <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Liste des Membres
                  <span className={`ml-2 text-sm font-normal ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    ({filtered.length}/{membres.length})
                  </span>
                </h2>
                {session &&
                  <div className="flex items-center gap-2">
                    {/* Attendance button */}
                    <button
                      onClick={handleOpenPresence}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all border ${isDark
                        ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/30 hover:border-emerald-400'
                        : 'bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-emerald-100'
                      }`}
                    >
                      <UserCheck className="w-4 h-4" />
                      <span className="hidden sm:inline">Présence</span>
                    </button>
                    <button
                      onClick={handleAddMembre}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-pink-600 via-purple-500 to-cyan-500 hover:from-pink-700 hover:via-purple-600 hover:to-cyan-600 text-white font-bold transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      <span className="hidden sm:inline">Ajouter</span>
                    </button>
                  </div>
                }
              </div>

              {/* Search bar */}
              <div className="relative mb-3">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                <input
                  type="text"
                  placeholder="Rechercher par nom ou prénom..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-xl text-sm font-medium border focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${isDark
                    ? 'bg-white/5 border-white/10 text-white placeholder-gray-500'
                    : 'bg-white/80 border-gray-200 text-gray-900 placeholder-gray-400'
                    }`}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-gray-700'}`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Sort buttons */}
              <div className="flex flex-wrap gap-2 items-center">
                <span className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Trier :</span>
                {sortButtons.map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => handleSort(key)}
                    className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition-all border ${sortConfig.key === key
                      ? isDark
                        ? 'bg-purple-500/30 border-purple-500/60 text-purple-300'
                        : 'bg-purple-100 border-purple-300 text-purple-700'
                      : isDark
                        ? 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20 hover:text-white'
                        : 'bg-white/60 border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      }`}
                  >
                    {label}
                    <SortIcon colKey={key} />
                  </button>
                ))}
              </div>
            </div>

            {/* Members list */}
            <div className="divide-y divide-white/5">
              {filtered.length === 0 ? (
                <div className={`p-12 text-center ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  <Search className="w-10 h-10 mx-auto mb-3 opacity-40" />
                  <p className="font-medium">Aucun membre trouvé pour "{searchQuery}"</p>
                </div>
              ) : (
                filtered.map((membre, index) => {
                  const rankFlag = getRankFlag(index, filtered.length);
                  return (
                    <div key={membre._id} className="p-6" style={{ animation: `fadeIn 0.5s ease-out ${index * 0.05}s both` }}>
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex-1 flex items-center gap-4">
                          <div className="relative">
                            <div className={`w-12 h-12 rounded-full overflow-hidden ring-2 ${membre.admin ? 'ring-purple-400' : isDark ? 'ring-gray-600' : 'ring-gray-300'}`}>
                              {membre.img ? (
                                <img src={membre.img} alt={`${membre.prenom} ${membre.nom}`} className="w-full h-full object-cover" />
                              ) : (
                                <div className={`w-full h-full flex items-center justify-center text-sm font-bold ${isDark ? 'bg-gradient-to-br from-purple-600 to-cyan-600' : 'bg-gradient-to-br from-purple-400 to-cyan-400'} text-white`}>
                                  {membre.prenom[0]}{membre.nom[0]}
                                </div>
                              )}
                            </div>
                            {membre.admin && (
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                                <Shield className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              {searchQuery
                                ? (() => {
                                    const fullName = `${membre.prenom} ${membre.nom}`;
                                    const q = searchQuery;
                                    const idx = fullName.toLowerCase().indexOf(q.toLowerCase());
                                    if (idx === -1) return fullName;
                                    return (
                                      <>
                                        {fullName.slice(0, idx)}
                                        <mark className={`rounded px-0.5 ${isDark ? 'bg-purple-500/50 text-white' : 'bg-purple-200 text-purple-900'}`}>
                                          {fullName.slice(idx, idx + q.length)}
                                        </mark>
                                        {fullName.slice(idx + q.length)}
                                      </>
                                    );
                                  })()
                                : `${membre.prenom} ${membre.nom}`
                              }
                            </div>
                            <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                              {membre.email} • {membre.tel}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className={`flex items-center gap-2 px-3 py-1 rounded-full font-bold text-xs ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            <span className="text-yellow-400">{membre.points} pts</span>
                            {rankFlag && (
                              <div className={`p-1 rounded-full ${rankFlag.color}`}>
                                {rankFlag.icon}
                              </div>
                            )}
                          </div>
                          {session &&
                            <div className="flex gap-2">
                              <button onClick={() => handleEditMembre(membre)} className="p-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 transition-all">
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleDeleteMembre(membre._id)} className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-all">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          }
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto ${isDark ? 'bg-gray-900 border border-white/10' : 'bg-white border border-gray-200'}`}>
            <div className={`sticky top-0 px-6 py-4 border-b flex justify-between items-center ${isDark ? 'bg-gray-900 border-white/10' : 'bg-white border-gray-200'} z-10`}>
              <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {editingMembre ? 'Modifier le membre' : 'Ajouter un membre'}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-700/50 rounded-lg transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-bold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Nom *</label>
                  <input type="text" value={formData.nom} onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    className={`w-full px-4 py-2 rounded-lg ${isDark ? 'bg-gray-800 text-white border-gray-700' : 'bg-gray-100 text-gray-900 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-purple-500`} />
                </div>
                <div>
                  <label className={`block text-sm font-bold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Prénom *</label>
                  <input type="text" value={formData.prenom} onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                    className={`w-full px-4 py-2 rounded-lg ${isDark ? 'bg-gray-800 text-white border-gray-700' : 'bg-gray-100 text-gray-900 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-purple-500`} />
                </div>
              </div>
              <div>
                <label className={`block text-sm font-bold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Email *</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg ${isDark ? 'bg-gray-800 text-white border-gray-700' : 'bg-gray-100 text-gray-900 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-purple-500`} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-bold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Téléphone</label>
                  <input type="tel" value={formData.tel} onChange={(e) => setFormData({ ...formData, tel: e.target.value })}
                    className={`w-full px-4 py-2 rounded-lg ${isDark ? 'bg-gray-800 text-white border-gray-700' : 'bg-gray-100 text-gray-900 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-purple-500`} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-bold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Points</label>
                  <input type="number" value={formData.points} onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 0 })}
                    className={`w-full px-4 py-2 rounded-lg ${isDark ? 'bg-gray-800 text-white border-gray-700' : 'bg-gray-100 text-gray-900 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-purple-500`} />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <label className={`inline-flex items-center gap-2 text-sm font-bold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  <input type="checkbox" checked={formData.admin} onChange={(e) => setFormData({ ...formData, admin: e.target.checked })}
                    className="h-4 w-4 rounded text-purple-600 focus:ring-purple-500" />
                  Bureau ?
                </label>
              </div>
              <div>
                <label className={`block text-sm font-bold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Image de profil</label>
                <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
                <div onClick={triggerFileInput}
                  className={`w-full h-32 flex flex-col items-center justify-center rounded-lg border-2 border-dashed cursor-pointer ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-300'} hover:border-purple-500 transition-all`}>
                  {imagePreview ? (
                    <img src={imagePreview} alt="Aperçu" className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-4">
                      <Plus className="w-8 h-8 mb-2 text-gray-400" />
                      <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Cliquez pour télécharger une image</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className={`sticky bottom-0 px-6 py-4 border-t flex justify-end gap-2 ${isDark ? 'bg-gray-900 border-white/10' : 'bg-white border-gray-200'}`}>
              <button onClick={() => setShowAddModal(false)}
                className={`px-4 py-2 rounded-lg font-bold transition-all ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}>
                Annuler
              </button>
              <button onClick={handleSaveMembre}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-pink-600 via-purple-500 to-cyan-500 hover:from-pink-700 hover:via-purple-600 hover:to-cyan-600 text-white font-bold transition-all">
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Presence Modal */}
      {showPresenceModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col ${isDark ? 'bg-gray-900 border border-white/10' : 'bg-white border border-gray-200'}`}>
            {/* Modal header */}
            <div className={`px-6 py-4 border-b flex justify-between items-center ${isDark ? 'bg-gray-900 border-white/10' : 'bg-white border-gray-200'}`}>
              <div>
                <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  <UserCheck className="inline-block w-5 h-5 mr-2 text-emerald-400" />
                  Marquer la présence
                </h3>
                <p className={`text-xs mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Présent : <span className="text-emerald-400 font-bold">+1 pt</span> &nbsp;|&nbsp; Absent : <span className="text-red-400 font-bold">−3 pts</span>
                </p>
              </div>
              <button onClick={() => setShowPresenceModal(false)} className="p-2 hover:bg-gray-700/50 rounded-lg transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search + select all */}
            <div className={`px-6 py-3 border-b ${isDark ? 'border-white/10' : 'border-gray-100'}`}>
              <div className="relative mb-3">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                <input
                  type="text"
                  placeholder="Rechercher un membre..."
                  value={presenceSearchQuery}
                  onChange={e => setPresenceSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-xl text-sm font-medium border focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${isDark
                    ? 'bg-white/5 border-white/10 text-white placeholder-gray-500'
                    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                  }`}
                />
                {presenceSearchQuery && (
                  <button
                    onClick={() => setPresenceSearchQuery('')}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-gray-700'}`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-xs font-semibold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {presentIds.size} / {membres.length} présent(s)
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={selectAll}
                    className={`text-xs px-3 py-1 rounded-lg font-bold transition-all ${isDark ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`}
                  >
                    Tout sélectionner
                  </button>
                  <button
                    onClick={deselectAll}
                    className={`text-xs px-3 py-1 rounded-lg font-bold transition-all ${isDark ? 'bg-white/5 text-gray-400 hover:bg-white/10' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    Tout désélectionner
                  </button>
                </div>
              </div>
            </div>

            {/* Members list */}
            <div className="overflow-y-auto flex-1 divide-y divide-white/5">
              {filteredPresence.length === 0 ? (
                <div className={`p-8 text-center ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  <p className="font-medium">Aucun membre trouvé</p>
                </div>
              ) : (
                filteredPresence.map(membre => {
                  const isPresent = presentIds.has(membre._id);
                  return (
                    <button
                      key={membre._id}
                      onClick={() => togglePresence(membre._id)}
                      className={`w-full flex items-center gap-4 px-6 py-3 text-left transition-all ${
                        isPresent
                          ? isDark
                            ? 'bg-emerald-500/10 hover:bg-emerald-500/15'
                            : 'bg-emerald-50 hover:bg-emerald-100/80'
                          : isDark
                            ? 'hover:bg-white/5'
                            : 'hover:bg-gray-50'
                      }`}
                    >
                      {/* Checkbox icon */}
                      <div className={`flex-shrink-0 transition-colors ${isPresent ? 'text-emerald-400' : isDark ? 'text-gray-600' : 'text-gray-300'}`}>
                        {isPresent
                          ? <CheckCircle2 className="w-5 h-5" />
                          : <Circle className="w-5 h-5" />
                        }
                      </div>

                      {/* Avatar */}
                      <div className={`w-9 h-9 rounded-full overflow-hidden flex-shrink-0 ring-2 ${isPresent ? 'ring-emerald-400' : isDark ? 'ring-gray-700' : 'ring-gray-200'}`}>
                        {membre.img ? (
                          <img src={membre.img} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className={`w-full h-full flex items-center justify-center text-xs font-bold ${isDark ? 'bg-gradient-to-br from-purple-600 to-cyan-600' : 'bg-gradient-to-br from-purple-400 to-cyan-400'} text-white`}>
                            {membre.prenom[0]}{membre.nom[0]}
                          </div>
                        )}
                      </div>

                      {/* Name & info */}
                      <div className="flex-1 min-w-0">
                        <div className={`font-bold text-sm ${isPresent ? 'text-emerald-400' : isDark ? 'text-white' : 'text-gray-900'}`}>
                          {membre.prenom} {membre.nom}
                        </div>
                      </div>

                      {/* Points + badge */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`text-xs font-bold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{membre.points} pts</span>
                        {isPresent ? (
                          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">Présent</span>
                        ) : (
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isDark ? 'text-gray-500 bg-white/5' : 'text-gray-400 bg-gray-100'}`}>Absent</span>
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className={`px-6 py-4 border-t flex justify-between items-center gap-3 ${isDark ? 'bg-gray-900 border-white/10' : 'bg-white border-gray-200'}`}>
              <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                <span className="text-emerald-400 font-bold">{presentIds.size} présent(s)</span>
                {' · '}
                <span className="text-red-400 font-bold">{membres.length - presentIds.size} absent(s)</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowPresenceModal(false)}
                  className={`px-4 py-2 rounded-lg font-bold transition-all ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  Annuler
                </button>
                <button
                  onClick={handleSubmitPresence}
                  disabled={presenceSubmitting}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {presenceSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Enregistrer
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

}
