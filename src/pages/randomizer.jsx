import { useState, useEffect, useRef } from 'react';
import { Shield, Users, Shuffle, ChevronRight, ArrowLeft, Crown, User } from 'lucide-react';

const BUREAU_MEMBRES = [
  { id: 'b1', prenom: 'Chouaib', nom: 'YAKINE' },
  { id: 'b2', prenom: 'Youssef', nom: 'LAMAIDAR' },
  { id: 'b3', prenom: 'Amina', nom: 'Kafi' },
  { id: 'b4', prenom: 'Bahaa-eddine', nom: 'LAMRISSI' },
  { id: 'b5', prenom: 'Aya', nom: 'MOUINE' },
  { id: 'b6', prenom: 'Aicha', nom: 'AKOUCHTAH' },
  { id: 'b7', prenom: 'Hiba', nom: 'CHAOUKI' },
];

const GROUP_COLORS = [
  { name: 'PINK', gradient: 'from-pink-500 to-rose-600', light: 'from-pink-100 to-rose-100', border: 'border-pink-400/40', text: 'text-pink-400', badge: 'bg-pink-500/20 text-pink-300' },
  { name: 'PURPLE', gradient: 'from-violet-500 to-purple-600', light: 'from-violet-100 to-purple-100', border: 'border-violet-400/40', text: 'text-violet-400', badge: 'bg-violet-500/20 text-violet-300' },
  { name: 'AQUA', gradient: 'from-cyan-500 to-blue-600', light: 'from-cyan-100 to-blue-100', border: 'border-cyan-400/40', text: 'text-cyan-400', badge: 'bg-cyan-500/20 text-cyan-300' },
  { name: 'GREEN', gradient: 'from-emerald-500 to-teal-600', light: 'from-emerald-100 to-teal-100', border: 'border-emerald-400/40', text: 'text-emerald-400', badge: 'bg-emerald-500/20 text-emerald-300' },
  { name: 'ORANGE', gradient: 'from-orange-500 to-amber-600', light: 'from-orange-100 to-amber-100', border: 'border-orange-400/40', text: 'text-orange-400', badge: 'bg-orange-500/20 text-orange-300' },
  { name: 'RED', gradient: 'from-red-500 to-pink-600', light: 'from-red-100 to-pink-100', border: 'border-red-400/40', text: 'text-red-400', badge: 'bg-red-500/20 text-red-300' },
  { name: 'BLUE', gradient: 'from-indigo-500 to-blue-600', light: 'from-indigo-100 to-blue-100', border: 'border-indigo-400/40', text: 'text-indigo-400', badge: 'bg-indigo-500/20 text-indigo-300' },
];

function Avatar({ member, size = 'md', isDark }) {
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-14 h-14 text-base' };
  return (
    <div className={`${sizes[size]} rounded-full flex items-center justify-center font-bold text-white bg-gradient-to-br from-purple-500 to-cyan-500 ring-2 ring-purple-500/30 shrink-0`}>
      {member.prenom[0]}{member.nom[0]}
    </div>
  );
}

