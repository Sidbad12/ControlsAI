// utils.ts — Pure typed helper functions.
import type { Message, HistoryEntry } from './types';

export const generateId = (): string =>
  Math.random().toString(36).substr(2, 9);

/** Strip zero-width and invisible Unicode characters (common in PDF copy-paste). */
export const sanitizeInput = (text: string): string =>
  text.replace(/[\u200B-\u200D\uFEFF\u00AD]/g, '').trim();

/**
 * Build a sliding-window history for the backend.
 * Last 2 complete turns (4 messages max), role + content only.
 */
export const buildHistory = (messages: Message[]): HistoryEntry[] =>
  messages
    .filter((m) => (m.role === 'user' || m.role === 'assistant') && m.content)
    .slice(-4)
    .map((m) => ({ role: m.role, content: m.content }));
