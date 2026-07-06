import { useEffect, useRef, useState, useCallback } from 'react';
import type { ClaudeStatus } from '../types/usage';

// Bundled by vite — require() is unavailable in the sandboxed renderer
import { Howl } from 'howler';

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

    // html5: true forces plain <audio> element playback instead of Howler's
    // default Web Audio API path. Electron loads the packaged app via
    // file://, and Web Audio's XHR-based fetch is blocked cross-file-origin
    // there — sounds would silently never load. <audio src> is unaffected.
    sounds.current = {
      ambientPurr: new Howl({
        src: ['sounds/ambient-purr.mp3'],
        loop: true,
        volume: volume * 0.5,
        html5: true,
      }),
      keyboardClick: new Howl({
        src: ['sounds/keyboard-click.mp3'],
        volume: volume * 0.6,
        html5: true,
      }),
      pageTurn: new Howl({
        src: ['sounds/page-turn.mp3'],
        volume: volume * 0.4,
        html5: true,
      }),
      cookingBubble: new Howl({
        src: ['sounds/cooking-bubble.mp3'],
        loop: true,
        volume: volume * 0.3,
        html5: true,
      }),
      sweep: new Howl({
        src: ['sounds/sweep.mp3'],
        volume: volume * 0.3,
        html5: true,
      }),
      notification: new Howl({
        src: ['sounds/notification.mp3'],
        volume: volume * 0.5,
        html5: true,
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
