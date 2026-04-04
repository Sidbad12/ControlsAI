// types.ts — All shared TypeScript interfaces for the ControlsAI frontend.
// These mirror the backend Pydantic schemas (models.py).

export interface Source {
  section  : string;
  version  : string;
  pages    : number[];
  pdf_url  : string | null;
}

export interface DiagramImage {
  image_id   : string;
  image_url  : string;
  page       : number;
  caption    : string;
  explanation?: string;
}

export interface Message {
  role      : 'user' | 'assistant';
  content   : string;
  sources?  : Source[];
  images?   : DiagramImage[];
  latency?  : number;
  timestamp?: number;
  isError?  : boolean;
}

export interface Session {
  id      : string;
  title   : string;
  mode    : 'qa' | 'flowchart';
  messages: Message[];
}

export interface HistoryEntry {
  role   : 'user' | 'assistant';
  content: string;
}

export interface QueryBody {
  query          : string;
  mode           : 'qa' | 'flowchart';
  version_filter : string | null;
  mermaid_code   : string | null;
  history        : HistoryEntry[];
}

export interface QueryApiResponse {
  query        : string;
  answer       : string;
  sources      : Source[];
  images       : DiagramImage[];
  latency_ms   : number;
  version_used : string | null;
}

export interface VersionOption {
  value: string;
  label: string;
}
