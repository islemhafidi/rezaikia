import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Users, Newspaper, Target, TrendingUp,
  PlusCircle, Settings, RefreshCw, Database,
  ArrowUpRight, Flame, Zap, Activity
} from 'lucide-react';
import { supabase } from '../../utils/supabaseClient';
import { useArticles } from '../../hooks/useArticles';
import { useSettings } from '../../hooks/useSettings';
import { seedDatabase } from '../../utils/seedData';

function StatCard({ icon: Icon, label, labelAr, value, gradient, glowColor, delay = 0, sub }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="relative group overflow-hidden rounded-2xl border border-white/5 hover:border-white/10 transition-all duration-300 cursor-default"
    >
      {/* Gradient background */}
      <div className={`absolute inset-0 ${gradient} opacity-10 group-hover:opacity-15 transition-opacity`} />
      <div className="absolute inset-0 bg-[#040e06]/80" />

      {/* Glow effect */}
      <div className={`absolute -top-6 -right-6 w-24 h-24 ${glowColor} rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity`} />

      <div className="relative p-5 flex items-start gap-4">
        <div className={`p-2.5 rounded-xl ${gradient} bg-opacity-20 flex-shrink-0 shadow-lg`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-0.5 font-tajawal">{labelAr}</p>
          <p className="text-sm text-slate-500 mb-2">{label}</p>
          <p className="text-4xl font-black text-white leading-none">{value ?? '—'}</p>
          {sub && <p className="text-slate-500 text-xs mt-2">{sub}</p>}
        </div>
        <ArrowUpRight className="h-4 w-4 text-slate-700 group-hover:text-slate-400 transition-colors flex-shrink-0 mt-1" />
      </div>
    </motion.div>
  );
}

