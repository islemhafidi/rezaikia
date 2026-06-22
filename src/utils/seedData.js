import { supabase } from './supabaseClient';

/**
 * Seeds the Supabase database with default settings and
 * the 3 articles from the static translations file.
 *
 * Safe to run multiple times (uses upsert / ON CONFLICT DO NOTHING via slug).
 */

const defaultSettings = {
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

const seedArticles = [
  {
    slug: 'town-hall-algiers-2026',
    title_ar: "تجمع شعبي حاشد وسط العاصمة لشرح محاور برنامج 'أوفياء نوفمبر'",
    title_en: "Large Town Hall Meeting in Algiers Center to Present 'Oufia November' Program",
    summary_ar: "التقى المرشح عماد رزايقية بالمواطنين والشباب لمناقشة آليات رقمنة الخدمات الإدارية وتشجيع مبادرات التوظيف الذاتي.",
    summary_en: "Candidate Imad Rezayguia met with citizens and young entrepreneurs to discuss administrative digitalization and job initiatives.",
    body_ar: "عقد مرشح قائمة أوفياء نوفمبر رقم 102 (المرشح رقم 2) عماد رزايقية تجمعاً تفاعلياً مميزاً بوسط العاصمة، حيث التقى بعشرات الشباب وحاملي المشاريع. تناول اللقاء أهمية إدماج الشباب في المشاريع الاقتصادية الجديدة وتطبيق الرقمنة الشاملة لتسهيل إنشاء المؤسسات الناشئة.",
    body_en: "The candidate representing Oufia November List 102 (Candidate Position #2), Imad Rezayguia, hosted an interactive town hall meeting in central Algiers, gathering dozens of youth and entrepreneurs. The discussion focused on integrating youth in new economic opportunities and deploying digitalization to ease startup registration.",
    cover_url: '',
    published_at: '2026-06-20T10:00:00Z',
    is_published: true,
  },
  {
    slug: 'youth-economy-panel-2026',
    title_ar: "ندوة تفاعلية حول 'دور الكفاءات الشابة في صياغة الاقتصاد الجديد'",
    title_en: "Interactive Panel: 'Empowering Young Talent to Build the Future Economy'",
    summary_ar: "بمشاركة نخبة من المهندسين والاقتصاديين، استعرض عماد رزايقية خطته لدعم الأمن الرقمي وصناعة البرمجيات الوطنية.",
    summary_en: "Engaging engineers and economists, Imad Rezayguia showcased his blueprint for national digital security and local software development.",
    body_ar: "نشط المرشح عماد رزايقية ندوة فكرية تحت عنوان 'الكفاءات الشابة وقود الاقتصاد البديل'. شهدت الندوة حضوراً واسعاً لمهندسين وممثلي حاضنات الأعمال.",
    body_en: "Imad Rezayguia facilitated a seminar titled 'Young Talents as the Catalyst of an Alternative Economy'. Attended by IT specialists and business incubator representatives.",
    cover_url: '',
    published_at: '2026-06-18T10:00:00Z',
    is_published: true,
  },
  {
    slug: 'community-outreach-rural-2026',
    title_ar: "لقاء جواري مع سكان قرى ومناطق الظل لتعزيز التنمية المحلية",
    title_en: "Community Outreach in Regional Areas to Enhance Rural Development",
    summary_ar: "استماعاً لانشغالات المواطنين، أكد المرشح التزامه بالدفاع عن العدالة الاجتماعية وتحسين الرعاية الصحية الجوارية.",
    summary_en: "Listening to citizen concerns, the candidate pledged to advocate for social justice and upgrade localized public healthcare.",
    body_ar: "في إطار حملته الجوارية، زار المرشح عماد رزايقية عدة قرى ومجمعات سكنية جوارية للاستماع المباشر لانشغالات الساكنة.",
    body_en: "Continuing his local outreach campaigns, candidate Imad Rezayguia visited several regional communities to gather direct citizen feedback.",
    cover_url: '',
    published_at: '2026-06-15T10:00:00Z',
    is_published: true,
  },
];

const mockVotesData = [
  // Khenchela municipalities
  { voter_name: 'أحمد بن علي', national_id: 'DZ2026001', wilaya_code: 40, wilaya_name: 'خنشلة', municipality_name: 'خنشلة' },
  { voter_name: 'سليم بلعيد', national_id: 'DZ2026002', wilaya_code: 40, wilaya_name: 'خنشلة', municipality_name: 'الحامة' },
  { voter_name: 'فاطمة حسيني', national_id: 'DZ2026003', wilaya_code: 40, wilaya_name: 'خنشلة', municipality_name: 'قايس' },
  { voter_name: 'مصطفى قادري', national_id: 'DZ2026004', wilaya_code: 40, wilaya_name: 'خنشلة', municipality_name: 'بابار' },
  { voter_name: 'ياسمين بوغزال', national_id: 'DZ2026005', wilaya_code: 40, wilaya_name: 'خنشلة', municipality_name: 'ششار' },
  { voter_name: 'كريم مزياني', national_id: 'DZ2026006', wilaya_code: 40, wilaya_name: 'خنشلة', municipality_name: 'أولاد رشاش' },
  { voter_name: 'مريم حداد', national_id: 'DZ2026007', wilaya_code: 40, wilaya_name: 'خنشلة', municipality_name: 'المحمل' },
  { voter_name: 'سفيان دراجي', national_id: 'DZ2026008', wilaya_code: 40, wilaya_name: 'خنشلة', municipality_name: 'عين الطويلة' },
  { voter_name: 'راضية بن عيسى', national_id: 'DZ2026009', wilaya_code: 40, wilaya_name: 'خنشلة', municipality_name: 'بوحمامة' },
  { voter_name: 'جمال تواتي', national_id: 'DZ2026010', wilaya_code: 40, wilaya_name: 'خنشلة', municipality_name: 'يابوس' },
  { voter_name: 'حمزة منصوري', national_id: 'DZ2026011', wilaya_code: 40, wilaya_name: 'خنشلة', municipality_name: 'تامزة' },
  { voter_name: 'زينب علوي', national_id: 'DZ2026012', wilaya_code: 40, wilaya_name: 'خنشلة', municipality_name: 'انسيغة' },
  { voter_name: 'أمين رحماني', national_id: 'DZ2026013', wilaya_code: 40, wilaya_name: 'خنشلة', municipality_name: 'بغاي' },
  { voter_name: 'نور الدين غانم', national_id: 'DZ2026014', wilaya_code: 40, wilaya_name: 'خنشلة', municipality_name: 'شيلية' },

  // Other Wilayas
  { voter_name: 'مراد الجزائري', national_id: 'DZ2026101', wilaya_code: 16, wilaya_name: 'الجزائر', municipality_name: null },
  { voter_name: 'فتيحة بوكرسي', national_id: 'DZ2026102', wilaya_code: 16, wilaya_name: 'الجزائر', municipality_name: null },
  { voter_name: 'خالد مسعودي', national_id: 'DZ2026103', wilaya_code: 31, wilaya_name: 'وهران', municipality_name: null },
  { voter_name: 'سامية بن يحيى', national_id: 'DZ2026104', wilaya_code: 31, wilaya_name: 'وهران', municipality_name: null },
  { voter_name: 'محمد بوقرة', national_id: 'DZ2026105', wilaya_code: 25, wilaya_name: 'قسنطينة', municipality_name: null },
  { voter_name: 'نجيب سليماني', national_id: 'DZ2026106', wilaya_code: 23, wilaya_name: 'عنابة', municipality_name: null },
  { voter_name: 'سليمان بن مالك', national_id: 'DZ2026107', wilaya_code: 5, wilaya_name: 'باتنة', municipality_name: null },
  { voter_name: 'هدى رحيم', national_id: 'DZ2026108', wilaya_code: 5, wilaya_name: 'باتنة', municipality_name: null },
  { voter_name: 'سعيد شريفي', national_id: 'DZ2026109', wilaya_code: 15, wilaya_name: 'تيزي وزو', municipality_name: null },
  { voter_name: 'عبد القادر موساوي', national_id: 'DZ2026110', wilaya_code: 19, wilaya_name: 'سطيف', municipality_name: null },
  { voter_name: 'ليلى شريف', national_id: 'DZ2026111', wilaya_code: 19, wilaya_name: 'سطيف', municipality_name: null },
  { voter_name: 'ياسين بلحاج', national_id: 'DZ2026112', wilaya_code: 9, wilaya_name: 'البليدة', municipality_name: null },
  { voter_name: 'حميد وعلي', national_id: 'DZ2026113', wilaya_code: 6, wilaya_name: 'بجاية', municipality_name: null },
  { voter_name: 'كمال قادري', national_id: 'DZ2026114', wilaya_code: 13, wilaya_name: 'تلمسان', municipality_name: null },
  { voter_name: 'رضوان سعيدي', national_id: 'DZ2026115', wilaya_code: 30, wilaya_name: 'ورقلة', municipality_name: null },
  { voter_name: 'يوسف بومدين', national_id: 'DZ2026116', wilaya_code: 39, wilaya_name: 'الوادي', municipality_name: null },
  { voter_name: 'إبراهيم تهامي', national_id: 'DZ2026117', wilaya_code: 17, wilaya_name: 'الجلفة', municipality_name: null },
  { voter_name: 'حسان قدور', national_id: 'DZ2026118', wilaya_code: 14, wilaya_name: 'تيارت', municipality_name: null },
  { voter_name: 'علي عثمان', national_id: 'DZ2026119', wilaya_code: 11, wilaya_name: 'تمنراست', municipality_name: null },
  { voter_name: 'أمل بن سالم', national_id: 'DZ2026120', wilaya_code: 37, wilaya_name: 'تندوف', municipality_name: null }
];

/**
 * Seeds settings + articles + votes into Supabase.
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function seedDatabase() {
  const results = { settings: false, articles: [], votes: false };

  // 1. Upsert settings
  try {
    const { error } = await supabase
      .from('settings')
      .upsert([defaultSettings], { onConflict: 'id' });
    if (error) throw error;
    results.settings = true;
  } catch (err) {
    console.error('Seed settings error:', err.message);
  }

  // 2. Insert articles (skip if slug already exists)
  for (const article of seedArticles) {
    try {
      const { error } = await supabase
        .from('articles')
        .upsert([article], { onConflict: 'slug', ignoreDuplicates: true });
      if (error) throw error;
      results.articles.push({ slug: article.slug, ok: true });
    } catch (err) {
      console.error(`Seed article "${article.slug}" error:`, err.message);
      results.articles.push({ slug: article.slug, ok: false, error: err.message });
    }
  }

  // 3. Insert mock votes
  try {
    const formattedVotes = mockVotesData.map(v => ({
      voter_name: v.voter_name,
      national_id: v.national_id,
      list_number: 102,
      candidate_number: 2,
      candidate_name: 'عماد رزايقية',
      wilaya_code: v.wilaya_code,
      wilaya_name: v.wilaya_name,
      municipality_name: v.municipality_name,
      voted_at: new Date(Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000).toISOString()
    }));

    const { error } = await supabase
      .from('votes')
      .upsert(formattedVotes, { onConflict: 'national_id' });
      
    if (error) throw error;
    results.votes = true;
  } catch (err) {
    console.error('Seed votes error:', err.message);
  }

  const allOk = results.settings && results.articles.every((a) => a.ok) && results.votes;
  return {
    success: allOk,
    message: allOk
      ? 'تمت تهيئة قاعدة البيانات بنجاح مع توزيع الأصوات الجغرافي!'
      : 'Database seeded, but with some errors. Check console.',
    results,
  };
}
