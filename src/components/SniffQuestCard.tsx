import React from "react";
import type { SniffQuest } from "../types/sniff";

interface SniffQuestCardProps {
  quest: SniffQuest;
}

export const SniffQuestCard: React.FC<SniffQuestCardProps> = ({ quest }) => {
  return (
    // No inner container: the quest reads as part of
    // the report, so it shares the report's edges.
    <section
      className="border-t border-[#D8D1C5] bg-[#F2EEE6]/35 py-7 sm:py-8"
      aria-labelledby="sniff-quest-title"
    >
      <p className="font-data text-[9px] font-semibold uppercase tracking-[0.19em] text-[#43513B]">
        SNIFF QUEST
      </p>

      <h3
        id="sniff-quest-title"
        className="mt-2 font-editorial text-2xl font-light uppercase tracking-[-0.025em] text-[#1D1C19] sm:text-3xl"
      >
        {quest.title}
      </h3>

      <p className="mt-3 max-w-[68ch] font-sans text-sm leading-[1.75] text-[#625D55] sm:text-[15px]">
        {quest.description}
      </p>
    </section>
  );
};
