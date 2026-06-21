import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  duration?: number;
  once?: boolean;
}

const getVariants = (direction: string, distance: number): Variants => {
  const dirs: Record<string, { x?: number; y?: number }> = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
  };
  return {
    hidden: { opacity: 0, ...dirs[direction] },
    visible: { opacity: 1, x: 0, y: 0 },
  };
};

const ScrollReveal = ({
  children,
  className,
  delay = 0,
  direction = "up",
  duration = 0.65,
  once = true,
}: ScrollRevealProps) => {
  return (
    <motion.div
      className={className}
      variants={getVariants(direction, 40)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-80px" }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
