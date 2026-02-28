import { useState, useEffect } from 'react';
import { Crown, Shield, Phone, Mail, Trophy, ChevronDown, ChevronUp, EyeOff } from 'lucide-react';

export default function AdminRanking({ isDark }) {
  const [mounted, setMounted] = useState(false);
  const [membres, setMembres] = useState([]);
  const [session, setSession] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const fetchMembres = async () => {
      try {
        const response = await fetch('/api/membres/get');
        if (!response.ok) throw new Error("Erreur lors de la récupération des membres");
        const data = await response.json();
        const sorted = [...data].filter(m => !m.admin).sort((a, b) => b.points - a.points);
        setMembres(sorted);
      } catch (error) {
        console.error("Erreur:", error);
      }
    };
    fetchMembres();
  }, []);

  useEffect(() => {
    setMounted(true);
    if (window.localStorage.getItem("session") != null)
      setSession(true);
  }, []);

  if (!mounted) return null;

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getMedalColor = (position) => {
    if (position === 1) return 'from-yellow-400 to-amber-500';
    if (position === 2) return 'from-slate-300 to-slate-400';
    if (position === 3) return 'from-amber-600 to-amber-700';
    return null;
  };

  const getBorderClass = (position, total) => {
    if (position <= 3) return 'border-l-4 border-l-green-400';
    if (position === 4) return 'border-l-4 border-l-purple-400';
    if (position >= total - 2) return 'border-l-4 border-l-red-500';
    return '';
  };

  return (
    <div className={`min-h-screen transition-all duration-700 ${
      isDark
        ? 'bg-gradient-to-br from-[#0a0a0a] via-[#1a0a2e] to-[#0a0a0a]'
        : 'bg-gradient-to-br from-[#f4f4f4] via-[#e8e8f5] to-[#f4f4f4]'
    }`}>
      {/* Background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-20 left-10 w-72 sm:w-96 h-72 sm:h-96 rounded-full blur-3xl opacity-20 animate-pulse ${isDark ? 'bg-purple-600' : 'bg-purple-400'}`} style={{ animationDuration: '4s' }} />
        <div className={`absolute bottom-20 right-10 w-72 sm:w-96 h-72 sm:h-96 rounded-full blur-3xl opacity-20 animate-pulse ${isDark ? 'bg-cyan-600' : 'bg-cyan-400'}`} style={{ animationDuration: '6s' }} />
      </div>

      <div className="relative z-10 container mx-auto px-3 sm:px-4 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 mt-14 sm:mt-20">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight mb-3">
            <span className="bg-gradient-to-r from-pink-600 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
              Classement
            </span>
            <span className={`block sm:inline ${isDark ? 'text-white' : 'text-gray-900'}`}> des membres</span>
          </h1>
          <p className={`text-base sm:text-lg md:text-xl font-medium flex items-center justify-center gap-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
            Club de Cybersécurité Universitaire
          </p>
        </div>

        {/* Top 3 podium — visible only on mobile */}
        {membres.length >= 3 && (
          <div className="flex items-end justify-center gap-2 mb-6 sm:hidden">
            {[membres[1], membres[0], membres[2]].map((member, i) => {
              const pos = i === 0 ? 2 : i === 1 ? 1 : 3;
              const heights = ['h-24', 'h-32', 'h-20'];
              const medalGrad = getMedalColor(pos);
              return (
                <div key={member._id} className="flex flex-col items-center gap-1 flex-1 max-w-[110px]">
                  <div className={`w-6 h-6 -translate-y-4 rounded-full flex items-center justify-center text-sm font-bold text-white ring-2 ring-offset-1 ${isDark ? 'ring-offset-gray-900' : 'ring-offset-white'} bg-gradient-to-br ${medalGrad}`}>
                    {pos === 1 ? <Crown className="w-4 h-4" /> : pos}
                  </div>
                  <div className={`w-10 h-10 rounded-full overflow-hidden ring-2 ${pos === 1 ? 'ring-yellow-400' : isDark ? 'ring-gray-600' : 'ring-gray-300'}`}>
                    <div className={`w-full h-full flex items-center justify-center text-sm font-bold text-white bg-gradient-to-br ${isDark ? 'from-purple-600 to-cyan-600' : 'from-purple-400 to-cyan-400'}`}>
                      {member.prenom[0]}{member.nom[0]}
                    </div>
                  </div>
                  <p className={`text-xs font-semibold text-center truncate w-full text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>{member.prenom}</p>
                  <p className={`text-xs font-bold text-cyan-500`}>{member.points} pts</p>
                  <div className={`w-full rounded-t-lg ${heights[i]} bg-gradient-to-t ${pos === 1 ? 'from-yellow-500/40 to-yellow-400/10' : pos === 2 ? 'from-slate-400/30 to-slate-300/10' : 'from-amber-700/30 to-amber-600/10'} border-t ${isDark ? 'border-white/10' : 'border-gray-200'}`} />
                </div>
              );
            })}
          </div>
        )}

        {/* Main table */}
        <div className="max-w-[900px] mx-auto">
          <div className={`rounded-2xl sm:rounded-3xl overflow-hidden backdrop-blur-xl ${
            isDark ? 'bg-black/40 border border-white/10' : 'bg-white/60 border border-gray-200/50'
          } shadow-2xl`}>
            <div className="h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500" />

            {/* Desktop header */}
            <div className={`hidden sm:grid grid-cols-15 gap-4 px-6 py-5 font-bold text-sm uppercase tracking-wider border-b ${
              isDark ? 'bg-gradient-to-r from-purple-900/30 to-cyan-900/30 border-white/10 text-gray-300' : 'bg-gradient-to-r from-purple-100/50 to-cyan-100/50 border-gray-200 text-gray-700'
            }`}>
              <div className="col-span-2 text-center">Pos</div>
              <div className="col-span-4 text-center">Membre</div>
              <div className="col-span-3 text-center">Téléphone</div>
              <div className="col-span-3 text-center">Email</div>
              <div className="col-span-2 text-center">Points</div>
            </div>

            {/* Mobile header */}
            <div className={`grid sm:hidden grid-cols-12 gap-2 px-3 py-3 font-bold text-xs uppercase tracking-wider border-b ${
              isDark ? 'bg-gradient-to-r from-purple-900/30 to-cyan-900/30 border-white/10 text-gray-300' : 'bg-gradient-to-r from-purple-100/50 to-cyan-100/50 border-gray-200 text-gray-700'
            }`}>
              <div className="col-span-2 text-center">#</div>
              <div className="col-span-6">Membre</div>
              <div className="col-span-3 text-center">Points</div>
              <div className="col-span-1 text-center"></div>
            </div>

            <div className={`divide-y ${isDark ? 'divide-white/5' : 'divide-gray-100'}`}>
              {membres.map((member, index) => {
                const position = index + 1;
                const isTopThree = position <= 3;
                const isFourth = position === 4;
                const isLastThree = position >= membres.length - 2;
                const isExpanded = expandedId === member._id;
                const medalGrad = getMedalColor(position);
                const borderCls = getBorderClass(position, membres.length);

                return (
                  <div key={member._id} className={`${borderCls}`} style={{ animation: `fadeIn 0.5s ease-out ${index * 0.07}s both` }}>
                    {/* Desktop row */}
                    <div className={`hidden sm:grid grid-cols-15 gap-4 px-6 py-4 items-center transition-all duration-300 cursor-pointer group ${
                      isDark ? 'hover:bg-gradient-to-r hover:from-purple-900/20 hover:to-cyan-900/20' : 'hover:bg-gradient-to-r hover:from-purple-50 hover:to-cyan-50'
                    }`}>
                      <div className="col-span-2 flex justify-center">
                        <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl font-bold text-lg ${
                          medalGrad ? `bg-gradient-to-br ${medalGrad} text-white` : isDark ? 'bg-gray-800/50 text-gray-300' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {position === 1 ? <Crown className="w-5 h-5" /> : position}
                        </div>
                      </div>
                      <div className="col-span-4 flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-full overflow-hidden ring-2 flex-shrink-0 ${isTopThree ? 'ring-yellow-400' : isDark ? 'ring-gray-700' : 'ring-gray-300'}`}>
                          <div className={`w-full h-full flex items-center justify-center text-lg font-bold text-white bg-gradient-to-br ${isDark ? 'from-purple-600 to-cyan-600' : 'from-purple-400 to-cyan-400'}`}>
                            {member.prenom[0]}{member.nom[0]}
                          </div>
                        </div>
                        <div>
                          <div className={`font-semibold text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {member.prenom} {member.nom}
                          </div>
                        </div>
                      </div>
                      <div className="col-span-3 flex justify-center">
                          <span className={`flex gap-2 items-center text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                            <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                            {session ? member.tel : <EyeOff size={18} classeName={isDark ? "text-white" : "text-black" />}
                          </span>
                        </div>
                      <div className="col-span-3 flex justify-center">
                        <span className={`flex gap-2 items-center text-xs truncate max-w-full ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                          <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                          <span className="truncate">{member.email}</span>
                        </span>
                      </div>
                      <div className="col-span-2 flex justify-center">
                        <div className={`inline-flex items-center justify-center px-4 py-2 rounded-xl font-bold text-lg ${
                          isDark ? 'bg-gradient-to-br from-gray-800 to-gray-900 text-cyan-400 border-cyan-500/30' : 'bg-gradient-to-br from-gray-100 to-gray-200 text-cyan-600 border-cyan-400/30'
                        } shadow-lg border group-hover:scale-110 transition-transform duration-300`}>
                          {member.points}
                        </div>
                      </div>
                    </div>

                    {/* Mobile row */}
                    <div className="sm:hidden">
                      <button
                        onClick={() => toggleExpand(member._id)}
                        className={`w-full grid grid-cols-12 gap-2 px-3 py-3 items-center text-left transition-all duration-300 ${
                          isDark ? 'hover:bg-purple-900/20 active:bg-purple-900/30' : 'hover:bg-purple-50 active:bg-purple-100'
                        }`}
                      >
                        {/* Position */}
                        <div className="col-span-2 flex justify-center">
                          <div className={`inline-flex items-center justify-center w-8 h-8 rounded-lg font-bold text-sm ${
                            medalGrad ? `bg-gradient-to-br ${medalGrad} text-white` : isDark ? 'bg-gray-800/60 text-gray-300' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {position === 1 ? <Crown className="w-4 h-4" /> : position}
                          </div>
                        </div>

                        {/* Name + avatar */}
                        <div className="col-span-6 flex items-center gap-2 min-w-0">
                          <div className={`w-9 h-9 rounded-full overflow-hidden ring-2 flex-shrink-0 ${isTopThree ? 'ring-yellow-400' : isDark ? 'ring-gray-700' : 'ring-gray-300'}`}>
                            <div className={`w-full h-full flex items-center justify-center text-sm font-bold text-white bg-gradient-to-br ${isDark ? 'from-purple-600 to-cyan-600' : 'from-purple-400 to-cyan-400'}`}>
                              {member.prenom[0]}{member.nom[0]}
                            </div>
                          </div>
                          <div className="min-w-0">
                            <p className={`font-semibold text-sm truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              {member.prenom} {member.nom}
                            </p>
                          </div>
                        </div>

                        {/* Points */}
                        <div className="col-span-3 flex justify-center">
                          <span className={`font-bold text-base ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                            {member.points}
                          </span>
                        </div>

                        {/* Expand icon */}
                        <div className="col-span-1 flex justify-center">
                          {isExpanded
                            ? <ChevronUp className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                            : <ChevronDown className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                          }
                        </div>
                      </button>

                      {/* Expanded details */}
                      {isExpanded && (
                        <div className={`px-4 pb-3 pt-1 space-y-2 transition-all duration-300 ${isDark ? 'bg-purple-900/10' : 'bg-purple-50/60'}`}>
                            <div className={`flex items-center gap-2 text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                              <Phone className="w-3.5 h-3.5 text-cyan-500 flex-shrink-0" />
                              <span>{session ? member.tel <EyeOff size={18} classeName={isDark ? "text-white" : "text-black" />}</span>
                            </div>
                          <div className={`flex items-center gap-2 text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                            <Mail className="w-3.5 h-3.5 text-cyan-500 flex-shrink-0" />
                            <span className="truncate">{member.email}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className={`mt-6 sm:mt-8 p-4 sm:p-6 rounded-2xl backdrop-blur-xl ${
            isDark ? 'bg-black/30 border border-white/10' : 'bg-white/40 border border-gray-200/50'
          }`}>
            <h3 className={`text-xs sm:text-sm font-bold uppercase tracking-wider mb-3 sm:mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Légende du classement
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <span className="text-lg">🟩</span>
                <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                  <span className="font-semibold text-green-400">Top 3</span> - Qualification garantie
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">🟪</span>
                <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                  <span className="font-semibold text-purple-400">4ᵉ place</span> - Position stable
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">🟥</span>
                <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                  <span className="font-semibold text-red-400">3 derniers</span> - Zone de danger
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}







