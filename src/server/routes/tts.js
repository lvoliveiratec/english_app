const https = require("node:https");
const { readRequestBody, sendJson } = require("../http");

// Two natural ElevenLabs voices for dialogue
const VOICES = [
  process.env.ELEVENLABS_VOICE_AGENT_ID || "EXAVITQu4vr4xnSDxMaL", // Sarah
  process.env.ELEVENLABS_VOICE_STUDENT_ID || "onwK4e9ZLuTAKqWW03F9", // Daniel
  process.env.ELEVENLABS_VOICE_NARRATOR_ID || process.env.ELEVENLABS_VOICE_AGENT_ID || "EXAVITQu4vr4xnSDxMaL",
];
const MODEL_ID = process.env.ELEVENLABS_MODEL_ID || "eleven_multilingual_v2";

function elevenLabsTTS(text, voiceId) {
  return new Promise((resolve, reject) => {
    if (!process.env.ELEVENLABS_API_KEY) {
      reject(new Error("ELEVENLABS_API_KEY is not set."));
      return;
    }

    const body = JSON.stringify({
      text,
      model_id: MODEL_ID,
      language_code: "en",
      voice_settings: {
        stability: 0.28,
        similarity_boost: 0.9,
        style: 0.68,
        use_speaker_boost: true,
        speed: 0.92,
      },
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

async function ttsWithFallback(text, preferredIndex) {
  const orderedVoiceIds = [
    VOICES[preferredIndex],
    ...VOICES.filter((voiceId, index) => index !== preferredIndex && voiceId),
  ];
  let lastError;

  for (const voiceId of orderedVoiceIds) {
    try {
      return await elevenLabsTTS(text, voiceId);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
}

async function handleTtsRoutes({ request, response, parsedUrl }) {
  if (
    (request.method === "POST" || request.method === "GET") &&
    parsedUrl.pathname === "/api/tts"
  ) {
    const body = request.method === "POST" ? await readRequestBody(request) : {};
    const text = (body.text || "").toString().trim();
    const queryText = (parsedUrl.searchParams.get("text") || "").toString().trim();
    const selectedText = text || queryText;
    const requestedVoiceIndex = body.voiceIndex ?? parsedUrl.searchParams.get("voiceIndex");
    const voiceIndex = Math.min(Math.max(Number(requestedVoiceIndex) || 0, 0), VOICES.length - 1);

    if (!selectedText) {
      sendJson(response, 400, { error: "text is required." });
      return true;
    }

    if (selectedText.length > 1000) {
      sendJson(response, 400, { error: "text is too long (max 1000 chars)." });
      return true;
    }

    try {
      const audio = await ttsWithFallback(selectedText, voiceIndex);
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
