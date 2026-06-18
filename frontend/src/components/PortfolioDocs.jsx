import React, { useState } from 'react';
import { Terminal, Copy, Check, Download, ShieldAlert, Cpu, Layers, Laptop, HardDrive, Network } from 'lucide-react';

export default function PortfolioDocs() {
  const [copiedReadme, setCopiedReadme] = useState(false);

  const readmeContent = `# SecureCrypt - Enterprise Cybersecurity Suite

SecureCrypt is a production-grade cryptographic dashboard designed for security teams, researchers, and students to analyze symmetric and asymmetric encryption models.

## Architecture

\`\`\`
[React/Vite Frontend (Port 5173)] <--- HTTPS REST API ---> [Flask Backend (Port 5000)]
                                                                    |
                                                            [PyCryptodome Engine]
                                                        (AES-256-CBC, DES-CBC, RSA-2048)
\`\`\`

## Technology Stack

- **Frontend Core**: React 19, Vite 8, Tailwind CSS, Lucide icons, Canvas-Confetti
- **Backend Core**: Python 3, Flask, Flask-CORS, PyCryptodome

## Installation & Setup

### 1. Backend Setup
\`\`\`bash
cd backend
python -m venv venv
.\\venv\\Scripts\\activate
pip install -r requirements.txt
python app.py
\`\`\`

### 2. Frontend Setup
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`
`;

  const handleCopyReadme = () => {
    navigator.clipboard.writeText(readmeContent);
    setCopiedReadme(true);
    setTimeout(() => setCopiedReadme(false), 2000);
  };

  const handleDownloadReadme = () => {
    const blob = new Blob([readmeContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'README.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-fade-in text-slate-300 font-sans">
      
      {/* Introduction Card */}
      <section className="glass-panel rounded-xl p-6 border border-white/5 shadow-glass flex flex-col md:flex-row gap-6 items-center">
        <div className="space-y-3 flex-grow">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-cyber-purple/10 border border-cyber-purple/30 text-purple-400 font-mono text-[10px] font-bold">
            <Layers size={10} />
            DEVELOPER SHOWCASE
          </div>
          <h2 className="text-xl font-bold text-white">Project Showcase Portfolio: SecureCrypt</h2>
          <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">
            This module presents the software architecture, design decisions, and system specifications for the SecureCrypt platform. Built for hiring managers and recruiters, it outlines the core technologies and deployment requirements.
          </p>
        </div>
        <div className="shrink-0 flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <button
            onClick={handleCopyReadme}
            className="flex-1 py-2.5 px-4 bg-slate-900 border border-slate-800 hover:border-slate-600 rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all duration-200"
          >
            {copiedReadme ? <Check size={12} className="text-cyber-green" /> : <Copy size={12} />}
            {copiedReadme ? 'README Copied' : 'Copy README.md'}
          </button>
          <button
            onClick={handleDownloadReadme}
            className="flex-1 py-2.5 px-4 bg-cyber-purple/20 border border-cyber-purple/40 hover:border-cyber-purple/80 hover:bg-cyber-purple/30 text-purple-300 rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all duration-200"
          >
            <Download size={12} />
            Download README
          </button>
        </div>
      </section>

      {/* Grid: Tech Stack & Architecture (Side by Side) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Technology Stack Details */}
        <div className="glass-panel rounded-xl p-6 border border-white/5 shadow-glass flex flex-col gap-4">
          <h3 className="text-xs font-mono tracking-widest text-slate-400 uppercase flex items-center gap-1.5 border-b border-slate-900 pb-3">
            <Laptop size={14} className="text-cyber-accent" />
            ENTERPRISE TECHNOLOGY STACK
          </h3>

          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-mono text-slate-500 block mb-1">FRONTEND ARCHITECTURE</span>
              <div className="flex flex-wrap gap-2">
                {['React 19', 'Vite 8', 'Tailwind CSS 3', 'Lucide React', 'Canvas-Confetti', 'ESLint 10'].map(tag => (
                  <span key={tag} className="px-2.5 py-1 bg-slate-950/60 border border-slate-800 rounded font-mono text-[10px] text-slate-300">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[10px] font-mono text-slate-500 block mb-1">BACKEND SERVICE LAYERS</span>
              <div className="flex flex-wrap gap-2">
                {['Python 3', 'Flask 3.0', 'PyCryptodome', 'CORS Engine', 'SHA-256 Hashes', 'Venv sandbox'].map(tag => (
                  <span key={tag} className="px-2.5 py-1 bg-slate-950/60 border border-slate-800 rounded font-mono text-[10px] text-cyan-400">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[10px] font-mono text-slate-500 block mb-1">PROJECT DEVELOPER ASSIGNMENT</span>
              <div className="bg-slate-950/40 border border-slate-900 p-3 rounded flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Lead Security Engineer:</span>
                <span className="text-white font-bold">Anshika Rathi</span>
              </div>
            </div>
          </div>
        </div>

        {/* System Architecture and Diagram */}
        <div className="glass-panel rounded-xl p-6 border border-white/5 shadow-glass flex flex-col gap-4">
          <h3 className="text-xs font-mono tracking-widest text-slate-400 uppercase flex items-center gap-1.5 border-b border-slate-900 pb-3">
            <Network size={14} className="text-cyber-purple" />
            SYSTEM ARCHITECTURE DIAGRAM
          </h3>

          {/* Interactive Flow representation */}
          <div className="flex flex-col gap-3 py-1 items-stretch">
            
            {/* Frontend node */}
            <div className="bg-slate-950/80 border border-cyber-accent/30 rounded-lg p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Laptop size={16} className="text-cyber-accent" />
                <span className="text-xs font-mono font-semibold text-slate-200">React Client Dashboard</span>
              </div>
              <span className="text-[9px] font-mono bg-cyan-500/10 text-cyber-accent px-2 py-0.5 rounded">Port 5173</span>
            </div>

            {/* Link */}
            <div className="flex flex-col items-center py-0.5 justify-center">
              <span className="w-[1px] h-4 bg-slate-800" />
              <span className="text-[9px] font-mono text-slate-500 my-0.5">REST API (JSON payloads over CORS)</span>
              <span className="w-[1px] h-4 bg-slate-800" />
            </div>

            {/* Backend node */}
            <div className="bg-slate-950/80 border border-cyber-purple/30 rounded-lg p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HardDrive size={16} className="text-cyber-purple" />
                <span className="text-xs font-mono font-semibold text-slate-200">Flask Security Server</span>
              </div>
              <span className="text-[9px] font-mono bg-violet-500/10 text-cyber-purple px-2 py-0.5 rounded">Port 5000</span>
            </div>

            {/* Link */}
            <div className="flex flex-col items-center py-0.5 justify-center">
              <span className="w-[1px] h-4 bg-slate-800" />
              <span className="text-[9px] font-mono text-slate-500 my-0.5">Internal Cryptographic Operations</span>
              <span className="w-[1px] h-4 bg-slate-800" />
            </div>

            {/* Cryptographic Library */}
            <div className="bg-slate-950/80 border border-emerald-500/30 rounded-lg p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu size={16} className="text-cyber-green animate-pulse" />
                <span className="text-xs font-mono font-semibold text-slate-200">PyCryptodome Engine</span>
              </div>
              <span className="text-[9px] font-mono bg-emerald-500/10 text-cyber-green px-2 py-0.5 rounded">Local Library</span>
            </div>

          </div>
        </div>

      </div>

      {/* Installation Guide & Shell Commands */}
      <section className="glass-panel rounded-xl p-6 border border-white/5 shadow-glass space-y-4">
        <h3 className="text-xs font-mono tracking-widest text-slate-400 uppercase flex items-center gap-1.5 border-b border-slate-900 pb-3">
          <Terminal size={14} className="text-cyber-green" />
          INSTALLATION & LOCAL SETUP GUIDELINES
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-mono">
          {/* Flask Backend */}
          <div className="space-y-2">
            <span className="text-slate-400 font-bold block">1. Run Flask Backend Server</span>
            <div className="bg-slate-950 rounded-lg p-3 border border-slate-900 text-[11px] leading-relaxed text-slate-300">
              <div>cd backend</div>
              <div>python -m venv venv</div>
              <div>.\venv\Scripts\activate <span className="text-slate-600"># Windows powershell</span></div>
              <div>pip install -r requirements.txt</div>
              <div className="text-cyber-accent">python app.py</div>
            </div>
          </div>

          {/* Vite Frontend */}
          <div className="space-y-2">
            <span className="text-slate-400 font-bold block">2. Run React/Vite Frontend Client</span>
            <div className="bg-slate-950 rounded-lg p-3 border border-slate-900 text-[11px] leading-relaxed text-slate-300">
              <div>cd frontend</div>
              <div>npm install</div>
              <div className="text-cyber-accent font-bold">npm run dev</div>
              <div className="text-slate-500 mt-2"># Open http://localhost:5173 in browser</div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Screenshot Outlines */}
      <section className="glass-panel rounded-xl p-6 border border-white/5 shadow-glass space-y-4">
        <h3 className="text-xs font-mono tracking-widest text-slate-400 uppercase flex items-center gap-1.5 border-b border-slate-900 pb-3">
          <Layers size={14} className="text-cyan-400" />
          PORTFOLIO WIREFRAME & SCREENSHOT GUIDE
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="border border-dashed border-slate-800 rounded-lg p-6 text-center flex flex-col items-center justify-center gap-2 bg-slate-950/10 min-h-[140px]">
            <span className="text-xs font-mono font-bold text-slate-300 block">Workspace Dashboard</span>
            <p className="text-[10px] text-slate-500 max-w-[180px] leading-relaxed">
              Shows split-screen interface, input boxes, block cipher configuration, key setups, and operational buttons.
            </p>
          </div>

          <div className="border border-dashed border-slate-800 rounded-lg p-6 text-center flex flex-col items-center justify-center gap-2 bg-slate-950/10 min-h-[140px]">
            <span className="text-xs font-mono font-bold text-slate-300 block">Analytics Matrix</span>
            <p className="text-[10px] text-slate-500 max-w-[180px] leading-relaxed">
              Shows local history list, byte volume tracker, most-used algorithms, and operation status percentages.
            </p>
          </div>

          <div className="border border-dashed border-slate-800 rounded-lg p-6 text-center flex flex-col items-center justify-center gap-2 bg-slate-950/10 min-h-[140px]">
            <span className="text-xs font-mono font-bold text-slate-300 block">Cryptography Academy</span>
            <p className="text-[10px] text-slate-500 max-w-[180px] leading-relaxed">
              Shows educational specifications, comparison matrix table, and definitions of AES, DES, and RSA.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
