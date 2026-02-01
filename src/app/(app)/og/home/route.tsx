import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request: Request) {
  const origin = new URL(request.url).origin;
  const headshotUrl = new URL("/og/anton-headshot.png", origin);
  const headshot = await fetch(headshotUrl).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "64px",
          color: "#ffffff",
          backgroundImage:
            "linear-gradient(135deg, #003b3b 0%, #004141 55%, #0b5a60 100%)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          boxShadow: "inset 0 0 0 24px rgba(255, 255, 255, 0.03)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "18px",
            maxWidth: "640px",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: "18px",
              letterSpacing: "0.6em",
              textTransform: "uppercase",
              color: "#ffd4d4",
              fontWeight: 600,
            }}
          >
            24letters
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "72px",
              fontWeight: 700,
              lineHeight: 0.95,
              letterSpacing: "-0.02em",
            }}
          >
            Anton Timmermans
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "30px",
              lineHeight: 1.25,
              color: "#f6f1ef",
            }}
          >
            Human-focused software engineer bringing calm to complex projects.
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "22px",
              color: "#ffd4d4",
            }}
          >
            24letters.com
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "360px",
            height: "360px",
            borderRadius: "40px",
            background: "#fd6363",
            padding: "12px",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.35)",
          }}
        >
          <img
            src={headshot}
            width={336}
            height={336}
            style={{ borderRadius: "32px", objectFit: "cover" }}
            alt="Portrait of Anton Timmermans"
          />
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
