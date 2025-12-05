import { useState, useEffect, useRef } from 'react';
import { Users, Plus, Edit2, Trash2, Save, X, Shield, Crown, Award, Flag, ChevronDown, ChevronUp } from 'lucide-react';

export default function AdminMembres({ isDark }) {
  const [mounted, setMounted] = useState(false);
  const [membres, setMembres] = useState([]);

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
    dateN: '',
    ville: '',
    points: 0,
    admin: false,
    img: ''
  });
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setMounted(true);

    if (window.localStorage.getItem("session") == null)
      window.location.href = "./";
  }, []);

  const handleAddMembre = () => {
    setFormData({
      nom: '',
      prenom: '',
      tel: '',
      email: '',
      dateN: '',
      ville: '',
      points: 0,
      admin: false,
      img: ''
    });
    setImagePreview(null);
    setShowAddModal(true);
    setEditingMembre(null);
  };

  const handleEditMembre = (membre) => {
    setFormData({ ...membre });
    setImagePreview(membre.img);
    setShowAddModal(true);
    setEditingMembre(membre._id); // Utilisez _id au lieu de id
  };

  const handleDeleteMembre = async (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce membre ?')) {
      try {
        const response = await fetch(`/api/membres/delete?id=${id}`, {
          method: 'DELETE',
        });

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
      const url = editingMembre
        ? `/api/membres/update?id=${editingMembre}`
        : '/api/membres/add';

      const method = editingMembre ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
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

    if (!file.type.match('image.*')) {
      alert('Veuillez sélectionner un fichier image valide.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, img: reader.result });
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  if (!mounted) return null;

  const sortedMembres = [...membres].sort((a, b) => b.points - a.points);

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
                Gestion des Membres
              </span>
            </h1>
          </div>
          <p className={`text-lg md:text-xl font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
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
            <div className={`px-6 py-5 flex justify-between items-center border-b ${isDark ? 'bg-gradient-to-r from-purple-900/30 to-cyan-900/30 border-white/10' : 'bg-gradient-to-r from-purple-100/50 to-cyan-100/50 border-gray-200'
              }`}>
              <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Liste des Membres
              </h2>
              <button
                onClick={handleAddMembre}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-pink-600 via-purple-500 to-cyan-500 hover:from-pink-700 hover:via-purple-600 hover:to-cyan-600 text-white font-bold transition-all"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Ajouter</span>
              </button>
            </div>
            <div className="divide-y divide-white/5">
              {sortedMembres.map((membre, index) => {
                const rankFlag = getRankFlag(index, sortedMembres.length);
                return (
                  <div key={membre._id} className="p-6" style={{ animation: `fadeIn 0.5s ease-out ${index * 0.1}s both` }}>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex-1 flex items-center gap-4">
                        <div className="relative">
                          <div className={`w-12 h-12 rounded-full overflow-hidden ring-2 ${membre.admin ? 'ring-purple-400' : isDark ? 'ring-gray-600' : 'ring-gray-300'
                            }`}>
                            {membre.img ? (
                              <img
                                src={membre.img}
                                alt={`${membre.prenom} ${membre.nom}`}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className={`w-full h-full flex items-center justify-center text-sm font-bold ${isDark ? 'bg-gradient-to-br from-purple-600 to-cyan-600' : 'bg-gradient-to-br from-purple-400 to-cyan-400'
                                } text-white`}>
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
                            {membre.prenom} {membre.nom}
                          </div>
                          <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            {membre.email} • {membre.tel} • {membre.ville} • {new Date(membre.dateN).toLocaleDateString('FR-fr')}
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
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditMembre(membre)}
                            className="p-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 transition-all"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteMembre(membre._id)}
                            className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto ${isDark ? 'bg-gray-900 border border-white/10' : 'bg-white border border-gray-200'
            }`}>
            <div className={`sticky top-0 px-6 py-4 border-b flex justify-between items-center ${isDark ? 'bg-gray-900 border-white/10' : 'bg-white border-gray-200'
              } z-10`}>
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
                  <label className={`block text-sm font-bold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Nom *
                  </label>
                  <input
                    type="text"
                    value={formData.nom}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    className={`w-full px-4 py-2 rounded-lg ${isDark ? 'bg-gray-800 text-white border-gray-700' : 'bg-gray-100 text-gray-900 border-gray-300'
                      } border focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-bold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Prénom *
                  </label>
                  <input
                    type="text"
                    value={formData.prenom}
                    onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                    className={`w-full px-4 py-2 rounded-lg ${isDark ? 'bg-gray-800 text-white border-gray-700' : 'bg-gray-100 text-gray-900 border-gray-300'
                      } border focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  />
                </div>
              </div>
              <div>
                <label className={`block text-sm font-bold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg ${isDark ? 'bg-gray-800 text-white border-gray-700' : 'bg-gray-100 text-gray-900 border-gray-300'
                    } border focus:outline-none focus:ring-2 focus:ring-purple-500`}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-bold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    value={formData.tel}
                    onChange={(e) => setFormData({ ...formData, tel: e.target.value })}
                    className={`w-full px-4 py-2 rounded-lg ${isDark ? 'bg-gray-800 text-white border-gray-700' : 'bg-gray-100 text-gray-900 border-gray-300'
                      } border focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-bold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Ville
                  </label>
                  <input
                    type="text"
                    value={formData.ville}
                    onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
                    className={`w-full px-4 py-2 rounded-lg ${isDark ? 'bg-gray-800 text-white border-gray-700' : 'bg-gray-100 text-gray-900 border-gray-300'
                      } border focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-bold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Date de Naissance
                  </label>
                  <input
                    type="date"
                    value={(formData.dateN ? new Date(formData.dateN) : new Date()).toISOString().split("T")[0]}
                    onChange={(e) => setFormData({ ...formData, dateN: e.target.value })}
                    className={`w-full px-4 py-2 rounded-lg ${isDark ? 'bg-gray-800 text-white border-gray-700' : 'bg-gray-100 text-gray-900 border-gray-300'
                      } border focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-bold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Points
                  </label>
                  <input
                    type="number"
                    value={formData.points}
                    onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 0 })}
                    className={`w-full px-4 py-2 rounded-lg ${isDark ? 'bg-gray-800 text-white border-gray-700' : 'bg-gray-100 text-gray-900 border-gray-300'
                      } border focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <label className={`inline-flex items-center gap-2 text-sm font-bold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  <input
                    type="checkbox"
                    checked={formData.admin}
                    onChange={(e) => setFormData({ ...formData, admin: e.target.checked })}
                    className="h-4 w-4 rounded text-purple-600 focus:ring-purple-500"
                  />
                  Bureau ?
                </label>
              </div>
              <div>
                <label className={`block text-sm font-bold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Image de profil
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
                <div
                  onClick={triggerFileInput}
                  className={`w-full h-32 flex flex-col items-center justify-center rounded-lg border-2 border-dashed cursor-pointer ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-300'
                    } hover:border-purple-500 transition-all`}
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Aperçu"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-4">
                      <Plus className="w-8 h-8 mb-2 text-gray-400" />
                      <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Cliquez pour télécharger une image
                      </span>
                    </div>
                  )}
                </div>
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
                onClick={handleSaveMembre}
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
