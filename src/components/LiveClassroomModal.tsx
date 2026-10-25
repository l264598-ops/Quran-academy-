import React, { useState } from 'react';
import {
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Mic,
  MicOff,
  MessageSquare,
  PhoneOff,
  Send,
  Video,
  VideoOff,
  Volume2,
  X,
} from 'lucide-react';
import { db } from '../services/db';
import { playAuditoryChime } from '../utils/islamicUtils';

interface LiveClassroomModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  courseTitle?: string;
  studentName?: string;
}

export const LiveClassroomModal: React.FC<LiveClassroomModalProps> = ({
  isOpen,
  onClose,
  title = 'Quran Recitation & Tajweed Session',
  courseTitle = 'Quran with Tajweed',
  studentName = 'Aisha Fatima Khan',
}) => {
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [activeTab, setActiveTab] = useState<'quran' | 'whiteboard' | 'chat'>('quran');

  // Interactive Quran reader state in classroom
  const [selectedSurah, setSelectedSurah] = useState('Surah Al-Mulk (67)');
  const [currentAyahIndex, setCurrentAyahIndex] = useState(0);
  const [highlightRule, setHighlightRule] = useState<string | null>('qalqalah');

  // Live chat messages state
  const [messages, setMessages] = useState<Array<{ sender: string; text: string; time: string }>>([
    {
      sender: 'Teacher Bua Qasim',
      text: 'Assalamu Alaikum wa Rahmatullahi wa Barakatuh! Let us start today with Surah Al-Mulk, focusing on Qalqalah in verse 2.',
      time: '17:30',
    },
    {
      sender: 'Student Aisha',
      text: 'Wa Alaikum Assalam respected teacher! I have my Mushaf open and marked the bouncing letters.',
      time: '17:31',
    },
  ]);
  const [newMsg, setNewMsg] = useState('');

  // Whiteboard notes
  const [whiteboardText, setWhiteboardText] = useState(
    'CLASS NOTES - TEACHER BUA QASIM SHIGRY:\n\n1. Rule of Qalqalah (ق، ط، ب، ج، د) in "الَّذِي خَلَقَ" - Keep the bounce crisp.\n2. In Verse 3 "تَفَاوُتٍ", lengthen the Wow Maddah for exactly 2 counts (Harakah).'
  );

  if (!isOpen) return null;

  const AYAH_SAMPLE = [
    {
      number: 1,
      arabic: 'تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ',
      translation: 'Blessed is He in whose hand is dominion, and He is over all things competent.',
      ruleAnnotation: 'Notice the clear Raa in "Tabaraka" and stopping elongation in "Qadeer".',
    },
    {
      number: 2,
      arabic: 'الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا ۚ وَهُوَ الْعَزِيزُ الْغَفُورُ',
      translation: 'He who created death and life to test you as to which of you is best in deed — and He is the Exalted in Might, the Forgiving.',
      ruleAnnotation: 'Qalqalah on Qaaf in "Khalaqa" and Baa in "Liyabluwakum".',
    },
    {
      number: 3,
      arabic: 'الَّذِي خَلَقَ سَبْعَ سَمَاوَاتٍ طِبَاقًا ۖ مَّا تَرَىٰ فِي خَلْقِ الرَّحْمَٰنِ مِن تَفَاوُتٍ',
      translation: 'Who created seven heavens in layers. You see not in the creation of the Most Merciful any inconsistency.',
      ruleAnnotation: 'Qalqalah Sughra on Baa in "Sab\'a" and Ikhfa on Tanween before Taa in "Tibaaqan maa".',
    },
  ];

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsg.trim()) return;
    const msg = {
      sender: 'You',
      text: newMsg.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages([...messages, msg]);
    setNewMsg('');
    playAuditoryChime('click');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col">
      {/* Top Session Bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between text-white shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-800 flex items-center justify-center text-amber-300 font-bold">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">{title}</h3>
            <p className="text-xs text-slate-400">
              {courseTitle} · Student: {studentName} · Teacher Bua Qasim Shigry
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-xs text-slate-300 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Live Class Room #401</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Classroom Split */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left / Center: Interactive Quran Workspace & Whiteboard */}
        <div className="flex-1 flex flex-col bg-slate-950 p-4 overflow-y-auto">
          {/* Navigation tab bar */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('quran')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  activeTab === 'quran'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white bg-slate-900'
                }`}
              >
                Holy Quran Mushaf
              </button>
              <button
                onClick={() => setActiveTab('whiteboard')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  activeTab === 'whiteboard'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white bg-slate-900'
                }`}
              >
                Teacher’s Whiteboard & Tajweed Rules
              </button>
            </div>

            {activeTab === 'quran' && (
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400 hidden sm:inline">Tajweed Highlight:</span>
                <button
                  onClick={() => setHighlightRule(highlightRule === 'qalqalah' ? null : 'qalqalah')}
                  className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                    highlightRule === 'qalqalah'
                      ? 'bg-blue-900 text-blue-200 border border-blue-500'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  Qalqalah (Echo)
                </button>
                <button
                  onClick={() => setHighlightRule(highlightRule === 'ghunnah' ? null : 'ghunnah')}
                  className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                    highlightRule === 'ghunnah'
                      ? 'bg-emerald-900 text-emerald-200 border border-emerald-500'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  Ghunnah (Nasal)
                </button>
              </div>
            )}
          </div>

          {/* TAB 1: Holy Quran Recitation Board */}
          {activeTab === 'quran' && (
            <div className="flex-1 flex flex-col justify-between max-w-4xl mx-auto w-full">
              <div className="bg-[#FAF7EE] text-slate-900 rounded-2xl p-6 sm:p-8 shadow-2xl border-4 border-[#C8B88A]/40 relative font-arabic">
                <div className="text-center pb-4 border-b border-[#E5DEC7] mb-6">
                  <span className="text-xs uppercase font-sans tracking-widest text-[#8C7A4E] font-bold block mb-1">
                    Juz 29 · Surah Al-Mulk (The Sovereignty)
                  </span>
                  <div className="text-2xl sm:text-3xl font-bold text-emerald-950">
                    بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                  </div>
                </div>

                {/* Verses display */}
                <div className="space-y-6">
                  {AYAH_SAMPLE.map((ayah, idx) => (
                    <div
                      key={ayah.number}
                      onClick={() => {
                        setCurrentAyahIndex(idx);
                        playAuditoryChime('click');
                      }}
                      className={`p-4 rounded-xl transition-all cursor-pointer border ${
                        currentAyahIndex === idx
                          ? 'bg-amber-100/60 border-amber-400 ring-2 ring-amber-400/30'
                          : 'border-transparent hover:bg-black/5'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <span className="font-sans text-xs font-bold text-[#8C7A4E] bg-white border border-[#C8B88A] w-7 h-7 rounded-full flex items-center justify-center shrink-0">
                          {ayah.number}
                        </span>
                        <p
                          dir="rtl"
                          className="text-2xl sm:text-3xl leading-loose font-arabic text-right text-slate-900"
                        >
                          {ayah.arabic}
                        </p>
                      </div>

                      {currentAyahIndex === idx && (
                        <div className="mt-3 pt-3 border-t border-amber-200/80 font-sans text-xs text-slate-700">
                          <p className="italic text-slate-600 mb-1">{ayah.translation}</p>
                          <p className="font-semibold text-emerald-800">
                            Teacher Annotation: {ayah.ruleAnnotation}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Recitation Controls */}
              <div className="mt-4 bg-slate-900 border border-slate-800 p-3 rounded-xl flex items-center justify-between text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setCurrentAyahIndex(Math.max(0, currentAyahIndex - 1));
                      playAuditoryChime('click');
                    }}
                    className="p-1.5 rounded hover:bg-slate-800"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span>Ayah {AYAH_SAMPLE[currentAyahIndex].number} of {AYAH_SAMPLE.length}</span>
                  <button
                    onClick={() => {
                      setCurrentAyahIndex(Math.min(AYAH_SAMPLE.length - 1, currentAyahIndex + 1));
                      playAuditoryChime('click');
                    }}
                    className="p-1.5 rounded hover:bg-slate-800"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => playAuditoryChime('complete')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-800 text-white font-medium hover:bg-emerald-700 transition-colors"
                  >
                    <Volume2 className="w-3.5 h-3.5" /> Listen to Model Recitation
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Teacher Whiteboard */}
          {activeTab === 'whiteboard' && (
            <div className="flex-1 flex flex-col bg-slate-900 rounded-2xl p-4 border border-slate-800">
              <label className="text-xs font-semibold text-slate-300 mb-2 block">
                Collaborative Lesson Slate & Tajweed Corrections:
              </label>
              <textarea
                value={whiteboardText}
                onChange={(e) => setWhiteboardText(e.target.value)}
                className="flex-1 w-full bg-slate-950 text-emerald-300 font-mono text-xs sm:text-sm p-4 rounded-xl border border-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-600 leading-relaxed"
              />
              <p className="text-[11px] text-slate-500 mt-2">
                Notes written here are visible in real-time to both Teacher Bua Qasim and student and saved in class history.
              </p>
            </div>
          )}
        </div>

        {/* Right Pane: Video Streams & Chat Panel */}
        <div className="w-full lg:w-80 bg-slate-900 border-l border-slate-800 flex flex-col shrink-0">
          {/* Video Frames */}
          <div className="p-3 grid grid-cols-2 lg:grid-cols-1 gap-2.5 border-b border-slate-800">
            {/* Teacher Frame */}
            <div className="relative rounded-xl overflow-hidden aspect-video bg-slate-950 border border-slate-700 shadow-inner group">
              <img
                src="/src/assets/images/teacher_bua_qasim_1792917817962.jpg"
                alt="Teacher Bua Qasim Shigry"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-xs text-[10px] text-white font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Teacher Bua Qasim Shigry</span>
              </div>
              <div className="absolute top-2 right-2 p-1 rounded-full bg-emerald-800 text-amber-300">
                <Volume2 className="w-3 h-3" />
              </div>
            </div>

            {/* Student Frame */}
            <div className="relative rounded-xl overflow-hidden aspect-video bg-slate-800 border border-slate-700 flex items-center justify-center">
              {videoOn ? (
                <div className="text-center p-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-900 text-emerald-200 font-bold flex items-center justify-center mx-auto mb-1">
                    {studentName.charAt(0)}
                  </div>
                  <span className="text-[11px] text-slate-300 font-medium">{studentName}</span>
                </div>
              ) : (
                <div className="text-center text-slate-500 text-xs">Camera Off</div>
              )}
              <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-xs text-[10px] text-white font-semibold">
                Student Camera
              </div>
            </div>
          </div>

          {/* Classroom Chat */}
          <div className="flex-1 flex flex-col p-3 overflow-hidden">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 pb-2 border-b border-slate-800">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>In-Class Discussion</span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 py-3 text-xs">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`p-2.5 rounded-xl max-w-[85%] ${
                    m.sender === 'You' || m.sender.includes('Student')
                      ? 'ml-auto bg-emerald-900/60 text-emerald-100 border border-emerald-700/40'
                      : 'bg-slate-800 text-slate-200 border border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-0.5">
                    <span className="font-semibold text-amber-200">{m.sender}</span>
                    <span>{m.time}</span>
                  </div>
                  <p className="leading-relaxed">{m.text}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendChat} className="pt-2 flex gap-1.5">
              <input
                type="text"
                value={newMsg}
                onChange={(e) => setNewMsg(e.target.value)}
                placeholder="Ask teacher a question..."
                className="flex-1 bg-slate-950 text-xs text-white px-3 py-2 rounded-lg border border-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-700"
              />
              <button
                type="submit"
                className="p-2 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Session Toolbar */}
      <div className="bg-slate-900 border-t border-slate-800 px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMicOn(!micOn)}
            className={`p-2.5 rounded-xl font-medium text-xs flex items-center gap-2 transition-colors ${
              micOn ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-red-900/70 text-red-200'
            }`}
          >
            {micOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            <span className="hidden sm:inline">{micOn ? 'Mute' : 'Unmute'}</span>
          </button>

          <button
            onClick={() => setVideoOn(!videoOn)}
            className={`p-2.5 rounded-xl font-medium text-xs flex items-center gap-2 transition-colors ${
              videoOn ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-red-900/70 text-red-200'
            }`}
          >
            {videoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
            <span className="hidden sm:inline">{videoOn ? 'Stop Camera' : 'Start Camera'}</span>
          </button>
        </div>

        <button
          onClick={onClose}
          className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
        >
          <PhoneOff className="w-4 h-4" /> End Class Session
        </button>
      </div>
    </div>
  );
};
