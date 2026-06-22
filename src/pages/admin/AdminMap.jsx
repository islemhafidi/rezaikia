import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Map, MapPin, Activity, TrendingUp, Users, RefreshCw, 
  Globe, Info, Network, Award, Percent, LayoutList
} from 'lucide-react';
import { getVoteMapStats } from '../../hooks/useAdmin';

// Algeria 58 Wilayas coordinates mapped to a 500x500 viewport layout
const ALGERIA_WILAYAS_COORDS = [
  { code: 1, nameAr: 'أدرار', nameEn: 'Adrar', x: 190, y: 310 },
  { code: 2, nameAr: 'الشلف', nameEn: 'Chlef', x: 200, y: 80 },
  { code: 3, nameAr: 'الأغواط', nameEn: 'Laghouat', x: 235, y: 155 },
  { code: 4, nameAr: 'أم البواقي', nameEn: 'Oum El Bouaghi', x: 332, y: 92 },
  { code: 5, nameAr: 'باتنة', nameEn: 'Batna', x: 310, y: 108 },
  { code: 6, nameAr: 'بجاية', nameEn: 'Béjaïa', x: 288, y: 70 },
  { code: 7, nameAr: 'بسكرة', nameEn: 'Biskra', x: 305, y: 135 },
  { code: 8, nameAr: 'بشار', nameEn: 'Béchar', x: 135, y: 220 },
  { code: 9, nameAr: 'البليدة', nameEn: 'Blida', x: 232, y: 80 },
  { code: 10, nameAr: 'البويرة', nameEn: 'Bouira', x: 255, y: 80 },
  { code: 11, nameAr: 'تمنراست', nameEn: 'Tamanrasset', x: 300, y: 410 },
  { code: 12, nameAr: 'تبسة', nameEn: 'Tébessa', x: 350, y: 110 },
  { code: 13, nameAr: 'تلمسان', nameEn: 'Tlemcen', x: 140, y: 105 },
  { code: 14, nameAr: 'تيارت', nameEn: 'Tiaret', x: 195, y: 110 },
  { code: 15, nameAr: 'تيزي وزو', nameEn: 'Tizi Ouzou', x: 270, y: 72 },
  { code: 16, nameAr: 'الجزائر', nameEn: 'Algiers', x: 245, y: 70 },
  { code: 17, nameAr: 'الجلفة', nameEn: 'Djelfa', x: 245, y: 135 },
  { code: 18, nameAr: 'جيجل', nameEn: 'Jijel', x: 305, y: 68 },
  { code: 19, nameAr: 'سطيف', nameEn: 'Sétif', x: 300, y: 88 },
  { code: 20, nameAr: 'سعيدة', nameEn: 'Saïda', x: 175, y: 115 },
  { code: 21, nameAr: 'سكيكدة', nameEn: 'Skikda', x: 322, y: 68 },
  { code: 22, nameAr: 'سيدي بلعباس', nameEn: 'Sidi Bel Abbès', x: 158, y: 110 },
  { code: 23, nameAr: 'عنابة', nameEn: 'Annaba', x: 338, y: 66 },
  { code: 24, nameAr: 'قالمة', nameEn: 'Guelma', x: 338, y: 82 },
  { code: 25, nameAr: 'قسنطينة', nameEn: 'Constantine', x: 322, y: 82 },
  { code: 26, nameAr: 'المدية', nameEn: 'Médéa', x: 230, y: 92 },
  { code: 27, nameAr: 'مستغانم', nameEn: 'Mostaganem', x: 180, y: 82 },
  { code: 28, nameAr: 'المسيلة', nameEn: 'M\'Sila', x: 275, y: 108 },
  { code: 29, nameAr: 'معسكر', nameEn: 'Mascara', x: 170, y: 98 },
  { code: 30, nameAr: 'ورقلة', nameEn: 'Ouargla', x: 295, y: 205 },
  { code: 31, nameAr: 'وهران', nameEn: 'Oran', x: 165, y: 85 },
  { code: 32, nameAr: 'البيض', nameEn: 'El Bayadh', x: 188, y: 165 },
  { code: 33, nameAr: 'إليزي', nameEn: 'Illizi', x: 380, y: 300 },
  { code: 34, nameAr: 'برج بوعريريج', nameEn: 'Bordj Bou Arréridj', x: 282, y: 90 },
  { code: 35, nameAr: 'بومرداس', nameEn: 'Boumerdès', x: 258, y: 72 },
  { code: 36, nameAr: 'الطارف', nameEn: 'El Tarf', x: 350, y: 68 },
  { code: 37, nameAr: 'تندوف', nameEn: 'Tindouf', x: 75, y: 350 },
  { code: 38, nameAr: 'تيسمسيلت', nameEn: 'Tissemsilt', x: 210, y: 95 },
  { code: 39, nameAr: 'الوادي', nameEn: 'El Oued', x: 325, y: 170 },
  { code: 40, nameAr: 'خنشلة', nameEn: 'Khenchela', x: 332, y: 108 }, // Highlight Target
  { code: 41, nameAr: 'سوق أهراس', nameEn: 'Souk Ahras', x: 350, y: 88 },
  { code: 42, nameAr: 'تيبازة', nameEn: 'Tipaza', x: 220, y: 78 },
  { code: 43, nameAr: 'ميلة', nameEn: 'Mila', x: 315, y: 82 },
  { code: 44, nameAr: 'عين الدفلى', nameEn: 'Aïn Defla', x: 210, y: 88 },
  { code: 45, nameAr: 'النعامة', nameEn: 'Naâma', x: 140, y: 165 },
  { code: 46, nameAr: 'عين تموشنت', nameEn: 'Aïn Témouchent', x: 150, y: 94 },
  { code: 47, nameAr: 'غرداية', nameEn: 'Ghardaïa', x: 250, y: 200 },
  { code: 48, nameAr: 'غليزان', nameEn: 'Relizane', x: 190, y: 92 },
  { code: 49, nameAr: 'تيميمون', nameEn: 'Timimoun', x: 210, y: 260 },
  { code: 50, nameAr: 'برج باجي مختار', nameEn: 'Bordj Badji Mokhtar', x: 215, y: 440 },
  { code: 51, nameAr: 'أولاد جلال', nameEn: 'Ouled Djellal', x: 280, y: 145 },
  { code: 52, nameAr: 'بني عباس', nameEn: 'Béni Abbès', x: 120, y: 255 },
  { code: 53, nameAr: 'عين صالح', nameEn: 'In Salah', x: 255, y: 300 },
  { code: 54, nameAr: 'عين قزام', nameEn: 'In Guezzam', x: 300, y: 480 },
  { code: 55, nameAr: 'تقرت', nameEn: 'Touggourt', x: 305, y: 180 },
  { code: 56, nameAr: 'جانت', nameEn: 'Djanet', x: 380, y: 380 },
  { code: 57, nameAr: 'المغير', nameEn: 'El M\'Ghair', x: 310, y: 160 },
  { code: 58, nameAr: 'المنيعة', nameEn: 'El Meniaa', x: 240, y: 235 }
];

