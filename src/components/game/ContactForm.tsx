"use client";

import { useEffect, useRef } from "react";
import { contact } from "@/game/data/contact";
import { Modal } from "./Modal";
import { PixelIcon } from "./PixelIcon";
import { useInputModeValue } from "./inputMode";

export type LetterDraft = { name: string; msg: string };

/** Draft lives in the parent so closing the mailbox never throws a message away. */
export function ContactForm({
  draft,
  onDraft,
  onClose,
}: {
  draft: LetterDraft;
  onDraft: (d: LetterDraft) => void;
  onClose: () => void;
}) {
  const mode = useInputModeValue();
  const nameRef = useRef<HTMLInputElement>(null);

  // desktop only: jump straight into the first field (no surprise keyboard on phones)
  useEffect(() => {
    if (mode === "keyboard") {
      const id = window.setTimeout(() => nameRef.current?.focus(), 60);
      return () => window.clearTimeout(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mailto = `mailto:${contact.email}?subject=${encodeURIComponent(
    `Hello from ${draft.name || "a visitor"}`,
  )}&body=${encodeURIComponent(draft.msg)}`;

  return (
    <Modal title="Mailbox" onClose={onClose} width="max-w-lg">
      <h3 className="t-ui text-[0.9375rem] font-bold text-[color:var(--text)]">{contact.heading}</h3>
      <p className="t-body mt-2 text-[1rem] leading-relaxed text-[color:var(--text-2)]">{contact.note}</p>

      <div className="mt-5 flex flex-col gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="t-ui text-[0.75rem] text-[color:var(--text-2)]">Your name</span>
          <input
            ref={nameRef}
            name="name"
            autoComplete="name"
            value={draft.name}
            onChange={(e) => onDraft({ ...draft, name: e.target.value })}
            placeholder="Traveler…"
            className="field"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="t-ui text-[0.75rem] text-[color:var(--text-2)]">Message</span>
          <textarea
            name="message"
            autoComplete="off"
            value={draft.msg}
            onChange={(e) => onDraft({ ...draft, msg: e.target.value })}
            rows={4}
            placeholder="Write your message…"
            className="field resize-none"
          />
        </label>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        <p className="t-body text-[1rem] text-[color:var(--text-2)]">
          Or write directly:{" "}
          <a href={`mailto:${contact.email}`} className="whitespace-nowrap text-[color:var(--sky)] underline underline-offset-4">
            {contact.email}
          </a>
        </p>
        <div className="flex gap-2 sm:justify-end">
          <button type="button" onClick={onClose} className="btn btn-wood flex-1 sm:flex-none">
            Close
          </button>
          <a href={mailto} className="btn flex-1 sm:flex-none" aria-describedby="send-note">
            <PixelIcon name="mail" />
            Send letter
          </a>
        </div>
      </div>
      <p id="send-note" className="t-body mt-3 text-right text-[1rem] text-[color:var(--text-3)]">
        Opens your email app with the letter filled in.
      </p>
    </Modal>
  );
}
