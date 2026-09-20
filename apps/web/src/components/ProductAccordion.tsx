"use client";

import React, { useState } from "react";

export type AccordionSectionItem = {
  id: string;
  title: string;
  content?: string | null;
  items?: string[];
  customNode?: React.ReactNode;
};

interface ProductAccordionProps {
  sections: AccordionSectionItem[];
  defaultOpenId?: string;
}

export function ProductAccordion({ sections, defaultOpenId = "description" }: ProductAccordionProps) {
  const [openIds, setOpenIds] = useState<string[]>([defaultOpenId]);

  function toggle(id: string) {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  const validSections = sections.filter(
    (s) => (s.content && s.content.trim()) || (s.items && s.items.length > 0) || s.customNode
  );

  if (!validSections.length) return null;

  return (
    <div className="mt-8 divide-y divide-brand-border/70 border-y border-brand-border/70 text-brand-text">
      {validSections.map((sec) => {
        const isOpen = openIds.includes(sec.id);
        return (
          <div key={sec.id} className="py-1">
            <button
              type="button"
              onClick={() => toggle(sec.id)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between py-3.5 text-left transition-colors hover:text-rose-dark group"
            >
              <span className="serif text-lg tracking-wide uppercase font-medium">
                {sec.title}
              </span>
              <span className="ml-4 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-brand-border text-xs text-brand-muted transition group-hover:border-rose group-hover:text-rose">
                {isOpen ? "−" : "+"}
              </span>
            </button>

            {isOpen && (
              <div className="pb-5 pt-1 text-xs sm:text-sm leading-relaxed text-brand-muted">
                {sec.content && (
                  <div className="whitespace-pre-line">
                    {sec.content}
                  </div>
                )}
                {sec.items && sec.items.length > 0 && (
                  <ul className="mt-2 space-y-1.5 list-disc list-inside">
                    {sec.items.map((it, idx) => (
                      <li key={idx}>{it}</li>
                    ))}
                  </ul>
                )}
                {sec.customNode}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
