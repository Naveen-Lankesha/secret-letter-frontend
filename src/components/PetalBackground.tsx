import React from "react";
import { motion } from "framer-motion";

type PetalBackgroundProps = {
  count?: number;
  className?: string;
};

const PetalBackground: React.FC<PetalBackgroundProps> = ({
  count = 22,
  className = "",
}) => {
  const petals = Array.from({ length: count });

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      aria-hidden="true">
      {petals.map((_, i) => {
        const left = Math.random() * 100;
        const size = 10 + Math.random() * 14;
        const duration = 8 + Math.random() * 8;
        const delay = Math.random() * 6;
        const drift = (Math.random() - 0.5) * 60;
        const rotate = Math.random() * 360;

        return (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${left}%`,
              width: `${size}px`,
              height: `${size * 0.75}px`,
            }}
            initial={{
              top: "-12%",
              opacity: 0,
              rotate,
              x: 0,
            }}
            animate={{
              top: "112%",
              opacity: [0, 0.9, 0.9, 0],
              rotate: rotate + 240,
              x: [0, drift, drift / 2],
            }}
            transition={{
              duration,
              delay,
              repeat: Infinity,
              ease: "linear",
            }}>
            <div
              className="w-full h-full"
              style={{
                background:
                  "linear-gradient(135deg, rgba(244,63,94,0.7), rgba(251,113,133,0.65))",
                borderRadius: "999px 999px 999px 0px",
                filter: "blur(0.2px)",
                boxShadow: "0 0 12px rgba(244,63,94,0.18)",
                transform: `skewX(${Math.random() * 18 - 9}deg)`,
              }}
            />
          </motion.div>
        );
      })}

      {/* soft tint behind petals */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 via-red-500/5 to-transparent" />
    </div>
  );
};

export default PetalBackground;
