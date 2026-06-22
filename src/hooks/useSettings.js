import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../utils/supabaseClient';

// Default fallback values if DB is unavailable
const DEFAULTS = {
  id: 1,
  candidate_name: 'عماد رزايقية',
  candidate_name_en: 'Imad Rezayguia',
  list_number: 102,
  candidate_number: 2,
  vote_goal: 2500,
  hero_portrait_url: '/candidate_portrait.png',
  facebook_url: 'https://facebook.com',
  twitter_url: 'https://twitter.com',
  youtube_url: 'https://youtube.com',
  footer_slogan_ar: 'إختاروا من يدافع عنكم فهو أصلا محام.',
  footer_slogan_en: "November's history liberated us, November's future builds us.",
};

/**
 * Hook that fetches (and caches) the single settings row.
 * Falls back to hardcoded defaults if Supabase is unreachable.
 */
export function useSettings() {
  const [settings, setSettings] = useState(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from('settings')
        .select('*')
        .eq('id', 1)
        .single();

      if (err) throw err;
      if (data) setSettings(data);
    } catch (err) {
      console.warn('useSettings: falling back to defaults.', err.message);
      setError(err.message);
      // Keep defaults already in state
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return { settings, loading, error, refetch: fetchSettings, defaults: DEFAULTS };
}
