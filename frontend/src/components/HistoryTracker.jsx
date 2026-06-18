import React from 'react';
import { Trash2, Shield, Activity, PieChart, Calendar, ChevronRight } from 'lucide-react';

export default function HistoryTracker({ history, onClearHistory }) {
  
  // Calculate Algorithm Usage Breakdown
  const total = history.length;
  const aesCount = history.filter(h => h.algorithm === 'AES').length;
  const desCount = history.filter(h => h.algorithm === 'DES').length;
  const rsaCount = history.filter(h => h.algorithm === 'RSA').length;

  const aesPct = total > 0 ? Math.round((aesCount / total) * 100) : 0;
  const desPct = total > 0 ? Math.round((desCount / total) * 100) : 0;
  const rsaPct = total > 0 ? Math.round((rsaCount / total) * 100) : 0;

  // Determine Most-used Algorithm
  let mostUsed = 'None';
  let max = 0;
  if (aesCount > max) { mostUsed = 'AES'; max = aesCount; }
  if (desCount > max) { mostUsed = 'DES'; max = desCount; }
  if (rsaCount > max) { mostUsed = 'RSA'; max = rsaCount; }

  // Format Bytes Utility
  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const totalBytes = history.reduce((sum, item) => sum + (item.bytes || 0), 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
      
      {/* LEFT: Stats & Analytics Breakdown (4 columns) */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        
        {/* Metric Cards */}
        <div className="glass-panel rounded-xl p-5 border border-white/5 shadow-glass flex flex-col gap-4">
          <h3 className="text-xs font-mono tracking-widest text-slate-400 uppercase flex items-center gap-1.5">
            <PieChart size={14} className="text-cyber-accent" />
            USAGE METRICS
          </h3>

          <div className="space-y-4">
            <div className="flex justify-between items-center bg-slate-950/40 p-3 rounded border border-white/5">
              <span className="text-xs font-mono text-slate-400">Total Run Count</span>
              <span className="text-sm font-mono font-bold text-white">{total}</span>
            </div>
            <div className="flex justify-between items-center bg-slate-950/40 p-3 rounded border border-white/5">
              <span className="text-xs font-mono text-slate-400">Most Used Cipher</span>
              <span className="text-sm font-mono font-bold text-cyber-accent">{mostUsed}</span>
            </div>
            <div className="flex justify-between items-center bg-slate-950/40 p-3 rounded border border-white/5">
              <span className="text-xs font-mono text-slate-400">Total Encrypted Volume</span>
              <span className="text-sm font-mono font-bold text-cyber-green">{formatBytes(totalBytes)}</span>
            </div>
          </div>
        </div>

        {/* Algorithm breakdown graph (custom progress bars) */}
        <div className="glass-panel rounded-xl p-5 border border-white/5 shadow-glass flex flex-col gap-4">
          <h3 className="text-xs font-mono tracking-widest text-slate-400 uppercase flex items-center gap-1.5">
            <Activity size={14} className="text-cyber-purple animate-pulse" />
            ALGORITHM BREAKDOWN
          </h3>

          <div className="space-y-4 font-mono text-xs">
            {/* AES */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-300">AES-256 (Military Standard)</span>
                <span className="text-cyber-green font-bold">{aesPct}% ({aesCount})</span>
              </div>
              <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-white/5">
                <div className="h-full bg-cyber-green transition-all duration-500" style={{ width: `${aesPct}%` }} />
              </div>
            </div>

            {/* DES */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-300">DES (Legacy Cipher)</span>
                <span className="text-amber-500 font-bold">{desPct}% ({desCount})</span>
              </div>
              <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-white/5">
                <div className="h-full bg-amber-500 transition-all duration-500" style={{ width: `${desPct}%` }} />
              </div>
            </div>

            {/* RSA */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-300">RSA-2048 (Asymmetric Pair)</span>
                <span className="text-cyber-purple font-bold">{rsaPct}% ({rsaCount})</span>
              </div>
              <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-white/5">
                <div className="h-full bg-cyber-purple transition-all duration-500" style={{ width: `${rsaPct}%` }} />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* RIGHT: Activity Timeline (8 columns) */}
      <div className="lg:col-span-8">
        <div className="glass-panel rounded-xl p-5 border border-white/5 shadow-glass flex flex-col gap-4 h-full">
          <div className="flex justify-between items-center border-b border-slate-900 pb-3">
            <h3 className="text-xs font-mono tracking-widest text-slate-400 uppercase flex items-center gap-1.5">
              <Calendar size={14} className="text-cyan-400" />
              SESSION OPERATION LOGS (LOCAL STORAGE)
            </h3>
            {total > 0 && (
              <button
                onClick={onClearHistory}
                className="text-[10px] text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500/40 bg-red-500/5 px-2 py-1 rounded flex items-center gap-1 font-mono transition-all duration-200"
              >
                <Trash2 size={10} />
                Clear Archive
              </button>
            )}
          </div>

          {/* Timeline List */}
          <div className="flex-grow overflow-y-auto max-h-[360px] scrollbar pr-1">
            {history.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-600 italic gap-2 py-12">
                <Shield size={32} className="opacity-20 animate-pulse text-cyan-400" />
                <span>No local activity recorded in this browser session.</span>
              </div>
            ) : (
              <div className="space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[1px] before:bg-slate-900">
                {history.map((item, index) => {
                  let algoBadge = 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
                  if (item.algorithm === 'DES') algoBadge = 'bg-amber-500/10 text-amber-500 border-amber-500/20';
                  if (item.algorithm === 'RSA') algoBadge = 'bg-violet-500/10 text-cyber-purple border-violet-500/20';

                  return (
                    <div key={index} className="flex gap-4 items-start pl-6 relative">
                      {/* Timeline dot */}
                      <span className={`w-2.5 h-2.5 rounded-full absolute left-1.5 top-1.5 border border-slate-950 ${
                        item.type === 'encrypt' ? 'bg-cyber-green' : 'bg-cyber-purple'
                      }`} />
                      
                      <div className="flex-grow bg-slate-950/40 border border-white/5 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:border-slate-800 transition-all duration-200">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${algoBadge}`}>
                              {item.algorithm}
                            </span>
                            <span className={`text-[10px] font-mono uppercase ${
                              item.type === 'encrypt' ? 'text-cyber-green' : 'text-cyber-purple'
                            }`}>
                              {item.type}ED
                            </span>
                            <span className="text-[10px] font-mono text-slate-500">{item.timestamp}</span>
                          </div>
                          <p className="text-xs text-slate-300 font-mono truncate max-w-[280px] sm:max-w-[380px]" title={item.payload}>
                            Payload: {item.payload}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-[10px] font-mono text-slate-500 block">DATA PROCESSED</span>
                          <span className="text-xs font-mono font-bold text-white">{formatBytes(item.bytes)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>

    </div>
  );
}
