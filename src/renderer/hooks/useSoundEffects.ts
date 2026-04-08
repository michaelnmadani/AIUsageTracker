import { useEffect, useRef, useState, useCallback } from 'react';
import type { ClaudeStatus } from '../types/usage';

// Howler will be loaded dynamically
let Howl: any = null;

try {
  const howler = require('howler');
  Howl = howler.Howl;
} catch {
  // Howler not available, sounds disabled
}

interface SoundRefs {
  ambientPurr?: any;
  keyboardClick?: any;
  pageTurn?: any;
  cookingBubble?: any;
  sweep?: any;
  notification?: any;
}

export function useSoundEffects(status: ClaudeStatus) {
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const sounds = useRef<SoundRefs>({});
  const prevStatus = useRef<ClaudeStatus>(status);

  // Initialize sounds
  useEffect(() => {
    if (!Howl) return;

    sounds.current = {
      ambientPurr: new Howl({
        src: ['sounds/ambient-purr.mp3'],
        loop: true,
        volume: volume * 0.5,
      }),
      keyboardClick: new Howl({
        src: ['sounds/keyboard-click.mp3'],
        volume: volume * 0.6,
      }),
      pageTurn: new Howl({
        src: ['sounds/page-turn.mp3'],
        volume: volume * 0.4,
      }),
      cookingBubble: new Howl({
        src: ['sounds/cooking-bubble.mp3'],
        loop: true,
        volume: volume * 0.3,
      }),
      sweep: new Howl({
        src: ['sounds/sweep.mp3'],
        volume: volume * 0.3,
      }),
      notification: new Howl({
        src: ['sounds/notification.mp3'],
        volume: volume * 0.5,
      }),
    };

    return () => {
      Object.values(sounds.current).forEach((sound: any) => {
        try { sound?.stop(); } catch {}
      });
    };
  }, []);

  // Update volume
  useEffect(() => {
    if (!sounds.current) return;
    Object.values(sounds.current).forEach((sound: any) => {
      try { sound?.volume(volume); } catch {}
    });
  }, [volume]);

  // React to status changes
  useEffect(() => {
    if (muted || !Howl) return;

    const prev = prevStatus.current;
    prevStatus.current = status;

    if (status === 'active' && prev !== 'active') {
      // Claude started working
      try {
        sounds.current.notification?.play();
        sounds.current.keyboardClick?.play();
      } catch {}
    } else if (status === 'idle' && prev === 'active') {
      // Claude stopped working
      try {
        sounds.current.keyboardClick?.stop();
        sounds.current.cookingBubble?.stop();
        sounds.current.ambientPurr?.play();
      } catch {}
    } else if (status === 'active') {
      // Still active, ensure background sounds play
      try {
        if (!sounds.current.keyboardClick?.playing()) {
          sounds.current.keyboardClick?.play();
        }
      } catch {}
    }
  }, [status, muted]);

  const toggleMute = useCallback(() => {
    setMuted((prev) => {
      if (!prev) {
        // Muting - stop all sounds
        Object.values(sounds.current).forEach((sound: any) => {
          try { sound?.stop(); } catch {}
        });
      }
      return !prev;
    });
  }, []);

  return {
    muted,
    volume,
    setVolume,
    toggleMute,
  };
}
