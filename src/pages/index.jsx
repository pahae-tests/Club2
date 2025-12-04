import { useState, useEffect } from 'react';
import { Lock, LogIn, Megaphone } from 'lucide-react';

export default function AdminLogin({ isDark = true }) {
    const [mounted, setMounted] = useState(false);
    const [code, setCode] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        setMounted(true);
        if (window.localStorage.getItem("session") === "yes")
            window.location.href = "classement";
    }, []);

    const handleLogin = async () => {
        if (!code) {
            setError('Veuillez entrer le code administrateur');
            return;
        }
        try {
            const res = await fetch("/api/_auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ code })
            });

            if (!res.ok) throw new Error("Erreur de connexion");

            const data = await res.json();
            if (data === "success") {
                window.localStorage.setItem("session", "yes");
                window.location.reload();
            } else {
                setError("Code incorrect");
            }
        } catch (error) {
            alert(error);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleLogin();
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

            <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-12">
                <div className="w-full max-w-md">
                    <div className="text-center mb-12">
                        <div className="inline-block mb-6">
                            <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-pink-600 via-purple-500 to-cyan-500 flex items-center justify-center shadow-2xl ${isDark ? 'shadow-purple-500/50' : 'shadow-purple-400/50'
                                }`}>
                                <Lock className="w-10 h-10 text-white" />
                            </div>
                            <h1 className={`relative text-3xl md:text-5xl font-black tracking-tight ${isDark ? 'text-white' : 'text-gray-900'
                                }`}>
                                <span className="bg-gradient-to-r from-pink-600 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
                                    Espace Admin
                                </span>
                            </h1>
                        </div>
                        <p className={`text-base md:text-lg font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                            <Megaphone className="inline-block w-4 h-4 mr-2" />
                            Club de Cybersécurité Universitaire
                        </p>
                    </div>

                    <div className={`rounded-3xl overflow-hidden backdrop-blur-xl ${isDark
                        ? 'bg-black/40 border border-white/10'
                        : 'bg-white/60 border border-gray-200/50'
                        } shadow-2xl`}>
                        <div className="h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500"></div>

                        <div className="p-8">
                            <div className="space-y-6">
                                <div>
                                    <label className={`block text-sm font-bold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'
                                        }`}>
                                        Code Administrateur
                                    </label>
                                    <input
                                        type="password"
                                        value={code}
                                        onChange={(e) => {
                                            setCode(e.target.value);
                                            setError('');
                                        }}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Entrez votre code"
                                        className={`w-full px-4 py-3 rounded-lg ${isDark
                                            ? 'bg-gray-800 text-white border-gray-700 placeholder-gray-500'
                                            : 'bg-gray-100 text-gray-900 border-gray-300 placeholder-gray-400'
                                            } border focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all`}
                                    />
                                    {error && (
                                        <p className="mt-2 text-sm text-red-400 font-medium">
                                            {error}
                                        </p>
                                    )}
                                </div>

                                <button
                                    onClick={handleLogin}
                                    className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-lg bg-gradient-to-r from-pink-600 via-purple-500 to-cyan-500 hover:from-pink-700 hover:via-purple-600 hover:to-cyan-600 text-white font-bold transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                                >
                                    <LogIn className="w-5 h-5" />
                                    Se Connecter
                                </button>
                            </div>

                            <div className={`mt-6 pt-6 border-t ${isDark ? 'border-white/10' : 'border-gray-200'
                                } text-center`}>
                                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'
                                    }`}>
                                    Accès réservé aux administrateurs du club
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 text-center">
                        <a
                            href="#"
                            className={`text-sm font-medium ${isDark ? 'text-gray-400 hover:text-purple-400' : 'text-gray-600 hover:text-purple-600'
                                } transition-colors`}
                        >
                            Retour à l'accueil
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}