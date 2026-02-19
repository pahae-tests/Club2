import { useState, useEffect } from 'react';
import { Shield, Menu, X, Moon, Sun, LogOut, Trophy, FolderKanban, Newspaper, Users, Shuffle } from 'lucide-react';
import Link from 'next/link';

export default function Header({ isDark, setIsDark }) {
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setIsDark(savedTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    setIsDark(!isDark);
    localStorage.setItem('theme', newTheme);
  };

  const handleLogout = () => {
    window.localStorage.removeItem("session");
    window.location.reload();
  };

  const navItems = [
    { name: 'Classement', path: '/classement', icon: Trophy },
    { name: 'Projets', path: '/projets', icon: FolderKanban },
    { name: 'Actualités', path: '/actualites', icon: Newspaper },
    { name: 'Membres', path: '/membres', icon: Users },
    { name: 'Randomizer', path: '/randomizer', icon: Shuffle },
  ];

  if (!mounted) return null;

  return (
    <header className={`fixed w-full top-0 z-50 transition-all duration-700 backdrop-blur-3xl`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <img src="/logo.png" className="h-26" />
            {/* <div className={`relative w-12 h-12 rounded-xl overflow-hidden ring-2 transition-all duration-300 ${
              isDark
                ? 'ring-purple-500/50 group-hover:ring-purple-400'
                : 'ring-purple-400/50 group-hover:ring-purple-500'
            }`}>
              <div className={`w-full h-full flex items-center justify-center ${
                isDark ? 'bg-gradient-to-br from-purple-600 to-cyan-600' : 'bg-gradient-to-br from-purple-400 to-cyan-400'
              }`}>
                <img src="/logo.png" className="w-full h-full" />
              </div>
            </div>
            <div className="hidden sm:block">
              <h1 className={`text-xl font-black tracking-tight ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                <span className="bg-gradient-to-r from-pink-600 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
                  WORMZ
                </span>
              </h1>
            </div> */}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <a
                key={item.path}
                href={item.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 ${isDark
                    ? 'text-gray-300 hover:text-white hover:bg-white/10'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }`}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </a>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 ${isDark
                  ? 'bg-white/10 hover:bg-white/20 text-yellow-400'
                  : 'bg-gray-100 hover:bg-gray-200 text-purple-600'
                }`}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Logout Button (Desktop) */}
            <button
              onClick={handleLogout}
              className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 ${isDark
                  ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30'
                  : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                }`}
            >
              <LogOut className="w-4 h-4" />
              Déconnexion
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`md:hidden flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 ${isDark
                  ? 'bg-white/10 hover:bg-white/20 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                }`}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-500 ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}
        >
          <nav className={`py-4 space-y-2 border-t ${isDark ? 'border-white/10' : 'border-gray-200/50'
            }`}>
            {navItems.map((item, index) => (
              <a
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${isDark
                    ? 'text-gray-300 hover:text-white hover:bg-white/10'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                style={{
                  animation: isMenuOpen ? `fadeIn 0.3s ease-out ${index * 0.1}s both` : 'none'
                }}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </a>
            ))}
            <button
              onClick={handleLogout}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${isDark
                  ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30'
                  : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                }`}
              style={{
                animation: isMenuOpen ? `fadeIn 0.3s ease-out ${navItems.length * 0.1}s both` : 'none'
              }}
            >
              <LogOut className="w-5 h-5" />
              Déconnexion
            </button>
          </nav>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </header>
  );

}
