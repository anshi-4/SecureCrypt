import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Unlock, 
  Key, 
  RefreshCw, 
  Copy, 
  Check, 
  Trash2, 
  Terminal as TerminalIcon, 
  Shield, 
  Activity,
  ChevronRight,
  Eye,
  EyeOff,
  AlertTriangle,
  Cpu,
  Database,
  Layers,
  Sparkles,
  Server,
  TrendingUp,
  Globe,
  Info,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Upload,
  Download,
  Sun,
  Moon,
  FileText
} from 'lucide-react';
import Terminal from './components/Terminal';
import Visualizer from './components/Visualizer';
import HistoryTracker from './components/HistoryTracker';
import PortfolioDocs from './components/PortfolioDocs';
import KeyStrengthMeter from './components/KeyStrengthMeter';
import confetti from 'canvas-confetti';

const API_BASE_URL = 'https://securecrypt-backend.onrender.com';

export default function App() {
  // Navigation & UI Layout State
  const [activeTab, setActiveTab] = useState('workspace'); // 'workspace' | 'analytics' | 'academy' | 'portfolio'
  const [theme, setTheme] = useState('dark');

  // Application Cryptographic State
  const [plaintext, setPlaintext] = useState('');
  const [algorithm, setAlgorithm] = useState('AES');
  const [aesKey, setAesKey] = useState('');
  const [desKey, setDesKey] = useState('');
  const [rsaPublicKey, setRsaPublicKey] = useState('');
  const [rsaPrivateKey, setRsaPrivateKey] = useState('');
  
  // Results State
  const [ciphertext, setCiphertext] = useState('');
  const [iv, setIv] = useState('');
  const [decryptedText, setDecryptedText] = useState('');
  
  // UI & Action Loading States
  const [loading, setLoading] = useState(false);
  const [copiedType, setCopiedType] = useState(null); 
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [logs, setLogs] = useState([]);
  const [toast, setToast] = useState({ message: '', type: 'info', visible: false });

  // Visualizer Animation Triggers
  const [visualizerTrigger, setVisualizerTrigger] = useState(0);
  const [activeOperation, setActiveOperation] = useState('');

  // Connection & Analytics Stats States
  const [backendHealth, setBackendHealth] = useState('checking'); 
  const [history, setHistory] = useState([]);

  // Add a log entry
  const addLog = (text, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString().split(' ')[0];
    setLogs(prev => [...prev, { timestamp, text, type }]);
  };

  // Show a toast message
  const triggerToast = (message, type = 'success') => {
    setToast({ message, type, visible: true });
    const timer = setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 4000);
    return () => clearTimeout(timer);
  };

  // Check Flask Backend Health
  const checkBackendHealth = async () => {
    setBackendHealth('checking');
    try {
      console.log(`[Health Check] Checking backend server at: https://securecrypt-backend.onrender.com/health`);
      const response = await fetch('https://securecrypt-backend.onrender.com/health');
      if (response.ok) {
        const data = await response.json();
        console.log(`[Health Check] Backend is healthy:`, data);
        setBackendHealth('online');
        addLog(`Backend connection verified. Status: Healthy. Host: https://securecrypt-backend.onrender.com`, 'success');
      } else {
        console.warn(`[Health Check] Backend returned bad status code: ${response.status}`);
        setBackendHealth('offline');
        addLog('Backend returned non-200 status code during verification.', 'warning');
      }
    } catch (err) {
      console.error(`[Health Check] Connection failed:`, err);
      setBackendHealth('offline');
      addLog('Backend network connection offline. Verify Flask is running on port 5000.', 'error');
    }
  };

  // Load history & Check health on mount
  useEffect(() => {
    addLog('SecureCrypt enterprise security module loading...', 'info');
    checkBackendHealth();

    // Ingest History from Local Storage
    const saved = localStorage.getItem('securecrypt_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse history local archive', e);
      }
    }
  }, []);

  // Update History archive in Local Storage
  const recordHistory = (type, payloadText, byteSize) => {
    const newRecord = {
      timestamp: new Date().toLocaleString(),
      algorithm,
      type,
      payload: payloadText.substring(0, 50) + (payloadText.length > 50 ? '...' : ''),
      bytes: byteSize
    };
    const updated = [newRecord, ...history];
    setHistory(updated);
    localStorage.setItem('securecrypt_history', JSON.stringify(updated));
  };

  // Clear History
  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('securecrypt_history');
    triggerToast('Local history database purged.', 'warning');
    addLog('Deleted all local storage operations record.', 'warning');
  };

  // Helper to copy text to clipboard
  const copyToClipboard = (text, type) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    triggerToast(`${type.toUpperCase()} copied to clipboard!`, 'success');
    addLog(`Copied ${type} contents to system clipboard.`, 'success');
    setTimeout(() => setCopiedType(null), 2000);
  };

  // Clear all states
  const handleClearAll = () => {
    setPlaintext('');
    setCiphertext('');
    setIv('');
    setDecryptedText('');
    triggerToast('All workspace fields cleared.', 'info');
    addLog('Cleared input payload, outputs, and initialization vectors.', 'warning');
  };

  // Generate random keys for AES / DES
  const generateSymmetricKey = (algo) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';
    let length = algo === 'AES' ? 32 : 8; 
    let key = '';
    for (let i = 0; i < length; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    if (algo === 'AES') {
      setAesKey(key);
      addLog(`Generated random 256-bit AES key. Length: ${key.length} characters.`, 'info');
      triggerToast('Random AES key generated!', 'success');
    } else {
      setDesKey(key);
      addLog(`Generated random 64-bit DES key. Length: ${key.length} characters.`, 'info');
      triggerToast('Random DES key generated!', 'success');
    }
  };

  // Generate RSA Key Pair from backend
  const generateRsaKeys = async () => {
    setLoading(true);
    const url = `${API_BASE_URL}/rsa/generate`;
    addLog(`POST Request: Initiating RSA Key Pair Generation at ${url}`, 'info');
    console.log(`[API Request] POST ${url}`);
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      
      const data = await response.json();
      console.log(`[API Response] Status: ${response.status}`, data);
      
      if (response.ok && data.success) {
        setRsaPublicKey(data.public_key);
        setRsaPrivateKey(data.private_key);
        addLog(`RSA Key Generation Successful. Key length: 2048-bit PEM format.`, 'success');
        triggerToast('RSA Key pair generated!', 'success');
      } else {
        const errorMsg = data.error || 'Server returned keypair generation error.';
        addLog(`[Error] RSA keygen failed: ${errorMsg}`, 'error');
        triggerToast(`RSA Keygen Failed: ${errorMsg}`, 'error');
      }
    } catch (err) {
      console.error(`[API Network Error]`, err);
      addLog(`[Network Error] Failed to generate RSA keys. Details: ${err.message}`, 'error');
      triggerToast('Network Error: Could not generate keys.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Encrypt plaintext
  const handleEncrypt = async () => {
    if (!plaintext) {
      triggerToast('Please enter text to encrypt.', 'error');
      return;
    }

    setLoading(true);
    setCiphertext('');
    setIv('');
    
    // Prepare payload
    const payload = { algorithm, plaintext };
    if (algorithm === 'AES') {
      if (!aesKey) {
        triggerToast('Please provide an AES secret key.', 'error');
        setLoading(false);
        return;
      }
      payload.key = aesKey;
    } else if (algorithm === 'DES') {
      if (!desKey) {
        triggerToast('Please provide a DES secret key.', 'error');
        setLoading(false);
        return;
      }
      payload.key = desKey;
    } else if (algorithm === 'RSA') {
      if (!rsaPublicKey) {
        triggerToast('RSA Public Key is required.', 'error');
        setLoading(false);
        return;
      }
      payload.publicKey = rsaPublicKey;
    }

    const url = `${API_BASE_URL}/encrypt`;
    addLog(`POST Request: Encrypting via ${algorithm} to ${url}`, 'info');
    console.log(`[API Request] POST ${url}`, {
      headers: { 'Content-Type': 'application/json' },
      body: payload
    });
    addLog(`Payload: ${JSON.stringify({ ...payload, key: payload.key ? '***' : undefined, publicKey: payload.publicKey ? 'PEM_KEY_EXISTS' : undefined })}`, 'info');

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      console.log(`[API Response] Status: ${response.status}`, data);

      if (response.ok && data.success) {
        setCiphertext(data.ciphertext);
        if (data.iv) {
          setIv(data.iv);
        }
        
        // Trigger workflow visualizer pulse
        setActiveOperation('encrypt');
        setVisualizerTrigger(prev => prev + 1);

        // Record locally
        const byteSize = new Blob([plaintext]).size;
        recordHistory('encrypt', plaintext, byteSize);

        addLog(`POST Response: 200 OK. Ciphertext successfully returned. Size: ${data.ciphertext.length} chars.`, 'success');
        triggerToast('Encryption successful!', 'success');
      } else {
        const errorMsg = data.error || 'Server error during encryption.';
        addLog(`[Error] Encryption failed: ${errorMsg}`, 'error');
        triggerToast(errorMsg, 'error');
      }
    } catch (err) {
      console.error(`[API Network Error]`, err);
      addLog(`[Network Error] API connection failed. Verify Flask backend is operational on port 5000. Error details: ${err.message}`, 'error');
      triggerToast('Connection error during encryption.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Decrypt ciphertext
  const handleDecrypt = async () => {
    if (!ciphertext) {
      triggerToast('Please encrypt something or provide a ciphertext first.', 'error');
      return;
    }

    setLoading(true);
    setDecryptedText('');

    // Prepare payload
    const payload = { algorithm, ciphertext };
    if (algorithm === 'AES') {
      if (!aesKey) {
        triggerToast('AES secret key is required.', 'error');
        setLoading(false);
        return;
      }
      if (!iv) {
        triggerToast('IV is required for AES decryption.', 'error');
        setLoading(false);
        return;
      }
      payload.key = aesKey;
      payload.iv = iv;
    } else if (algorithm === 'DES') {
      if (!desKey) {
        triggerToast('DES secret key is required.', 'error');
        setLoading(false);
        return;
      }
      if (!iv) {
        triggerToast('IV is required for DES decryption.', 'error');
        setLoading(false);
        return;
      }
      payload.key = desKey;
      payload.iv = iv;
    } else if (algorithm === 'RSA') {
      if (!rsaPrivateKey) {
        triggerToast('RSA Private Key is required.', 'error');
        setLoading(false);
        return;
      }
      payload.privateKey = rsaPrivateKey;
    }

    const url = `${API_BASE_URL}/decrypt`;
    addLog(`POST Request: Decrypting via ${algorithm} to ${url}`, 'info');
    console.log(`[API Request] POST ${url}`, {
      headers: { 'Content-Type': 'application/json' },
      body: payload
    });
    addLog(`Payload: ${JSON.stringify({ ...payload, key: payload.key ? '***' : undefined, iv: payload.iv ? '***' : undefined, privateKey: payload.privateKey ? 'PEM_KEY_EXISTS' : undefined })}`, 'info');

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      console.log(`[API Response] Status: ${response.status}`, data);

      if (response.ok && data.success) {
        setDecryptedText(data.plaintext);
        
        // Trigger workflow visualizer pulse
        setActiveOperation('decrypt');
        setVisualizerTrigger(prev => prev + 1);

        // Record locally
        const byteSize = new Blob([ciphertext]).size;
        recordHistory('decrypt', data.plaintext, byteSize);

        addLog(`POST Response: 200 OK. Decrypted plaintext returned successfully.`, 'success');
        triggerToast('Decryption successful!', 'success');
        
        // Celebrate successful decryption
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#06b6d4', '#10b981', '#8b5cf6']
        });
      } else {
        const errorMsg = data.error || 'Server error during decryption.';
        addLog(`[Error] Decryption failed: ${errorMsg}`, 'error');
        triggerToast(errorMsg, 'error');
      }
    } catch (err) {
      console.error(`[API Network Error]`, err);
      addLog(`[Network Error] API connection failed. Verify Flask backend is operational on port 5000. Error details: ${err.message}`, 'error');
      triggerToast('Connection error during decryption.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // File Upload Ingestion
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      setPlaintext(evt.target.result);
      addLog(`Loaded raw plaintext content from uploaded file: ${file.name}`, 'info');
      triggerToast('Plaintext file uploaded successfully!', 'success');
    };
    reader.readAsText(file);
  };

  // Text File Downloader Utility
  const downloadTextFile = (content, filename) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addLog(`Exported file download: ${filename}`, 'success');
  };

  // PDF Exporter using formatted HTML popup print
  const handleExportReport = () => {
    if (!ciphertext) {
      triggerToast('Please encrypt a plaintext first to generate a report.', 'error');
      return;
    }
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>SecureCrypt Security Audit Report</title>
          <style>
            body { font-family: monospace; padding: 40px; color: #000; background: #fff; line-height: 1.5; }
            .header { border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 20px; }
            .title { font-size: 24px; font-weight: bold; letter-spacing: 1px; }
            .meta { font-size: 11px; color: #555; margin-top: 5px; }
            .section { margin-bottom: 25px; }
            .section-title { font-weight: bold; text-decoration: underline; margin-bottom: 8px; font-size: 14px; text-transform: uppercase; }
            .payload { background: #f5f5f5; padding: 12px; border: 1px solid #ccc; word-break: break-all; white-space: pre-wrap; font-size: 11px; }
            .footer { margin-top: 60px; font-size: 10px; border-top: 1px solid #ccc; padding-top: 15px; text-align: center; color: #777; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">SECURECRYPT SECURITY AUDIT REPORT</div>
            <div class="meta">Generated: ${new Date().toLocaleString()} | Lead Assessor: Anshika Rathi</div>
          </div>
          <div class="section">
            <div class="section-title">Cryptographic Vector Parameters</div>
            <div>Selected Cipher: ${algorithm}-CBC / Asymmetric Modulus</div>
            <div>Hashing Engine: SHA-256 Derived</div>
            <div>Modulus Depth: 2048-bit Asymmetry Standard</div>
            <div>Initialization Vector (IV): ${iv ? 'Active CBC Block (Included below)' : 'Not Used'}</div>
          </div>
          <div class="section">
            <div class="section-title">Plaintext Input Payload</div>
            <pre class="payload">${plaintext}</pre>
          </div>
          <div class="section">
            <div class="section-title">Ciphertext Output Base64 Block</div>
            <pre class="payload">${ciphertext}</pre>
          </div>
          ${iv ? `
          <div class="section">
            <div class="section-title">Initialization Vector Base64 Block</div>
            <pre class="payload">${iv}</pre>
          </div>
          ` : ''}
          <div class="footer">
            SecureCrypt Suite v1.2.0 | Lead Security Architect: Anshika Rathi | Internal Security Artifact
          </div>
          <script>
            window.onload = function() {
              window.print();
              window.close();
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
    addLog('Exported Security Audit PDF document.', 'success');
  };

  // Toggle Theme
  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    addLog(`Client theme context altered to: ${nextTheme.toUpperCase()}`, 'info');
  };

  // Dynamic recommendation based on algorithm selection
  const getSecurityVerdict = () => {
    switch(algorithm) {
      case 'AES':
        return {
          level: 'MAXIMUM SECURITY',
          color: 'text-cyber-green',
          border: 'border-emerald-500/30',
          bg: 'bg-emerald-500/5',
          advice: 'AES-256-CBC is the global standard for securing sensitive and government-level documents. Ensure your secret key is random, at least 16+ characters long, and never stored in plain text.'
        };
      case 'DES':
        return {
          level: 'LEGACY / UNSECURE',
          color: 'text-amber-500',
          border: 'border-amber-500/30',
          bg: 'bg-amber-500/5',
          advice: 'DES uses a legacy 56-bit derived key and is vulnerable to linear cryptanalysis and brute-force attacks in minutes. Avoid for production systems. Use only for legacy compatibility or academic analysis.'
        };
      case 'RSA':
        return {
          level: 'ASYMMETRIC EXCELLENT',
          color: 'text-cyber-purple',
          border: 'border-violet-500/30',
          bg: 'bg-violet-500/5',
          advice: 'RSA-2048 with OAEP-SHA256 padding provides high asymmetry protection. Note that RSA can only encrypt files smaller than the modulus size (max payload 190 bytes). For larger payloads, encrypt an AES key using RSA and the file using AES.'
        };
      default:
        return {
          level: 'UNKNOWN',
          color: 'text-slate-400',
          border: 'border-slate-800',
          bg: 'bg-slate-900/5',
          advice: 'Select an algorithm to view recommendations.'
        };
    }
  };

  const verdict = getSecurityVerdict();

  return (
    <div className={`relative min-h-screen pb-12 z-10 font-sans transition-colors duration-300 ${
      theme === 'light' ? 'light-theme' : 'bg-cyber-bg text-slate-100'
    }`}>
      {/* Background Grid + Cyber Glowing Blobs */}
      <div className="cyber-grid cyber-grid-animate"></div>
      <div className="glow-blob bg-cyber-accent w-96 h-96 top-1/4 left-1/10"></div>
      <div className="glow-blob bg-cyber-purple w-96 h-96 bottom-1/3 right-1/10" style={{ animationDelay: '-5s' }}></div>
      <div className="glow-blob bg-cyber-pink w-[500px] h-[500px] top-10 right-1/4" style={{ animationDelay: '-2s' }}></div>
      
      {/* CRT Scanline Overlay */}
      <div className="scanline-overlay"></div>

      {/* Main Layout Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* Top Header Bar */}
        <header className="glass-panel rounded-xl px-6 py-4 flex flex-col md:flex-row items-center justify-between border border-white/5 mb-6 gap-4 shadow-glass no-print">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-cyber-accent to-cyber-purple p-2.5 rounded-lg border border-cyan-400/30 shadow-neon-cyan/20 shadow-md">
              <Shield size={22} className="text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black font-mono tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-teal-300 to-purple-400">
                  SECURECRYPT
                </h1>
                <span className="text-[10px] bg-slate-900 border border-slate-700 px-2 py-0.5 rounded font-mono text-cyan-400">v1.2.0</span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-400 font-mono">Enterprise Cryptography Workspace</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-slate-950/50 hover:bg-slate-950 border border-white/5 text-slate-400 hover:text-cyan-400 transition-all duration-200"
              title={theme === 'dark' ? "Toggle Light Theme" : "Toggle Dark Theme"}
            >
              {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
            </button>

            <button 
              onClick={checkBackendHealth} 
              className="text-xs text-slate-400 hover:text-cyan-400 font-mono flex items-center gap-1 bg-slate-950/50 hover:bg-slate-950 px-2.5 py-1.5 rounded border border-white/5 transition-all duration-200"
              title="Click to check connection health"
            >
              <RefreshCw size={12} className={backendHealth === 'checking' ? 'animate-spin' : ''} />
              Ping
            </button>

            <div className="flex items-center gap-2 bg-slate-950/80 px-3 py-1.5 rounded-md border border-white/5 font-mono text-xs text-slate-300">
              <span className={`w-2 h-2 rounded-full inline-block ${
                backendHealth === 'online' ? 'bg-cyber-green status-dot-active' : 
                backendHealth === 'offline' ? 'bg-red-500 status-dot-danger' : 'bg-yellow-500 status-dot-warning animate-pulse'
              }`} />
              <span>SERVER: <span className={
                backendHealth === 'online' ? 'text-cyber-green font-bold' : 
                backendHealth === 'offline' ? 'text-red-500 font-bold' : 'text-yellow-500 font-bold'
              }>{backendHealth.toUpperCase()}</span></span>
            </div>
          </div>
        </header>

        {/* Tab Navigation Header */}
        <div className="flex flex-wrap gap-2 border-b border-white/5 pb-4 mb-6 no-print">
          <button
            onClick={() => setActiveTab('workspace')}
            className={`px-4 py-2 font-mono text-xs font-bold tracking-wider rounded-lg border transition-all duration-200 ${
              activeTab === 'workspace'
                ? 'bg-slate-900/80 text-cyber-accent border-cyber-accent/30 shadow-neon-cyan/10'
                : 'text-slate-500 hover:text-slate-300 border-transparent hover:bg-slate-900/30'
            }`}
          >
            💻 SECURITY WORKSPACE
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 font-mono text-xs font-bold tracking-wider rounded-lg border transition-all duration-200 ${
              activeTab === 'analytics'
                ? 'bg-slate-900/80 text-cyber-green border-cyber-green/30 shadow-neon-green/10'
                : 'text-slate-500 hover:text-slate-300 border-transparent hover:bg-slate-900/30'
            }`}
          >
            📊 SECURITY ANALYTICS
          </button>
          <button
            onClick={() => setActiveTab('academy')}
            className={`px-4 py-2 font-mono text-xs font-bold tracking-wider rounded-lg border transition-all duration-200 ${
              activeTab === 'academy'
                ? 'bg-slate-900/80 text-cyber-purple border-cyber-purple/30 shadow-neon-purple/10'
                : 'text-slate-500 hover:text-slate-300 border-transparent hover:bg-slate-900/30'
            }`}
          >
            🎓 CRYPTOGRAPHY ACADEMY
          </button>
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`px-4 py-2 font-mono text-xs font-bold tracking-wider rounded-lg border transition-all duration-200 ${
              activeTab === 'portfolio'
                ? 'bg-slate-900/80 text-cyan-400 border-cyan-400/30 shadow-neon-cyan/10'
                : 'text-slate-500 hover:text-slate-300 border-transparent hover:bg-slate-900/30'
            }`}
          >
            📁 DEVELOPER PORTFOLIO
          </button>
        </div>

        {/* Tab Content Router */}
        {activeTab === 'workspace' && (
          <div className="space-y-6">
            
            {/* Hero Section */}
            <section className="relative glass-panel rounded-xl p-6 sm:p-8 border border-white/5 overflow-hidden shadow-glass no-print">
              <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-gradient-to-bl from-cyber-accent/10 to-transparent rounded-bl-full pointer-events-none blur-3xl" />
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-accent/10 border border-cyber-accent/30 text-cyan-400 font-mono text-xs font-semibold mb-4 animate-cyber-float">
                  <Sparkles size={12} className="animate-spin-slow" />
                  <span>CRYPTOGRAPHIC OPERATIONS HUB // ONLINE</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold font-sans tracking-tight text-white mb-3">
                  Enterprise-grade Cryptographic Workspace
                </h2>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6 font-sans">
                  Perform zero-knowledge symmetric (AES, DES) and asymmetric (RSA) encryption models.
                  Verify keys, derive key hashes, upload payload documents, and download secure encryption records.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button 
                    onClick={() => setActiveTab('academy')} 
                    className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-cyan-450 hover:from-cyan-500 hover:to-cyan-400 text-slate-950 font-bold font-mono text-xs tracking-wider rounded-lg flex items-center gap-1.5 shadow-md transition-all duration-200"
                  >
                    View Encryption Academy
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </section>

            {/* Split Workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* LEFT: Inputs & Controls (7 Cols) */}
              <section className="lg:col-span-7 flex flex-col gap-6 no-print">
                <div className="glass-panel rounded-xl p-6 border border-white/5 shadow-glass flex flex-col gap-6">
                  
                  {/* Algorithm Selector */}
                  <div className="flex flex-col gap-2">
                    <h3 className="text-xs font-mono tracking-widest text-slate-400 uppercase flex items-center gap-1.5">
                      <span className="w-1.5 h-3 bg-cyber-accent rounded-sm inline-block animate-pulse"></span>
                      Select Encryption Algorithm
                    </h3>
                    <div className="grid grid-cols-3 gap-2 bg-slate-950/70 p-1 rounded-lg border border-slate-800/80">
                      {['AES', 'DES', 'RSA'].map((algo) => (
                        <button
                          key={algo}
                          onClick={() => {
                            setAlgorithm(algo);
                            addLog(`Switching algorithm workspace context to: ${algo}`, 'info');
                          }}
                          className={`py-2 px-3 rounded font-mono text-xs font-bold tracking-wider transition-all duration-300 ${
                            algorithm === algo 
                              ? 'bg-slate-900 text-cyber-accent border border-cyber-accent/30' 
                              : 'text-slate-500 hover:text-slate-350'
                          }`}
                        >
                          {algo}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Keys Manager Form */}
                  <div className="space-y-4 border-t border-slate-900 pt-4">
                    
                    {/* AES Key Input */}
                    {algorithm === 'AES' && (
                      <div className="space-y-2.5 animate-fade-in">
                        <div className="flex justify-between items-center">
                          <label className="text-xs font-mono text-slate-400 flex items-center gap-1">
                            <Key size={12} className="text-cyber-accent animate-pulse" />
                            AES Secret Key (256-bit derived key)
                          </label>
                          <button
                            onClick={() => generateSymmetricKey('AES')}
                            className="text-[10px] text-cyber-accent hover:underline flex items-center gap-1 font-bold font-mono"
                          >
                            <RefreshCw size={10} className={loading ? 'animate-spin' : ''} />
                            AUTO-GENERATE KEY
                          </button>
                        </div>
                        <input
                          type="text"
                          value={aesKey}
                          onChange={(e) => setAesKey(e.target.value)}
                          placeholder="Type password key or generate automatically..."
                          className="w-full bg-slate-950/80 text-slate-100 placeholder:text-slate-700 rounded-lg px-4 py-2.5 font-mono text-sm border border-slate-800 focus:border-cyber-accent focus:ring-1 focus:ring-cyber-accent/30 outline-none transition-all duration-200"
                        />
                        <KeyStrengthMeter password={aesKey} algorithm="AES" />
                      </div>
                    )}

                    {/* DES Key Input */}
                    {algorithm === 'DES' && (
                      <div className="space-y-2.5 animate-fade-in">
                        <div className="flex justify-between items-center">
                          <label className="text-xs font-mono text-slate-400 flex items-center gap-1">
                            <Key size={12} className="text-cyber-accent animate-pulse" />
                            DES Secret Key (64-bit derived block size)
                          </label>
                          <button
                            onClick={() => generateSymmetricKey('DES')}
                            className="text-[10px] text-cyber-accent hover:underline flex items-center gap-1 font-bold font-mono"
                          >
                            <RefreshCw size={10} className={loading ? 'animate-spin' : ''} />
                            AUTO-GENERATE KEY
                          </button>
                        </div>
                        <input
                          type="text"
                          value={desKey}
                          onChange={(e) => setDesKey(e.target.value)}
                          placeholder="Type password key (8 chars recommended)..."
                          className="w-full bg-slate-950/80 text-slate-100 placeholder:text-slate-700 rounded-lg px-4 py-2.5 font-mono text-sm border border-slate-800 focus:border-cyber-accent focus:ring-1 focus:ring-cyber-accent/30 outline-none transition-all duration-200"
                        />
                        <KeyStrengthMeter password={desKey} algorithm="DES" />
                      </div>
                    )}

                    {/* RSA Keypair */}
                    {algorithm === 'RSA' && (
                      <div className="space-y-4 animate-fade-in">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                            <Key size={12} className="text-cyber-purple animate-pulse" />
                            Asymmetric RSA Modulus Key pair Manager
                          </span>
                          <div className="flex gap-2">
                            <button
                              onClick={generateRsaKeys}
                              disabled={loading}
                              className="text-[10px] bg-cyber-purple/20 border border-cyber-purple/40 hover:border-cyber-purple/80 hover:bg-cyber-purple/30 text-purple-300 px-2.5 py-1.5 rounded flex items-center gap-1 font-mono font-bold transition-all duration-200"
                            >
                              <RefreshCw size={10} className={loading ? 'animate-spin' : ''} />
                              Generate Keys
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Public Key */}
                          <div className="space-y-2">
                            <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
                              <span>PUBLIC KEY (PEM)</span>
                              <div className="flex gap-1.5">
                                {rsaPublicKey && (
                                  <>
                                    <button
                                      onClick={() => copyToClipboard(rsaPublicKey, 'pubkey')}
                                      className="text-cyber-accent hover:underline flex items-center gap-0.5 text-[9px]"
                                    >
                                      COPY
                                    </button>
                                    <button
                                      onClick={handleDownloadPubKey}
                                      className="text-cyber-purple hover:underline flex items-center gap-0.5 text-[9px]"
                                      title="Download PEM File"
                                    >
                                      <Download size={8} /> PEM
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                            <textarea
                              value={rsaPublicKey}
                              onChange={(e) => setRsaPublicKey(e.target.value)}
                              placeholder="Paste PEM Public Key..."
                              className="w-full h-32 bg-slate-950/80 text-slate-300 placeholder:text-slate-700 rounded-lg p-3 font-mono text-[10px] border border-slate-800 focus:border-cyber-purple outline-none transition-all duration-250 resize-none"
                            />
                          </div>

                          {/* Private Key */}
                          <div className="space-y-2">
                            <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
                              <span>PRIVATE KEY (PEM)</span>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => setShowPrivateKey(!showPrivateKey)}
                                  className="text-slate-400 hover:text-slate-200 flex items-center gap-0.5 text-[9px]"
                                >
                                  {showPrivateKey ? <EyeOff size={10} /> : <Eye size={10} />}
                                  {showPrivateKey ? "HIDE" : "REVEAL"}
                                </button>
                                {rsaPrivateKey && (
                                  <>
                                    <button
                                      onClick={() => copyToClipboard(rsaPrivateKey, 'privkey')}
                                      className="text-cyber-purple hover:underline flex items-center gap-0.5 text-[9px]"
                                    >
                                      COPY
                                    </button>
                                    <button
                                      onClick={handleDownloadPrivKey}
                                      className="text-cyber-accent hover:underline flex items-center gap-0.5 text-[9px]"
                                      title="Download PEM File"
                                    >
                                      <Download size={8} /> PEM
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                            <div className="relative">
                              <textarea
                                value={rsaPrivateKey}
                                onChange={(e) => setRsaPrivateKey(e.target.value)}
                                placeholder="Paste PEM Private Key..."
                                className={`w-full h-32 bg-slate-950/80 placeholder:text-slate-700 rounded-lg p-3 font-mono text-[10px] border border-slate-800 focus:border-cyber-purple outline-none transition-all duration-250 resize-none ${
                                  !showPrivateKey && rsaPrivateKey ? 'text-slate-950 select-none blur-[4px]' : 'text-slate-300'
                                }`}
                              />
                              {!showPrivateKey && rsaPrivateKey && (
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                  <span className="bg-slate-950/90 text-[10px] border border-slate-800 text-slate-400 px-3 py-1.5 rounded font-mono font-bold tracking-widest shadow-lg">
                                    PRIVATE_KEY_BLURRED
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <KeyStrengthMeter password={rsaPrivateKey} algorithm="RSA" />
                      </div>
                    )}

                  </div>

                  {/* Plaintext Input Box */}
                  <div className="space-y-2.5 border-t border-slate-900 pt-4">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-mono tracking-wider text-slate-400 uppercase flex items-center gap-1.5">
                        <Database size={12} className="text-cyan-400" />
                        Plaintext Input Payload
                      </label>
                      <div className="flex gap-3 items-center">
                        {/* File Upload trigger */}
                        <label className="text-[10px] text-cyber-accent hover:text-cyan-300 cursor-pointer font-bold font-mono flex items-center gap-1">
                          <Upload size={11} />
                          Upload .txt File
                          <input
                            type="file"
                            onChange={handleFileUpload}
                            accept=".txt"
                            className="hidden"
                          />
                        </label>
                        <div className="text-[10px] text-slate-500 font-mono bg-slate-950/50 px-2 py-0.5 rounded border border-white/5">
                          {plaintext.length} Chars
                        </div>
                      </div>
                    </div>
                    <textarea
                      value={plaintext}
                      onChange={(e) => setPlaintext(e.target.value)}
                      placeholder="Type sensitive text here to process..."
                      className="w-full h-32 bg-slate-950/80 text-slate-200 placeholder:text-slate-700 rounded-lg p-4 font-mono text-sm border border-slate-800 focus:border-cyber-accent focus:ring-1 focus:ring-cyber-accent/30 outline-none transition-all duration-200 resize-none scrollbar"
                    />
                  </div>

                  {/* Actions buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                      onClick={handleEncrypt}
                      disabled={loading}
                      className="flex-1 py-3 px-4 bg-gradient-to-r from-cyan-600 to-cyan-450 hover:from-cyan-550 hover:to-cyan-400 text-slate-950 font-mono font-bold tracking-widest rounded-lg flex items-center justify-center gap-2 shadow-md hover:shadow-neon-cyan/20 active:scale-98 transition-all duration-150 disabled:opacity-50"
                    >
                      {loading ? <RefreshCw size={15} className="animate-spin" /> : <Lock size={15} />}
                      ENCRYPT
                    </button>

                    <button
                      onClick={handleDecrypt}
                      disabled={loading}
                      className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-700 to-cyber-purple hover:from-purple-650 hover:to-purple-500 text-white font-mono font-bold tracking-widest rounded-lg flex items-center justify-center gap-2 shadow-md hover:shadow-neon-purple/20 active:scale-98 transition-all duration-150 disabled:opacity-50"
                    >
                      {loading ? <RefreshCw size={15} className="animate-spin" /> : <Unlock size={15} />}
                      DECRYPT
                    </button>

                    <button
                      onClick={handleClearAll}
                      className="bg-slate-900/60 border border-slate-800/80 hover:border-red-500/30 hover:bg-red-500/10 text-slate-400 hover:text-red-400 px-4 py-3 rounded-lg font-mono font-bold text-xs tracking-wider flex items-center justify-center gap-1.5 transition-all duration-150"
                    >
                      <Trash2 size={13} />
                      CLEAR
                    </button>
                  </div>

                </div>
              </section>

              {/* RIGHT: Output Panel & Intelligence (5 Cols) */}
              <section className="lg:col-span-5 flex flex-col gap-6">
                
                {/* Results Panel */}
                <div className="glass-panel rounded-xl p-6 border border-white/5 shadow-glass flex flex-col gap-5 no-print">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-mono tracking-widest text-slate-400 uppercase flex items-center gap-1.5">
                      <span className="w-1.5 h-3 bg-cyan-500 rounded-sm inline-block animate-pulse"></span>
                      Results Board
                    </h3>
                    {ciphertext && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => downloadTextFile(ciphertext, `${algorithm}_ciphertext.txt`)}
                          className="text-[10px] text-cyber-accent hover:underline flex items-center gap-0.5 font-bold font-mono"
                          title="Download ciphertext as .txt file"
                        >
                          <Download size={11} /> TXT
                        </button>
                        <button
                          onClick={handleExportReport}
                          className="text-[10px] text-cyber-purple hover:underline flex items-center gap-0.5 font-bold font-mono"
                          title="Export security report as PDF"
                        >
                          <FileText size={11} /> REPORT (PDF)
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    {/* Ciphertext Box */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-slate-500 font-mono">CIPHERTEXT (BASE64)</span>
                        {ciphertext && (
                          <button
                            onClick={() => copyToClipboard(ciphertext, 'ciphertext')}
                            className="text-[10px] text-cyber-accent hover:underline flex items-center gap-1 font-bold font-mono"
                          >
                            {copiedType === 'ciphertext' ? <Check size={10} /> : <Copy size={10} />}
                            COPY
                          </button>
                        )}
                      </div>
                      <div className="w-full h-24 overflow-y-auto bg-slate-950/80 border border-slate-850 rounded-lg p-3 font-mono text-xs text-cyan-400 select-all break-all scrollbar">
                        {ciphertext || <span className="text-slate-700 italic">Awaiting cryptographic trigger...</span>}
                      </div>
                    </div>

                    {/* IV Box */}
                    {(algorithm === 'AES' || algorithm === 'DES') && (
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-slate-500 font-mono">INITIALIZATION VECTOR (IV)</span>
                          {iv && (
                            <button
                              onClick={() => copyToClipboard(iv, 'iv')}
                              className="text-[10px] text-cyber-accent hover:underline flex items-center gap-0.5 font-bold font-mono"
                            >
                              COPY
                            </button>
                          )}
                        </div>
                        <div className="w-full bg-slate-950/80 border border-slate-850 rounded-lg px-3 py-2 font-mono text-xs text-teal-400 break-all">
                          {iv || <span className="text-slate-700 italic">Auto-generated per block encrypt run...</span>}
                        </div>
                      </div>
                    )}

                    {/* Decrypted text */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-slate-500 font-mono">DECRYPTED PLAINTEXT</span>
                        {decryptedText && (
                          <button
                            onClick={() => copyToClipboard(decryptedText, 'decrypted')}
                            className="text-[10px] text-cyber-green hover:underline flex items-center gap-1 font-bold font-mono"
                          >
                            {copiedType === 'decrypted' ? <Check size={10} /> : <Copy size={10} />}
                            COPY
                          </button>
                        )}
                      </div>
                      <div className="w-full min-h-[50px] max-h-[100px] overflow-y-auto bg-slate-950/80 border border-slate-850 rounded-lg p-3 font-mono text-xs text-cyber-green select-all break-words scrollbar">
                        {decryptedText || <span className="text-slate-700 italic">Awaiting decryption...</span>}
                      </div>
                    </div>

                  </div>
                </div>

                {/* Security Intel */}
                <div className="glass-panel rounded-xl p-6 border border-white/5 shadow-glass flex flex-col gap-4 no-print">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-mono tracking-widest text-slate-400 uppercase flex items-center gap-1.5">
                      <Activity size={12} className="text-cyber-green animate-pulse" />
                      Security Intelligence
                    </h3>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold border ${verdict.border} ${verdict.color} ${verdict.bg}`}>
                      {verdict.level}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 bg-slate-950/50 p-3 rounded-lg border border-slate-900 text-slate-300">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[9px] text-slate-500 font-mono">MODE / SHAPE</span>
                      <span className="text-xs font-mono font-semibold text-slate-200">
                        {algorithm === 'AES' ? 'CBC / 256-bit' : algorithm === 'DES' ? 'CBC / 64-bit' : 'OAEP / SHA-256'}
                      </span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[9px] text-slate-500 font-mono">STRENGTH GRADE</span>
                      <span className={`text-xs font-mono font-semibold ${
                        algorithm === 'AES' ? 'text-cyber-green' : algorithm === 'DES' ? 'text-amber-500' : 'text-cyber-purple'
                      }`}>
                        {algorithm === 'AES' ? 'Excellent' : algorithm === 'DES' ? 'Unsafe' : 'High Asymmetry'}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2.5 bg-slate-950/60 p-3 rounded-lg border border-white/5 items-start">
                    <Info size={16} className={`shrink-0 mt-0.5 ${verdict.color}`} />
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-slate-450 block font-bold">RECOMENDATION // ENGINE</span>
                      <p className="text-[11px] text-slate-300 leading-relaxed font-sans font-medium">
                        {verdict.advice}
                      </p>
                    </div>
                  </div>
                </div>

              </section>

            </div>

            {/* Core Workflow Visualizer */}
            <Visualizer algorithm={algorithm} activeOperation={activeOperation} trigger={visualizerTrigger} />

            {/* Hacker Terminal Logs */}
            <div className="no-print">
              <Terminal logs={logs} onClear={() => setLogs([])} />
            </div>

          </div>
        )}

        {/* Tab 2: Analytics */}
        {activeTab === 'analytics' && (
          <HistoryTracker history={history} onClearHistory={handleClearHistory} />
        )}

        {/* Tab 3: Academy */}
        {activeTab === 'academy' && (
          <div className="space-y-8 animate-fade-in no-print">
            
            {/* Explanatory intro */}
            <section className="glass-panel rounded-xl p-6 border border-white/5 shadow-glass space-y-2">
              <h2 className="text-base font-bold text-white">Educational Cryptography Academy</h2>
              <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">
                Explore definitions and comparative breakdowns of symmetric and asymmetric ciphers. SecureCrypt supports AES-256 for secure file encryption, DES for legacy compliance, and RSA-2048-OAEP for asymmetrical key exchange procedures.
              </p>
            </section>

            {/* Core Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* AES Card */}
              <div className="cyber-card rounded-xl p-6 flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-400/20">
                    <ShieldCheck size={18} className="text-cyber-accent" />
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400 font-bold bg-cyan-500/5 px-2 py-0.5 rounded border border-cyan-500/20">AES-256</span>
                </div>
                <h3 className="text-base font-bold font-sans text-slate-200">Advanced Encryption Standard</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  The primary symmetric standard globally. Encrypts data in 128-bit blocks using 256-bit keys, which yields a key space size of 2<sup>256</sup> - mathematically impossible to brute-force with current computer technology.
                </p>
                <div className="border-t border-slate-900 pt-3 mt-auto space-y-1">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-slate-500">Security Grade:</span>
                    <span className="text-cyber-green font-bold">MILITARY</span>
                  </div>
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-slate-500">Application:</span>
                    <span className="text-slate-300">File Storage, SSL/TLS</span>
                  </div>
                </div>
              </div>

              {/* DES Card */}
              <div className="cyber-card rounded-xl p-6 flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-400/20">
                    <AlertTriangle size={18} className="text-amber-500" />
                  </div>
                  <span className="text-[10px] font-mono text-amber-500 font-bold bg-amber-500/5 px-2 py-0.5 rounded border border-amber-500/20">DES</span>
                </div>
                <h3 className="text-base font-bold font-sans text-slate-200">Data Encryption Standard</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  A classic block cipher developed in 1977. Its short 56-bit key size is highly vulnerable to modern computing clusters, but it serves as an excellent case study in cryptanalysis.
                </p>
                <div className="border-t border-slate-900 pt-3 mt-auto space-y-1">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-slate-500">Security Grade:</span>
                    <span className="text-red-500 font-bold">DEPRECATED</span>
                  </div>
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-slate-500">Application:</span>
                    <span className="text-slate-300">Legacy Systems, Banks</span>
                  </div>
                </div>
              </div>

              {/* RSA Card */}
              <div className="cyber-card-purple rounded-xl p-6 flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div className="p-2 bg-violet-500/10 rounded-lg border border-violet-400/20">
                    <Layers size={18} className="text-cyber-purple" />
                  </div>
                  <span className="text-[10px] font-mono text-cyber-purple font-bold bg-violet-500/5 px-2 py-0.5 rounded border border-violet-500/20">RSA-2048</span>
                </div>
                <h3 className="text-base font-bold font-sans text-slate-200">Rivest-Shamir-Adleman</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  A foundational asymmetric cryptosystem. Encrypts small messages using a Public Key, which can only be decrypted by the corresponding private key using advanced modular exponentiation calculations.
                </p>
                <div className="border-t border-slate-900 pt-3 mt-auto space-y-1">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-slate-500">Security Grade:</span>
                    <span className="text-cyan-400 font-bold">EXCELLENT</span>
                  </div>
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-slate-500">Application:</span>
                    <span className="text-slate-300">Secure Key Exchange</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Spec Matrix Table */}
            <div id="tech-specs">
              <h2 className="text-sm font-mono tracking-widest text-slate-400 uppercase mb-4 flex items-center gap-2">
                <span className="w-1.5 h-3 bg-cyber-green rounded-sm inline-block"></span>
                Symmetric vs Asymmetric Spec Matrix
              </h2>
              <div className="cyber-table-container">
                <div className="overflow-x-auto">
                  <table className="w-full cyber-table text-left border-collapse text-slate-300">
                    <thead>
                      <tr>
                        <th className="px-6 py-4">Algorithm</th>
                        <th className="px-6 py-4">Type</th>
                        <th className="px-6 py-4">Key Size</th>
                        <th className="px-6 py-4">Encryption Speed</th>
                        <th className="px-6 py-4">Security Level</th>
                        <th className="px-6 py-4">Common Use Cases</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900 text-xs font-mono">
                      <tr>
                        <td className="px-6 py-4 font-bold text-white">AES-256</td>
                        <td className="px-6 py-4">Symmetric Block Cipher</td>
                        <td className="px-6 py-4">256 bits</td>
                        <td className="px-6 py-4 text-cyber-green">Fast (Hardware Accelerated)</td>
                        <td className="px-6 py-4"><span className="px-2 py-0.5 bg-emerald-500/10 text-cyber-green rounded border border-emerald-500/20">Highest</span></td>
                        <td className="px-6 py-4 text-slate-400 font-sans">Secure data transmission, database encryption, local storage</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-bold text-white">DES-CBC</td>
                        <td className="px-6 py-4">Symmetric Block Cipher</td>
                        <td className="px-6 py-4">56 bits</td>
                        <td className="px-6 py-4 text-amber-500">Moderate</td>
                        <td className="px-6 py-4"><span className="px-2 py-0.5 bg-red-500/10 text-red-400 rounded border border-red-500/20">Deprecated</span></td>
                        <td className="px-6 py-4 text-slate-400 font-sans">Legacy smart cards, older financial transactions, academic modeling</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-bold text-white">RSA-2048</td>
                        <td className="px-6 py-4">Asymmetric Key Pair</td>
                        <td className="px-6 py-4">2048 bits</td>
                        <td className="px-6 py-4 text-yellow-500">Slow (Math-Intensive)</td>
                        <td className="px-6 py-4"><span className="px-2 py-0.5 bg-cyan-500/10 text-cyber-accent rounded border border-cyan-500/20">High Asymmetric</span></td>
                        <td className="px-6 py-4 text-slate-400 font-sans">Digital signatures, SSH connections, initial TLS key exchange</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Tab 4: Developer Portfolio */}
        {activeTab === 'portfolio' && (
          <PortfolioDocs />
        )}

        {/* Footer */}
        <footer className="glass-panel rounded-xl px-6 py-6 border border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-xs text-slate-500 mt-12 shadow-glass no-print">
          <div className="flex flex-col gap-1 text-center md:text-left">
            <span>SECURECRYPT CORE ENGINE // INTEGRATED SYSTEM</span>
            <span>Designed and Developed by <strong className="text-slate-350">Anshika Rathi</strong></span>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4 text-[10px]">
            <div className="flex gap-2">
              <span className="bg-slate-950/60 border border-slate-900 px-2 py-0.5 rounded text-slate-400">React 19</span>
              <span className="bg-slate-950/60 border border-slate-900 px-2 py-0.5 rounded text-slate-400">Vite 8</span>
              <span className="bg-slate-950/60 border border-slate-900 px-2 py-0.5 rounded text-slate-400">Python 3</span>
              <span className="bg-slate-950/60 border border-slate-900 px-2 py-0.5 rounded text-slate-400">Flask</span>
            </div>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-cyan-500 hover:underline flex items-center gap-0.5 font-bold"
            >
              GitHub Codebase <ExternalLink size={10} />
            </a>
          </div>
        </footer>

      </div>

      {/* Floating Animated Toast Alert */}
      {toast.visible && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in no-print">
          <div className={`px-4 py-3 rounded-lg border shadow-lg flex items-center gap-2.5 font-mono text-xs ${
            toast.type === 'success' 
              ? 'bg-slate-900 border-cyber-green/40 text-cyber-green shadow-neon-green/10'
              : toast.type === 'error' 
              ? 'bg-slate-900 border-red-500/40 text-red-400'
              : 'bg-slate-900 border-cyber-accent/40 text-cyber-accent shadow-neon-cyan/10'
          }`}>
            <span className={`w-2 h-2 rounded-full ${
              toast.type === 'success' ? 'bg-cyber-green status-dot-active' : 
              toast.type === 'error' ? 'bg-red-500 status-dot-danger' : 'bg-cyber-accent status-dot-warning animate-pulse'
            }`} />
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
