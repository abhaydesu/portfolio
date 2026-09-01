import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Abhay Singh — Full Stack Web Developer";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          backgroundColor: "#080605",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            fontSize: "20px",
            color: "#f9a8d4",
            letterSpacing: "2px",
            textTransform: "uppercase",
          }}
        >
          <span>abhaydesu.dev</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div
            style={{
              fontSize: "64px",
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: "-2px",
              lineHeight: 1.1,
            }}
          >
            Abhay Singh
          </div>
          <div
            style={{
              fontSize: "28px",
              color: "#a3a3a3",
              maxWidth: "800px",
              lineHeight: 1.4,
            }}
          >
            Full Stack Web Developer & Designer · Sweating the details & minimal micro-interactions
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "24px",
            fontSize: "18px",
            color: "#737373",
          }}
        >
          <span>Next.js</span>
          <span>·</span>
          <span>React</span>
          <span>·</span>
          <span>TypeScript</span>
          <span>·</span>
          <span>TailwindCSS</span>
          <span>·</span>
          <span>Three.js</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
