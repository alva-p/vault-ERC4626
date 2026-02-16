"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

export default function DevModePanel() {
  const [enabled, setEnabled] = useState(true);
  const [yieldAmount, setYieldAmount] = useState("250");

  return (
    <motion.div whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 220, damping: 18 }}>
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Dev Mode</CardTitle>
          <CardDescription>Simulate yield for testnet demos.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-2xl border border-stroke bg-glass px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-primary">Enable Dev Mode</p>
              <p className="text-xs text-muted">Inject simulated yield into charts.</p>
            </div>
            <Switch checked={enabled} onCheckedChange={setEnabled} />
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-[0.3em] text-muted">Simulate yield</label>
            <Input value={yieldAmount} onChange={(event) => setYieldAmount(event.target.value)} />
            <p className="text-xs text-muted">For demonstration on testnets only.</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
