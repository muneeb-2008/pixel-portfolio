"use client";

import { useEffect, useRef, useState } from "react";
import { contact } from "@/game/data/contact";
import { play } from "@/game/audio";
import { Modal } from "./Modal";
import { PixelIcon } from "./PixelIcon";
import { useInputModeValue } from "./inputMode";

export type LetterDraft = { name: string; email: string; msg: string };

/**
 * Messages are delivered straight to Muneeb's inbox through FormSubmit
 * (a no-backend form-to-email relay that works on a static GitHub Pages site).
 * The visitor's address is set as reply-to, so a reply goes right back to them.
 * NOTE: FormSubmit asks the inbox owner to confirm the address once — the very
 * first submission triggers an activation email to contact.email.
 */
const ENDPOINT = `https://formsubmit.co/ajax/${contact.email}`;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Status = "idle" | "sending" | "sent" | "error";

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
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  // desktop only: jump straight into the first field (no surprise keyboard on phones)
  useEffect(() => {
    if (mode === "keyboard") {
      const id = window.setTimeout(() => nameRef.current?.focus(), 60);
      return () => window.clearTimeout(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    const name = draft.name.trim();
    const email = draft.email.trim();
    const msg = draft.msg.trim();
    if (!EMAIL_RE.test(email)) {
      setError("Please enter a valid email so Muneeb can reply — e.g. name@company.com.");
      return;
    }
    if (msg.length < 2) {
      setError("Your letter is empty — write a short message first.");
      return;
    }
    setError("");
    setStatus("sending");
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: name || "A visitor",
          email,
          message: msg,
          _replyto: email,
          _subject: `Portfolio message from ${name || email}`,
          _template: "table",
          _captcha: "false",
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { success?: string | boolean };
      if (!res.ok || String(data.success) === "false") throw new Error("send failed");
      setStatus("sent");
      play("achieve");
      onDraft({ name: "", email: "", msg: "" });
    } catch {
      setStatus("error");
      play("back");
    }
  };

  const mailto = `mailto:${contact.email}?subject=${encodeURIComponent(
    `Hello from ${draft.name || "a visitor"}`,
  )}&body=${encodeURIComponent(draft.msg)}`;

  return (
    <Modal title="The Exit" onClose={onClose} width="max-w-lg">
      <div className="flex flex-col gap-1.5">
        {contact.lines.map((l) => (
          <p key={l} className="t-body text-[1rem] leading-relaxed text-[color:var(--text-2)]">
            {l}
          </p>
        ))}
      </div>
      <h3 className="t-display mt-4 text-[30px] text-[color:var(--gold)]">{contact.heading}</h3>

      {status === "sent" ? (
        <div className="well pop mt-5 px-3 py-4 text-center" role="status">
          <span className="mx-auto grid h-12 w-12 place-items-center text-[color:var(--moss)]" aria-hidden>
            <PixelIcon name="mail" px={4} />
          </span>
          <p className="t-ui mt-2 text-[0.875rem] font-bold text-[color:var(--moss)]">Letter delivered!</p>
          <p className="t-body mt-1 text-[1rem] text-[color:var(--text-2)]">Muneeb will reply to your email soon.</p>
          <div className="mt-4 flex justify-center gap-2">
            <button type="button" onClick={() => setStatus("idle")} className="btn btn-wood">
              Write another
            </button>
            <button type="button" onClick={onClose} className="btn">
              Back to town
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={send} noValidate className="mt-5 flex flex-col gap-4">
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
            <span className="t-ui text-[0.75rem] text-[color:var(--text-2)]">Your email · so Muneeb can reply</span>
            <input
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              spellCheck={false}
              required
              value={draft.email}
              onChange={(e) => onDraft({ ...draft, email: e.target.value })}
              placeholder="name@company.com…"
              className="field"
              aria-invalid={!!error && !EMAIL_RE.test(draft.email.trim())}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="t-ui text-[0.75rem] text-[color:var(--text-2)]">Message</span>
            <textarea
              name="message"
              autoComplete="off"
              required
              value={draft.msg}
              onChange={(e) => onDraft({ ...draft, msg: e.target.value })}
              rows={4}
              placeholder="Tell me about your product, website or idea…"
              className="field resize-none"
            />
          </label>

          {error && (
            <p className="t-body text-[1rem] text-[color:var(--ember)]" role="alert">
              {error}
            </p>
          )}
          {status === "error" && (
            <p className="t-body text-[1rem] text-[color:var(--ember)]" role="alert">
              The letter couldn&apos;t be sent right now.{" "}
              <a href={mailto} className="underline underline-offset-4">
                Send it from your email app instead
              </a>
              .
            </p>
          )}

          <div className="flex flex-col gap-3">
            <p className="t-body text-[1rem] text-[color:var(--text-2)]">
              Or write directly:{" "}
              <a href={`mailto:${contact.email}`} className="whitespace-nowrap text-[color:var(--sky)] underline underline-offset-4">
                {contact.email}
              </a>
            </p>
            <p className="t-body -mt-1 flex flex-wrap gap-x-4 text-[1rem]">
              {contact.links.map((l) => (
                <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" className="text-[color:var(--sky)] underline underline-offset-4">
                  {l.label}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              ))}
            </p>
            <div className="flex gap-2 sm:justify-end">
              <button type="button" onClick={onClose} className="btn btn-wood flex-1 sm:flex-none">
                Close
              </button>
              <button type="submit" className="btn flex-1 sm:flex-none" disabled={status === "sending"}>
                <PixelIcon name="mail" />
                {status === "sending" ? "Sending…" : "Send letter"}
              </button>
            </div>
          </div>
        </form>
      )}
    </Modal>
  );
}
