import React, { useState } from 'react';
import { BookOpen, Check, Download, FileText, Search, Sparkles } from 'lucide-react';
import { DOWNLOADABLE_BOOKS } from '../data/seedData';
import { playAuditoryChime } from '../utils/islamicUtils';

export const BooksLibraryView: React.FC = () => {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const handleDownload = (id: string, title: string) => {
    setDownloadingId(id);
    playAuditoryChime('complete');
    setTimeout(() => {
      setDownloadingId(null);
      // Simulated browser download notification
      alert(`Downloading authorized digital edition: "${title}". PDF saved to your device.`);
    }, 1000);
  };

  const filteredBooks = DOWNLOADABLE_BOOKS.filter(
    (b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.category.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest">
          Authentic Curriculum Materials
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-emerald-950">
          Digital Islamic Books & Primers Library
        </h1>
        <p className="text-sm text-slate-600">
          Free authorized downloadable PDF resources for our students and families worldwide. Includes full color-coded Noorani Qaida, Tajweed handbook, and 40 Rabbana supplications.
        </p>

        {/* Search */}
        <div className="pt-4 max-w-md mx-auto relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search books, primers, or topics..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-emerald-700"
          />
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
        </div>
      </div>

      {/* Library Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks.map((book) => (
          <div
            key={book.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold shrink-0">
                  <BookOpen className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold uppercase text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-full">
                  {book.category}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 leading-snug">{book.title}</h3>
                <p className="text-xs text-slate-500 mt-1">By {book.author}</p>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{book.description}</p>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>{book.pages} Pages</span>
                <span>PDF · {book.fileSize}</span>
              </div>
            </div>

            <div className="pt-6">
              <button
                onClick={() => handleDownload(book.id, book.title)}
                disabled={downloadingId === book.id}
                className="w-full py-2.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-75"
              >
                {downloadingId === book.id ? (
                  <>
                    <Check className="w-4 h-4 text-amber-300" /> Preparing Download...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 text-amber-300" /> Free PDF Download
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
