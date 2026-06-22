import { supabase } from '../utils/supabaseClient';

/**
 * Admin-level operations: settings update, article CRUD, image uploads.
 * These functions use the anon key with permissive RLS policies (demo mode).
 */

// ─── Settings ─────────────────────────────────────────────────────────────────

/**
 * Update the settings row (id=1).
 * @param {Object} data - Partial or full settings object
 */
export async function updateSettings(data) {
  const payload = { ...data, updated_at: new Date().toISOString() };
  delete payload.id; // Don't update PK

  const { data: result, error } = await supabase
    .from('settings')
    .update(payload)
    .eq('id', 1)
    .select()
    .single();

  if (error) throw error;
  return result;
}

// ─── Articles ─────────────────────────────────────────────────────────────────

/**
 * Create a new article.
 * @param {Object} articleData
 */
export async function createArticle(articleData) {
  const payload = {
    ...articleData,
    slug: articleData.slug || generateSlug(articleData.title_en || articleData.title_ar),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('articles')
    .insert([payload])
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Update an existing article by id.
 * @param {number} id
 * @param {Object} articleData
 */
export async function updateArticle(id, articleData) {
  const payload = { ...articleData, updated_at: new Date().toISOString() };
  delete payload.id;
  delete payload.created_at;

  const { data, error } = await supabase
    .from('articles')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Delete an article by id.
 * @param {number} id
 */
export async function deleteArticle(id) {
  const { error } = await supabase
    .from('articles')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}

/**
 * Toggle publish status of an article.
 * @param {number} id
 * @param {boolean} isPublished
 */
export async function toggleArticlePublish(id, isPublished) {
  return updateArticle(id, { is_published: isPublished });
}

// ─── Image Upload ──────────────────────────────────────────────────────────────

const BUCKET = 'campaign-media';

/**
 * Upload an image file to Supabase Storage.
 * @param {File} file - The file to upload
 * @param {string} path - Storage path e.g. 'articles/cover-uuid.jpg' or 'portrait.jpg'
 * @returns {string} Public URL of the uploaded file
 */
export async function uploadImage(file, path) {
  // Remove old file if exists (ignore error)
  await supabase.storage.from(BUCKET).remove([path]).catch(() => {});

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true,
      contentType: file.type,
    });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Delete an image from Supabase Storage.
 * @param {string} path - Storage path
 */
export async function deleteImage(path) {
  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) console.warn('deleteImage error:', error.message);
}

// ─── Votes (admin read) ───────────────────────────────────────────────────────

/**
 * Get all votes (admin read).
 */
export async function getAllVotes() {
  const { data, error, count } = await supabase
    .from('votes')
    .select('*', { count: 'exact' })
    .order('voted_at', { ascending: false });

  if (error) throw error;
  return { votes: data || [], count: count || 0 };
}

/**
 * Gets aggregated vote statistics by Wilaya and Khenchela Municipality.
 */
export async function getVoteMapStats() {
  const { data: votes, error } = await supabase
    .from('votes')
    .select('wilaya_code, wilaya_name, municipality_name');

  if (error) throw error;

  const wilayaStats = {};
  const municipalityStats = {};
  let totalVotes = votes?.length || 0;

  votes?.forEach((v) => {
    // Wilaya aggregation
    const wCode = v.wilaya_code ?? 40;
    const wName = v.wilaya_name ?? 'خنشلة';
    if (!wilayaStats[wCode]) {
      wilayaStats[wCode] = { code: wCode, name: wName, count: 0 };
    }
    wilayaStats[wCode].count += 1;

    // Khenchela Municipality aggregation
    if (wCode === 40 && v.municipality_name) {
      const mName = v.municipality_name;
      if (!municipalityStats[mName]) {
        municipalityStats[mName] = { name: mName, count: 0 };
      }
      municipalityStats[mName].count += 1;
    }
  });

  return {
    totalVotes,
    wilayas: Object.values(wilayaStats),
    municipalities: Object.values(municipalityStats)
  };
}


// ─── Helpers ──────────────────────────────────────────────────────────────────

function generateSlug(text = '') {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80) + '-' + Date.now();
}
