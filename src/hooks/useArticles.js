import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../utils/supabaseClient';

/**
 * Hook that fetches published articles from Supabase,
 * ordered by published_at descending.
 */
export function useArticles({ adminMode = false } = {}) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from('articles')
        .select('*')
        .order('published_at', { ascending: false });

      // In admin mode fetch all (including drafts); otherwise only published
      if (!adminMode) {
        query = query.eq('is_published', true);
      }

      const { data, error: err } = await query;
      if (err) throw err;
      setArticles(data || []);
    } catch (err) {
      console.error('useArticles error:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [adminMode]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  return { articles, loading, error, refetch: fetchArticles };
}
