import React, { useMemo } from "react";
import { motion } from "framer-motion";

type SerpentBackgroundProps = {
  className?: string;
  particles?: number;
};

const SerpentBackground: React.FC<SerpentBackgroundProps> = ({
  className = "",
  particles = 18,
}) => {
  const paths = useMemo(
    () => [
      // Keep command structure identical across paths for smooth morphing
      "M -120 360 C 120 260, 240 420, 380 330 S 640 250, 760 330 S 980 430, 1200 280 S 1440 150, 1320 340",
      "M -120 330 C 110 230, 260 410, 410 310 S 650 220, 780 350 S 980 470, 1210 300 S 1460 170, 1320 360",
      "M -120 380 C 140 300, 260 460, 420 340 S 640 260, 790 320 S 1000 410, 1220 260 S 1450 130, 1320 330",
      "M -120 350 C 150 250, 270 430, 420 320 S 660 240, 800 350 S 990 450, 1220 290 S 1450 150, 1320 350",
    ],
    [],
  );

  const trackLength = 1000; // normalized dash math
  const headLen = 70;
  const bodyLen = 170;
  const tailLen = 140;
  const gap = trackLength - Math.max(headLen + bodyLen + tailLen, 1);

  const travelDuration = 10; // seconds per full slither loop
  const dashStart = 0;
  const dashEnd = -trackLength;

  const motes = useMemo(() => {
    return Array.from({ length: particles }).map((_, i) => {
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      const size = 1.5 + Math.random() * 3.5;
      const duration = 5 + Math.random() * 7;
      const delay = (i / particles) * 2.2;
      const driftX = (Math.random() - 0.5) * 80;
      const driftY = (Math.random() - 0.5) * 60;
      const opacity = 0.25 + Math.random() * 0.35;
      return { left, top, size, duration, delay, driftX, driftY, opacity };
    });
  }, [particles]);

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      aria-hidden="true">
      {/* dark emerald haze + subtle texture */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 20%, rgba(16,185,129,0.12), transparent 44%), radial-gradient(circle at 70% 75%, rgba(34,197,94,0.08), transparent 48%), repeating-linear-gradient(135deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1px, rgba(0,0,0,0) 7px, rgba(0,0,0,0) 12px)",
          backgroundBlendMode: "screen",
        }}
      />

      {/* drifting mist layers */}
      <motion.div
        className="absolute -inset-x-1 -inset-y-1"
        style={{
          background:
            "radial-gradient(circle at 20% 30%, rgba(16,185,129,0.14), transparent 55%), radial-gradient(circle at 80% 60%, rgba(34,197,94,0.09), transparent 58%), radial-gradient(circle at 50% 80%, rgba(148,163,184,0.05), transparent 60%)",
          filter: "blur(10px)",
          opacity: 0.9,
        }}
        animate={{
          backgroundPosition: ["0% 0%", "40% 10%", "10% 35%", "0% 0%"],
          opacity: [0.65, 0.9, 0.75],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* spectral serpent: SVG path + glow layers */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0.55 }}
        animate={{ opacity: [0.45, 0.85, 0.55] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{ mixBlendMode: "screen" }}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1200 600"
          preserveAspectRatio="none">
          <defs>
            <linearGradient id="serpentCore" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(16,185,129,0)" />
              <stop offset="18%" stopColor="rgba(16,185,129,0.35)" />
              <stop offset="40%" stopColor="rgba(52,211,153,0.85)" />
              <stop offset="55%" stopColor="rgba(236,252,203,0.55)" />
              <stop offset="72%" stopColor="rgba(16,185,129,0.55)" />
              <stop offset="100%" stopColor="rgba(16,185,129,0)" />
            </linearGradient>
            <filter id="softGlow">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feColorMatrix
                in="blur"
                type="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -6"
                result="glow"
              />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* serpent: fixed-length segment that travels along a morphing path */}
          {/* tail (thin) */}
          <motion.path
            d={paths[0]}
            fill="none"
            pathLength={trackLength}
            stroke="rgba(16,185,129,0.16)"
            strokeWidth="20"
            strokeLinecap="round"
            filter="url(#softGlow)"
            strokeDasharray={`${tailLen} ${trackLength - tailLen}`}
            initial={{ strokeDashoffset: dashStart }}
            animate={{
              d: paths,
              strokeDashoffset: [
                dashStart + headLen + bodyLen,
                dashEnd + headLen + bodyLen,
              ],
              opacity: [0.22, 0.55, 0.28],
            }}
            transition={{
              d: { duration: 12, repeat: Infinity, ease: "easeInOut" },
              strokeDashoffset: {
                duration: travelDuration,
                repeat: Infinity,
                ease: "linear",
              },
              opacity: { duration: 5, repeat: Infinity, ease: "easeInOut" },
            }}
          />

          {/* body aura (thicker) */}
          <motion.path
            d={paths[0]}
            fill="none"
            pathLength={trackLength}
            stroke="rgba(16,185,129,0.20)"
            strokeWidth="34"
            strokeLinecap="round"
            filter="url(#softGlow)"
            strokeDasharray={`${bodyLen} ${trackLength - bodyLen}`}
            initial={{ strokeDashoffset: dashStart }}
            animate={{
              d: paths,
              strokeDashoffset: [dashStart + headLen, dashEnd + headLen],
              opacity: [0.25, 0.85, 0.35],
            }}
            transition={{
              d: { duration: 12, repeat: Infinity, ease: "easeInOut" },
              strokeDashoffset: {
                duration: travelDuration,
                repeat: Infinity,
                ease: "linear",
              },
              opacity: { duration: 6, repeat: Infinity, ease: "easeInOut" },
            }}
          />

          {/* body inner glow */}
          <motion.path
            d={paths[0]}
            fill="none"
            pathLength={trackLength}
            stroke="rgba(110,231,183,0.30)"
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={`${bodyLen} ${trackLength - bodyLen}`}
            initial={{ strokeDashoffset: dashStart }}
            animate={{
              d: paths,
              strokeDashoffset: [dashStart + headLen, dashEnd + headLen],
              opacity: [0.18, 0.75, 0.28],
            }}
            transition={{
              d: { duration: 12, repeat: Infinity, ease: "easeInOut" },
              strokeDashoffset: {
                duration: travelDuration,
                repeat: Infinity,
                ease: "linear",
              },
              opacity: { duration: 4.8, repeat: Infinity, ease: "easeInOut" },
            }}
          />

          {/* head (brightest + slightly thicker) */}
          <motion.path
            d={paths[0]}
            fill="none"
            pathLength={trackLength}
            stroke="url(#serpentCore)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={`${headLen} ${trackLength - headLen}`}
            initial={{ strokeDashoffset: dashStart }}
            animate={{
              d: paths,
              strokeDashoffset: [dashStart, dashEnd],
              opacity: [0.2, 1, 0.55],
            }}
            transition={{
              d: { duration: 12, repeat: Infinity, ease: "easeInOut" },
              strokeDashoffset: {
                duration: travelDuration,
                repeat: Infinity,
                ease: "linear",
              },
              opacity: { duration: 4.4, repeat: Infinity, ease: "easeInOut" },
            }}
          />

          {/* subtle moving "scales" texture over the whole snake segment */}
          <motion.path
            d={paths[0]}
            fill="none"
            pathLength={trackLength}
            stroke="rgba(236,252,203,0.28)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDashoffset={0}
            strokeDasharray={`${headLen + bodyLen + tailLen} ${gap}`}
            initial={{ strokeDashoffset: 0, opacity: 0.0 }}
            animate={{
              d: paths,
              strokeDashoffset: [0, -260],
              opacity: [0.0, 0.25, 0.08],
            }}
            transition={{
              d: { duration: 12, repeat: Infinity, ease: "easeInOut" },
              strokeDashoffset: {
                duration: 2.2,
                repeat: Infinity,
                ease: "linear",
              },
              opacity: { duration: 5.2, repeat: Infinity, ease: "easeInOut" },
            }}
          />

          {/* head highlight (subtle) */}
          {/* <motion.circle
            cx="1080"
            cy="285"
            r="18"
            fill="rgba(236,252,203,0.35)"
            filter="url(#softGlow)"
            initial={{ opacity: 0.1, scale: 0.9 }}
            animate={{ opacity: [0.12, 0.45, 0.15], scale: [0.9, 1.05, 0.95] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
          /> */}
        </svg>
      </motion.div>

      {/* arcane motes */}
      {motes.map((m, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${m.left}%`,
            top: `${m.top}%`,
            width: `${m.size}px`,
            height: `${m.size}px`,
            background: "rgba(236, 252, 203, 0.9)",
            boxShadow: "0 0 14px rgba(16,185,129,0.20)",
            opacity: m.opacity,
            mixBlendMode: "screen",
          }}
          initial={{ x: 0, y: 0, opacity: 0 }}
          animate={{
            x: [0, m.driftX],
            y: [0, m.driftY],
            opacity: [0, m.opacity, 0],
          }}
          transition={{
            duration: m.duration,
            delay: m.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* faint distortion vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_35%,rgba(0,0,0,0.55)_100%)]" />
    </div>
  );
};

export default SerpentBackground;
