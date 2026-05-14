const path = require("node:path");
const fs = require("node:fs/promises");
const crypto = require("node:crypto");
const { getSession } = require("../auth");
const { readRequestBodyBuffer, sendJson } = require("../http");
const { transcribeAudio, analyzeLessonTranscript } = require("../../agents/lesson-analysis");

const uploadsDir = path.join(__dirname, "../../../uploads");

// Accept any audio or video MIME — Whisper handles all common formats.
// iPhone sends audio/x-m4a, audio/mp4 or video/quicktime depending on the app.
function isAcceptedMime(mime) {
  return mime.startsWith("audio/") || mime.startsWith("video/");
}

const MIME_TO_EXT = {
  "audio/webm": "webm",
  "audio/ogg": "ogg",
  "audio/mp4": "m4a",
  "audio/m4a": "m4a",
  "audio/x-m4a": "m4a",
  "audio/aac": "m4a",
  "audio/mpeg": "mp3",
  "audio/mp3": "mp3",
  "audio/wav": "wav",
  "audio/x-wav": "wav",
  "video/webm": "webm",
  "video/mp4": "mp4",
  "video/quicktime": "mp4",
};

async function handleRecordingRoutes({ request, response, parsedUrl, storage }) {
  if (request.method === "POST" && parsedUrl.pathname === "/api/recordings") {
    const session = await getSession(request, storage);

    if (!session) {
      sendJson(response, 401, { error: "Not signed in." });
      return true;
    }

    if (session.user.role !== "student") {
      sendJson(response, 403, { error: "Only students can upload recordings." });
      return true;
    }

    const mimeType = (request.headers["content-type"] || "audio/webm").split(";")[0].trim();

    if (!isAcceptedMime(mimeType)) {
      sendJson(response, 400, { error: `Unsupported format: ${mimeType}. Please upload an audio or video file.` });
      return true;
    }

    const ext = MIME_TO_EXT[mimeType] || "webm";
    const id = crypto.randomUUID();
    const filename = `${id}.${ext}`;
    const filePath = path.join(uploadsDir, filename);

    let buffer;
    try {
      buffer = await readRequestBodyBuffer(request);
    } catch (error) {
      sendJson(response, 400, { error: error.message });
      return true;
    }

    if (buffer.length === 0) {
      sendJson(response, 400, { error: "Empty audio file received." });
      return true;
    }

    await fs.writeFile(filePath, buffer);

    const recording = await storage.createLessonRecording({
      studentId: session.user.id,
      audioPath: filename,
      audioMime: mimeType,
      fileSizeBytes: buffer.length,
    });

    // Transcribe and analyze asynchronously — respond immediately with recordingId
    // so the frontend can poll or show progress
    sendJson(response, 202, { recordingId: recording.id, status: "uploaded" });

    // Run transcription + analysis in background
    processRecording({ recording, session, storage, filePath }).catch((err) => {
      console.error(`[recordings] processing failed for ${recording.id}:`, err.message);
      storage.updateLessonRecording(recording.id, { processingStatus: "failed" }).catch(() => {});
    });

    return true;
  }

  if (request.method === "GET" && parsedUrl.pathname.startsWith("/api/recordings/")) {
    const session = await getSession(request, storage);

    if (!session) {
      sendJson(response, 401, { error: "Not signed in." });
      return true;
    }

    const recordingId = parsedUrl.pathname.slice("/api/recordings/".length);
    const recording = await storage.getLessonRecording(recordingId);

    if (!recording || recording.studentId !== session.user.id) {
      sendJson(response, 404, { error: "Recording not found." });
      return true;
    }

    sendJson(response, 200, recording);
    return true;
  }

  return false;
}

async function processRecording({ recording, session, storage, filePath }) {
  await storage.updateLessonRecording(recording.id, { processingStatus: "transcribing" });

  const transcript = await transcribeAudio(filePath, recording.audioMime);

  await storage.updateLessonRecording(recording.id, {
    transcript,
    processingStatus: "analyzing",
  });

  const teacherProfile = await storage.getTeacherForStudent(session.user.id);
  const analysis = await analyzeLessonTranscript({
    transcript,
    studentProfile: session.profile,
    teacherProfile,
  });

  await storage.saveRecordingAnalysis(recording.id, session.user.id, analysis);
  await storage.updateLessonRecording(recording.id, { processingStatus: "analyzed" });
}

module.exports = { handleRecordingRoutes };
