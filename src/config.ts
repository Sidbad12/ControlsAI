// config.ts — API URL and static data.
import type { VersionOption } from './types';

export const API_BASE: string =
  import.meta.env.VITE_API_URL || 'http://localhost:7860';

export const API_KEY: string =
  import.meta.env.VITE_FRONTEND_API_KEY || 'controlsai-dev-run';

export const VERSIONS: VersionOption[] = [
  { value: '',           label: 'All Versions'        },
  { value: 'G2-V1.0',   label: 'G2 V1.0 (2024+)'     },
  { value: 'G1-V4.7',   label: 'G1 V4.7 (Current)'   },
  { value: 'G1-V3.0',   label: 'G1 V3.0 (Legacy)'    },
  { value: 'G1-Safety', label: 'Safety Manual'        },
  { value: 'G2-FW',     label: 'G2 Firmware'          },
  { value: 'PG-V1',     label: 'Programming Guide'   },
  { value: 'Tool-V4.0', label: 'Eng. Tools V4.0'     },
  { value: 'Tool-V5.0', label: 'Eng. Tools V5.0'     },
];
