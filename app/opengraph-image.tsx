import { ImageResponse } from "next/og";

export const alt = "Evolution Media | AI-powered web design. Built fast. Built right.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0f",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <span
          style={{
            fontSize: 72,
            fontWeight: 800,
            background: "linear-gradient(135deg, #00d4ff 0%, #ff00aa 50%, #ffb800 100%)",
            backgroundClip: "text",
            color: "transparent",
            marginBottom: 16,
          }}
        >
          Evolution Media
        </span>
        <span style={{ fontSize: 28, color: "#94a3b8" }}>
          AI-powered web design. Built fast. Built right.
        </span>
      </div>
    ),
    { ...size }
  );
}
