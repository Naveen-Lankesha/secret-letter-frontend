import React, { useMemo } from "react";
import { motion } from "framer-motion";

type PetalBackgroundProps = {
  count?: number;
  className?: string;
};

const PetalBackground: React.FC<PetalBackgroundProps> = ({
  count = 22,
  className = "",
}) => {
  const fallingPetals = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      const left = Math.random() * 100;
      const size = 10 + Math.random() * 14;
      const duration = 8 + Math.random() * 8;
      const delay = Math.random() * 6;
      const drift = (Math.random() - 0.5) * 60;
      const rotate = Math.random() * 360;
      const skew = Math.random() * 18 - 9;
      return { i, left, size, duration, delay, drift, rotate, skew };
    });
  }, [count]);

  const pilePetals = useMemo(() => {
    const pileCount = Math.max(28, Math.round(count * 2.2));
    return Array.from({ length: pileCount }).map((_, i) => {
      const left = Math.random() * 100;
      const bottom = Math.random() * 26;
      const size = 10 + Math.random() * 18;
      const rotate = Math.random() * 360;
      const skew = Math.random() * 22 - 11;
      const opacity = 0.18 + Math.random() * 0.38;
      const blur = 0.0 + Math.random() * 0.6;
      const driftX = (Math.random() - 0.5) * 10;
      const driftY = (Math.random() - 0.5) * 6;
      const sway = 2 + Math.random() * 3;
      const delay = (i / pileCount) * 1.8;
      return {
        i,
        left,
        bottom,
        size,
        rotate,
        skew,
        opacity,
        blur,
        driftX,
        driftY,
        sway,
        delay,
      };
    });
  }, [count]);

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      aria-hidden="true">
      {/* soft tint behind petals */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 via-red-500/5 to-transparent" />

      {/* falling petals (fade out as they approach the pile) */}
      {fallingPetals.map((p) => (
        <motion.div
          key={p.i}
          className="absolute z-10"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size * 0.75}px`,
          }}
          initial={{
            top: "-12%",
            opacity: 0,
            rotate: p.rotate,
            x: 0,
          }}
          animate={{
            // Stop just above the very bottom so it feels like it settles into the stack.
            top: "92%",
            opacity: [0, 0.9, 0.85, 0],
            rotate: p.rotate + 240,
            x: [0, p.drift, p.drift / 2],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}>
          <div
            className="w-full h-full"
            style={{
              background:
                "linear-gradient(135deg, rgba(244,63,94,0.72), rgba(251,113,133,0.66))",
              borderRadius: "999px 999px 999px 0px",
              filter: "blur(0.2px)",
              boxShadow: "0 0 12px rgba(244,63,94,0.18)",
              transform: `skewX(${p.skew}deg)`,
            }}
          />
        </motion.div>
      ))}

      {/* bottom stack/pile */}
      <div className="absolute left-0 right-0 bottom-0 h-32 z-20">
        {/* base haze */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 120%, rgba(244,63,94,0.28) 0%, rgba(251,113,133,0.12) 38%, rgba(0,0,0,0) 72%)",
            filter: "blur(0.6px)",
          }}
        />

        {pilePetals.map((p) => (
          <motion.div
            key={`pile-${p.i}`}
            className="absolute"
            style={{
              left: `${p.left}%`,
              bottom: `${p.bottom}px`,
              width: `${p.size}px`,
              height: `${p.size * 0.75}px`,
              opacity: p.opacity,
              filter: `blur(${p.blur}px)`,
            }}
            initial={{ x: 0, y: 0, rotate: p.rotate }}
            animate={{
              x: [0, p.driftX, 0],
              y: [0, -p.driftY, 0],
              rotate: [p.rotate, p.rotate + p.sway, p.rotate],
            }}
            transition={{
              duration: 3.8 + Math.random() * 2.2,
              delay: p.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}>
            <div
              className="w-full h-full"
              style={{
                background:
                  "linear-gradient(135deg, rgba(244,63,94,0.78), rgba(251,113,133,0.62))",
                borderRadius: "999px 999px 999px 0px",
                boxShadow: "0 0 10px rgba(244,63,94,0.12)",
                transform: `skewX(${p.skew}deg)`,
              }}
            />
          </motion.div>
        ))}

        {/* subtle shadow to make the stack feel grounded */}
        <div className="absolute left-0 right-0 bottom-0 h-8 bg-gradient-to-t from-black/25 to-transparent" />
      </div>
    </div>
  );
};

export default PetalBackground;
