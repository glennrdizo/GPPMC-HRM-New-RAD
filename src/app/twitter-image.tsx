import { ImageResponse } from "next/og"

export const alt = "GD Prime HRM - the HRM platform of GD Prime Property Management Corporation"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

// Link preview card: royal blue with a gold frame and title.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", padding: 40, background: "linear-gradient(135deg, #081a4a 0%, #13307f 55%, #1d3fae 100%)" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "56px 64px", border: "2px solid rgba(212,175,55,0.7)", borderRadius: 28 }}>
          <div style={{ display: "flex", fontSize: 26, letterSpacing: 6, color: "#f0d78c", textTransform: "uppercase", fontWeight: 700 }}>GD Prime Property Management Corporation</div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 92, fontWeight: 700, color: "#ffffff", lineHeight: 1.05 }}>GD Prime HRM</div>
            <div style={{ display: "flex", width: 160, height: 4, marginTop: 28, background: "linear-gradient(90deg, #d4af37, #f0d78c)" }} />
            <div style={{ display: "flex", marginTop: 28, fontSize: 36, color: "#dfe6f8" }}>28 modules. One record of truth.</div>
          </div>
          <div style={{ display: "flex", fontSize: 24, color: "#c8d3ef" }}>Core HR · Talent · Time and pay · Relations · Field · Governance</div>
        </div>
      </div>
    ),
    size,
  )
}
