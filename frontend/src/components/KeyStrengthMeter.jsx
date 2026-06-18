import React from 'react';
import { ShieldAlert, ShieldCheck } from 'lucide-react';

export default function KeyStrengthMeter({ password, algorithm }) {
  if (algorithm === 'RSA') {
    return (
      <div className="flex items-center gap-1.5 bg-slate-950/45 p-2 rounded border border-white/5 text-[10px] font-mono text-cyber-purple">
        <ShieldCheck size={11} className="animate-pulse" />
        <span>Asymmetric modulus keys are inherently strong. (2048-bit PEM)</span>
      </div>
    );
  }

  if (!password) {
    return (
      <div className="text-[10px] font-mono text-slate-600">
        Enter a secret key to measure password complexity.
      </div>
    );
  }

  // Basic Strength Calculator
  let score = 0;
  if (password.length > 0) score += 1;
  if (password.length >= 8) score += 1;
  if (password.length >= 16) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[!@#$%^&*()_+\-=\[\]{};':",\\|.<>\/?]/.test(password)) score += 1;

  let color = 'bg-red-500';
  let border = 'border-red-500/20';
  let text = 'WEAK PASSWORD (INSECURE)';
  let textColor = 'text-red-400';
  let width = 'w-1/3';

  if (score >= 4) {
    color = 'bg-cyber-green status-dot-active';
    border = 'border-emerald-500/20';
    text = 'EXCELLENT / CRYPTOGRAPHICALLY SECURE';
    textColor = 'text-cyber-green';
    width = 'w-full';
  } else if (score >= 2) {
    color = 'bg-yellow-500 status-dot-warning';
    border = 'border-yellow-500/20';
    text = 'MODERATE STRENGTH';
    textColor = 'text-yellow-500';
    width = 'w-2/3';
  }

  // Additional warnings for DES keys
  const isDes = algorithm === 'DES';

  return (
    <div className="space-y-1.5 font-mono text-[10px] w-full">
      <div className="flex justify-between items-center">
        <span className="text-slate-500 uppercase">Key Strength Meter:</span>
        <span className={`font-bold ${textColor}`}>{text}</span>
      </div>
      <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-white/5 flex">
        <div className={`h-full ${color} transition-all duration-300 ${width}`} />
      </div>
      {isDes && (
        <div className="flex items-center gap-1 text-[9px] text-amber-500">
          <ShieldAlert size={10} />
          <span>Notice: DES key size is legacy (derived to 64-bit blocks). Strength is capped by protocol limits.</span>
        </div>
      )}
    </div>
  );
}
