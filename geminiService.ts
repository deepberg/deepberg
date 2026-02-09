
import { GoogleGenAI, GenerateContentResponse, Type, Modality, LiveServerMessage, Blob } from "@google/genai";
import { AIModelType } from "../types";

// Manual base64 decoding implementation as per guidelines
export function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Manual base64 encoding implementation as per guidelines
export function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// PCM audio decoding for Live API and TTS
export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export class GeminiService {
  private chatSessions: Map<string, any> = new Map();

  // Unified text generation method supporting Search, Maps, and Thinking config
  async generateText(
    prompt: string, 
    useSearch: boolean = false, 
    useMaps: boolean = false,
    location?: { latitude: number, longitude: number },
    mode: 'LITE' | 'TURBO' | 'BRAIN' | 'THINKING' = 'BRAIN',
    systemInstruction?: string,
    sessionId?: string,
    media?: { data: string; mimeType: string }[]
  ): Promise<{ text: string; sources?: any[] }> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    let modelName: string;
    switch(mode) {
      case 'LITE': modelName = AIModelType.CHAT_LITE; break;
      case 'TURBO': modelName = AIModelType.CHAT_FLASH; break;
      case 'THINKING':
      case 'BRAIN': 
      default: modelName = AIModelType.CHAT_PRO; break;
    }
    
    if (useMaps) modelName = AIModelType.CHAT_MAPS;

    const config: any = {
      systemInstruction: systemInstruction || "You are Deepberg AI, a state-of-the-art creative intelligence platform."
    };

    if (mode === 'THINKING') {
      config.thinkingConfig = { thinkingBudget: 32768 };
      // Requirement: Avoid setting maxOutputTokens unless a specific budget is set.
    }

    if (useSearch) config.tools = [{ googleSearch: {} }];
    if (useMaps) config.tools = [{ googleMaps: {} }];
    if (useMaps && location) {
      config.toolConfig = { retrievalConfig: { latLng: location } };
    }

    const contents: any[] = [];
    if (media && media.length > 0) {
      const parts = media.map(m => ({ inlineData: { data: m.data, mimeType: m.mimeType } }));
      parts.push({ text: prompt } as any);
      contents.push({ parts });
    } else {
      contents.push({ parts: [{ text: prompt }] });
    }
    
    if (sessionId) {
      if (!this.chatSessions.has(sessionId)) {
        this.chatSessions.set(sessionId, ai.chats.create({ model: modelName, config }));
      }
      const chat = this.chatSessions.get(sessionId);
      // chat.sendMessage only accepts the message parameter as per SDK rules
      const response = await chat.sendMessage({ message: prompt });
      return this.processResponse(response);
    }

    const response = await ai.models.generateContent({
      model: modelName,
      contents: contents[0],
      config
    });

    return this.processResponse(response);
  }

  // Extract grounding metadata and text from GenerateContentResponse
  private processResponse(response: GenerateContentResponse) {
    const sources: any[] = [];
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (groundingChunks) {
      groundingChunks.forEach((chunk: any) => {
        if (chunk.web) sources.push({ title: chunk.web.title, uri: chunk.web.uri });
        if (chunk.maps) sources.push({ title: chunk.maps.title || "Location", uri: chunk.maps.uri });
      });
    }
    // Using .text property directly as per extracts from GenerateContentResponse guidelines
    return { text: response.text || "No response.", sources };
  }

  // Image generation with support for Pro and Flash models
  async generateImage(prompt: string, isPro: boolean = true, aspectRatio: string = "1:1", imageSize: "1K" | "2K" | "4K" = "1K"): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const config: any = {
      imageConfig: { aspectRatio: aspectRatio as any }
    };
    if (isPro) config.imageConfig.imageSize = imageSize;

    const response = await ai.models.generateContent({
      model: isPro ? AIModelType.IMAGE_PRO : AIModelType.IMAGE_FLASH,
      contents: { parts: [{ text: prompt }] },
      config
    });

    // Iterate parts to find the image part
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    }
    throw new Error("Failed to generate image");
  }

  // Video generation using Veo operations
  async generateVideo(prompt: string, aspectRatio: '16:9' | '9:16' = '16:9', onProgress?: (msg: string) => void): Promise<string> {
    if (!(await (window as any).aistudio?.hasSelectedApiKey())) {
      await (window as any).aistudio?.openSelectKey();
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    onProgress?.("Contacting Veo 3.1 Fast engine...");
    
    let operation = await ai.models.generateVideos({
      model: AIModelType.VIDEO_VEO,
      prompt,
      config: { numberOfVideos: 1, resolution: '720p', aspectRatio }
    });

    while (!operation.done) {
      await new Promise(r => setTimeout(r, 8000));
      operation = await ai.operations.getVideosOperation({ operation });
      onProgress?.("Veo is synthesizing your vision...");
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  }

  // Audio transcription leveraging multimodal Gemini Flash
  async transcribeAudio(audioBase64: string): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: AIModelType.CHAT_FLASH,
      contents: {
        parts: [
          { inlineData: { data: audioBase64, mimeType: 'audio/wav' } },
          { text: "Transcribe this audio accurately. If there is no speech, say 'No speech detected'." }
        ]
      }
    });
    return response.text || "Transcription failed.";
  }

  // Text-to-speech synthesis using responseModalities: [Modality.AUDIO]
  async generateSpeech(text: string, voice: string = 'Kore'): Promise<AudioBuffer> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: AIModelType.AUDIO_TTS,
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } },
        },
      },
    });
    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    return await decodeAudioData(decode(base64Audio), audioCtx, 24000, 1);
  }

  // Session establishment for low-latency Live API interaction
  createLiveSession(callbacks: {
    onopen: () => void;
    onmessage: (message: LiveServerMessage) => Promise<void>;
    onerror: (e: any) => void;
    onclose: (e: any) => void;
  }) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    return ai.live.connect({
      model: AIModelType.LIVE,
      callbacks,
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
        },
        inputAudioTranscription: {},
        outputAudioTranscription: {},
      },
    });
  }
}

export const gemini = new GeminiService();
