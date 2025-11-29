"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      // fade out to left → fade in from right illusion
      initial={{ opacity: 0, x: 40 }} // new page starts right and invisible
      animate={{ opacity: 1, x: 0 }} // fades/slides to normal
      transition={{
        duration: 0.6, // slower + smoother
        ease: [0.45, 0, 0.55, 1],
      }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
}
