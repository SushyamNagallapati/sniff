import React from 'react';
import { SniffQuest } from '../types/sniff';

interface SniffQuestCardProps {
  quest: SniffQuest;
}

export const SniffQuestCard: React.FC<SniffQuestCardProps> = ({ quest }) => {
  return (
    <div className="border-t border-b border-[#D5CEBF] bg-[#FAF8F3] py-5 sm:py-6 px-6 sm:px-8 my-6">
      <div className="mx-auto max-w-4xl">
        <p className="font-data text-xs font-semibold uppercase tracking-widest text-[#4A5839]">
          SNIFF QUEST
        </p>

        <h3 className="mt-2 font-editorial text-2xl font-light leading-snug uppercase tracking-tight text-[#191816] sm:text-3xl">
          {quest.title}
        </h3>

        <p className="mt-2 font-sans text-sm leading-relaxed text-[#524E46] sm:text-base">
          {quest.description}
        </p>
      </div>
    </div>
  );
};