export default function AdminDashboard() {
  const { articles } = useArticles({ adminMode: true });
  const { settings } = useSettings();
  const [voteCount, setVoteCount] = useState(null);
  const [voteLoading, setVoteLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [seedMsg, setSeedMsg] = useState('');

  const fetchVotes = async () => {
    setVoteLoading(true);
    try {
      const { count, error } = await supabase
        .from('votes')
        .select('*', { count: 'exact', head: true });
      if (!error) setVoteCount(count || 0);
    } catch (e) {
      console.error(e);
    } finally {
      setVoteLoading(false);
    }
  };

  useEffect(() => {
    fetchVotes();
  }, []);

  const handleSeed = async () => {
    setSeeding(true);
    setSeedMsg('');
    const result = await seedDatabase();
    setSeedMsg(result.message);
    setSeeding(false);
  };

  const voteGoal = settings?.vote_goal ?? 2500;
  const votePercent = voteCount !== null ? Math.min(100, Math.round((voteCount / voteGoal) * 100)) : 0;
  const publishedCount = articles.filter((a) => a.is_published).length;
  const draftCount = articles.length - publishedCount;

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'صباح الخير' : hour < 18 ? 'مساء الخير' : 'مساء النور';

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-6xl">

      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between flex-wrap gap-4"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="h-px w-6 bg-algerian-gold" />
            <span className="text-algerian-gold text-xs font-bold uppercase tracking-widest">نوفمبر 2026</span>
          </div>
          <h1 className="text-3xl font-black text-white font-tajawal leading-tight">
            {greeting} 👋
          </h1>
          <p className="text-slate-500 text-sm mt-1">Campaign Overview · لوحة القيادة</p>
        </div>
        <button
          onClick={fetchVotes}
          className="flex items-center gap-2 px-4 py-2.5 bg-algerian-green/10 hover:bg-algerian-green/20 border border-algerian-green/20 rounded-xl text-algerian-green text-sm font-semibold transition-all"
        >
          <RefreshCw className={`h-4 w-4 ${voteLoading ? 'animate-spin' : ''}`} />
          تحديث
        </button>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          label="Total Votes"
          labelAr="مجموع الأصوات"
          value={voteLoading ? '...' : voteCount?.toLocaleString()}
          gradient="bg-algerian-green"
          glowColor="bg-algerian-green"
          delay={0}
          sub={`الهدف: ${voteGoal.toLocaleString()}`}
        />
        <StatCard
          icon={Activity}
          label="Vote Progress"
          labelAr="نسبة الإنجاز"
          value={voteLoading ? '...' : `${votePercent}%`}
          gradient="bg-algerian-gold"
          glowColor="bg-algerian-gold"
          delay={0.08}
        />
        <StatCard
          icon={Newspaper}
          label="Published Articles"
          labelAr="مقالات منشورة"
          value={publishedCount}
          gradient="bg-blue-600"
          glowColor="bg-blue-600"
          delay={0.16}
          sub={`${draftCount} مسودة`}
        />
        <StatCard
          icon={TrendingUp}
          label="Total Articles"
          labelAr="مجموع المقالات"
          value={articles.length}
          gradient="bg-algerian-red"
          glowColor="bg-algerian-red"
          delay={0.24}
        />
      </div>

      {/* Vote Progress Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="relative overflow-hidden rounded-2xl border border-algerian-green/15 bg-[#040e06]"
      >
        {/* Background texture */}
        <div className="absolute inset-0 bg-gradient-to-br from-algerian-green/5 via-transparent to-algerian-gold/5" />

        <div className="relative p-7">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Flame className="h-4 w-4 text-algerian-gold" />
                <p className="text-algerian-gold text-sm font-bold font-tajawal uppercase tracking-wide">تقدم الحملة</p>
              </div>
              <h2 className="text-white font-black text-xl font-tajawal">Campaign Vote Progress</h2>
            </div>
            <div className="text-right">
              <p className="text-4xl font-black text-white">{votePercent}%</p>
              <p className="text-slate-500 text-xs mt-1">من الهدف / of goal</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-4 bg-slate-900 rounded-full overflow-hidden mb-3 border border-white/5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${votePercent}%` }}
              transition={{ duration: 1.5, ease: [0.34, 1.56, 0.64, 1] }}
              className="h-full rounded-full relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-algerian-green via-algerian-gold to-algerian-red" />
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
            </motion.div>
          </div>

          <div className="flex justify-between text-xs text-slate-600">
            <span className="font-tajawal">{(voteCount || 0).toLocaleString()} صوت محصّل</span>
            <span>{voteGoal.toLocaleString()} الهدف</span>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <p className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-4 font-tajawal">إجراءات سريعة</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            to="/admin/articles/new"
            className="group flex items-center gap-4 p-5 rounded-2xl border border-algerian-green/20 bg-algerian-green/5 hover:bg-algerian-green/12 hover:border-algerian-green/40 transition-all duration-200"
          >
            <div className="p-2.5 rounded-xl bg-algerian-green/20 group-hover:bg-algerian-green/30 transition-colors">
              <PlusCircle className="h-5 w-5 text-algerian-green" />
            </div>
            <div>
              <p className="text-white font-bold text-sm font-tajawal group-hover:text-algerian-green transition-colors">مقال جديد</p>
              <p className="text-slate-600 text-xs">New Article</p>
            </div>
            <ArrowUpRight className="h-4 w-4 text-slate-700 group-hover:text-algerian-green transition-colors ml-auto" />
          </Link>

          <Link
            to="/admin/settings"
            className="group flex items-center gap-4 p-5 rounded-2xl border border-algerian-gold/20 bg-algerian-gold/5 hover:bg-algerian-gold/12 hover:border-algerian-gold/40 transition-all duration-200"
          >
            <div className="p-2.5 rounded-xl bg-algerian-gold/20 group-hover:bg-algerian-gold/30 transition-colors">
              <Settings className="h-5 w-5 text-algerian-gold" />
            </div>
            <div>
              <p className="text-white font-bold text-sm font-tajawal group-hover:text-algerian-gold transition-colors">الإعدادات</p>
              <p className="text-slate-600 text-xs">Edit Settings</p>
            </div>
            <ArrowUpRight className="h-4 w-4 text-slate-700 group-hover:text-algerian-gold transition-colors ml-auto" />
          </Link>

          <button
            onClick={handleSeed}
            disabled={seeding}
            className="group flex items-center gap-4 p-5 rounded-2xl border border-blue-500/20 bg-blue-600/5 hover:bg-blue-600/12 hover:border-blue-500/40 transition-all duration-200 disabled:opacity-50 text-left w-full"
          >
            <div className="p-2.5 rounded-xl bg-blue-600/20 group-hover:bg-blue-600/30 transition-colors">
              <Database className={`h-5 w-5 text-blue-400 ${seeding ? 'animate-pulse' : ''}`} />
            </div>
            <div>
              <p className="text-white font-bold text-sm font-tajawal group-hover:text-blue-400 transition-colors">
                {seeding ? 'جارٍ التهيئة...' : 'تهيئة البيانات'}
              </p>
              <p className="text-slate-600 text-xs">Seed Database</p>
            </div>
            <Zap className="h-4 w-4 text-slate-700 group-hover:text-blue-400 transition-colors ml-auto" />
          </button>
        </div>
      </motion.div>

      {/* Seed message */}
      {seedMsg && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 bg-algerian-green/8 border border-algerian-green/25 rounded-xl p-4 text-algerian-green text-sm font-semibold font-tajawal"
        >
          <div className="w-2 h-2 rounded-full bg-algerian-green animate-pulse flex-shrink-0" />
          {seedMsg}
        </motion.div>
      )}

      {/* November footer motto */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex items-center gap-4 pt-4 border-t border-white/5"
      >
        <div className="flex gap-1">
          <div className="w-3 h-5 bg-algerian-green rounded-sm" />
          <div className="w-1.5 h-5 bg-white rounded-sm" />
          <div className="w-3 h-5 bg-algerian-red rounded-sm" />
        </div>
        <p className="text-slate-600 text-xs font-tajawal">أوفياء نوفمبر · الجزائر 2026</p>
      </motion.div>
    </div>
  );
}
