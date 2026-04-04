// styles.ts
import { Variants } from 'framer-motion';

// ── Framer Motion Variants ───────────────────────────────────────────────────
export const msgVariants: Variants = {
  hidden : { opacity: 0, y: 12 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.2, 
      ease: 'easeOut'
    } 
  },
};
