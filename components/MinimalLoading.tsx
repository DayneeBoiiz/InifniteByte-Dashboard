"use client";

import { motion } from "framer-motion";

interface MinimalLoadingProps {
  message?: string;
}

export default function MinimalLoading({
  message = "Loading...",
}: MinimalLoadingProps) {
  return (
    <div className="flex items-center justify-center min-h-screen min-w-screen bg-background">
      <div className="flex flex-col items-center gap-4">
        {/* Pulsing Circle */}
        <div className="relative w-16 h-16">
          <motion.div
            className="absolute inset-0 bg-[#8b5cf6] rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 0.3, 0.7],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute inset-2 bg-[#8b5cf6] rounded-full"
            animate={{
              scale: [1, 0.8, 1],
              opacity: [1, 0.5, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        {/* Loading Text */}
        <motion.p
          className="text-sm font-medium text-muted-foreground"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {message}
        </motion.p>
      </div>
    </div>
  );
}