// Khenchela 21 municipalities positioned inside a 500x500 local canvas network
const KHENCHELA_MUNICIPALITIES_COORDS = [
  { nameAr: 'خنشلة', nameEn: 'Khenchela', x: 250, y: 220, isCenter: true },
  { nameAr: 'الحامة', nameEn: 'El Hamma', x: 200, y: 160 },
  { nameAr: 'قايس', nameEn: 'Kais', x: 140, y: 190 },
  { nameAr: 'بغاي', nameEn: 'Baghai', x: 260, y: 110 },
  { nameAr: 'انسيغة', nameEn: 'Ensigha', x: 320, y: 210 },
  { nameAr: 'تامزة', nameEn: 'Tamza', x: 190, y: 260 },
  { nameAr: 'عين الطويلة', nameEn: 'Ain Touila', x: 360, y: 140 },
  { nameAr: 'متوسة', nameEn: 'Mtoussa', x: 310, y: 100 },
  { nameAr: 'تاوزيانت', nameEn: 'Taouzient', x: 80, y: 180 },
  { nameAr: 'بوحمامة', nameEn: 'Bouhmama', x: 110, y: 290 },
  { nameAr: 'يابوس', nameEn: 'Yabous', x: 60, y: 270 },
  { nameAr: 'الرميلة', nameEn: 'Remila', x: 130, y: 120 },
  { nameAr: 'شيلية', nameEn: 'Chelia', x: 140, y: 350 },
  { nameAr: 'أولاد رشاش', nameEn: 'Ouled Rechache', x: 390, y: 220 },
  { nameAr: 'المحمل', nameEn: 'El Mahmal', x: 350, y: 280 },
  { nameAr: 'بابار', nameEn: 'Babar', x: 320, y: 340 },
  { nameAr: 'ششار', nameEn: 'Chechar', x: 260, y: 390 },
  { nameAr: 'خيران', nameEn: 'Khirane', x: 210, y: 440 },
  { nameAr: 'جلال', nameEn: 'Djellal', x: 170, y: 420 },
  { nameAr: 'الولجة', nameEn: 'El Ouldja', x: 330, y: 430 },
  { nameAr: 'مسارة', nameEn: 'M\'Sara', x: 270, y: 460 }
];

