import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Calendar, Clock, Megaphone, ChevronDown, ChevronUp } from 'lucide-react';

export default function AdminActualites({ isDark }) {
  const [mounted, setMounted] = useState(false);
  const [actualites, setActualites] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingActualite, setEditingActualite] = useState(null);
  const [expandedActualite, setExpandedActualite] = useState(null);
  const [formData, setFormData] = useState({
    titre: '',
    descr: '',
    date: '',
    heure: '',
    salle: ''
  });

  useEffect(() => {
    setMounted(true);

    if (window.localStorage.getItem("session") == null)
      window.location.href = "./";

    fetchActualites();
  }, []);

  const fetchActualites = async () => {
    try {
      const response = await fetch('/api/actualites/get');
      if (!response.ok) throw new Error("Erreur lors de la récupération des actualités");
      const data = await response.json();
      setActualites(data);
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const handleAddActualite = () => {
    setFormData({
      titre: '',
      descr: '',
      date: '',
      heure: '',
      salle: ''
    });
    setShowAddModal(true);
    setEditingActualite(null);
  };

  const handleEditActualite = (actualite) => {
    setFormData({ ...actualite });
    setEditingActualite(actualite._id);
    setShowAddModal(true);
  };

  const handleDeleteActualite = async (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette actualité ?')) {
      try {
        const response = await fetch(`/api/actualites/delete?id=${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error("Erreur lors de la suppression");
        setActualites(actualites.filter(a => a._id !== id));
      } catch (error) {
        console.error("Erreur:", error);
        alert("Erreur lors de la suppression");
      }
    }
  };

  const handleSaveActualite = async () => {
    if (!formData.titre || !formData.date || !formData.heure || !formData.salle) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      const url = editingActualite
        ? `/api/actualites/update?id=${editingActualite}`
        : '/api/actualites/add';

      const method = editingActualite ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Erreur lors de l'enregistrement");

      const result = await response.json();

      if (editingActualite) {
        setActualites(actualites.map(a => a._id === editingActualite ? result : a));
      } else {
        setActualites([...actualites, result]);
      }

      setShowAddModal(false);
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de l'enregistrement");
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
                Gestion des Actualités
              </span>
            </h1>
          </div>
          <p className={`text-lg md:text-xl font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
            <Megaphone className="inline-block w-5 h-5 mr-2" />
            Club de Cybersécurité Universitaire
          </p>
        </div>
        {/* Historique des Actualités */}
        <div className="max-w-6xl mx-auto">
          <div className={`rounded-3xl overflow-hidden backdrop-blur-xl ${isDark
            ? 'bg-black/40 border border-white/10'
            : 'bg-white/60 border border-gray-200/50'
            } shadow-2xl`}>
            <div className="h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500"></div>
            <div className={`px-6 py-5 flex justify-between items-center border-b ${isDark ? 'bg-gradient-to-r from-purple-900/30 to-cyan-900/30 border-white/10' : 'bg-gradient-to-r from-purple-100/50 to-cyan-100/50 border-gray-200'
              }`}>
              <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Historique des Actualités
              </h2>
              <button
                onClick={handleAddActualite}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-pink-600 via-purple-500 to-cyan-500 hover:from-pink-700 hover:via-purple-600 hover:to-cyan-600 text-white font-bold transition-all"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Ajouter</span>
              </button>
            </div>
            <div className="divide-y divide-white/5">
              {actualites.map((actualite, index) => (
                <div key={actualite._id} className="p-6" style={{ animation: `fadeIn 0.5s ease-out ${index * 0.1}s both` }}>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                    <div className="flex-1">
                      <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {actualite.titre}
                      </h3>
                      <p className={`text-sm mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        {actualite.descr}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className={`w-4 h-4 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
                          <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                            {new Date(actualite.date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className={`w-4 h-4 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
                          <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                            {actualite.heure}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                            {actualite.salle}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditActualite(actualite)}
                        className="p-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 transition-all"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteActualite(actualite._id)}
                        className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
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
                {editingActualite ? 'Modifier l\'actualité' : 'Ajouter une actualité'}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-bold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Date *
                  </label>
                  <input
                    type="date"
                    value={new Date(formData.date).toISOString().split("T")[0]}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className={`w-full px-4 py-2 rounded-lg ${isDark ? 'bg-gray-800 text-white border-gray-700' : 'bg-gray-100 text-gray-900 border-gray-300'
                      } border focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-bold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Heure *
                  </label>
                  <input
                    type="time"
                    value={formData.heure}
                    onChange={(e) => setFormData({ ...formData, heure: e.target.value })}
                    className={`w-full px-4 py-2 rounded-lg ${isDark ? 'bg-gray-800 text-white border-gray-700' : 'bg-gray-100 text-gray-900 border-gray-300'
                      } border focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  />
                </div>
              </div>
              <div>
                <label className={`block text-sm font-bold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Salle *
                </label>
                <input
                  type="text"
                  value={formData.salle}
                  onChange={(e) => setFormData({ ...formData, salle: e.target.value })}
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
                onClick={handleSaveActualite}
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