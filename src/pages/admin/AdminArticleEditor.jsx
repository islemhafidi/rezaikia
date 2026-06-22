import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Save, ArrowLeft, Upload, X, Loader2,
  CheckCircle, AlertCircle, ImageIcon, Eye, EyeOff,
  Globe, FileText, AlignLeft
} from 'lucide-react';
import { supabase } from '../../utils/supabaseClient';
import { createArticle, updateArticle, uploadImage } from '../../hooks/useAdmin';

function Field({ label, labelEn, required, children }) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-bold text-slate-300 font-tajawal">
        {label}
        {labelEn && <span className="text-slate-600 font-normal text-xs ml-2">({labelEn})</span>}
        {required && <span className="text-algerian-red ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputClass = "w-full bg-black/30 border border-algerian-green/15 rounded-xl px-4 py-3 text-white placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-algerian-green/30 focus:border-algerian-green/40 transition-all text-sm";
const textareaClass = `${inputClass} resize-y min-h-[120px] leading-relaxed`;

const emptyForm = {
  title_ar: '',
  title_en: '',
  summary_ar: '',
  summary_en: '',
  body_ar: '',
  body_en: '',
  cover_url: '',
  published_at: new Date().toISOString().slice(0, 16),
  is_published: true,
};

function SectionCard({ icon: Icon, title, titleAr, children }) {
  return (
    <section className="bg-[#040e06] border border-algerian-green/10 rounded-2xl overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-white/5 bg-algerian-green/3">
        <Icon className="h-4 w-4 text-algerian-gold" />
        <div>
          <p className="text-white font-bold text-sm font-tajawal">{titleAr}</p>
          <p className="text-slate-600 text-xs">{title}</p>
        </div>
      </div>
      <div className="p-6 space-y-5">
        {children}
      </div>
    </section>
  );
}

export default function AdminArticleEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = id && id !== 'new';

  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!isEdit) return;
    const fetchArticle = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .eq('id', id)
          .single();
        if (error) throw error;
        setForm({
          ...data,
          published_at: data.published_at ? data.published_at.slice(0, 16) : new Date().toISOString().slice(0, 16),
        });
        if (data.cover_url) setCoverPreview(data.cover_url);
      } catch (err) {
        setStatus({ type: 'error', msg: `فشل التحميل: ${err.message}` });
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id, isEdit]);

  const update = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverPreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const uid = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const path = `articles/cover-${uid}.${ext}`;
      const publicUrl = await uploadImage(file, path);
      update('cover_url', publicUrl);
      setStatus({ type: 'success', msg: 'تم رفع الصورة بنجاح!' });
    } catch (err) {
      setStatus({ type: 'error', msg: `فشل الرفع: ${err.message}` });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title_ar && !form.title_en) {
      setStatus({ type: 'error', msg: 'يجب إدخال عنوان واحد على الأقل (عربي أو إنجليزي).' });
      return;
    }
    setSaving(true);
    setStatus(null);
    try {
      const payload = {
        ...form,
        published_at: form.published_at ? new Date(form.published_at).toISOString() : new Date().toISOString(),
      };
      if (isEdit) {
        await updateArticle(parseInt(id), payload);
      } else {
        await createArticle(payload);
      }
      setStatus({ type: 'success', msg: isEdit ? 'تم تحديث المقال بنجاح!' : 'تم إنشاء المقال بنجاح!' });
      setTimeout(() => navigate('/admin/articles'), 1200);
    } catch (err) {
      setStatus({ type: 'error', msg: `فشل الحفظ: ${err.message}` });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-algerian-green/20 border-t-algerian-green rounded-full animate-spin" />
          <p className="text-slate-500 text-sm font-tajawal">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 max-w-5xl space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <button
          onClick={() => navigate('/admin/articles')}
          className="p-2.5 rounded-xl text-slate-500 hover:text-white hover:bg-algerian-green/10 transition-colors border border-white/5"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            <div className="h-px w-6 bg-algerian-gold" />
            <span className="text-algerian-gold text-xs font-bold uppercase tracking-widest">{isEdit ? 'تعديل' : 'إنشاء'}</span>
          </div>
          <h1 className="text-2xl font-black text-white font-tajawal">
            {isEdit ? 'تعديل المقال' : 'مقال جديد'}
          </h1>
        </div>

        {/* Publish toggle */}
        <button
          type="button"
          onClick={() => update('is_published', !form.is_published)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border transition-all font-tajawal ${
            form.is_published
              ? 'bg-algerian-green/15 border-algerian-green/30 text-algerian-green'
              : 'bg-slate-800/50 border-white/8 text-slate-500'
          }`}
        >
          {form.is_published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          {form.is_published ? 'منشور' : 'مسودة'}
        </button>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Cover Image */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <SectionCard icon={ImageIcon} title="Cover Image" titleAr="صورة الغلاف">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              {/* Preview */}
              <div className="w-48 h-32 rounded-2xl overflow-hidden border border-algerian-gold/15 bg-algerian-green/5 flex items-center justify-center flex-shrink-0 relative group">
                {coverPreview ? (
                  <>
                    <img src={coverPreview} alt="Cover preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => { update('cover_url', ''); setCoverPreview(null); }}
                        className="p-2 bg-algerian-red/80 rounded-lg text-white hover:bg-algerian-red transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-slate-600">
                    <ImageIcon className="h-8 w-8" />
                    <p className="text-xs font-tajawal">لا توجد صورة</p>
                  </div>
                )}
              </div>
              <div className="space-y-3 flex-1">
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="flex items-center gap-2 px-5 py-3 bg-algerian-gold/10 border border-algerian-gold/25 rounded-xl text-algerian-gold text-sm font-bold hover:bg-algerian-gold/20 transition-all disabled:opacity-50 font-tajawal"
                >
                  {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  {uploading ? 'جارٍ الرفع...' : 'رفع صورة الغلاف'}
                </motion.button>
                <p className="text-slate-600 text-xs font-tajawal">
                  يُنصح بصورة بأبعاد 1200×630 بكسل. الصيغ المدعومة: JPG, PNG, WebP
                </p>
                {form.cover_url && (
                  <p className="text-slate-600 text-xs truncate max-w-sm font-mono">{form.cover_url}</p>
                )}
              </div>
            </div>
          </SectionCard>
        </motion.div>

        {/* Titles */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <SectionCard icon={FileText} title="Titles" titleAr="العناوين">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <Field label="العنوان بالعربية" labelEn="Title Arabic" required>
                <textarea
                  value={form.title_ar}
                  onChange={(e) => update('title_ar', e.target.value)}
                  placeholder="أدخل العنوان بالعربية..."
                  dir="rtl"
                  rows={2}
                  className={`${inputClass} resize-none`}
                />
              </Field>
              <Field label="العنوان بالإنجليزية" labelEn="Title English" required>
                <textarea
                  value={form.title_en}
                  onChange={(e) => update('title_en', e.target.value)}
                  placeholder="Enter the title in English..."
                  rows={2}
                  className={`${inputClass} resize-none`}
                />
              </Field>
            </div>
          </SectionCard>
        </motion.div>

        {/* Summaries */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <SectionCard icon={AlignLeft} title="Summaries" titleAr="الملخصات">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <Field label="الملخص (عربي)" labelEn="Summary Arabic">
                <textarea
                  value={form.summary_ar}
                  onChange={(e) => update('summary_ar', e.target.value)}
                  placeholder="ملخص قصير للمقال..."
                  dir="rtl"
                  className={textareaClass}
                />
              </Field>
              <Field label="الملخص (إنجليزي)" labelEn="Summary English">
                <textarea
                  value={form.summary_en}
                  onChange={(e) => update('summary_en', e.target.value)}
                  placeholder="Short article summary..."
                  className={textareaClass}
                />
              </Field>
            </div>
          </SectionCard>
        </motion.div>

        {/* Full Body */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <SectionCard icon={Globe} title="Full Article Body" titleAr="نص المقال الكامل">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <Field label="النص الكامل (عربي)" labelEn="Body Arabic">
                <textarea
                  value={form.body_ar}
                  onChange={(e) => update('body_ar', e.target.value)}
                  placeholder="النص الكامل للمقال بالعربية..."
                  dir="rtl"
                  className={`${inputClass} resize-y min-h-[200px]`}
                />
              </Field>
              <Field label="النص الكامل (إنجليزي)" labelEn="Body English">
                <textarea
                  value={form.body_en}
                  onChange={(e) => update('body_en', e.target.value)}
                  placeholder="Full article body in English..."
                  className={`${inputClass} resize-y min-h-[200px]`}
                />
              </Field>
            </div>
          </SectionCard>
        </motion.div>

        {/* Publish Date */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <SectionCard icon={FileText} title="Publishing Date" titleAr="تاريخ النشر">
            <Field label="تاريخ النشر" labelEn="Published At">
              <input
                type="datetime-local"
                value={form.published_at}
                onChange={(e) => update('published_at', e.target.value)}
                className={inputClass}
              />
            </Field>
          </SectionCard>
        </motion.div>

        {/* Status message */}
        {status && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-center gap-3 p-4 rounded-xl border text-sm font-bold font-tajawal ${
              status.type === 'success'
                ? 'bg-algerian-green/10 border-algerian-green/25 text-algerian-green'
                : 'bg-algerian-red/10 border-algerian-red/25 text-algerian-red'
            }`}
          >
            {status.type === 'success'
              ? <CheckCircle className="h-5 w-5 flex-shrink-0" />
              : <AlertCircle className="h-5 w-5 flex-shrink-0" />}
            {status.msg}
          </motion.div>
        )}

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-between gap-4 pt-2"
        >
          <button
            type="button"
            onClick={() => navigate('/admin/articles')}
            className="px-6 py-3 border border-white/8 rounded-xl text-slate-500 hover:text-white hover:bg-white/5 text-sm font-bold transition-all font-tajawal"
          >
            إلغاء
          </button>
          <motion.button
            type="submit"
            disabled={saving || uploading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2.5 px-8 py-3 bg-gradient-to-r from-algerian-green to-algerian-dark text-white font-black rounded-xl shadow-lg shadow-algerian-green/20 disabled:opacity-50 transition-all font-tajawal relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-algerian-gold/0 via-algerian-gold/10 to-algerian-gold/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
            {saving ? 'جارٍ الحفظ...' : isEdit ? 'تحديث المقال' : 'نشر المقال'}
          </motion.button>
        </motion.div>
      </form>
    </div>
  );
}
