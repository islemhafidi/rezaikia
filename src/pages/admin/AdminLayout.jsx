import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Settings, Newspaper, LogOut,
  Menu, X, Shield, Users, ChevronRight, Home, Lock, Star, Map
} from 'lucide-react';

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin2026';
const AUTH_KEY = 'oufia_admin_auth';

function isAuthenticated() {
  return localStorage.getItem(AUTH_KEY) === 'true';
}

// ─── Login Screen ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        localStorage.setItem(AUTH_KEY, 'true');
        onLogin();
      } else {
        setError('كلمة المرور غير صحيحة / Incorrect password');
      }
      setLoading(false);
    }, 700);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020c07] relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-algerian-green via-white to-algerian-red" />
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-1/4 -left-32 w-96 h-96 bg-algerian-green rounded-full blur-3xl"
      />
      <motion.div
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute bottom-1/4 -right-32 w-96 h-96 bg-algerian-red rounded-full blur-3xl"
      />

      {/* Decorative star */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-algerian-green/5 rounded-full"
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-algerian-gold/5 rounded-full" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        {/* Card */}
        <div className="bg-gradient-to-b from-[#0a1f0f] to-[#061208] border border-algerian-green/20 rounded-3xl p-10 shadow-2xl backdrop-blur-xl">
          {/* Flag stripe top */}
          <div className="absolute top-0 left-0 right-0 h-0.5 flex rounded-t-3xl overflow-hidden">
            <div className="bg-algerian-green flex-1" />
            <div className="bg-white w-8" />
            <div className="bg-algerian-red flex-1" />
          </div>

          {/* Logo & Title */}
          <div className="flex flex-col items-center mb-10">
            <div className="relative mb-5">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-algerian-green to-algerian-dark flex items-center justify-center shadow-xl shadow-algerian-green/30">
                <Shield className="h-9 w-9 text-algerian-gold" />
              </div>
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -inset-1 rounded-2xl border border-algerian-gold/30"
              />
            </div>
            <h1 className="text-3xl font-black text-white font-tajawal text-center leading-tight">
              لوحة التحكم
            </h1>
            <p className="text-algerian-gold/80 text-sm mt-1 font-medium tracking-widest uppercase">
              Admin · أوفياء نوفمبر
            </p>
            <div className="flex items-center gap-1.5 mt-3">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-algerian-green/50" />
              <Star className="h-3 w-3 text-algerian-gold fill-algerian-gold" />
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-algerian-red/50" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-slate-300 text-sm font-semibold mb-2 font-tajawal">
                <Lock className="inline h-3.5 w-3.5 ml-1.5 opacity-60" />
                كلمة المرور
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••"
                className="w-full bg-black/30 border border-algerian-green/20 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-algerian-green/50 focus:border-algerian-green/40 transition-all text-sm"
                autoFocus
              />
            </div>

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-red-400 text-sm bg-red-950/40 border border-red-500/20 rounded-xl px-4 py-3 font-tajawal text-center"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              disabled={loading || !password}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-gradient-to-r from-algerian-green via-algerian-dark to-algerian-green text-white font-bold rounded-xl shadow-xl shadow-algerian-green/20 disabled:opacity-40 transition-all font-tajawal text-base tracking-wide relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-algerian-gold/0 via-algerian-gold/10 to-algerian-gold/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  جاري التحقق...
                </span>
              ) : (
                'دخول إلى لوحة التحكم'
              )}
            </motion.button>
          </form>

          <p className="text-center text-slate-600 text-xs mt-6">
            أوفياء نوفمبر · حملة انتخابية 2026
          </p>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Sidebar nav links ─────────────────────────────────────────────────────────
