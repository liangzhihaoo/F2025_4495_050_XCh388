import React from "react";

type IconProps = React.SVGProps<SVGSVGElement> & { size?: number };

const Base = ({ children, size = 20, ...rest }: IconProps & { children: React.ReactNode }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...rest}
  >
    {children}
  </svg>
);

// nav icons
export const IcOverview = (p: IconProps) => (
  <Base {...p}><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></Base>
);
export const IcUsers = (p: IconProps) => (
  <Base {...p}><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></Base>
);
export const IcUpload = (p: IconProps) => (
  <Base {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></Base>
);
export const IcFunnel = (p: IconProps) => (
  <Base {...p}><path d="M3 4h18l-7 8v6l-4 2v-8L3 4z" /></Base>
);
export const IcQuotes = (p: IconProps) => (
  <Base {...p}><path d="M7 7h6v6H7z" /><path d="M11 13c0 2-1 4-3 4" /><path d="M17 7h4v6h-4z" /><path d="M21 13c0 2-1 4-3 4" /></Base>
);
export const IcBilling = (p: IconProps) => (
  <Base {...p}><rect x="3" y="5" width="18" height="14" rx="2" /><line x1="3" y1="10" x2="21" y2="10" /></Base>
);
export const IcUsage = (p: IconProps) => (
  <Base {...p}><path d="M3 17h3v4H3zM9 13h3v8H9zM15 9h3v12h-3z" /></Base>
);
export const IcAlerts = (p: IconProps) => (
  <Base {...p}><path d="M18 8a6 6 0 10-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" /></Base>
);

// top bar icons
export const IcSearch = (p: IconProps) => (
  <Base {...p}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></Base>
);
export const IcBell = (p: IconProps) => (
  <Base {...p}><path d="M10 21h4" /><path d="M18 8a6 6 0 10-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /></Base>
);
export const IcChevronDown = (p: IconProps) => (
  <Base {...p}><polyline points="6 9 12 15 18 9" /></Base>
);
