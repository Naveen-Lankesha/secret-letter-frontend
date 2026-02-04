import React, { useMemo } from "react";
import { motion } from "framer-motion";

type SpellBeamBackgroundProps = {
  casts?: number;
  className?: string;
  origin?: "bottom-right" | "bottom-left";
  variant?: "dark" | "hero";
  showOrb?: boolean;
};

const SpellBeamBackground: React.FC<SpellBeamBackgroundProps> = ({
  casts = 4,
  className = "",
  origin = "bottom-right",
  variant = "dark",
  showOrb = true,
}) => {
  const direction: "ltr" | "rtl" = origin === "bottom-left" ? "ltr" : "rtl";
  const beamTop = "50%";
  const orbTop = "-10%";

  const palette = useMemo(() => {
    if (variant === "hero") {
      return {
        texture:
          "radial-gradient(circle at 20% 30%, rgba(168,85,247,0.10), transparent 40%), radial-gradient(circle at 80% 70%, rgba(236,72,153,0.08), transparent 45%), repeating-linear-gradient(135deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1px, rgba(0,0,0,0) 6px, rgba(0,0,0,0) 10px)",
        orb: "radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(167,139,250,0.70) 24%, rgba(236,72,153,0.40) 46%, rgba(168,85,247,0) 72%)",
        orbShadow:
          "0 0 42px rgba(168,85,247,0.22), 0 0 90px rgba(236,72,153,0.12)",
        beamGlow:
          "linear-gradient(90deg, rgba(168,85,247,0) 0%, rgba(168,85,247,0.18) 12%, rgba(236,72,153,0.48) 40%, rgba(253,230,138,0.26) 65%, rgba(168,85,247,0.14) 88%, rgba(168,85,247,0) 100%)",
        beamCore:
          "linear-gradient(90deg, rgba(168,85,247,0) 0%, rgba(167,139,250,0.85) 20%, rgba(255,255,255,0.95) 45%, rgba(253,230,138,0.62) 70%, rgba(168,85,247,0) 100%)",
        plasma:
          "linear-gradient(90deg, rgba(168,85,247,0) 0%, rgba(236,72,153,0.18) 22%, rgba(167,139,250,0.30) 45%, rgba(253,230,138,0.16) 68%, rgba(168,85,247,0) 100%)",
        arcStroke: "rgba(253, 230, 138, 0.55)",
        arcShadow: "drop-shadow(0 0 10px rgba(168,85,247,0.20))",
        sparkFill: "rgba(255, 255, 255, 0.9)",
        sparkShadow: "0 0 12px rgba(168,85,247,0.26)",
        centerGlow:
          "radial-gradient(circle at 50% 50%, rgba(168,85,247,0.12), transparent 60%)",
      };
    }

    return {
      texture:
        "radial-gradient(circle at 20% 30%, rgba(34,197,94,0.08), transparent 40%), radial-gradient(circle at 80% 70%, rgba(34,197,94,0.06), transparent 45%), repeating-linear-gradient(135deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1px, rgba(0,0,0,0) 6px, rgba(0,0,0,0) 10px)",
      orb: "radial-gradient(circle, rgba(236,252,203,0.95) 0%, rgba(74,222,128,0.75) 22%, rgba(34,197,94,0.35) 45%, rgba(34,197,94,0) 70%)",
      orbShadow: "0 0 42px rgba(34,197,94,0.22), 0 0 90px rgba(34,197,94,0.12)",
      beamGlow:
        "linear-gradient(90deg, rgba(34,197,94,0) 0%, rgba(34,197,94,0.25) 12%, rgba(34,197,94,0.55) 40%, rgba(163,230,53,0.35) 65%, rgba(34,197,94,0.18) 88%, rgba(34,197,94,0) 100%)",
      beamCore:
        "linear-gradient(90deg, rgba(34,197,94,0) 0%, rgba(74,222,128,0.9) 20%, rgba(236,252,203,0.95) 45%, rgba(190,242,100,0.65) 70%, rgba(34,197,94,0) 100%)",
      plasma:
        "linear-gradient(90deg, rgba(34,197,94,0) 0%, rgba(163,230,53,0.22) 22%, rgba(74,222,128,0.35) 45%, rgba(163,230,53,0.22) 68%, rgba(34,197,94,0) 100%)",
      arcStroke: "rgba(190, 242, 100, 0.65)",
      arcShadow: "drop-shadow(0 0 10px rgba(34,197,94,0.18))",
      sparkFill: "rgba(236, 252, 203, 0.9)",
      sparkShadow: "0 0 12px rgba(34,197,94,0.28)",
      centerGlow:
        "radial-gradient(circle at 50% 50%, rgba(34,197,94,0.12), transparent 60%)",
    };
  }, [variant]);

  const sparkCount = Math.max(14, casts * 10);
  const arcCount = Math.max(2, Math.min(6, casts));

  const sparks = useMemo(() => {
    return Array.from({ length: sparkCount }).map((_, i) => {
      const along = Math.random();
      const y = (Math.random() - 0.5) * 60;
      const size = 1.5 + Math.random() * 3.5;
      const driftY = (Math.random() - 0.5) * 140;
      const driftX = (Math.random() - 0.5) * 120;
      const duration = 1.2 + Math.random() * 1.8;
      const delay = (i / sparkCount) * 1.4 + Math.random() * 1.6;
      return { along, y, size, driftX, driftY, duration, delay };
    });
  }, [sparkCount]);

  const arcs = useMemo(() => {
    const buildPath = (amplitude: number, phase: number) => {
      const points = 10;
      const y0 = 50;
      const step = 100 / points;
      const coords: Array<[number, number]> = [];
      for (let p = 0; p <= points; p++) {
        const x = p * step;
        const y = y0 + Math.sin((p / points) * Math.PI * 2 + phase) * amplitude;
        coords.push([x, y]);
      }
      const d = coords
        .map(([x, y], idx) => `${idx === 0 ? "M" : "L"} ${x} ${y}`)
        .join(" ");
      return d;
    };

    return Array.from({ length: arcCount }).map(() => {
      const amplitude = 6 + Math.random() * 14;
      const phase = Math.random() * Math.PI * 2;
      const strokeWidth = 1.2 + Math.random() * 1.8;
      const duration = 1.8 + Math.random() * 1.8;
      const delay = Math.random() * 1.6;
      return {
        d: buildPath(amplitude, phase),
        strokeWidth,
        duration,
        delay,
      };
    });
  }, [arcCount]);

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      aria-hidden="true">
      {/* dark texture + green haze */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: palette.texture,
          backgroundBlendMode: "screen",
        }}
      />

      {/* source orb */}
      {showOrb && (
        <motion.div
          className="absolute"
          style={{
            top: orbTop,
            left: "80%",
            width: "180px",
            height: "180px",
            transform: "translate(-50%, -50%)",
            mixBlendMode: "screen",
          }}
          initial={{ opacity: 0.6, scale: 0.92 }}
          animate={{ opacity: [0.45, 0.95, 0.55], scale: [0.9, 1.05, 0.95] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}>
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: palette.orb,
              filter: "blur(0.2px)",
            }}
          />
          <div
            className="absolute inset-0 rounded-full"
            style={{
              boxShadow: palette.orbShadow,
              filter: "blur(0.6px)",
            }}
          />
        </motion.div>
      )}

      {/* main horizontal beam (layered for VFX look) */}
      <motion.div
        className="absolute"
        style={{
          top: beamTop,
          left: "0%",
          right: "0%",
          height: "22px",
          transform: "translateY(-50%)",
          mixBlendMode: "screen",
          filter: "blur(0.2px)",
        }}
        initial={{ opacity: 0.55 }}
        animate={{ opacity: [0.45, 0.95, 0.6] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}>
        {/* glow */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: palette.beamGlow,
            filter: "blur(6px)",
            opacity: 0.9,
          }}
        />
        {/* core */}
        <div
          className="absolute left-0 right-0 top-1/2 rounded-full"
          style={{
            height: "6px",
            transform: "translateY(-50%)",
            background: palette.beamCore,
            boxShadow:
              variant === "hero"
                ? "0 0 18px rgba(168,85,247,0.30)"
                : "0 0 18px rgba(74,222,128,0.35)",
          }}
        />

        {/* plasma trail (animated texture) */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            backgroundImage: palette.plasma,
            backgroundSize: "240% 100%",
            filter: "blur(2.2px)",
            opacity: 0.75,
          }}
          animate={{
            backgroundPosition:
              direction === "ltr"
                ? ["0% 50%", "100% 50%"]
                : ["100% 50%", "0% 50%"],
            opacity: [0.55, 0.85, 0.6],
          }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>

      {/* electric arcs riding the beam */}
      <div
        className="absolute inset-x-0"
        style={{
          top: beamTop,
          transform: "translateY(-50%)",
          height: "120px",
        }}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ filter: palette.arcShadow }}>
          {arcs.map((arc, idx) => (
            <motion.path
              key={idx}
              d={arc.d}
              fill="none"
              stroke={palette.arcStroke}
              strokeWidth={arc.strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="7 14"
              initial={{ opacity: 0, strokeDashoffset: 0 }}
              animate={{
                opacity: [0, 0.9, 0.25, 0],
                strokeDashoffset: direction === "ltr" ? [0, -60] : [0, 60],
              }}
              transition={{
                duration: arc.duration,
                delay: arc.delay,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}
        </svg>
      </div>

      {/* sparks and mist */}
      {sparks.map((s, idx) => (
        <motion.div
          key={idx}
          className="absolute rounded-full"
          style={{
            top: `calc(${beamTop} + ${s.y}px)`,
            left: `${s.along * 100}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            background: palette.sparkFill,
            boxShadow: palette.sparkShadow,
            mixBlendMode: "screen",
          }}
          initial={{ opacity: 0, x: 0, y: 0, scale: 0.9 }}
          animate={{
            opacity: [0, 1, 0],
            x: [0, s.driftX],
            y: [0, s.driftY],
            scale: [0.9, 1.1, 0.95],
          }}
          transition={{
            duration: s.duration,
            delay: s.delay,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}

      {/* center glow */}
      <div
        className="absolute inset-0"
        style={{ background: palette.centerGlow }}
      />
    </div>
  );
};

export default SpellBeamBackground;