// Links to draw network lines for Khenchela municipalities
const KHENCHELA_NET_LINKS = [
  { from: 'خنشلة', to: 'الحامة' },
  { from: 'خنشلة', to: 'بغاي' },
  { from: 'خنشلة', to: 'انسيغة' },
  { from: 'خنشلة', to: 'تامزة' },
  { from: 'خنشلة', to: 'المحمل' },
  { from: 'خنشلة', to: 'بابار' },
  { from: 'قايس', to: 'الرميلة' },
  { from: 'قايس', to: 'تاوزيانت' },
  { from: 'قايس', to: 'الحامة' },
  { from: 'قايس', to: 'تامزة' },
  { from: 'بوحمامة', to: 'يابوس' },
  { from: 'بوحمامة', to: 'شيلية' },
  { from: 'بوحمامة', to: 'تامزة' },
  { from: 'أولاد رشاش', to: 'المحمل' },
  { from: 'أولاد رشاش', to: 'عين الطويلة' },
  { from: 'عين الطويلة', to: 'متوسة' },
  { from: 'متوسة', to: 'بغاي' },
  { from: 'بابار', to: 'ششار' },
  { from: 'ششار', to: 'جلال' },
  { from: 'ششار', to: 'خيران' },
  { from: 'ششار', to: 'الولجة' },
  { from: 'ششار', to: 'مسارة' },
  { from: 'خيران', to: 'جلال' }
];

