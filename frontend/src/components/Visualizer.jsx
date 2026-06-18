import React, { useEffect, useState } from 'react';
import { Database, Key, ShieldAlert, Cpu, ArrowRight } from 'lucide-react';

export default function Visualizer({ algorithm, activeOperation, trigger }) {
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (trigger) {
      setAnimating(true);
      const timer = setTimeout(() => setAnimating(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [trigger]);

  const steps = [
    {
      id: 'input',
      title: '1. Raw Payload',
      icon: <Database size={18} className="text-cyan-400" />,
      desc: 'Plaintext data payload is ingested.',
      accent: 'border-cyan-500/30'
    },
    {
      id: 'key',
      title: '2. Key Derivation',
      icon: <Key size={18} className="text-cyber-purple" />,
      desc: algorithm === 'RSA' ? 'RSA Modulus Loaded' : 'SHA-256 Key Derived',
      accent: 'border-violet-500/30'
    },
    {
      id: 'engine',
      title: '3. Cipher Engine',
      icon: <Cpu size={18} className="text-cyber-green animate-pulse" />,
      desc: algorithm === 'RSA' ? 'RSA-OAEP SHA256' : `${algorithm}-CBC Block`,
      accent: 'border-emerald-500/30'
    },
    {
      id: 'output',
      title: '4. Encrypted State',
      icon: <ShieldAlert size={18} className="text-cyan-400" />,
      desc: 'Base64 Ciphertext generated.',
      accent: 'border-cyan-500/30'
    }
  ];

  return (
    <div className="glass-panel rounded-xl p-5 border border-white/5 shadow-glass flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xs font-mono tracking-widest text-slate-400 uppercase flex items-center gap-1.5">
          <span className="w-1.5 h-3 bg-cyber-accent rounded-sm inline-block animate-pulse"></span>
          REAL-TIME DATA FLOW VISUALIZATION
        </h3>
        {activeOperation && (
          <span className="text-[10px] bg-slate-900 border border-slate-700 px-2 py-0.5 rounded font-mono text-cyan-400 animate-pulse">
            ACTIVE FLOW: {activeOperation.toUpperCase()}
          </span>
        )}
      </div>

      {/* Grid of Steps */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative items-center">
        {steps.map((step, idx) => (
          <React.Fragment key={step.id}>
            <div className={`cyber-card rounded-lg p-4 flex flex-col gap-2 relative ${step.accent} ${
              animating ? 'ring-1 ring-cyan-400/50 shadow-neon-cyan/20 scale-[1.02]' : ''
            } transition-all duration-350`}>
              
              {/* Pulse effect */}
              {animating && (
                <span className="absolute -inset-px rounded-lg bg-gradient-to-r from-cyan-500/30 to-purple-500/30 animate-pulse-glow pointer-events-none" />
              )}

              <div className="flex items-center gap-2">
                {step.icon}
                <span className="text-xs font-mono font-bold text-slate-200">{step.title}</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed font-sans">{step.desc}</p>
            </div>
            
            {/* Arrow Connector */}
            {idx < 3 && (
              <div className="hidden sm:flex items-center justify-center text-slate-700">
                <ArrowRight size={16} className={`${animating ? 'text-cyan-400 animate-bounce' : ''}`} />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1.5 bg-slate-950/40 p-2.5 rounded border border-white/5">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
        <span>Click <strong>ENCRYPT</strong> or <strong>DECRYPT</strong> to trigger the active pipeline animation.</span>
      </div>
    </div>
  );
}
