import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Upload, X, Loader2, CheckCircle, AlertCircle, ImageIcon, Globe, Users, Link2, MessageSquare } from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';
import { updateSettings, uploadImage } from '../../hooks/useAdmin';

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

function Field({ label, labelEn, children }) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-bold text-slate-400 font-tajawal">
        {label}
        {labelEn && <span className="text-slate-600 font-normal text-xs ml-2">({labelEn})</span>}
      </label>
      {children}
    </div>
  );
}

const inputClass = "w-full bg-black/30 border border-algerian-green/15 rounded-xl px-4 py-3 text-white placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-algerian-green/30 focus:border-algerian-green/40 transition-all text-sm";

export default function AdminSettings() {
  const { settings, loading: settingsLoading, refetch } = useSettings();
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (settings) {
      setForm({ ...settings });
      setPreviewUrl(settings.hero_portrait_url || null);
    }
  }, [settings]);

  const update = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  const handlePortraitUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);
    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const path = `portrait/candidate-portrait.${ext}`;
      const publicUrl = await uploadImage(file, path);
      update('hero_portrait_url', publicUrl);
      setStatus({ type: 'success', msg: 'تم رفع الصورة بنجاح!' });
    } catch (err) {
      setStatus({ type: 'error', msg: `فشل الرفع: ${err.message}` });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus(null);
    try {
      await updateSettings(form);
      await refetch();
      setStatus({ type: 'success', msg: 'تم حفظ الإعدادات بنجاح! / Settings saved successfully!' });
    } catch (err) {
      setStatus({ type: 'error', msg: `خطأ: ${err.message}` });
    } finally {
      setSaving(false);
    }
  };

  if (settingsLoading || !form) {
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
    <div className="p-6 lg:p-10 max-w-4xl space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-2 mb-1">
          <div className="h-px w-6 bg-algerian-gold" />
          <span className="text-algerian-gold text-xs font-bold uppercase tracking-widest">ضبط الحملة</span>
        </div>
        <h1 className="text-2xl font-black text-white font-tajawal">الإعدادات</h1>
        <p className="text-slate-500 text-sm mt-1">Site Configuration & Settings</p>
      </motion.div>

      <form onSubmit={handleSave} className="space-y-6">

        {/* Candidate Info */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <SectionCard icon={Users} title="Candidate Info" titleAr="معلومات المرشح">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="اسم المرشح (عربي)" labelEn="Candidate Name (Arabic)">
                <input type="text" value={form.candidate_name || ''} onChange={(e) => update('candidate_name', e.target.value)} placeholder="عماد رزايقية" dir="rtl" className={inputClass} />
              </Field>
              <Field label="اسم المرشح (إنجليزي)" labelEn="Candidate Name (English)">
                <input type="text" value={form.candidate_name_en || ''} onChange={(e) => update('candidate_name_en', e.target.value)} placeholder="Imad Rezayguia" className={inputClass} />
              </Field>
              <Field label="رقم القائمة" labelEn="List Number">
                <input type="number" value={form.list_number || ''} onChange={(e) => update('list_number', parseInt(e.target.value) || 0)} placeholder="102" className={inputClass} />
              </Field>
              <Field label="رقم المرشح" labelEn="Candidate Number">
                <input type="number" value={form.candidate_number || ''} onChange={(e) => update('candidate_number', parseInt(e.target.value) || 0)} placeholder="2" className={inputClass} />
              </Field>
              <Field label="هدف الأصوات" labelEn="Vote Goal">
                <div className="relative">
                  <input type="number" value={form.vote_goal || ''} onChange={(e) => update('vote_goal', parseInt(e.target.value) || 0)} placeholder="2500" className={inputClass} />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-algerian-gold text-xs font-bold font-tajawal">صوت</span>
                </div>
              </Field>
            </div>
          </SectionCard>
        </motion.div>

        {/* Portrait Upload */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <SectionCard icon={ImageIcon} title="Candidate Portrait" titleAr="صورة المرشح">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              {/* Preview */}
              <div className="relative w-32 h-40 rounded-2xl overflow-hidden border border-algerian-gold/20 bg-algerian-green/5 flex items-center justify-center flex-shrink-0 group">
                {previewUrl ? (
                  <>
                    <img src={previewUrl} alt="Portrait preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => { update('hero_portrait_url', '/candidate_portrait.png'); setPreviewUrl('/candidate_portrait.png'); }}
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
              <div className="space-y-4 flex-1">
                <p className="text-slate-500 text-sm font-tajawal leading-relaxed">
                  ارفع صورة المرشح الرسمية. ستظهر في قسم البداية (Hero) بالموقع. يُنصح بصورة عمودية بدقة عالية.
                </p>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePortraitUpload} className="hidden" />
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="flex items-center gap-2 px-5 py-3 bg-algerian-gold/10 border border-algerian-gold/25 rounded-xl text-algerian-gold text-sm font-bold hover:bg-algerian-gold/20 transition-all disabled:opacity-50 font-tajawal"
                >
                  {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  {uploading ? 'جارٍ الرفع...' : 'رفع الصورة'}
                </motion.button>
                {form.hero_portrait_url && (
                  <p className="text-slate-600 text-xs truncate max-w-xs font-mono">{form.hero_portrait_url}</p>
                )}
              </div>
            </div>
          </SectionCard>
        </motion.div>

        {/* Social Links */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <SectionCard icon={Link2} title="Social Media Links" titleAr="روابط التواصل الاجتماعي">
            <div className="space-y-4">
              <Field label="رابط Facebook" labelEn="Facebook URL">
                <div className="relative">
                  <Globe className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-500/60" />
                  <input type="url" value={form.facebook_url || ''} onChange={(e) => update('facebook_url', e.target.value)} placeholder="https://facebook.com/..." className={`${inputClass} pr-10`} />
                </div>
              </Field>
              <Field label="رابط Twitter / X" labelEn="Twitter URL">
                <div className="relative">
                  <Globe className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-sky-500/60" />
                  <input type="url" value={form.twitter_url || ''} onChange={(e) => update('twitter_url', e.target.value)} placeholder="https://twitter.com/..." className={`${inputClass} pr-10`} />
                </div>
              </Field>
              <Field label="رابط YouTube" labelEn="YouTube URL">
                <div className="relative">
                  <Globe className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-red-500/60" />
                  <input type="url" value={form.youtube_url || ''} onChange={(e) => update('youtube_url', e.target.value)} placeholder="https://youtube.com/..." className={`${inputClass} pr-10`} />
                </div>
              </Field>
            </div>
          </SectionCard>
        </motion.div>

        {/* Footer Slogans */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <SectionCard icon={MessageSquare} title="Footer Slogans" titleAr="شعارات التذييل">
            <div className="space-y-4">
              <Field label="الشعار (عربي)" labelEn="Slogan Arabic">
                <input type="text" value={form.footer_slogan_ar || ''} onChange={(e) => update('footer_slogan_ar', e.target.value)} dir="rtl" placeholder="إختاروا من يدافع عنكم..." className={inputClass} />
              </Field>
              <Field label="الشعار (إنجليزي)" labelEn="Slogan English">
                <input type="text" value={form.footer_slogan_en || ''} onChange={(e) => update('footer_slogan_en', e.target.value)} placeholder="November's history..." className={inputClass} />
              </Field>
            </div>
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
            {status.type === 'success' ? <CheckCircle className="h-5 w-5 flex-shrink-0" /> : <AlertCircle className="h-5 w-5 flex-shrink-0" />}
            {status.msg}
          </motion.div>
        )}

        {/* Save */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex justify-end pt-2"
        >
          <motion.button
            type="submit"
            disabled={saving || uploading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2.5 px-9 py-3.5 bg-gradient-to-r from-algerian-green to-algerian-dark text-white font-black rounded-xl shadow-xl shadow-algerian-green/20 disabled:opacity-50 transition-all font-tajawal relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-algerian-gold/0 via-algerian-gold/10 to-algerian-gold/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
            {saving ? 'جارٍ الحفظ...' : 'حفظ الإعدادات'}
          </motion.button>
        </motion.div>
      </form>
    </div>
  );
}
