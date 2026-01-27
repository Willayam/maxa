import { ImageResponse } from "next/og";

export const alt = "HP Strategier - Maxa";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
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
            HP Strategier
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 32,
              opacity: 0.8,
              textAlign: "center",
            }}
          >
            Knäck högskoleprovet med rätt teknik
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
