import { ImageResponse } from "next/og";
import { getTestBySlug, tests } from "@/data/tests";

export const alt = "Högskoleprovet - Maxa";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Generate static params for all tests (required for static generation)
export function generateStaticParams() {
  return tests.map((test) => ({
    slug: test.slug,
  }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const test = getTestBySlug(slug);

  if (!test) {
    // Fallback for unknown tests
    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#1E1A2D",
            color: "#F5F5F5",
            fontSize: 48,
            fontFamily: "sans-serif",
          }}
        >
          Högskoleprovet - Maxa
        </div>
      ),
      { ...size }
    );
  }

  const seasonLabel = test.season === "vår" ? "Våren" : "Hösten";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#1E1A2D",
          color: "#F5F5F5",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 36,
              opacity: 0.7,
              marginBottom: 16,
            }}
          >
            Högskoleprovet
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 80,
              fontWeight: "bold",
              marginBottom: 24,
            }}
          >
            {seasonLabel} {test.year}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 32,
              opacity: 0.8,
              textAlign: "center",
            }}
          >
            PDF, Facit & Normering
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: 60,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#D4A017",
                color: "#1E1A2D",
                padding: "12px 32px",
                borderRadius: 12,
                fontSize: 28,
                fontWeight: "bold",
              }}
            >
              Maxa
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
