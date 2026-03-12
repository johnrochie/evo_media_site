import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0f",
          borderRadius: "24px",
        }}
      >
        <span
          style={{
            fontSize: 420,
            fontWeight: 800,
            background: "linear-gradient(135deg, #00d4ff 0%, #ff00aa 50%, #ffb800 100%)",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          E
        </span>
      </div>
    ),
    {
      width: 1080,
      height: 1080,
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    }
  );
}