export default function AdminRandomizeGroups({ isDark = true }) {
  const [step, setStep] = useState(1);
  const [membres, setMembres] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [groups, setGroups] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationPhase, setAnimationPhase] = useState('idle');
  const [visibleCards, setVisibleCards] = useState(new Set());
  const [shuffleIcon, setShuffleIcon] = useState(false);
  const [mounted, setMounted] = useState(false);
  const groupRefs = useRef([]);

  const bureauMembers = BUREAU_MEMBRES;

  useEffect(() => {
    setMounted(true);
    const fetchMembres = async () => {
      try {
        const response = await fetch('/api/membres/get');
        if (!response.ok) throw new Error();
        const data = await response.json();
        setMembres(data.filter(m => !m.admin));
      } catch {
        setMembres([]);
      }
    };
    fetchMembres();
  }, []);

  if (!mounted) return null;

  const regularMembers = membres;
  const selectedRegular = regularMembers.filter(m => selectedIds.has(String(m._id)));

  const toggleSelect = (id) => {
    const key = String(id);
    setSelectedIds(prev => {
      const arr = [...prev];
      if (arr.includes(key)) {
        return new Set(arr.filter(x => x !== key));
      } else {
        return new Set([...arr, key]);
      }
    });
  };

  const selectAll = () => {
    setSelectedIds(new Set(regularMembers.map(m => String(m._id))));
  };

  const clearAll = () => setSelectedIds(new Set());

  const distributeGroups = () => {
    const shuffled = [...selectedRegular].sort(() => Math.random() - 0.5);
    const g = bureauMembers.map((b, i) => ({
      id: i,
      leader: b,
      members: [],
      color: GROUP_COLORS[i % GROUP_COLORS.length],
      name: `Groupe ${i + 1}`
    }));
    shuffled.forEach((m, i) => {
      g[i % g.length].members.push(m);
    });
    return g;
  };

  const handleRandomize = async () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setAnimationPhase('gathering');
    setGroups([]);
    setVisibleCards(new Set());

    setShuffleIcon(true);
    await sleep(600);

    const newGroups = distributeGroups();
    setGroups(newGroups);
    setAnimationPhase('distributing');

    await sleep(300);

    for (let i = 0; i < newGroups.length; i++) {
      await sleep(120);
      setVisibleCards(prev => new Set([...prev, i]));
    }

    setAnimationPhase('done');
    setShuffleIcon(false);
    setIsAnimating(false);
  };

  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  const bgClass = isDark
    ? 'bg-gradient-to-br from-[#0a0a0a] via-[#1a0a2e] to-[#0a0a0a]'
    : 'bg-gradient-to-br from-[#f4f4f4] via-[#e8e8f5] to-[#f4f4f4]';

  return (
    <div className={`min-h-screen transition-all duration-700 ${bgClass}`}>
      <style>{`
        @keyframes float-in-left {
          from { opacity: 0; transform: translateX(-60px) scale(0.85); }
          to { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes float-in-right {
          from { opacity: 0; transform: translateX(60px) scale(0.85); }
          to { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes group-appear {
          0% { opacity: 0; transform: scale(0.7) translateY(30px); }
          60% { transform: scale(1.04) translateY(-4px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes member-pop {
          0% { opacity: 0; transform: scale(0) rotate(-10deg); }
          70% { transform: scale(1.1) rotate(3deg); }
          100% { opacity: 1; transform: scale(1) rotate(0); }
        }
        @keyframes spin-bounce {
          0% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(180deg) scale(1.2); }
          50% { transform: rotate(360deg) scale(0.9); }
          75% { transform: rotate(540deg) scale(1.1); }
          100% { transform: rotate(720deg) scale(1); }
        }
        .group-card-visible {
          animation: group-appear 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .spin-shuffle {
          animation: spin-bounce 0.8s cubic-bezier(0.36, 0.07, 0.19, 0.97) forwards;
        }
      `}</style>

      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="text-center mb-10 mt-16">
          <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-pink-600 via-purple-500 to-cyan-500 bg-clip-text text-transparent tracking-tight mb-3">
            Répartition des Groupes
          </h1>
          <p className={`text-lg font-medium flex items-center justify-center gap-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            <Shield className="w-5 h-5" />
            Club de Cybersécurité Universitaire
          </p>

          <div className="flex items-center justify-center gap-4 mt-6">
            {[1, 2].map(s => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 ${step >= s
                  ? 'bg-gradient-to-br from-pink-500 to-purple-600 text-white shadow-lg shadow-purple-500/30'
                  : isDark ? 'bg-gray-800 text-gray-500' : 'bg-gray-200 text-gray-400'}`}>
                  {s}
                </div>
                {s < 2 && <div className={`w-12 h-0.5 transition-all duration-500 ${step >= 2 ? 'bg-gradient-to-r from-pink-500 to-purple-500' : isDark ? 'bg-gray-700' : 'bg-gray-300'}`} />}
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-16 mt-2">
            <span className={`text-xs font-semibold ${step === 1 ? (isDark ? 'text-pink-400' : 'text-pink-600') : (isDark ? 'text-gray-500' : 'text-gray-400')}`}>Sélection</span>
            <span className={`text-xs font-semibold ${step === 2 ? (isDark ? 'text-purple-400' : 'text-purple-600') : (isDark ? 'text-gray-500' : 'text-gray-400')}`}>Randomisation</span>
          </div>
        </div>

        {step === 1 && (
          <div className="max-w-4xl mx-auto">
            <div className={`rounded-3xl overflow-hidden backdrop-blur-xl ${isDark ? 'bg-black/40 border border-white/10' : 'bg-white/60 border border-gray-200/50'} shadow-2xl`}>
              <div className="h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500" />
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Sélectionner les membres
                    </h2>
                    <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {selectedIds.size} membre{selectedIds.size !== 1 ? 's' : ''} sélectionné{selectedIds.size !== 1 ? 's' : ''} sur {regularMembers.length}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={selectAll} className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 text-purple-400 hover:from-purple-500/30 hover:to-cyan-500/30 transition-all duration-200">
                      Tout sélectionner
                    </button>
                    <button onClick={clearAll} className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all duration-200 ${isDark ? 'border-white/10 text-gray-400 hover:bg-white/5' : 'border-gray-300 text-gray-500 hover:bg-gray-50'}`}>
                      Effacer
                    </button>
                  </div>
                </div>

                <div className={`mb-5 p-4 rounded-2xl ${isDark ? 'bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border border-yellow-500/20' : 'bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200'}`}>
                  <div className="flex items-center gap-2 mb-3">
                    <Crown className="w-4 h-4 text-yellow-400" />
                    <span className={`text-sm font-bold ${isDark ? 'text-yellow-300' : 'text-yellow-700'}`}>Membres Bureau (7 chefs de groupe)</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {bureauMembers.map(m => (
                      <div key={m.id} className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${isDark ? 'bg-yellow-500/10 text-yellow-300 border border-yellow-500/20' : 'bg-yellow-100 text-yellow-700 border border-yellow-200'}`}>
                        <Avatar member={m} size="sm" isDark={isDark} />
                        {m.prenom} {m.nom}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto pr-1 custom-scroll">
                  {regularMembers.map((member, i) => {
                    const selected = selectedIds.has(String(member._id));
                    return (
                      <button
                        key={member._id}
                        onClick={() => toggleSelect(String(member._id))}
                        className={`flex items-center gap-3 p-3 rounded-2xl border-2 text-left transition-all duration-200 ${selected
                          ? isDark
                            ? 'bg-gradient-to-r from-purple-900/40 to-cyan-900/40 border-purple-400/60 shadow-lg shadow-purple-500/20'
                            : 'bg-gradient-to-r from-purple-50 to-cyan-50 border-purple-400 shadow-md'
                          : isDark
                            ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                            : 'bg-white/80 border-gray-200 hover:border-purple-300 hover:bg-purple-50/50'
                          }`}
                        style={{ animation: `float-in-left 0.4s ease-out ${i * 0.03}s both` }}
                      >
                        <div className="relative">
                          <Avatar member={member} size="sm" isDark={isDark} />
                          {selected && (
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                              <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={`font-semibold text-sm truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {member.prenom} {member.nom}
                          </div>
                          <div className={`text-xs truncate ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            {member.points} pts
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-6">
              <button
                onClick={() => setStep(2)}
                disabled={selectedIds.size === 0}
                className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${selectedIds.size > 0
                  ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-white shadow-xl shadow-purple-500/40 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50'
                  : isDark ? 'bg-gray-800 text-gray-600 cursor-not-allowed' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
              >
                Passer à l'étape 2
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <button
                onClick={() => { setStep(1); setGroups([]); setAnimationPhase('idle'); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200 ${isDark ? 'border-white/10 text-gray-300 hover:bg-white/5' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}
              >
                <ArrowLeft className="w-4 h-4" /> Retour
              </button>
              <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                <Users className="inline w-4 h-4 mr-1" />
                {selectedRegular.length} membres · {bureauMembers.length} groupes
              </div>
            </div>

            <div className="flex flex-col items-center mb-12">
              <div className="relative">
                <button
                  onClick={handleRandomize}
                  disabled={isAnimating}
                  className={`relative w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ${isAnimating ? 'scale-95' : 'hover:scale-110'}`}
                  style={{
                    background: 'linear-gradient(135deg, #f472b6, #a78bfa, #22d3ee)',
                    boxShadow: '0 0 40px rgba(167,139,250,0.5), 0 20px 40px rgba(0,0,0,0.4)',
                  }}
                >
                  <Shuffle
                    className={`w-14 h-14 text-white ${shuffleIcon ? 'spin-shuffle' : ''}`}
                  />
                </button>
              </div>

              <p className={`mt-5 text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {animationPhase === 'idle' && 'Cliquez pour randomiser les groupes'}
                {animationPhase === 'gathering' && (
                  <span className="flex items-center gap-2">
                    Mélange en cours...
                  </span>
                )}
                {animationPhase === 'distributing' && (
                  <span className="flex items-center gap-2">
                    Attribution des membres...
                  </span>
                )}
                {animationPhase === 'done' && (
                  <span className="flex items-center gap-2 text-emerald-400">
                    Groupes générés ! Cliquez pour re-randomiser
                  </span>
                )}
              </p>
            </div>

            {groups.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {groups.map((group, gi) => {
                  const color = group.color;
                  const isVisible = visibleCards.has(gi);

                  return (
                    <div
                      key={group.id}
                      className={`rounded-2xl overflow-hidden border-2 ${color.border} backdrop-blur-xl transition-all duration-300 ${isDark ? 'bg-black/40' : 'bg-white/70'} ${isVisible ? 'group-card-visible' : 'opacity-0'}`}
                      style={{ animationDelay: `${gi * 0.1}s` }}
                    >
                      <div className={`bg-gradient-to-r ${color.gradient} p-4`}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-white/80 text-xs font-bold uppercase tracking-widest">{group.name}</span>
                          <span className="bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                            {group.color.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-white text-sm ring-2 ring-white/40">
                            {group.leader.prenom[0]}{group.leader.nom[0]}
                          </div>
                          <div>
                            <div className="text-white font-bold text-sm leading-tight">
                              {group.leader.prenom} {group.leader.nom}
                            </div>
                            <div className="text-white/70 text-xs flex items-center gap-1">
                              <User className="w-3 h-3" />
                              Bureau
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-3 space-y-2">
                        {group.members.length === 0 ? (
                          <p className={`text-xs text-center py-2 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>Aucun membre assigné</p>
                        ) : (
                          group.members.map((m, mi) => (
                            <div
                              key={m._id}
                              className={`flex items-center gap-2 p-2 rounded-xl transition-all ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-50 hover:bg-gray-100'}`}
                              style={{
                                animation: isVisible ? `member-pop 0.4s cubic-bezier(0.34,1.56,0.64,1) ${mi * 0.06 + 0.2}s both` : 'none',
                                opacity: isVisible ? undefined : 0
                              }}
                            >
                              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white bg-gradient-to-br ${color.gradient}`}>
                                {m.prenom[0]}{m.nom[0]}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className={`text-xs font-semibold truncate ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                                  {m.prenom} {m.nom}
                                </div>
                                <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{m.points} pts</div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}