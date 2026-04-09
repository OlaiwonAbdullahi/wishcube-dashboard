import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "WishCube Celebration Page";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const API_BASE = "https://api.usewishcube.com/api/websites";

const OCCASION_LABEL: Record<string, string> = {
  birthday: "Birthday",
  anniversary: "Anniversary",
  wedding: "Wedding",
  graduation: "Graduation",
  christmas: "Christmas",
  valentine: "Valentine's Day",
  eid: "Eid Celebration",
  new_year: "New Year",
  other: "Celebration",
};

// Inline SVG paths (Hugeicons style) — safe to use in edge ImageResponse
const OCCASION_SVG: Record<string, string> = {
  birthday:
    "M12 2a3 3 0 0 0-3 3v1H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-4V5a3 3 0 0 0-3-3zm0 2a1 1 0 0 1 1 1v1h-2V5a1 1 0 0 1 1-1zm-7 5h14v3H5V9zm0 5h14v7H5v-7z",
  anniversary:
    "M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.069-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z",
  wedding:
    "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z",
  graduation:
    "M22 9L12 5 2 9l10 4 10-4zM12 15.5L5 12.5V17c0 1.1 3.13 2 7 2s7-.9 7-2v-4.5l-7 3z",
  christmas: "M12 2L8 9H3l4 3.5L5.5 19 12 15l6.5 4L17 12.5 21 9h-5L12 2z",
  valentine:
    "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z",
  eid: "M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8zm-1-5h2v2h-2zm0-8h2v6h-2z",
  new_year:
    "M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41M12 7a5 5 0 1 0 5 5 5 5 0 0 0-5-5z",
  other:
    "M12 3l1.5 4.5H18l-3.75 2.75 1.5 4.5L12 12l-3.75 2.75 1.5-4.5L6 7.5h4.5z",
};

// Gift icon SVG path for branding
const GIFT_PATH =
  "M20 12v10H4V12M22 7H2v5h20V7zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z";

function OccasionIcon({
  occasion,
  color,
  size: sz = 24,
}: {
  occasion: string;
  color: string;
  size?: number;
}) {
  const path = OCCASION_SVG[occasion] ?? OCCASION_SVG.other;
  return (
    <svg
      width={sz}
      height={sz}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={path} />
    </svg>
  );
}

function GiftIcon({ color, size: sz = 28 }: { color: string; size?: number }) {
  return (
    <svg
      width={sz}
      height={sz}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={GIFT_PATH} />
    </svg>
  );
}

export default async function OgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let website: {
    recipientName: string;
    occasion: string;
    message?: string;
    primaryColor?: string;
    images?: { url: string }[];
  } | null = null;

  try {
    const res = await fetch(`${API_BASE}/live/${slug}`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const json = await res.json();
      website = json?.data?.website ?? null;
    }
  } catch {}

  const recipientName = website?.recipientName ?? "Someone Special";
  const occasion = website?.occasion?.toLowerCase() ?? "other";
  const label = OCCASION_LABEL[occasion] ?? "Celebration";
  const accent = website?.primaryColor ?? "#6C63FF";
  const coverImage = website?.images?.[0]?.url ?? null;

  const hex2rgb = (h: string) => {
    const hex = h.replace("#", "");
    return {
      r: parseInt(hex.slice(0, 2), 16),
      g: parseInt(hex.slice(2, 4), 16),
      b: parseInt(hex.slice(4, 6), 16),
    };
  };
  const { r, g, b } = hex2rgb(accent);
  const accentLight = `rgba(${r},${g},${b},0.12)`;
  const accentMid = `rgba(${r},${g},${b},0.35)`;

  return new ImageResponse(
    <div
      style={{
        width: 1200,
        height: 630,
        display: "flex",
        fontFamily: "sans-serif",
        background: "#ffffff",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -120,
          right: -120,
          width: 520,
          height: 520,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${accentMid} 0%, transparent 70%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -80,
          left: -80,
          width: 380,
          height: 380,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${accentLight} 0%, transparent 70%)`,
        }}
      />

      {/* Left: cover image */}
      {coverImage && (
        <div
          style={{
            width: 380,
            height: 630,
            flexShrink: 0,
            position: "relative",
            display: "flex",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={coverImage}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(to right, transparent 60%, white 100%)`,
            }}
          />
        </div>
      )}

      {/* Main content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: coverImage ? "56px 80px 56px 48px" : "56px 80px",
          gap: 24,
        }}
      >
        {/* Occasion pill with icon */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: accentLight,
            border: `2px solid ${accentMid}`,
            borderRadius: 999,
            padding: "8px 20px",
            width: "fit-content",
          }}
        >
          <OccasionIcon occasion={occasion} color={accent} size={20} />
          <span
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: accent,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            {label}
          </span>
        </div>

        {/* Headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span
            style={{
              fontSize: 56,
              fontWeight: 900,
              color: "#0f172a",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
            }}
          >
            Happy {label},
          </span>
          <span
            style={{
              fontSize: 64,
              fontWeight: 900,
              color: accent,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
            }}
          >
            {recipientName}!
          </span>
        </div>

        {/* Subtext */}
        <p
          style={{
            fontSize: 20,
            color: "#64748b",
            lineHeight: 1.5,
            margin: 0,
            maxWidth: 480,
          }}
        >
          Someone created a personalised celebration page just for you. Open the
          link to see the surprise!
        </p>

        {/* WishCube branding */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginTop: 8,
          }}
        >
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              background: accent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <GiftIcon color="white" size={24} />
          </div>
          <span
            style={{
              fontSize: 20,
              fontWeight: 800,
              color: "#0f172a",
              letterSpacing: "-0.01em",
            }}
          >
            WishCube
          </span>
          <span style={{ fontSize: 14, color: "#94a3b8", marginLeft: 4 }}>
            · usewishcube.com
          </span>
        </div>
      </div>

      {/* Bottom accent bar */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 6,
          background: `linear-gradient(to right, ${accent}, ${accentMid})`,
        }}
      />
    </div>,
    { ...size },
  );
}
