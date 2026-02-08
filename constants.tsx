
import React from 'react';
import { 
  MessageSquare, 
  Image as ImageIcon, 
  Video, 
  Music, 
  LayoutTemplate, 
  History, 
  Radio,
  FileAudio,
  FileSearch,
  Wand2,
  PenTool,
  Film,
  Megaphone,
  Lightbulb,
  Share2,
  BookOpen
} from 'lucide-react';
import { CreativeTemplate } from './types';

export const NAV_ITEMS = [
  { id: 'chat', label: 'Chat AI', icon: <MessageSquare size={20} /> },
  { id: 'live', label: 'Deepberg Live', icon: <Radio size={20} /> },
  { id: 'image', label: 'Image Studio', icon: <ImageIcon size={20} /> },
  { id: 'video', label: 'Video Studio', icon: <Video size={20} /> },
  { id: 'audio', label: 'Audio Studio', icon: <Music size={20} /> },
  { id: 'transcription', label: 'Transcription', icon: <FileAudio size={20} /> },
  { id: 'templates', label: 'Creative Tools', icon: <LayoutTemplate size={20} /> },
  { id: 'history', label: 'History', icon: <History size={20} /> },
];

export const TEMPLATES: CreativeTemplate[] = [
  {
    id: 'caption-gen',
    title: 'Caption Generator',
    description: 'Engaging captions for Instagram, TikTok, and LinkedIn with relevant hashtags.',
    promptPrefix: 'Generate 5 creative, viral caption options for this topic or image description: ',
    category: 'Social Media',
    icon: 'PenTool',
    modelType: 'LITE',
    systemInstruction: 'You are a social media expert. Create punchy, engaging captions that stop the scroll. Include emojis and strategic hashtags.'
  },
  {
    id: 'script-writer',
    title: 'Script Generator',
    description: 'Professional video scripts for YouTube, Reels, and commercials.',
    promptPrefix: 'Write a high-converting video script for: ',
    category: 'Video',
    icon: 'Film',
    modelType: 'PRO',
    systemInstruction: 'You are an award-winning scriptwriter. Create structured scripts with visual cues, dialogue, and clear pacing.'
  },
  {
    id: 'ad-copy',
    title: 'Ad Copy Generator',
    description: 'High-converting copy using proven marketing frameworks like AIDA and PAS.',
    promptPrefix: 'Write compelling ad copy for: ',
    category: 'Marketing',
    icon: 'Megaphone',
    modelType: 'PRO',
    systemInstruction: 'You are a master direct-response copywriter. Use psychological triggers and clear calls to action to drive conversions.'
  },
  {
    id: 'marketing-ideas',
    title: 'Marketing Ideas',
    description: 'Brainstorm unique campaigns, growth hacks, and creative marketing angles.',
    promptPrefix: 'Brainstorm 10 unique marketing ideas for: ',
    category: 'Marketing',
    icon: 'Lightbulb',
    modelType: 'PRO',
    systemInstruction: 'You are a Creative Director. Think outside the box and suggest viral-worthy marketing strategies and unique positioning.'
  },
  {
    id: 'social-posts',
    title: 'Social Media Posts',
    description: 'Full post generation for LinkedIn, Twitter threads, or Facebook updates.',
    promptPrefix: 'Create a detailed social media post about: ',
    category: 'Social Media',
    icon: 'Share2',
    modelType: 'LITE',
    systemInstruction: 'You are a digital community manager. Write posts that encourage engagement, comments, and shares.'
  },
  {
    id: 'blog-writer',
    title: 'Blog Writer',
    description: 'SEO-optimized long-form articles with headers, intros, and conclusions.',
    promptPrefix: 'Write a comprehensive blog post about: ',
    category: 'Writing',
    icon: 'BookOpen',
    modelType: 'PRO',
    systemInstruction: 'You are an expert content marketer. Write deeply researched, SEO-friendly articles that provide immense value and authority.'
  },
  {
    id: 'content-analyst',
    title: 'Content Analyst',
    description: 'Deep audit of any text for clarity, tone, and impact.',
    promptPrefix: 'Please perform a comprehensive analysis of the following content: ',
    category: 'Intelligence',
    icon: 'FileSearch',
    systemInstruction: 'You are a Senior Content Auditor. Provide a detailed analysis including tone check, grammar audit, and strategic improvement suggestions.',
    modelType: 'PRO'
  },
  {
    id: 'smart-editor',
    title: 'Smart Editor',
    description: 'Fast, high-quality rewrites and edits for speed and clarity.',
    promptPrefix: 'Rewrite and improve the following text: ',
    category: 'Writing',
    icon: 'Wand2',
    systemInstruction: 'You are a professional editor. Focus on brevity, punchy language, and perfect flow.',
    modelType: 'LITE'
  }
];
