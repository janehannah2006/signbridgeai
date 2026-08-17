import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini if key is provided
  let ai: GoogleGenAI | null = null;
  if (process.env.GEMINI_API_KEY) {
    try {
      ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    } catch (e) {
      console.warn("Failed to initialize GoogleGenAI with provided key:", e);
    }
  }

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      service: "SignBridge AI",
      hasGeminiKey: !!process.env.GEMINI_API_KEY,
      timestamp: new Date().toISOString(),
    });
  });

  // AI Medical Instruction Extraction & Speech Processing Endpoint
  app.post("/api/ai/process-speech", async (req, res) => {
    const { text, targetLanguage = "en" } = req.body;

    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "Text is required" });
    }

    // Check for unclear speech indicators
    const isUnclear =
      text.toLowerCase().includes("[unclear]") ||
      text.toLowerCase().includes("...") ||
      text.trim().length < 4 ||
      text.toLowerCase().includes("muffled") ||
      text.toLowerCase().includes("inaudible");

    if (isUnclear) {
      return res.json({
        type: "warnings",
        text,
        confidence: 0.62,
        isUnclear: true,
        warning: "Some of this statement was unclear. Please confirm with your doctor.",
        extractedInstruction: {
          category: "warnings",
          text: "Part of the statement was unclear. Verify exact instructions directly with doctor.",
          tamilText: "மருத்துவரின் பேச்சில் சில பகுதி தெளிவாக இல்லை. மருத்துவரிடம் நேரடியாக உறுதிப்படுத்தவும்.",
          status: "needs_confirmation",
          confidence: 0.62,
        },
        translationTamil: "இந்த பேச்சின் சில பகுதி தெளிவாக இல்லை. தயவுசெய்து உங்கள் மருத்துவரிடம் உறுதிப்படுத்தவும்.",
      });
    }

    // Try Gemini if available
    if (ai) {
      try {
        const prompt = `You are the SignBridge AI Accessibility Engine for deaf patients during medical consultations.
Analyze this doctor statement: "${text}"

SAFETY RULES:
1. Never invent medicine names, dosages, diagnoses, or instructions not explicitly stated.
2. If the statement contains a prescription, follow-up, test, lifestyle tip, or warning, extract it faithfully.
3. Provide accurate Tamil translation of the instruction and the full statement.

Return valid JSON in this exact structure:
{
  "category": "medication" | "follow-up" | "tests" | "lifestyle" | "appointments" | "warnings" | "general",
  "instruction": "Brief exact instruction from doctor, or empty string if none",
  "confidence": 0.96,
  "status": "confirmed" | "needs_confirmation",
  "translationTamil": "Tamil translation of the instruction",
  "tamilCaption": "Accurate Tamil translation of the entire doctor utterance"
}`;

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            temperature: 0.1,
          },
        });

        if (response.text) {
          const parsed = JSON.parse(response.text.trim());
          return res.json({
            type: parsed.category || "general",
            text,
            confidence: parsed.confidence || 0.96,
            isUnclear: false,
            warning: null,
            extractedInstruction: parsed.instruction ? {
              category: parsed.category || "general",
              text: parsed.instruction,
              status: parsed.status || "confirmed",
              confidence: parsed.confidence || 0.96,
              tamilText: parsed.translationTamil,
            } : null,
            translationTamil: parsed.tamilCaption,
          });
        }
      } catch (err) {
        console.warn("Gemini processing fallback to rule-based parser:", err);
      }
    }

    // Deterministic Rule-Based Fallback
    const lower = text.toLowerCase();
    let category: string = "general";
    let status: "confirmed" | "needs_confirmation" = "confirmed";
    let extractedText = "";

    if (lower.includes("tablet") || lower.includes("medication") || lower.includes("medicine") || lower.includes("dose") || lower.includes("take") || lower.includes("paracetamol")) {
      category = "medication";
      extractedText = text;
    } else if (lower.includes("follow-up") || lower.includes("review") || lower.includes("next week") || lower.includes("days") || lower.includes("visit")) {
      category = "follow-up";
      extractedText = text;
    } else if (lower.includes("test") || lower.includes("blood") || lower.includes("scan") || lower.includes("x-ray") || lower.includes("report")) {
      category = "tests";
      extractedText = text;
    } else if (lower.includes("water") || lower.includes("diet") || lower.includes("rest") || lower.includes("exercise") || lower.includes("avoid")) {
      category = "lifestyle";
      extractedText = text;
    } else if (lower.includes("appointment") || lower.includes("schedule") || lower.includes("book")) {
      category = "appointments";
      extractedText = text;
    } else if (lower.includes("emergency") || lower.includes("immediately") || lower.includes("allergic") || lower.includes("stop")) {
      category = "warnings";
      status = "needs_confirmation";
      extractedText = text;
    }

    return res.json({
      type: category,
      text,
      confidence: 0.95,
      isUnclear: false,
      warning: null,
      extractedInstruction: extractedText ? {
        category,
        text: extractedText,
        status,
        confidence: 0.95,
      } : null,
    });
  });

  // AI Patient-Doctor Chat & Medical Consultation Assistant
  app.post("/api/ai/chat", async (req, res) => {
    const { message, language = "en", history = [], patientProfile = null } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required" });
    }

    // Emergency red flags detector
    const lower = message.toLowerCase();
    const isEmergency =
      lower.includes("chest pain") ||
      lower.includes("difficulty breathing") ||
      lower.includes("breathless") ||
      lower.includes("severe bleeding") ||
      lower.includes("நெஞ்சு வலி") ||
      lower.includes("மூச்சு திணறல்") ||
      lower.includes("சுவாசிக்க முடியவில்லை");

    if (ai) {
      try {
        const profileContext = patientProfile ? `
Patient Profile:
- Name: ${patientProfile.name || 'Meena'}
- Allergies: ${(patientProfile.allergies || []).join(', ') || 'None recorded'}
- Known Conditions: ${(patientProfile.conditions || []).join(', ') || 'None'}
` : '';

        const historyContext = history.slice(-4).map((h: any) => `${h.sender}: ${h.text}`).join('\n');

        const prompt = `You are Dr. Ananya Sharma (and SignBridge AI Clinical Assistant), consulting a deaf patient via an accessible text chat.
${profileContext}
Recent conversation history:
${historyContext}

The patient sent this message: "${message}" (in language: ${language}).

INSTRUCTIONS:
1. Respond with a caring, clear, professional clinical doctor response. Keep sentences short and easy to read.
2. If patient asked in Tamil or English, provide BOTH the English response and the accurate Tamil translation.
3. If this is an emergency symptom (e.g., severe chest pain, inability to breathe), advise immediate emergency emergency services (108 / 911 / nearest emergency room).
4. SAFETY: Never invent specific prescription dosages without instructing verification. Always include supportive guidance.

Return valid JSON in this exact structure:
{
  "replyEn": "Doctor response in clear English",
  "replyTa": "Doctor response in clear Tamil (தமிழ்)",
  "isEmergency": ${isEmergency},
  "extractedInstruction": {
    "category": "medication" | "follow-up" | "tests" | "lifestyle" | "warnings" | "general" | null,
    "text": "Any clear clinical advice or prescription instruction given, or null",
    "tamilText": "Tamil version of the advice, or null"
  }
}`;

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            temperature: 0.2,
          },
        });

        if (response.text) {
          const parsed = JSON.parse(response.text.trim());
          return res.json({
            replyEn: parsed.replyEn || "I understand. Please let me know how long you have had this symptom.",
            replyTa: parsed.replyTa || "நான் புரிந்துகொள்கிறேன். இந்த அறிகுறி எத்தனை நாட்களாக உள்ளது என்று தயவுசெய்து கூறவும்.",
            isEmergency: parsed.isEmergency || isEmergency,
            extractedInstruction: parsed.extractedInstruction?.text ? {
              category: parsed.extractedInstruction.category || "general",
              text: parsed.extractedInstruction.text,
              tamilText: parsed.extractedInstruction.tamilText,
              status: "confirmed",
              confidence: 0.97,
            } : null,
          });
        }
      } catch (err) {
        console.warn("Gemini chat error, fallback to clinical rule engine:", err);
      }
    }

    // Clinical rule fallback
    let replyEn = "Thank you for sharing your symptoms. Please monitor your condition closely, stay hydrated, and rest.";
    let replyTa = "உங்கள் அறிகுறிகளைப் பகிர்ந்ததற்கு நன்றி. உங்கள் உடல்நிலையைக் கவனித்து, போதுமான நீர் அருந்தி ஓய்வெடுக்கவும்.";
    let extractedInstruction = null;

    if (isEmergency) {
      replyEn = "EMERGENCY ADVICE: Please contact emergency medical services immediately or visit the nearest emergency room.";
      replyTa = "அவசர ஆலோசனை: உடனடியாக அவசர மருத்துவ சேவையைத் தொடர்பு கொள்ளவும் அல்லது அருகிலுள்ள அவசர சிகிச்சைப் பிரிவுக்குச் செல்லவும்.";
    } else if (lower.includes("headache") || lower.includes("தலைவலி")) {
      replyEn = "For your headache, please drink warm water and rest in a quiet room. If it persists, take Paracetamol 500mg after food.";
      replyTa = "உங்கள் தலைவலிக்கு வெதுவெதுப்பான நீர் அருந்தி அமைதியான அறையில் ஓய்வெடுக்கவும். தொடர்ந்தால் உணவுக்குப் பின் பாராசிட்டமால் 500 மி.கி உட்கொள்ளவும்.";
      extractedInstruction = {
        category: "medication",
        text: "Rest in a quiet room and drink warm water. Paracetamol 500mg if headache persists.",
        tamilText: "அமைதியான அறையில் ஓய்வெடுக்கவும். தலைவலி தொடர்ந்தால் பாராசிட்டமால் 500 மி.கி உட்கொள்ளவும்.",
        status: "confirmed",
        confidence: 0.95,
      };
    } else if (lower.includes("fever") || lower.includes("காய்ச்சல்")) {
      replyEn = "Please check your temperature with a thermometer. Stay well hydrated and keep a cool cloth on your forehead.";
      replyTa = "தயவுசெய்து உங்கள் உடல் வெப்பநிலையை அளவிடவும். நிறைய தண்ணீர் குடிக்கவும், நெற்றியில் குளிர்ந்த துணியை வைக்கவும்.";
      extractedInstruction = {
        category: "lifestyle",
        text: "Check body temperature every 4 hours and stay hydrated.",
        tamilText: "4 மணி நேரத்திற்கு ஒருமுறை உடல் வெப்பநிலையை அளவிடவும், நிறைய தண்ணீர் குடிக்கவும்.",
        status: "confirmed",
        confidence: 0.94,
      };
    } else if (lower.includes("pain") || lower.includes("வலி")) {
      replyEn = "I note your pain symptom. Please apply a warm compress gently and avoid heavy physical exertion.";
      replyTa = "உங்கள் வலி பற்றிய விவரத்தைப் பதிவு செய்துள்ளேன். லேசான வெதுவெதுப்பான ஒத்தடம் கொடுக்கவும், கடினமான உடற்பயிற்சிகளைத் தவிர்க்கவும்.";
    } else if (lower.includes("tablet") || lower.includes("medicine") || lower.includes("மருந்து")) {
      replyEn = "Please take your prescribed tablets only after having food, with a full glass of water.";
      replyTa = "மருந்துகளை உணவுக்குப் பிறகு ஒரு டம்ளர் தண்ணீருடன் உட்கொள்ளவும்.";
    }

    return res.json({
      replyEn,
      replyTa,
      isEmergency,
      extractedInstruction,
    });
  });

  // Direct Translation Endpoint (Tamil ↔ English)
  app.post("/api/ai/translate", async (req, res) => {
    const { text, sourceLang = "auto", targetLang = "ta" } = req.body;

    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "Text is required" });
    }

    if (ai) {
      try {
        const prompt = `Translate the following clinical or consultation text into ${targetLang === "ta" ? "Tamil (தமிழ்)" : "English"}.
Source text: "${text}"

Rules:
1. Maintain accurate medical terminology and clear conversational grammar.
2. Return ONLY the translated string without extra quotes or formatting.`;

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
          config: {
            temperature: 0.1,
          },
        });

        if (response.text) {
          return res.json({
            translatedText: response.text.trim(),
            sourceLang,
            targetLang,
          });
        }
      } catch (err) {
        console.warn("Translation API error, using fallback:", err);
      }
    }

    // Basic dictionary fallback
    const dict: Record<string, string> = {
      "hello": "வணக்கம்",
      "doctor": "மருத்துவர்",
      "medicine": "மருந்து",
      "headache": "தலைவலி",
      "fever": "காய்ச்சல்",
      "pain": "வலி",
      "yes": "ஆம்",
      "no": "இல்லை",
      "thank you": "நன்றி",
    };

    const lower = text.toLowerCase().trim();
    const translated = dict[lower] || text;

    return res.json({
      translatedText: translated,
      sourceLang,
      targetLang,
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SignBridge AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
