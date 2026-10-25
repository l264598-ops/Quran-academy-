import React from 'react';
import { db } from '../services/db';
import { Sparkles } from 'lucide-react';

interface AnnouncementBarProps {
  onActionClick: () => void;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ onActionClick }) => {
  const settings = db.getSettings();

  if (!settings.announcementActive || !settings.announcementText) return null;

  return (
    <div className="bg-emerald-900 text-amber-100 text-xs py-2 px-4 border-b border-emerald-800">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 text-center">
        <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 hidden sm:inline" />
        <span className="font-medium tracking-wide">
          {settings.announcementText}
        </span>
        <button
          onClick={onActionClick}
          className="underline font-semibold hover:text-white transition-colors cursor-pointer shrink-0 ml-1"
        >
          Book 1-on-1 Trial
        </button>
      </div>
    </div>
  );
};
