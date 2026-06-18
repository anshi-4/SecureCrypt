import React, { useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, Trash2, Cpu, ShieldCheck } from 'lucide-react';

export default function Terminal({ logs, onClear }) {
  const terminalEndRef = useRef(null);

  // Auto scroll to bottom of logs
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="glass-panel-accent rounded-lg overflow-hidden border border-cyber-accent/30 shadow-neon-cyan/20 shadow-md flex flex-col h-72">
      {/* Terminal Title Bar */}
      <div className="bg-slate-950 px-4 py-2 border-b border-cyber-accent/20 flex items-center justify-between shrink-0 select-none">
        <div className="flex items-center gap-2">
          {/* Window control buttons */}
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block"></span>
          </div>
          <div className="h-4 w-[1px] bg-slate-800 mx-1"></div>
          <span className="flex items-center gap-1.5 text-xs font-mono text-cyber-accent font-semibold tracking-wider">
            <TerminalIcon size={12} className="animate-pulse" />
            SECURECRYPT_CONSOLE // ENGINE_LOGS
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono">
            <Cpu size={10} className="text-cyber-purple animate-pulse" />
            <span>SYS_OK</span>
          </div>
          <button
            onClick={onClear}
            className="text-slate-400 hover:text-red-400 hover:bg-red-500/10 p-1 rounded transition-all duration-200"
            title="Clear Console Logs"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      {/* Terminal Display Area */}
      <div className="p-4 flex-grow overflow-y-auto font-mono text-xs leading-relaxed bg-slate-950/90 selection:bg-cyber-accent/30 selection:text-white">
        {/* Startup messages */}
        <div className="text-slate-500 mb-2 border-b border-slate-900 pb-2">
          <div>[SYSTEM] SECURECRYPT CORE v1.2.0 initialized.</div>
          <div className="flex items-center gap-1">
            [SYSTEM] Crypto backend link status: 
            <span className="text-cyber-green flex items-center gap-0.5">
              <ShieldCheck size={10} /> CONNECTED
            </span>
          </div>
          <div>[SYSTEM] Algorithms: AES-256-CBC, DES-CBC, RSA-2048-OAEP.</div>
        </div>

        {/* Live logs */}
        <div className="space-y-1">
          {logs.length === 0 ? (
            <div className="text-slate-600 italic">No operations recorded. Input text, choose an algorithm, and encrypt/decrypt.</div>
          ) : (
            logs.map((log, index) => {
              let typeColor = 'text-cyan-400'; // info
              let prefix = '[*]';
              
              if (log.type === 'success') {
                typeColor = 'text-cyber-green';
                prefix = '[+]';
              } else if (log.type === 'error') {
                typeColor = 'text-red-400 font-bold';
                prefix = '[!]';
              } else if (log.type === 'warning') {
                typeColor = 'text-yellow-500';
                prefix = '[-]';
              }

              return (
                <div key={index} className="flex gap-2 animate-fade-in terminal-line py-0.5 px-1 rounded">
                  <span className="text-slate-600 select-none shrink-0">{log.timestamp}</span>
                  <span className={`${typeColor} shrink-0`}>{prefix}</span>
                  <span className="text-slate-300 break-all">{log.text}</span>
                </div>
              );
            })
          )}
          {/* Cursor */}
          <div className="flex gap-2">
            <span className="text-slate-600 select-none">[{new Date().toLocaleTimeString().split(' ')[0]}]</span>
            <span className="text-cyber-accent animate-pulse font-bold">&gt;_</span>
          </div>
          <div ref={terminalEndRef} />
        </div>
      </div>
    </div>
  );
}
