import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type MusicContextValue = {
  enabled: boolean;
  playing: boolean;
  toggle: () => void;
  setEnabled: (enabled: boolean) => void;
};

const MusicContext = createContext<MusicContextValue | undefined>(undefined);

const STORAGE_KEY = "secret-letter:music-enabled";
const DEFAULT_ENABLED = true;
const DEFAULT_VOLUME = 0.25;

function readInitialEnabled(): boolean {
  if (typeof window === "undefined") return DEFAULT_ENABLED;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === null) return DEFAULT_ENABLED;
    return raw === "true";
  } catch {
    return DEFAULT_ENABLED;
  }
}

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [enabled, setEnabledState] = useState<boolean>(() =>
    readInitialEnabled(),
  );
  const [playing, setPlaying] = useState(false);

  const setEnabled = useCallback((next: boolean) => {
    setEnabledState(next);
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(STORAGE_KEY, String(next));
      } catch {
        // ignore
      }
    }
  }, []);

  const toggle = useCallback(() => {
    setEnabled(!enabled);
  }, [enabled, setEnabled]);

  const tryPlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return false;

    try {
      // Keep audio configured even if the element reloads.
      audio.loop = true;
      audio.volume = DEFAULT_VOLUME;
      await audio.play();
      setPlaying(true);
      return true;
    } catch {
      setPlaying(false);
      return false;
    }
  }, []);

  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    setPlaying(false);
  }, []);

  // Keep audio in sync with enabled state.
  useEffect(() => {
    if (!enabled) {
      pause();
      return;
    }

    let disposed = false;
    let attached = false;

    const onFirstGesture = async () => {
      detach();
      await tryPlay();
    };

    const attach = () => {
      if (attached) return;
      attached = true;
      window.addEventListener("pointerdown", onFirstGesture, { passive: true });
      window.addEventListener("keydown", onFirstGesture);
    };

    const detach = () => {
      if (!attached) return;
      attached = false;
      window.removeEventListener("pointerdown", onFirstGesture);
      window.removeEventListener("keydown", onFirstGesture);
    };

    // 1) Try immediately (works if browser allows it).
    void (async () => {
      const ok = await tryPlay();
      if (disposed || ok) return;
      // 2) If autoplay is blocked, retry after first user interaction.
      attach();
    })();

    return () => {
      disposed = true;
      detach();
    };
  }, [enabled, pause, tryPlay]);

  // Pause music when the tab is hidden (prevents surprises).
  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        pause();
      } else if (enabled) {
        void tryPlay();
      }
    };

    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [enabled, pause, tryPlay]);

  const value = useMemo<MusicContextValue>(
    () => ({
      enabled,
      playing,
      toggle,
      setEnabled,
    }),
    [enabled, playing, toggle, setEnabled],
  );

  return (
    <MusicContext.Provider value={value}>
      {children}
      {/* Put your MP3 at: frontend/public/audio/background.mp3 */}
      <audio ref={audioRef} src="/audio/background.mp3" preload="auto" />
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const ctx = useContext(MusicContext);
  if (!ctx) {
    throw new Error("useMusic must be used within MusicProvider");
  }
  return ctx;
}
