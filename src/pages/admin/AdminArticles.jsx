import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  PlusCircle, Edit3, Trash2, Eye, EyeOff,
  Calendar, Loader2, AlertCircle, Newspaper,
  ArrowUpRight, Search, Filter
} from 'lucide-react';
import { useArticles } from '../../hooks/useArticles';
import { deleteArticle, toggleArticlePublish } from '../../hooks/useAdmin';

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('ar-DZ', {
    year: 'numeric', month: 'short', day: 'numeric'
  });
}

export default function AdminArticles() {
  const { articles, loading, error, refetch } = useArticles({ adminMode: true });
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [togglingId, setTogglingId] = useState(null);
  const [search, setSearch] = useState('');

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await deleteArticle(id);
      await refetch();
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    } finally {
      setDeletingId(null);
      setConfirmDelete(null);
    }
  };

  const handleTogglePublish = async (article) => {
    setTogglingId(article.id);
    try {
      await toggleArticlePublish(article.id, !article.is_published);
      await refetch();
    } catch (err) {
      alert(`Failed to toggle: ${err.message}`);
    } finally {
      setTogglingId(null);
    }
  };

  const filtered = articles.filter(a => {
    const s = search.toLowerCase();
    return (a.title_en || '').toLowerCase().includes(s) || (a.title_ar || '').includes(s);
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
            <span className="text-algerian-gold text-xs font-bold uppercase tracking-widest">المحتوى</span>
          </div>
          <h1 className="text-2xl font-black text-white font-tajawal">المقالات والأخبار</h1>
          <p className="text-slate-500 text-sm mt-1">Articles & News Management</p>
        </div>
        <Link
          to="/admin/articles/new"
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-algerian-green to-algerian-dark text-white font-bold rounded-xl hover:shadow-lg hover:shadow-algerian-green/20 transition-all shadow-md"
        >
          <PlusCircle className="h-4 w-4" />
          <span className="font-tajawal">مقال جديد</span>
        </Link>
      </motion.div>

      {/* Search & Filter bar */}
      {!loading && articles.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-3 bg-[#040e06] border border-algerian-green/10 rounded-2xl p-4"
        >
          <Search className="h-4 w-4 text-slate-500 flex-shrink-0" />
          <input
            type="text"
            placeholder="بحث في المقالات... / Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-white placeholder-slate-600 text-sm focus:outline-none"
          />
          <span className="text-slate-600 text-xs border border-white/5 rounded-lg px-2.5 py-1">
            {filtered.length} مقال
          </span>
        </motion.div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-20">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full border-2 border-algerian-green/20 border-t-algerian-green animate-spin" />
            <p className="text-slate-500 text-sm font-tajawal">جاري التحميل...</p>
          </div>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="flex items-center gap-3 p-5 bg-red-950/30 border border-red-500/20 rounded-2xl text-red-400">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm font-tajawal">فشل تحميل المقالات: {error}</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && articles.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-24 border border-dashed border-algerian-green/15 rounded-3xl bg-algerian-green/3 space-y-5"
        >
          <div className="w-16 h-16 rounded-2xl bg-algerian-green/10 flex items-center justify-center mx-auto">
            <Newspaper className="h-8 w-8 text-algerian-green/50" />
          </div>
          <div>
            <p className="text-slate-300 text-lg font-bold font-tajawal">لا يوجد مقالات بعد</p>
            <p className="text-slate-600 text-sm mt-1">أنشئ أول مقال أو ابدر قاعدة البيانات من لوحة القيادة</p>
          </div>
          <Link
            to="/admin/articles/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-algerian-green text-white font-bold rounded-xl hover:bg-algerian-dark transition-all font-tajawal"
          >
            <PlusCircle className="h-4 w-4" />
            إنشاء أول مقال
          </Link>
        </motion.div>
      )}

      {/* Articles table */}
      {!loading && filtered.length > 0 && (
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
                  <th className="px-6 py-4 text-slate-500 font-bold text-xs uppercase tracking-widest text-right font-tajawal">المقالة</th>
                  <th className="px-4 py-4 text-slate-500 font-bold text-xs uppercase tracking-widest hidden md:table-cell">التاريخ</th>
                  <th className="px-4 py-4 text-slate-500 font-bold text-xs uppercase tracking-widest hidden sm:table-cell">الحالة</th>
                  <th className="px-4 py-4 text-slate-500 font-bold text-xs uppercase tracking-widest text-right">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((article, i) => (
                  <motion.tr
                    key={article.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="border-b border-white/3 hover:bg-algerian-green/4 transition-colors group"
                  >
                    {/* Article info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {/* Thumbnail */}
                        <div className="w-14 h-10 rounded-lg overflow-hidden bg-algerian-green/10 flex-shrink-0 border border-white/5">
                          {article.cover_url ? (
                            <img src={article.cover_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Newspaper className="h-4 w-4 text-algerian-green/30" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-white font-bold leading-snug line-clamp-1 max-w-xs group-hover:text-algerian-gold transition-colors">
                            {article.title_ar || article.title_en}
                          </p>
                          <p className="text-slate-600 text-xs line-clamp-1 mt-0.5 max-w-xs">
                            {article.title_en}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-4 hidden md:table-cell">
                      <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                        <Calendar className="h-3.5 w-3.5" />
                        <span className="font-tajawal">{formatDate(article.published_at)}</span>
                      </div>
                    </td>

                    {/* Status badge */}
                    <td className="px-4 py-4 hidden sm:table-cell">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
                        article.is_published
                          ? 'bg-algerian-green/15 text-algerian-green border border-algerian-green/25'
                          : 'bg-slate-800/50 text-slate-500 border border-white/5'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${article.is_published ? 'bg-algerian-green animate-pulse' : 'bg-slate-600'}`} />
                        <span className="font-tajawal">{article.is_published ? 'منشور' : 'مسودة'}</span>
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5 justify-end">
                        <button
                          onClick={() => handleTogglePublish(article)}
                          disabled={togglingId === article.id}
                          title={article.is_published ? 'إلغاء النشر' : 'نشر'}
                          className="p-2 rounded-lg text-slate-600 hover:text-algerian-gold hover:bg-algerian-gold/10 transition-all disabled:opacity-40"
                        >
                          {togglingId === article.id
                            ? <Loader2 className="h-4 w-4 animate-spin" />
                            : article.is_published
                              ? <EyeOff className="h-4 w-4" />
                              : <Eye className="h-4 w-4" />
                          }
                        </button>

                        <Link
                          to={`/admin/articles/${article.id}`}
                          className="p-2 rounded-lg text-slate-600 hover:text-blue-400 hover:bg-blue-500/10 transition-all"
                          title="تعديل"
                        >
                          <Edit3 className="h-4 w-4" />
                        </Link>

                        <button
                          onClick={() => setConfirmDelete(article)}
                          disabled={deletingId === article.id}
                          title="حذف"
                          className="p-2 rounded-lg text-slate-600 hover:text-algerian-red hover:bg-algerian-red/10 transition-all disabled:opacity-40"
                        >
                          {deletingId === article.id
                            ? <Loader2 className="h-4 w-4 animate-spin" />
                            : <Trash2 className="h-4 w-4" />
                          }
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Delete confirmation modal */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#040e06] border border-algerian-red/20 rounded-3xl p-8 max-w-sm w-full shadow-2xl"
            >
              {/* Top stripe */}
              <div className="h-0.5 bg-gradient-to-r from-algerian-red/50 via-algerian-red to-algerian-red/50 rounded-full mb-6" />

              <div className="flex items-center gap-3 mb-5">
                <div className="p-3 bg-algerian-red/15 rounded-xl">
                  <Trash2 className="h-6 w-6 text-algerian-red" />
                </div>
                <div>
                  <h3 className="text-white font-black font-tajawal">حذف المقال</h3>
                  <p className="text-slate-500 text-xs">هذا الإجراء لا يمكن التراجع عنه</p>
                </div>
              </div>

              <p className="text-slate-400 text-sm mb-6 bg-slate-900/50 p-4 rounded-xl border border-white/5 font-tajawal leading-relaxed">
                "{confirmDelete.title_ar || confirmDelete.title_en}"
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="flex-1 py-3 border border-white/8 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 text-sm font-bold transition-all font-tajawal"
                >
                  إلغاء
                </button>
                <button
                  onClick={() => handleDelete(confirmDelete.id)}
                  disabled={deletingId === confirmDelete.id}
                  className="flex-1 py-3 bg-algerian-red hover:bg-red-700 rounded-xl text-white text-sm font-bold transition-all disabled:opacity-60 font-tajawal"
                >
                  {deletingId === confirmDelete.id ? 'جارٍ الحذف...' : 'حذف نهائياً'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