export default function AdminMap() {
  const [activeTab, setActiveTab] = useState('national'); // 'national' or 'local'
  const [stats, setStats] = useState({ totalVotes: 0, wilayas: [], municipalities: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [refreshes, setRefreshes] = useState(0);

  useEffect(() => {
    async function loadStats() {
      setLoading(true);
      setError(null);
      try {
        const data = await getVoteMapStats();
        setStats(data);
      } catch (err) {
        console.error('getVoteMapStats error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, [refreshes]);

  // Aggregate stats mapping
  const getWilayaVoteCount = (code) => {
    const found = stats.wilayas.find((w) => w.code === code);
    return found ? found.count : 0;
  };

  const getMuniVoteCount = (name) => {
    const found = stats.municipalities.find((m) => m.name === name);
    return found ? found.count : 0;
  };

  // Helper for node sizing based on vote volume
  const getNodeSize = (votes, maxVal = 10, minVal = 5) => {
    if (stats.totalVotes === 0 || votes === 0) return minVal;
    return minVal + (votes / stats.totalVotes) * maxVal;
  };

  // Sorted list for panels
  const topWilayas = [...stats.wilayas].sort((a, b) => b.count - a.count);
  const topMunis = [...stats.municipalities].sort((a, b) => b.count - a.count);

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-6xl">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between flex-wrap gap-4"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="h-px w-6 bg-algerian-gold" />
            <span className="text-algerian-gold text-xs font-bold uppercase tracking-widest font-tajawal">تحليلات جغرافية</span>
          </div>
          <h1 className="text-2xl font-black text-white font-tajawal">خارطة توزيع الأصوات</h1>
          <p className="text-slate-500 text-sm mt-1">Geographic Vote Distribution Map</p>
        </div>
        <button
          onClick={() => setRefreshes((r) => r + 1)}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 bg-algerian-green/10 hover:bg-algerian-green/20 border border-algerian-green/20 rounded-xl text-algerian-green text-sm font-semibold transition-all disabled:opacity-50 font-tajawal"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          تحديث الخريطة
        </button>
      </motion.div>

      {/* Tabs Control */}
      <div className="flex border-b border-white/5 pb-px">
        <button
          onClick={() => {
            setActiveTab('national');
            setHoveredNode(null);
          }}
          className={`flex items-center gap-2 px-6 py-4.5 font-tajawal font-bold text-sm border-b-2 transition-all relative ${
            activeTab === 'national'
              ? 'border-algerian-gold text-white bg-white/2'
              : 'border-transparent text-slate-500 hover:text-slate-300'
          }`}
        >
          <Globe className="h-4.5 w-4.5 text-algerian-gold" />
          المنظور الوطني (الجزائر)
          <span className="text-[10px] ml-1 bg-algerian-gold/15 text-algerian-gold px-2 py-0.5 rounded-full">
            {stats.wilayas.length} ولايات
          </span>
        </button>
        <button
          onClick={() => {
            setActiveTab('local');
            setHoveredNode(null);
          }}
          className={`flex items-center gap-2 px-6 py-4.5 font-tajawal font-bold text-sm border-b-2 transition-all relative ${
            activeTab === 'local'
              ? 'border-algerian-green text-white bg-white/2'
              : 'border-transparent text-slate-500 hover:text-slate-300'
          }`}
        >
          <Network className="h-4.5 w-4.5 text-algerian-green" />
          المنظور المحلي (ولاية خنشلة)
          <span className="text-[10px] ml-1 bg-algerian-green/15 text-algerian-green px-2 py-0.5 rounded-full">
            {stats.municipalities.length} بلديات
          </span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Visual Interactive Map Canvas */}
        <div className="lg:col-span-2 bg-[#040e06] border border-algerian-green/10 rounded-3xl p-6 relative overflow-hidden flex flex-col items-center justify-center min-h-[480px]">
          
          {/* Overlay Background Grid and lights */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
          <div className="absolute top-0 right-0 w-48 h-48 bg-algerian-green/5 rounded-full blur-3xl pointer-events-none" />
          
          {loading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-3xl">
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-2 border-algerian-gold/20 border-t-algerian-gold rounded-full animate-spin" />
                <p className="text-slate-400 text-xs font-tajawal">جاري تحميل البيانات الحية...</p>
              </div>
            </div>
          )}

          {/* TAB 1: Algeria Map */}
          {activeTab === 'national' && (
            <div className="w-full relative flex flex-col items-center">
              
              {/* Informative instructions */}
              <div className="absolute top-0 left-0 text-slate-500 text-xs font-tajawal bg-white/2 border border-white/5 rounded-xl p-2.5 flex items-center gap-1.5 z-10">
                <Info className="h-3.5 w-3.5 text-algerian-gold" />
                <span>اضغط على **خنشلة** لعرض البلديات بالتفصيل.</span>
              </div>

              <svg 
                viewBox="0 0 500 500" 
                className="w-full max-w-[400px] h-auto text-slate-700 select-none transition-all duration-300"
              >
                {/* SVG Outline of Algeria Map */}
                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5 }}
                  d="M 140,90 
                     C 170,80, 210,70, 250,68
                     C 285,68, 310,72, 335,70
                     L 345,100
                     L 360,115
                     L 375,185
                     L 410,285
                     L 435,395
                     L 300,455
                     L 220,430
                     L 135,390
                     L 105,320
                     L 90,250
                     L 125,185
                     L 130,130
                     Z"
                  fill="#03170d"
                  stroke="#006233"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="opacity-75"
                />

                {/* Plotting Wilayas */}
                {ALGERIA_WILAYAS_COORDS.map((w) => {
                  const votes = getWilayaVoteCount(w.code);
                  const nodeRadius = w.code === 40 ? 10 : getNodeSize(votes, 10, 3.5);
                  const isHovered = hoveredNode?.type === 'wilaya' && hoveredNode?.code === w.code;
                  
                  // Color codes
                  let nodeColor = 'fill-slate-600 stroke-slate-500';
                  if (w.code === 40) {
                    nodeColor = 'fill-algerian-gold stroke-white ring-2 ring-algerian-gold animate-pulse';
                  } else if (votes > 0) {
                    nodeColor = 'fill-algerian-green stroke-white';
                  }

                  return (
                    <g 
                      key={w.code}
                      onClick={() => {
                        if (w.code === 40) {
                          setActiveTab('local');
                          setHoveredNode(null);
                        }
                      }}
                      onMouseEnter={() => setHoveredNode({ type: 'wilaya', code: w.code, name: w.nameAr, nameEn: w.nameEn, votes })}
                      onMouseLeave={() => setHoveredNode(null)}
                      className={`${w.code === 40 ? 'cursor-pointer' : 'cursor-default'} group`}
                    >
                      {/* Outer pulse circle for hovered / active */}
                      {(isHovered || w.code === 40) && (
                        <circle
                          cx={w.x}
                          cy={w.y}
                          r={nodeRadius + 4}
                          className="fill-transparent stroke-algerian-gold/30 animate-ping stroke-[1]"
                        />
                      )}
                      
                      {/* Solid Center point */}
                      <circle
                        cx={w.x}
                        cy={w.y}
                        r={nodeRadius}
                        className={`${nodeColor} transition-all duration-200 group-hover:fill-algerian-red group-hover:stroke-white`}
                      />

                      {/* Code Labels for high participations or Khenchela */}
                      {(votes > 0 || w.code === 40) && (
                        <text
                          x={w.x}
                          y={w.y - nodeRadius - 3}
                          textAnchor="middle"
                          className="font-mono font-bold text-[8px] fill-slate-400 pointer-events-none select-none"
                        >
                          {w.code.toString().padStart(2, '0')}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>
          )}

          {/* TAB 2: Khenchela local municipalities network */}
          {activeTab === 'local' && (
            <div className="w-full relative flex flex-col items-center">
              {/* Drilled heading */}
              <div className="absolute top-0 right-0 text-right">
                <span className="text-[10px] font-bold text-algerian-gold uppercase tracking-wider block font-tajawal">مستوى الدائرة والبلديات</span>
                <span className="text-sm font-black text-white font-tajawal">شبكة بلديات ولاية خنشلة (40)</span>
              </div>
              
              <div className="absolute top-0 left-0 text-slate-500 text-xs font-tajawal bg-white/2 border border-white/5 rounded-xl p-2.5 flex items-center gap-1.5 z-10">
                <Network className="h-3.5 w-3.5 text-algerian-green animate-pulse" />
                <span>رابط وتوصيل الدعم بين البلديات</span>
              </div>

              <svg 
                viewBox="0 0 500 500" 
                className="w-full max-w-[420px] h-auto text-slate-700 select-none"
              >
                {/* SVG Connections Links */}
                {KHENCHELA_NET_LINKS.map((link, idx) => {
                  const fromNode = KHENCHELA_MUNICIPALITIES_COORDS.find(m => m.nameAr === link.from);
                  const toNode = KHENCHELA_MUNICIPALITIES_COORDS.find(m => m.nameAr === link.to);
                  
                  if (!fromNode || !toNode) return null;

                  // Highlight link if from or to is hovered
                  const isHighlighted = hoveredNode?.type === 'muni' && 
                    (hoveredNode.name === link.from || hoveredNode.name === link.to);

                  return (
                    <line
                      key={idx}
                      x1={fromNode.x}
                      y1={fromNode.y}
                      x2={toNode.x}
                      y2={toNode.y}
                      className={`transition-all duration-300 stroke-[1.2] ${
                        isHighlighted 
                          ? 'stroke-algerian-gold opacity-90 stroke-[2]' 
                          : 'stroke-algerian-green/20 opacity-40'
                      }`}
                    />
                  );
                })}

                {/* Plotting Municipalities nodes */}
                {KHENCHELA_MUNICIPALITIES_COORDS.map((m) => {
                  const votes = getMuniVoteCount(m.nameAr);
                  const nodeRadius = m.isCenter ? 12 : getNodeSize(votes, 12, 5);
                  const isHovered = hoveredNode?.type === 'muni' && hoveredNode?.name === m.nameAr;
                  
                  let nodeColor = 'fill-[#072a19] stroke-algerian-green/60';
                  if (m.isCenter) {
                    nodeColor = 'fill-algerian-gold stroke-white ring-2 ring-algerian-gold';
                  } else if (votes > 0) {
                    nodeColor = 'fill-algerian-green stroke-white';
                  }

                  return (
                    <g
                      key={m.nameEn}
                      onMouseEnter={() => setHoveredNode({ type: 'muni', name: m.nameAr, nameEn: m.nameEn, votes })}
                      onMouseLeave={() => setHoveredNode(null)}
                      className="cursor-default"
                    >
                      {/* Pulse ring on hover */}
                      {isHovered && (
                        <circle
                          cx={m.x}
                          cy={m.y}
                          r={nodeRadius + 5}
                          className="fill-transparent stroke-algerian-gold/40 animate-ping stroke-[1]"
                        />
                      )}

                      {/* Node circle */}
                      <circle
                        cx={m.x}
                        cy={m.y}
                        r={nodeRadius}
                        className={`${nodeColor} transition-all duration-200 hover:fill-algerian-red hover:stroke-white`}
                      />

                      {/* Small text label inside or near node */}
                      <text
                        x={m.x}
                        y={m.y + nodeRadius + 12}
                        textAnchor="middle"
                        className="font-tajawal text-[7.5px] font-bold fill-slate-400 select-none pointer-events-none"
                      >
                        {m.nameAr}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          )}

          {/* Node Hover Information Tooltip (Floating overlay) */}
          <div className="absolute bottom-4 right-4 left-4 lg:right-auto lg:w-72 bg-gradient-to-b from-[#0a1f0f] to-[#040e06] border border-algerian-green/20 rounded-2xl p-4 shadow-xl z-20 transition-all duration-200">
            {hoveredNode ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 bg-algerian-gold/15 text-algerian-gold border border-algerian-gold/20 text-[10px] font-extrabold px-2 py-0.5 rounded-lg">
                    {hoveredNode.type === 'wilaya' ? `ولاية ${hoveredNode.code.toString().padStart(2, '0')}` : 'بلدية'}
                  </span>
                  <div className="text-right">
                    <p className="text-white font-bold font-tajawal text-sm">{hoveredNode.name}</p>
                    <p className="text-slate-500 text-[10px]">{hoveredNode.nameEn}</p>
                  </div>
                </div>
                
                <div className="h-px bg-white/5" />

                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">الأصوات المحققة / Votes</span>
                  <span className="text-white font-black">{hoveredNode.votes}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">النسبة الوطنية / Share</span>
                  <span className="text-algerian-gold font-bold">
                    {stats.totalVotes > 0 ? Math.round((hoveredNode.votes / stats.totalVotes) * 100) : 0}%
                  </span>
                </div>
              </motion.div>
            ) : (
              <div className="text-slate-500 text-xs font-tajawal flex items-center justify-center gap-2 py-3 text-center">
                <MapPin className="h-4 w-4 text-algerian-green flex-shrink-0" />
                <span>ضع مؤشر الفأرة على أي ولاية أو بلدية لمعاينة الإحصائيات.</span>
              </div>
            )}
          </div>

        </div>

        {/* Right Side: Detailed Statistics Panels */}
        <div className="space-y-6">
          
          {/* Card 1: Participation Summary */}
          <div className="bg-[#040e06] border border-algerian-green/10 rounded-3xl p-5 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-white/5">
              <Award className="h-5 w-5 text-algerian-gold" />
              <span className="text-white font-black text-sm font-tajawal">ملخص المشاركة الجغرافية</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/2 p-3.5 rounded-2xl border border-white/5">
                <p className="text-slate-500 text-[10px] font-tajawal">مجموع الأصوات</p>
                <p className="text-2xl font-black text-white mt-1">{stats.totalVotes}</p>
              </div>
              <div className="bg-white/2 p-3.5 rounded-2xl border border-white/5">
                <p className="text-slate-500 text-[10px] font-tajawal">نسبة خنشلة</p>
                <p className="text-2xl font-black text-algerian-green mt-1">
                  {stats.totalVotes > 0 
                    ? Math.round((stats.municipalities.reduce((acc, curr) => acc + curr.count, 0) / stats.totalVotes) * 100) 
                    : 0}%
                </p>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-400">
                <span>تغطية الولايات / States Covered</span>
                <span className="text-white font-bold">{stats.wilayas.length} / 58</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-1.5">
                <div 
                  className="bg-algerian-gold h-1.5 rounded-full" 
                  style={{ width: `${(stats.wilayas.length / 58) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Card 2: Highest Performing Regions */}
          <div className="bg-[#040e06] border border-algerian-green/10 rounded-3xl p-5 space-y-4">
            {activeTab === 'national' ? (
              <>
                <div className="flex items-center gap-2 pb-3 border-b border-white/5">
                  <TrendingUp className="h-5 w-5 text-algerian-green" />
                  <span className="text-white font-black text-sm font-tajawal">الولايات الأكثر تفاعلاً</span>
                </div>
                
                {topWilayas.length === 0 ? (
                  <p className="text-slate-500 text-xs py-4 text-center font-tajawal">لا يوجد أصوات مسجلة بعد.</p>
                ) : (
                  <div className="space-y-3.5 max-h-[220px] overflow-y-auto pr-1">
                    {topWilayas.slice(0, 5).map((w, idx) => {
                      const share = stats.totalVotes > 0 ? Math.round((w.count / stats.totalVotes) * 100) : 0;
                      return (
                        <div key={w.code} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2.5">
                            <span className="w-5 h-5 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-center font-mono font-bold text-[10px] text-slate-500">
                              {idx + 1}
                            </span>
                            <div>
                              <p className="text-white font-bold font-tajawal">{w.name}</p>
                              <p className="text-[9px] text-slate-500">Wilaya {w.code}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-white font-bold">{w.count} صوت</p>
                            <p className="text-[10px] text-algerian-gold font-bold">{share}%</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 pb-3 border-b border-white/5">
                  <LayoutList className="h-5 w-5 text-algerian-green" />
                  <span className="text-white font-black text-sm font-tajawal">بلديات خنشلة الأعلى مشاركة</span>
                </div>
                
                {topMunis.length === 0 ? (
                  <p className="text-slate-500 text-xs py-4 text-center font-tajawal">لا توجد أصوات في بلديات خنشلة بعد.</p>
                ) : (
                  <div className="space-y-3.5 max-h-[220px] overflow-y-auto pr-1">
                    {topMunis.slice(0, 5).map((m, idx) => {
                      const totalKhenchelaVotes = stats.municipalities.reduce((acc, curr) => acc + curr.count, 0);
                      const share = totalKhenchelaVotes > 0 ? Math.round((m.count / totalKhenchelaVotes) * 100) : 0;
                      return (
                        <div key={m.name} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2.5">
                            <span className="w-5 h-5 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-center font-mono font-bold text-[10px] text-slate-500">
                              {idx + 1}
                            </span>
                            <div>
                              <p className="text-white font-bold font-tajawal">{m.name}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-white font-bold">{m.count} صوت</p>
                            <p className="text-[10px] text-algerian-green font-bold">{share}%</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Card 3: Security & Protocols */}
          <div className="bg-gradient-to-br from-algerian-green/10 via-transparent to-transparent border border-algerian-green/20 rounded-3xl p-5">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-algerian-green/20">
                <Info className="h-4 w-4 text-algerian-green" />
              </div>
              <div className="space-y-1">
                <p className="text-white font-bold text-xs font-tajawal">الشفافية والتحديث الفوري</p>
                <p className="text-slate-500 text-[11px] font-tajawal leading-relaxed">
                  تقرأ هذه الخريطة البيانات مباشرة وبشكل فوري من قاعدة بيانات Supabase. عندما يقوم أي مواطن بالتصويت في نموذج الموقع العام، تنعكس مشاركته فورياً على إحصائيات الولايات والبلديات المعروضة هنا.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
