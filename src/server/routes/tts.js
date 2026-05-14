const https = require("node:https");
const { getSession } = require("../auth");
const { readRequestBody, sendJson } = require("../http");

// Two natural ElevenLabs voices for dialogue
const VOICES = [
  "21m00Tcm4TlvDq8ikWAM", // Rachel — calm female (Agent/professional)
  "pNInz6obpgDQGcFmaJgB", // Adam — warm male (Tourist/student)
];

function elevenLabsTTS(text, voiceId) {
  return new Promise((resolve, reject) => {
    if (!process.env.ELEVENLABS_API_KEY) {
      reject(new Error("ELEVENLABS_API_KEY is not set."));
      return;
    }

    const body = JSON.stringify({
      text,
      model_id: "eleven_turbo_v2_5",
      voice_settings: { stability: 0.45, similarity_boost: 0.8, style: 0.3, use_speaker_boost: true },
    });

    const options = {
      hostname: "api.elevenlabs.io",
      path: `/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`,
      method: "POST",
      headers: {
        "xi-api-key": process.env.ELEVENLABS_API_KEY,
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(body),
      },
    };

    const req = https.request(options, (res) => {
      if (res.statusCode !== 200) {
        let errBody = "";
        res.on("data", (d) => { errBody += d; });
        res.on("end", () => reject(new Error(`ElevenLabs error ${res.statusCode}: ${errBody.slice(0, 200)}`)));
        return;
      }
      const chunks = [];
      res.on("data", (chunk) => chunks.push(chunk));
      res.on("end", () => resolve(Buffer.concat(chunks)));
    });

    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

async function handleTtsRoutes({ request, response, parsedUrl }) {
  if (request.method === "POST" && parsedUrl.pathname === "/api/tts") {
    const session = await getSession(request, null); // no storage needed
    // Allow any signed-in user or skip auth for this endpoint
    // (audio is generated from non-sensitive placement question text)

    const body = await readRequestBody(request);
    const text = (body.text || "").toString().trim();
    const voiceIndex = Math.min(Math.max(Number(body.voiceIndex) || 0, 0), 1);

    if (!text) {
      sendJson(response, 400, { error: "text is required." });
      return true;
    }

    if (text.length > 1000) {
      sendJson(response, 400, { error: "text is too long (max 1000 chars)." });
      return true;
    }

    try {
      const audio = await elevenLabsTTS(text, VOICES[voiceIndex]);
      response.writeHead(200, {
        "Content-Type": "audio/mpeg",
        "Content-Length": audio.length,
        "Cache-Control": "public, max-age=3600",
      });
      response.end(audio);
    } catch (error) {
      sendJson(response, 502, { error: error.message });
    }

    return true;
  }

  return false;
}

module.exports = { handleTtsRoutes };
