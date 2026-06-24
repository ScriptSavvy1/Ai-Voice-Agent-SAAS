import { NextResponse } from "next/server";

export async function GET() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const script = `
(function() {
  window.VoiceAgent = {
    init: function(config) {
      if (!config.businessId) { console.error("VoiceAgent: businessId is required"); return; }
      var iframe = document.createElement("iframe");
      iframe.src = "${appUrl}/widget-demo?businessId=" + config.businessId + "&position=" + (config.position || "bottom-right") + "&language=" + (config.language || "so") + "&embedded=true";
      iframe.style.cssText = "position:fixed;bottom:0;right:0;width:400px;height:600px;border:none;z-index:99999;background:transparent;pointer-events:none;";
      iframe.allow = "microphone";
      iframe.id = "voiceagent-widget";
      document.body.appendChild(iframe);
      window.addEventListener("message", function(e) {
        if (e.data.type === "voiceagent-resize") {
          iframe.style.width = e.data.width + "px";
          iframe.style.height = e.data.height + "px";
          iframe.style.pointerEvents = e.data.interactive ? "auto" : "none";
        }
      });
    }
  };
})();
`;

  return new NextResponse(script, {
    headers: {
      "Content-Type": "application/javascript",
      "Cache-Control": "public, max-age=3600",
    },
  });
}