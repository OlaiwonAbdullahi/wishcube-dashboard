import { Metadata } from "next";

const API_BASE = "https://api.usewishcube.com/api/websites";

interface WebsitePreview {
  recipientName: string;
  occasion: string;
  message?: string;
  primaryColor?: string;
  images?: { url: string }[];
}

async function fetchWebsitePreview(
  slug: string,
): Promise<WebsitePreview | null> {
  try {
    const res = await fetch(`${API_BASE}/live/${slug}`, {
      next: { revalidate: 60 }, // cache for 60s
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data?.website ?? null;
  } catch {
    return null;
  }
}

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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const website = await fetchWebsitePreview(slug);

  if (!website) {
    return {
      title: "WishCube — A celebration page",
      description:
        "Someone created a special celebration page for you on WishCube.",
    };
  }

  const occasion =
    OCCASION_LABEL[website.occasion?.toLowerCase()] ?? "Celebration";
  const title = `Happy ${occasion}, ${website.recipientName}!`;
  const description = `You've received a personalised ${occasion.toLowerCase()} page from someone special. Open it to see the surprise!`;

  const pageUrl = `https://app.usewishcube.com/w/${slug}`;

  return {
    title,
    description,
    metadataBase: new URL("https://app.usewishcube.com"),
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: "WishCube",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      site: "@usewishcube",
    },
  };
}

export default function SlugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
