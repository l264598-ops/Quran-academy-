import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Check,
  ChevronRight,
  Clock,
  Compass,
  Copy,
  Heart,
  RefreshCw,
  Search,
  Sparkles,
  Volume2,
} from 'lucide-react';
import {
  AUTHENTIC_DUAS,
  AUTHENTIC_HADITHS,
  AUTHENTIC_NAMAZ_STEPS,
} from '../data/seedData';
import {
  calculatePrayerTimes,
  CityLocation,
  playAuditoryChime,
  SUPPORTED_CITIES,
} from '../utils/islamicUtils';

export const IslamicResourcesView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'namaz' | 'duas' | 'hadith' | 'tasbeeh' | 'prayer-times'>('namaz');

  // Namaz Guide State
  const [activeNamazStep, setActiveNamazStep] = useState(0);

  // Duas State
  const [duaCategory, setDuaCategory] = useState<string>('All');
  const [duaSearch, setDuaSearch] = useState('');
  const [copiedDuaId, setCopiedDuaId] = useState<string | null>(null);

  // Digital Tasbeeh State
  const [tasbeehCount, setTasbeehCount] = useState(0);
  const [tasbeehTarget, setTasbeehTarget] = useState(33);
  const [selectedDhikr, setSelectedDhikr] = useState('سُبْحَانَ اللَّهِ (SubhanAllah)');

  // Prayer Times State
  const [selectedCity, setSelectedCity] = useState<CityLocation>(SUPPORTED_CITIES[0]);
  const [prayerTimes, setPrayerTimes] = useState(calculatePrayerTimes(selectedCity));

  useEffect(() => {
    setPrayerTimes(calculatePrayerTimes(selectedCity));
  }, [selectedCity]);

  const handleTasbeehClick = () => {
    const next = tasbeehCount + 1;
    setTasbeehCount(next);
    if (next % tasbeehTarget === 0) {
      playAuditoryChime('complete');
    } else {
      playAuditoryChime('click');
    }
  };

  const handleCopyDua = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedDuaId(id);
    setTimeout(() => setCopiedDuaId(null), 2000);
  };

  const filteredDuas = AUTHENTIC_DUAS.filter((d) => {
    const matchCat = duaCategory === 'All' || d.category === duaCategory;
    const matchSearch =
      d.title.toLowerCase().includes(duaSearch.toLowerCase()) ||
      d.translationEn.toLowerCase().includes(duaSearch.toLowerCase()) ||
      d.translationUrdu.includes(duaSearch);
    return matchCat && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest">
          Knowledge & Spiritual Growth
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-emerald-950">
          Islamic Educational Resources Hub
        </h1>
        <p className="text-sm text-slate-600">
          Authentic guides carefully compiled and verified by Teacher Bua Qasim Shigry. Step-by-step Salah learning, masnoon duas, prophetic hadith, digital tasbeeh, and international prayer times.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-center gap-1.5 p-1.5 bg-slate-100 rounded-2xl overflow-x-auto max-w-3xl mx-auto">
        <button
          onClick={() => setActiveTab('namaz')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
            activeTab === 'namaz' ? 'bg-white text-emerald-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Namaz & Salah Guide
        </button>
        <button
          onClick={() => setActiveTab('duas')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
            activeTab === 'duas' ? 'bg-white text-emerald-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Daily Duas Explorer
        </button>
        <button
          onClick={() => setActiveTab('hadith')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
            activeTab === 'hadith' ? 'bg-white text-emerald-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Selected Hadith
        </button>
        <button
          onClick={() => setActiveTab('tasbeeh')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
            activeTab === 'tasbeeh' ? 'bg-white text-emerald-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Digital Tasbeeh
        </button>
        <button
          onClick={() => setActiveTab('prayer-times')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
            activeTab === 'prayer-times' ? 'bg-white text-emerald-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Prayer Times & Qibla
        </button>
      </div>

      {/* TAB 1: NAMAZ & SALAH GUIDE */}
      {activeTab === 'namaz' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Step-by-Step Practical Namaz (Salah) Guide
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Physical postures, verified Arabic recitations, transliterations, and meanings
              </p>
            </div>
            <button
              onClick={() => playAuditoryChime('complete')}
              className="px-4 py-2 bg-emerald-50 text-emerald-900 text-xs font-semibold rounded-xl border border-emerald-700/20 flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Volume2 className="w-4 h-4 text-emerald-700" /> Listen to Audio Recitation
            </button>
          </div>

          {/* Stepper Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {AUTHENTIC_NAMAZ_STEPS.map((st, idx) => (
              <button
                key={st.stepNumber}
                onClick={() => {
                  setActiveNamazStep(idx);
                  playAuditoryChime('click');
                }}
                className={`p-3 rounded-xl border text-left transition-all ${
                  activeNamazStep === idx
                    ? 'bg-emerald-800 text-white border-emerald-800 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span className="text-[10px] font-mono block opacity-80">STEP {st.stepNumber}</span>
                <span className="text-xs font-bold block truncate mt-0.5">
                  {st.titleEn.split('. ')[1]}
                </span>
              </button>
            ))}
          </div>

          {/* Step Detail Card */}
          {(() => {
            const step = AUTHENTIC_NAMAZ_STEPS[activeNamazStep];
            return (
              <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                  <h3 className="text-lg font-bold text-slate-900">{step.titleEn}</h3>
                  <span className="font-arabic text-emerald-900 text-base font-bold" dir="rtl">
                    {step.titleUrdu}
                  </span>
                </div>

                {/* Posture Description */}
                <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200/60 text-xs text-emerald-950">
                  <strong className="font-bold text-emerald-900 block mb-1">Physical Posture & Alignment:</strong>
                  <p>{step.posture}</p>
                </div>

                {/* Arabic Recitation Banner */}
                <div className="bg-[#FAF7EE] p-6 rounded-2xl border border-[#C8B88A]/50 text-right space-y-2">
                  <p dir="rtl" className="font-arabic text-2xl sm:text-3xl text-emerald-950 leading-loose">
                    {step.arabic}
                  </p>
                </div>

                {/* Transliteration & Translations */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-700 uppercase text-[10px] block">English Transliteration</span>
                    <p className="font-mono text-slate-800">{step.transliteration}</p>
                    <span className="font-bold text-slate-700 uppercase text-[10px] block pt-2">English Translation</span>
                    <p className="text-slate-600 leading-relaxed">{step.meaningEn}</p>
                  </div>

                  <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-1 text-right">
                    <span className="font-bold text-slate-700 uppercase text-[10px] block text-left">Urdu Translation</span>
                    <p dir="rtl" className="font-arabic text-base text-slate-800 leading-relaxed">
                      {step.meaningUrdu}
                    </p>
                  </div>
                </div>

                {/* Spiritual Wisdom Note */}
                <div className="text-xs text-slate-600 italic bg-white p-3 rounded-xl border border-slate-200">
                  <strong>Scholarly Note:</strong> {step.note}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* TAB 2: DAILY DUAS EXPLORER */}
      {activeTab === 'duas' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200">
            <div className="flex flex-wrap gap-1.5">
              {['All', 'Morning & Evening', 'Daily Life', 'Knowledge', 'Parents & Family', 'Hardship & Protection'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setDuaCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    duaCategory === cat ? 'bg-emerald-800 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <input
                type="text"
                value={duaSearch}
                onChange={(e) => setDuaSearch(e.target.value)}
                placeholder="Search duas..."
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700"
              />
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
            </div>
          </div>

          {/* Duas Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredDuas.map((dua) => (
              <div
                key={dua.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                      {dua.category}
                    </span>
                    <button
                      onClick={() => handleCopyDua(dua.id, `${dua.title}\n${dua.arabic}\n${dua.translationEn}`)}
                      className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1"
                    >
                      {copiedDuaId === dua.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" /> Copy
                        </>
                      )}
                    </button>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">{dua.title}</h3>

                  <div className="bg-[#FAF7EE] p-4 rounded-xl border border-[#C8B88A]/40 text-right">
                    <p dir="rtl" className="font-arabic text-xl sm:text-2xl text-emerald-950 leading-loose">
                      {dua.arabic}
                    </p>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <p className="font-mono text-slate-700 text-[11px]">{dua.transliteration}</p>
                    <p className="text-slate-600 leading-relaxed">{dua.translationEn}</p>
                    <p dir="rtl" className="font-arabic text-slate-800 text-sm leading-relaxed text-right pt-1">
                      {dua.translationUrdu}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="font-semibold text-emerald-800">{dua.reference}</span>
                  <span className="italic truncate max-w-[200px]" title={dua.benefit}>
                    {dua.benefit}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: SELECTED HADITH */}
      {activeTab === 'hadith' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {AUTHENTIC_HADITHS.map((h) => (
              <div key={h.id} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-xs">
                <div className="flex items-center justify-between border-b pb-3 border-slate-100">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded uppercase">
                      {h.theme}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-1">{h.narrator}</h3>
                  </div>
                  <span className="font-mono text-xs text-slate-500">{h.book}</span>
                </div>

                <div className="bg-[#FAF7EE] p-6 rounded-xl border border-[#C8B88A]/40 text-right">
                  <p dir="rtl" className="font-arabic text-2xl sm:text-3xl text-emerald-950 leading-loose">
                    {h.arabic}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <span className="font-bold text-slate-600 uppercase text-[10px] block mb-1">English Translation</span>
                    <p className="text-slate-800 leading-relaxed font-medium">{h.translationEn}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl text-right">
                    <span className="font-bold text-slate-600 uppercase text-[10px] block mb-1 text-left">Urdu Translation</span>
                    <p dir="rtl" className="font-arabic text-base text-slate-800 leading-relaxed">
                      {h.translationUrdu}
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200/50 text-xs text-emerald-950">
                  <strong className="text-emerald-900">Significance & Teaching Lesson:</strong> {h.explanation}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: DIGITAL TASBEEH */}
      {activeTab === 'tasbeeh' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 max-w-lg mx-auto text-center space-y-6 shadow-xl">
          <div>
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest">
              Daily Dhikr & Remembrance
            </span>
            <h2 className="text-2xl font-bold text-emerald-950 mt-1">Digital Tasbeeh Counter</h2>
          </div>

          {/* Dhikr Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Select Dhikr Preset</label>
            <select
              value={selectedDhikr}
              onChange={(e) => setSelectedDhikr(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 font-arabic text-center"
            >
              <option value="سُبْحَانَ اللَّهِ (SubhanAllah)">سُبْحَانَ اللَّهِ (SubhanAllah)</option>
              <option value="الْحَمْدُ لِلَّهِ (Alhamdulillah)">الْحَمْدُ لِلَّهِ (Alhamdulillah)</option>
              <option value="اللَّهُ أَكْبَرُ (Allahu Akbar)">اللَّهُ أَكْبَرُ (Allahu Akbar)</option>
              <option value="أَسْتَغْفِرُ اللَّهَ (Astaghfirullah)">أَسْتَغْفِرُ اللَّهَ (Astaghfirullah)</option>
              <option value="لَا إِلَهَ إِلَّا اللَّهُ (La ilaha illallah)">لَا إِلَهَ إِلَّا اللَّهُ (La ilaha illallah)</option>
              <option value="اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ (Salawat / Durood)">اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ (Salawat / Durood)</option>
            </select>
          </div>

          {/* Interactive Counter Bubble */}
          <div className="relative py-4">
            <button
              onClick={handleTasbeehClick}
              className="w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-gradient-to-b from-emerald-800 to-emerald-950 text-white shadow-2xl mx-auto flex flex-col items-center justify-center border-8 border-emerald-700/40 hover:scale-102 active:scale-98 transition-transform cursor-pointer select-none"
            >
              <span className="text-xs uppercase font-sans tracking-widest text-amber-300 font-bold mb-1">
                TAP TO COUNT
              </span>
              <span className="text-5xl sm:text-6xl font-mono font-extrabold text-white">
                {tasbeehCount}
              </span>
              <span className="text-[11px] text-emerald-200 mt-1">Target: {tasbeehTarget}</span>
            </button>
          </div>

          {/* Progress to target */}
          <div className="space-y-1.5 max-w-xs mx-auto">
            <div className="flex justify-between text-xs text-slate-500">
              <span>Round Completion</span>
              <span>{Math.min(100, Math.round(((tasbeehCount % tasbeehTarget) / tasbeehTarget) * 100))}%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-700 transition-all duration-300"
                style={{ width: `${Math.min(100, Math.round(((tasbeehCount % tasbeehTarget) / tasbeehTarget) * 100))}%` }}
              ></div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setTasbeehCount(0);
                playAuditoryChime('click');
              }}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reset Count
            </button>

            <button
              onClick={() => {
                const next = tasbeehTarget === 33 ? 100 : tasbeehTarget === 100 ? 500 : 33;
                setTasbeehTarget(next);
              }}
              className="px-4 py-2 text-xs font-semibold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-700/20 transition-colors"
            >
              Target: {tasbeehTarget}
            </button>
          </div>
        </div>
      )}

      {/* TAB 5: PRAYER TIMES */}
      {activeTab === 'prayer-times' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Worldwide Prayer Times Calculator</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Accurate astronomical calculations for the academy student community
              </p>
            </div>

            {/* City Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-600">Select City:</span>
              <select
                value={selectedCity.name}
                onChange={(e) => {
                  const city = SUPPORTED_CITIES.find((c) => c.name === e.target.value) || SUPPORTED_CITIES[0];
                  setSelectedCity(city);
                }}
                className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg font-semibold text-emerald-900"
              >
                {SUPPORTED_CITIES.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name} ({c.country})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Next Prayer Highlight Card */}
          <div className="bg-emerald-900 text-white rounded-xl p-5 flex items-center justify-between shadow-md">
            <div>
              <span className="text-[11px] font-bold text-amber-300 uppercase tracking-widest block">
                Next Upcoming Prayer
              </span>
              <p className="text-2xl font-bold mt-0.5">
                {prayerTimes.nextPrayer.name} at {prayerTimes.nextPrayer.time}
              </p>
              <p className="text-xs text-emerald-200 mt-0.5">
                Location: {selectedCity.name} ({selectedCity.timeZone})
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-800 text-amber-300 flex items-center justify-center font-bold">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          {/* Prayer Times Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center">
            {[
              { name: 'Fajr (Dawn)', time: prayerTimes.fajr },
              { name: 'Sunrise', time: prayerTimes.sunrise },
              { name: 'Dhuhr (Noon)', time: prayerTimes.dhuhr },
              { name: 'Asr (Afternoon)', time: prayerTimes.asr },
              { name: 'Maghrib (Sunset)', time: prayerTimes.maghrib },
              { name: 'Isha (Night)', time: prayerTimes.isha },
            ].map((p, i) => (
              <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-xs text-slate-500 font-medium block">{p.name}</span>
                <span className="text-base font-bold font-mono text-emerald-950 block mt-1">
                  {p.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