const navItems = [
  { to: '/admin', label: 'لوحة القيادة', labelEn: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/map', label: 'خريطة الأصوات', labelEn: 'Votes Map', icon: Map, end: false },
  { to: '/admin/articles', label: 'المقالات والأخبار', labelEn: 'Articles', icon: Newspaper, end: false },
  { to: '/admin/voters', label: 'المصوتون', labelEn: 'Voters', icon: Users, end: false },
  { to: '/admin/settings', label: 'الإعدادات', labelEn: 'Settings', icon: Settings, end: false },
];

// ─── Admin Layout ─────────────────────────────────────────────────────────────
export default function AdminLayout() {
  const [authed, setAuthed] = useState(isAuthenticated());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem(AUTH_KEY);
    setAuthed(false);
  };

  if (!authed) {
    return <LoginScreen onLogin={() => setAuthed(true)} />;
  }

  return (
    <div className="flex min-h-screen bg-[#020c07] text-slate-100">
      {/* Mobile backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-30 bg-black/80 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* ── Sidebar ── */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-40 w-72 flex flex-col
          bg-gradient-to-b from-[#040e06] to-[#020c07]
          border-r border-algerian-green/10
          shadow-2xl shadow-black/50
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-auto
        `}
      >
        {/* Flag stripe */}
        <div className="h-1 flex shrink-0">
          <div className="bg-algerian-green flex-[2]" />
          <div className="bg-white w-5" />
          <div className="bg-algerian-red flex-1" />
        </div>

        {/* Brand header */}
        <div className="px-5 py-6 border-b border-algerian-green/10 bg-gradient-to-r from-algerian-green/5 to-transparent">
          <div className="flex items-center gap-3.5">
            <div className="relative flex-shrink-0">
              <div className="w-11 h-11 bg-gradient-to-br from-algerian-green to-algerian-dark rounded-xl flex items-center justify-center shadow-lg shadow-algerian-green/30">
                <Shield className="h-5 w-5 text-algerian-gold" />
              </div>
              <div className="absolute -inset-0.5 rounded-xl border border-algerian-gold/20" />
            </div>
            <div>
              <p className="text-white font-black text-sm font-tajawal">أوفياء نوفمبر</p>
              <p className="text-algerian-gold/70 text-xs font-medium tracking-wider uppercase">Admin Panel</p>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden ml-auto p-1.5 text-slate-500 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Back to site */}
          <Link
            to="/"
            className="flex items-center gap-1.5 mt-4 text-xs text-slate-500 hover:text-algerian-gold transition-colors group"
          >
            <Home className="h-3.5 w-3.5 group-hover:scale-110 transition-transform" />
            <span>العودة للموقع / Back to Site</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1.5">
          <p className="text-xs font-bold text-slate-600 uppercase tracking-widest px-3 pb-2 font-tajawal">القائمة الرئيسية</p>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group relative overflow-hidden ${
                  isActive
                    ? 'bg-algerian-green/15 text-white border border-algerian-green/25'
                    : 'text-slate-500 hover:text-slate-200 hover:bg-white/4'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute left-0 top-0 bottom-0 w-0.5 bg-algerian-gold rounded-full"
                    />
                  )}
                  <item.icon className={`h-4.5 w-4.5 flex-shrink-0 transition-colors ${isActive ? 'text-algerian-gold' : 'text-slate-600 group-hover:text-slate-400'}`} style={{height: '18px', width: '18px'}} />
                  <div className="flex-1 min-w-0">
                    <p className={`font-tajawal font-bold leading-tight ${isActive ? 'text-white' : ''}`}>{item.label}</p>
                    <p className="text-xs text-slate-600 group-hover:text-slate-500 transition-colors leading-tight">{item.labelEn}</p>
                  </div>
                  {isActive && <ChevronRight className="h-3.5 w-3.5 text-algerian-gold/50 flex-shrink-0" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom section */}
        <div className="px-4 pb-6 space-y-2 border-t border-algerian-green/10 pt-4">
          {/* Campaign info badge */}
          <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-algerian-green/5 border border-algerian-green/10">
            <div className="flex-shrink-0">
              <div className="w-2 h-2 rounded-full bg-algerian-green animate-pulse" />
            </div>
            <div>
              <p className="text-xs text-algerian-green font-bold font-tajawal">حملة 2026 نشطة</p>
              <p className="text-xs text-slate-600">القائمة 102 · المرشح 2</p>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3.5 py-3 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/8 text-sm font-semibold transition-all duration-200 group"
          >
            <LogOut className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            <span className="font-tajawal">تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top bar (mobile) */}
        <header className="lg:hidden flex items-center justify-between px-5 py-4 bg-[#040e06] border-b border-algerian-green/10">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-algerian-green/10 transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-algerian-green rounded-lg flex items-center justify-center">
              <Shield className="h-3.5 w-3.5 text-algerian-gold" />
            </div>
            <span className="text-white font-black text-sm font-tajawal">Admin</span>
          </div>
          <Link to="/" className="p-2 rounded-xl text-slate-400 hover:text-algerian-gold transition-colors">
            <Home className="h-5 w-5" />
          </Link>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
