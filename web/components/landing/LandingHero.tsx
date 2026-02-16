"use client";

import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

export default function LandingHero() {
  return (
    <section className="relative z-10 flex flex-col gap-8">
      <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.6 }}>
        <Badge className="w-fit" variant="default">
             ERC-4626 Vault
        </Badge>
      </motion.div>
      <motion.h1
        className="font-serif text-[clamp(2.8rem,5vw,5rem)] leading-[1.02] text-primary"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        transition={{ duration: 0.7, delay: 0.05 }}
      >
        Deposit assets. Receive shares. Watch your position grow.
      </motion.h1>
      <motion.p
        className="max-w-xl text-base text-muted md:text-lg"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        transition={{ duration: 0.7, delay: 0.1 }}
      >
        A modern ERC-4626 dashboard that keeps yield transparent, flows smooth, and every conversion visible.
        Built for composable vaults and human-friendly finance.
      </motion.p>
      <motion.div
        className="flex flex-wrap items-center gap-3"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        transition={{ duration: 0.7, delay: 0.15 }}
      >
        <Button variant="secondary" type="button">
          View Dashboard
        </Button>
      </motion.div>
    </section>
  );
}
