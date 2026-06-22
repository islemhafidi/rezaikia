import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users, RefreshCw, Search, Calendar,
  UserCheck, Hash, Info, ShieldAlert, Lock
} from 'lucide-react';
import { getAllVotes } from '../../hooks/useAdmin';

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleString('ar-DZ', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

export default function AdminVoters() {
  const [votes, setVotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [refreshes, setRefreshes] = useState(0);

  useEffect(() => {
    const fetchVotesData = async () => {
      setLoading(true);
      setError(null);
      try {
        const { votes: data } = await getAllVotes();
        setVotes(data || []);
      } catch (err) {
        console.error('getAllVotes error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchVotesData();
  }, [refreshes]);

  const filteredVotes = votes.filter(v => {
    const term = search.toLowerCase();
    return (
      (v.voter_name || '').toLowerCase().includes(term) ||
      (v.national_id || '').toLowerCase().includes(term) ||
      (v.candidate_name || '').toLowerCase().includes(term)
    );
  });

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-6xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between flex-wrap gap-4"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="h-px w-6 bg-algerian-gold" />
            <span className="text-algerian-gold text-xs font-bold uppercase tracking-widest">للقراءة فقط</span>
          </div>
          <h1 className="text-2xl font-black text-white font-tajawal">سجل المصوتين</h1>
          <p className="text-slate-500 text-sm mt-1">Voters Registry (Read-Only)</p>
        </div>
        <button
          onClick={() => setRefreshes(r => r + 1)}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 bg-algerian-green/10 hover:bg-algerian-green/20 border border-algerian-green/20 rounded-xl text-algerian-green text-sm font-semibold transition-all disabled:opacity-50 font-tajawal"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          تحديث
        </button>
      </motion.div>

      {/* Security notice */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="flex items-start gap-4 p-5 bg-amber-950/20 border border-amber-500/15 rounded-2xl"
      >
        <div className="p-2.5 rounded-xl bg-amber-500/10 flex-shrink-0">
          <Lock className="h-5 w-5 text-amber-400" />
        </div>
        <div>
          <p className="text-amber-300 font-bold text-sm font-tajawal mb-1">ملاحظة أمنية</p>
          <p className="text-slate-400 text-sm font-tajawal leading-relaxed">
            سجل الأصوات للقراءة فقط لضمان نزاهة محاكاة التصويت ومنع أي تعديل على البيانات.
          </p>
          <p className="text-slate-600 text-xs mt-1">
            This voter registry is strictly read-only to ensure simulation integrity.
          </p>
        </div>
      </motion.div>

      {/* Search & stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-[#040e06] border border-algerian-green/10 rounded-2xl p-4"
      >
        <div className="relative flex-1">
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" />
          <input
            type="text"
            placeholder="بحث بالاسم أو الرقم الوطني..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent border border-white/5 rounded-xl pr-10 pl-4 py-2.5 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-algerian-green/30 transition-all font-tajawal"
          />
        </div>
        <div className="flex items-center gap-2.5 px-4 py-2.5 bg-algerian-green/8 rounded-xl border border-algerian-green/15">
          <Users className="h-4 w-4 text-algerian-green" />
          <span className="text-white font-bold text-sm font-tajawal">{votes.length} مصوت</span>
        </div>
      </motion.div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 p-5 bg-red-950/30 border border-red-500/20 rounded-2xl text-red-400">
          <Info className="h-5 w-5 flex-shrink-0" />
          <div>
            <p className="text-sm font-bold font-tajawal">تعذر تحميل بيانات المصوتين</p>
            <p className="text-xs text-red-400/70 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && votes.length === 0 && (
        <div className="flex justify-center py-20">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full border-2 border-algerian-green/20 border-t-algerian-green animate-spin" />
            <p className="text-slate-500 text-sm font-tajawal">جاري التحميل...</p>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && filteredVotes.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-24 border border-dashed border-algerian-green/15 rounded-3xl bg-algerian-green/3 space-y-4"
        >
          <div className="w-16 h-16 rounded-2xl bg-algerian-green/10 flex items-center justify-center mx-auto">
            <Users className="h-8 w-8 text-algerian-green/40" />
          </div>
          <div>
            <p className="text-slate-300 text-lg font-bold font-tajawal">لا يوجد مصوتون بعد</p>
            <p className="text-slate-600 text-sm mt-1 font-tajawal">لم يشارك أي مواطن في محاكاة التصويت حتى الآن</p>
          </div>
        </motion.div>
      )}

      {/* Table */}
      {!error && filteredVotes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl border border-algerian-green/10 bg-[#040e06] overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 bg-algerian-green/5">
                  <th className="px-6 py-4 text-slate-500 font-bold text-xs uppercase tracking-widest text-right font-tajawal">الاسم</th>
                  <th className="px-6 py-4 text-slate-500 font-bold text-xs uppercase tracking-widest font-tajawal">الرقم الوطني</th>
                  <th className="px-6 py-4 text-slate-500 font-bold text-xs uppercase tracking-widest font-tajawal">المرشح</th>
                  <th className="px-4 py-4 text-slate-500 font-bold text-xs uppercase tracking-widest text-center font-tajawal">القائمة</th>
                  <th className="px-6 py-4 text-slate-500 font-bold text-xs uppercase tracking-widest text-right font-tajawal">التاريخ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/3">
                {filteredVotes.map((vote, i) => (
                  <motion.tr
                    key={vote.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.03, 0.5) }}
                    className="hover:bg-algerian-green/4 transition-colors group"
                  >
                    <td className="px-6 py-4 font-bold text-white font-tajawal group-hover:text-algerian-gold transition-colors">
                      {vote.voter_name}
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-500 text-xs tracking-wider">
                      {vote.national_id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <UserCheck className="h-4 w-4 text-algerian-green flex-shrink-0" />
                        <div>
                          <p className="text-slate-200 font-bold font-tajawal">{vote.candidate_name}</p>
                          <p className="text-slate-600 text-xs font-tajawal">رقم: {vote.candidate_number}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-algerian-gold/10 text-algerian-gold border border-algerian-gold/20 font-tajawal">
                        <Hash className="h-3 w-3" />
                        {vote.list_number}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5 text-xs text-slate-500">
                        <Calendar className="h-3.5 w-3.5" />
                        <span className="font-tajawal">{formatDate(vote.voted_at || vote.created_at)}</span>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
}
