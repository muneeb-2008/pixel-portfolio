import type { SVGProps } from "react";

const base = {
  width: 22,
  height: 22,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function HomeIcon(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} aria-hidden {...p}>
      <path d="M4 10.5 12 4l8 6.5" />
      <path d="M6 9.5V20h12V9.5" />
    </svg>
  );
}

export function WorkIcon(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} aria-hidden {...p}>
      <rect x="4" y="4" width="7" height="7" rx="1.5" />
      <rect x="13" y="4" width="7" height="7" rx="1.5" />
      <rect x="4" y="13" width="7" height="7" rx="1.5" />
      <rect x="13" y="13" width="7" height="7" rx="1.5" />
    </svg>
  );
}

export function PlayIcon(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} aria-hidden {...p}>
      <path d="M12 3.5c.6 3.2 1.3 3.9 4.5 4.5-3.2.6-3.9 1.3-4.5 4.5-.6-3.2-1.3-3.9-4.5-4.5 3.2-.6 3.9-1.3 4.5-4.5Z" />
      <path d="M18 14c.3 1.6.7 2 2.3 2.3-1.6.3-2 .7-2.3 2.3-.3-1.6-.7-2-2.3-2.3 1.6-.3 2-.7 2.3-2.3Z" />
    </svg>
  );
}

export function MailIcon(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} aria-hidden {...p}>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
      <path d="m4.5 7 7.5 5.5L19.5 7" />
    </svg>
  );
}

export function ArrowUpRight(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} width={16} height={16} aria-hidden {...p}>
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}

export function ArrowRight(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} width={16} height={16} aria-hidden {...p}>
      <path d="M4 12h15" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

export function ArrowLeft(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} width={16} height={16} aria-hidden {...p}>
      <path d="M20 12H5" />
      <path d="m11 6-6 6 6 6" />
    </svg>
  );
}
