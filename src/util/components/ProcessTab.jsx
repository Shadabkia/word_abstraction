import React, { useState, useEffect, useRef } from 'react';

const API_BASE = '/api';

export default function ProcessTab() {
  // Common state
  const [savedApiKeyInfo, setSavedApiKeyInfo] = useState(null);
  const [localApiKey, setLocalApiKey] = useState('');
  const [apiKeyTesting, setApiKeyTesting] = useState(false);
  const [apiKeySaving, setApiKeySaving] = useState(false);
  const [apiKeyTestResult, setApiKeyTestResult] = useState(null);
  
  // Word Generator state
  const [wordGenState, setWordGenState] = useState(null);
  const [wordGenConfig, setWordGenConfig] = useState(null);
  const [wordGenLoading, setWordGenLoading] = useState(false);
  const [wordGenMetrics, setWordGenMetrics] = useState(null);
  
  // Level Curator state
  const [curatorState, setCuratorState] = useState(null);
  const [curatorConfig, setCuratorConfig] = useState(null);
  const [curatorLoading, setCuratorLoading] = useState(false);
  const [curatorMetrics, setCuratorMetrics] = useState(null);
  
  // Logs state
  const [logs, setLogs] = useState([]);
  const [logFilter, setLogFilter] = useState('all'); // 'all', 'word-generator', 'level-curator'
  const [streamConnected, setStreamConnected] = useState(false);
  
  const logsEndRef = useRef(null);
  const eventSourceRef = useRef(null);
  const maxLogs = 200;

  const fetchWordGenState = async (loadConfig = false) => {
    try {
      const res = await fetch(`${API_BASE}/state`);
      const data = await res.json();
      setWordGenState(data);
      if (loadConfig) setWordGenConfig(data.config);
    } catch (e) {
      console.error("Failed to fetch word gen state", e);
    }
  };

  const fetchCuratorState = async (loadConfig = false) => {
    try {
      const res = await fetch(`${API_BASE}/curator/state`);
      const data = await res.json();
      setCuratorState(data);
      if (loadConfig) setCuratorConfig(data.config);
    } catch (e) {
      console.error("Failed to fetch curator state", e);
    }
  };

  const fetchSavedApiKey = async () => {
    try {
      const res = await fetch(`${API_BASE}/apikey/saved`);
      const data = await res.json();
      setSavedApiKeyInfo(data);
    } catch (e) {
      console.error("Failed to fetch saved API key", e);
    }
  };

  useEffect(() => {
    // Load configs only on initial mount
    fetchWordGenState(true);
    fetchCuratorState(true);
    fetchSavedApiKey();
    
    // Poll for state updates without reloading configs
    const interval = setInterval(() => {
      fetchWordGenState(false);
      fetchCuratorState(false);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const testApiKey = async () => {
    const keyToTest = localApiKey?.trim();
    if (!keyToTest) {
      setApiKeyTestResult({ success: false, message: 'Please enter an API key' });
      return;
    }

    setApiKeyTesting(true);
    setApiKeyTestResult(null);
    try {
      const res = await fetch(`${API_BASE}/apikey/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: keyToTest })
      });
      
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response. Make sure the server is running on port 3001.');
      }
      
      const data = await res.json();
      setApiKeyTestResult(data);
    } catch (e) {
      console.error('API Key test error:', e);
      setApiKeyTestResult({ 
        success: false, 
        message: 'Test failed: ' + e.message,
        hint: 'Make sure the backend server is running (npm run server or npm run util)'
      });
    } finally {
      setApiKeyTesting(false);
    }
  };

  const saveApiKey = async () => {
    const keyToSave = localApiKey?.trim();
    if (!keyToSave) {
      alert('Please enter an API key');
      return;
    }

    setApiKeySaving(true);
    try {
      const res = await fetch(`${API_BASE}/apikey`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: keyToSave })
      });
      const data = await res.json();
      if (data.success) {
        alert('API Key saved successfully');
        await fetchSavedApiKey();
        setLocalApiKey('');
      }
    } catch (e) {
      alert('Error saving API key: ' + e.message);
    } finally {
      setApiKeySaving(false);
    }
  };

  // Setup SSE connection for real-time updates
  useEffect(() => {
    const eventSource = new EventSource(`${API_BASE}/stream`);
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      setStreamConnected(true);
      console.log('SSE connection established');
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'log') {
          setLogs(prev => {
            const newLogs = [...prev, data.data];
            if (newLogs.length > maxLogs) {
              return newLogs.slice(-maxLogs);
            }
            return newLogs;
          });
        } else if (data.type === 'metrics') {
          setWordGenMetrics(data.data);
        } else if (data.type === 'curator-metrics') {
          setCuratorMetrics(data.data);
        } else if (data.type === 'connected') {
          console.log('Stream connected:', data.message);
        }
      } catch (e) {
        console.error('Failed to parse SSE message', e);
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE error', error);
      setStreamConnected(false);
      eventSource.close();
      setTimeout(() => {
        if (!eventSourceRef.current || eventSourceRef.current.readyState === EventSource.CLOSED) {
          console.log('Attempting to reconnect...');
        }
      }, 3000);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  // Auto-scroll logs to bottom
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const toggleWordGen = async () => {
    setWordGenLoading(true);
    try {
      if (wordGenState.is_running) {
        await fetch(`${API_BASE}/process/stop`, { method: 'POST' });
      } else {
        await fetch(`${API_BASE}/process/start`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({})
        });
      }
      await fetchWordGenState();
    } catch (e) {
      alert("Error toggling word generator: " + e.message);
    } finally {
      setWordGenLoading(false);
    }
  };

  const toggleCurator = async () => {
    setCuratorLoading(true);
    try {
      if (curatorState.is_running) {
        await fetch(`${API_BASE}/curator/stop`, { method: 'POST' });
      } else {
        await fetch(`${API_BASE}/curator/start`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({})
        });
      }
      await fetchCuratorState();
    } catch (e) {
      alert("Error toggling level curator: " + e.message);
    } finally {
      setCuratorLoading(false);
    }
  };

  const saveWordGenConfig = async () => {
    try {
      await fetch(`${API_BASE}/config`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config: wordGenConfig })
      });
      alert("Word Generator config saved");
      // Reload config from server to confirm
      await fetchWordGenState(true);
    } catch (e) {
      alert("Error saving config");
    }
  };

  const saveCuratorConfig = async () => {
    try {
      await fetch(`${API_BASE}/curator/config`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config: curatorConfig })
      });
      alert("Level Curator config saved");
      // Reload config from server to confirm
      await fetchCuratorState(true);
    } catch (e) {
      alert("Error saving config");
    }
  };

  const getLogIcon = (level) => {
    switch (level) {
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      case 'debug': return '🔍';
      default: return '•';
    }
  };

  const getLogColor = (level) => {
    switch (level) {
      case 'error': return 'text-red-400';
      case 'warning': return 'text-yellow-400';
      case 'info': return 'text-blue-400';
      case 'debug': return 'text-gray-500';
      default: return 'text-gray-400';
    }
  };

  const getSourceBadge = (source) => {
    if (source === 'word-generator') {
      return <span className="text-[10px] bg-blue-600 px-1.5 py-0.5 rounded font-bold">WORDS</span>;
    } else if (source === 'level-curator') {
      return <span className="text-[10px] bg-purple-600 px-1.5 py-0.5 rounded font-bold">LEVELS</span>;
    }
    return null;
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const filteredLogs = logs.filter(log => {
    if (logFilter === 'all') return true;
    return log.source === logFilter;
  });

  if (!wordGenState || !curatorState) return <div className="p-6 text-center text-sm">Loading state...</div>;

  const wordGenProgress = wordGenMetrics && wordGenMetrics.candidatesGenerated > 0 
    ? (wordGenMetrics.candidatesProcessed / wordGenMetrics.candidatesGenerated) * 100 
    : 0;

  const curatorProgress = curatorMetrics && curatorMetrics.levelsGenerated > 0 
    ? (curatorMetrics.levelsProcessed / curatorMetrics.levelsGenerated) * 100 
    : 0;

  return (
    <div className="p-4 space-y-4">
      {/* Top Row - API Config, Word Generation, Level Curator */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* API Key Section */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-4 py-2.5 border-b border-gray-700 flex items-center justify-between">
          <h2 className="text-lg font-bold flex items-center gap-2">
            🔑 API Configuration
          </h2>
          {streamConnected && (
            <span className="text-[10px] text-green-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
              LIVE
            </span>
          )}
        </div>
        
        <div className="p-4">
          {savedApiKeyInfo?.hasSaved && (
            <div className="mb-3 bg-green-900/20 border border-green-700/50 rounded px-2 py-1.5">
              <div className="text-green-400 text-[10px] font-bold mb-0.5">✓ Configured</div>
              <div className="text-gray-400 text-[10px] font-mono truncate">{savedApiKeyInfo.masked}</div>
            </div>
          )}
          
          <div className="space-y-2">
            <input 
              type="password" 
              value={localApiKey}
              onChange={(e) => setLocalApiKey(e.target.value)}
              placeholder={savedApiKeyInfo?.hasSaved ? "Enter new key" : "sk-..."}
              className="bg-gray-900 border border-gray-700 rounded px-2 py-1.5 text-xs font-mono focus:border-blue-500 focus:outline-none w-full"
            />
            
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={testApiKey}
                disabled={apiKeyTesting || !localApiKey}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed px-2 py-1.5 rounded text-xs font-semibold transition-colors"
              >
                {apiKeyTesting ? '...' : 'Test'}
              </button>
              <button 
                onClick={saveApiKey}
                disabled={apiKeySaving || !localApiKey}
                className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed px-2 py-1.5 rounded text-xs font-semibold transition-colors"
              >
                {apiKeySaving ? '...' : 'Save'}
              </button>
            </div>
          </div>

          {apiKeyTestResult && (
            <div className={`mt-2 p-2 rounded text-xs ${
              apiKeyTestResult.success 
                ? 'bg-green-900/20 border border-green-700/50 text-green-300' 
                : 'bg-red-900/20 border border-red-700/50 text-red-300'
            }`}>
              <div className="font-bold">{apiKeyTestResult.success ? '✓ Valid' : '✗ Invalid'}</div>
              <div className="text-[10px] mt-0.5">{apiKeyTestResult.message || apiKeyTestResult.error}</div>
            </div>
          )}
        </div>
        </div>

        {/* Word Generation Section */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-900 to-blue-800 px-4 py-2.5 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold flex items-center gap-2">
              📝 Word Generation
            </h2>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${wordGenState.is_running ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
              <span className="text-xs font-semibold">{wordGenState.is_running ? 'Running' : 'Stopped'}</span>
            </div>
          </div>
        </div>

        <div className="p-4">
          {/* Control */}
          <button
            onClick={toggleWordGen}
            disabled={wordGenLoading || (!wordGenState.is_running && !savedApiKeyInfo?.hasSaved)}
            className={`w-full py-2.5 rounded-lg font-bold text-xs transition-colors mb-3 ${
              wordGenState.is_running 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed'
            }`}
          >
            {wordGenLoading ? '...' : wordGenState.is_running ? '⏹ Stop' : '▶ Start'}
          </button>
          {!savedApiKeyInfo?.hasSaved && !wordGenState.is_running && (
            <p className="text-red-400 text-[10px] text-center mb-3">Need API Key</p>
          )}

          {/* Configuration */}
          {wordGenConfig && (
            <div className="space-y-2 mb-3">
              <div>
                <label className="block text-[10px] text-gray-400 mb-1 uppercase tracking-wide font-semibold">Batch Size</label>
                <input 
                  type="number" 
                  value={wordGenConfig.batch_size} 
                  onChange={(e) => setWordGenConfig({...wordGenConfig, batch_size: parseInt(e.target.value)})}
                  className="bg-gray-900 border border-gray-700 rounded w-full px-2 py-1.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-[10px] text-gray-400 mb-1 uppercase tracking-wide font-semibold">Min Quality</label>
                <input 
                  type="number" 
                  value={wordGenConfig.min_quality_score} 
                  onChange={(e) => setWordGenConfig({...wordGenConfig, min_quality_score: parseInt(e.target.value)})}
                  className="bg-gray-900 border border-gray-700 rounded w-full px-2 py-1.5 text-sm"
                />
              </div>
              <button 
                onClick={saveWordGenConfig}
                className="bg-gray-700 hover:bg-gray-600 px-3 py-1.5 rounded text-xs font-semibold w-full transition-colors"
              >
                Save Config
              </button>
            </div>
          )}

          {/* Metrics */}
          {wordGenMetrics && wordGenState.is_running && (
            <div className="pt-3 border-t border-gray-700">
              <div className="grid grid-cols-4 gap-2 mb-2">
                <div className="bg-gray-900 rounded p-2">
                  <div className="text-[10px] text-gray-400 mb-0.5">Batch</div>
                  <div className="text-sm font-bold">{wordGenMetrics.currentBatchId || '-'}</div>
                </div>
                <div className="bg-gray-900 rounded p-2">
                  <div className="text-[10px] text-gray-400 mb-0.5">Generated</div>
                  <div className="text-sm font-bold text-blue-400">{wordGenMetrics.candidatesGenerated}</div>
                </div>
                <div className="bg-gray-900 rounded p-2">
                  <div className="text-[10px] text-gray-400 mb-0.5">Validated</div>
                  <div className="text-sm font-bold text-purple-400">{wordGenMetrics.candidatesValidated}</div>
                </div>
                <div className="bg-gray-900 rounded p-2">
                  <div className="text-[10px] text-gray-400 mb-0.5">Saved</div>
                  <div className="text-sm font-bold text-green-400">{wordGenMetrics.candidatesSaved}</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-2">
                <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                  <span>Progress</span>
                  <span>{wordGenMetrics.candidatesProcessed} / {wordGenMetrics.candidatesGenerated}</span>
                </div>
                <div className="w-full bg-gray-900 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-300"
                    style={{ width: `${wordGenProgress}%` }}
                  ></div>
                </div>
              </div>

              {/* API Calls */}
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div className="bg-gray-900 rounded px-2 py-1">
                  <span className="text-gray-400">Gen Calls:</span>
                  <span className="ml-1 font-bold">{wordGenMetrics.apiCallsGenerate}</span>
                </div>
                <div className="bg-gray-900 rounded px-2 py-1">
                  <span className="text-gray-400">Val Calls:</span>
                  <span className="ml-1 font-bold">{wordGenMetrics.apiCallsValidate}</span>
                </div>
              </div>
            </div>
          )}
        </div>
        </div>

        {/* Level Curator Section */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-900 to-purple-800 px-4 py-2.5 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold flex items-center gap-2">
              🎮 Level Curator
            </h2>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${curatorState.is_running ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
              <span className="text-xs font-semibold">{curatorState.is_running ? 'Running' : 'Stopped'}</span>
            </div>
          </div>
        </div>

        <div className="p-4">
          {/* Control */}
          <button
            onClick={toggleCurator}
            disabled={curatorLoading || (!curatorState.is_running && !savedApiKeyInfo?.hasSaved)}
            className={`w-full py-2.5 rounded-lg font-bold text-xs transition-colors mb-3 ${
              curatorState.is_running 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed'
            }`}
          >
            {curatorLoading ? '...' : curatorState.is_running ? '⏹ Stop' : '▶ Start'}
          </button>
          {!savedApiKeyInfo?.hasSaved && !curatorState.is_running && (
            <p className="text-red-400 text-[10px] text-center mb-3">Need API Key</p>
          )}

          {/* Configuration */}
          {curatorConfig && (
            <div className="space-y-2 mb-3">
              <div>
                <label className="block text-[10px] text-gray-400 mb-1 uppercase tracking-wide font-semibold">Levels/Batch</label>
                <input 
                  type="number" 
                  value={curatorConfig.levels_per_batch} 
                  onChange={(e) => setCuratorConfig({...curatorConfig, levels_per_batch: parseInt(e.target.value)})}
                  className="bg-gray-900 border border-gray-700 rounded w-full px-2 py-1.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-[10px] text-gray-400 mb-1 uppercase tracking-wide font-semibold">Groups/Level</label>
                <input 
                  type="number" 
                  value={curatorConfig.groups_per_level} 
                  onChange={(e) => setCuratorConfig({...curatorConfig, groups_per_level: parseInt(e.target.value)})}
                  className="bg-gray-900 border border-gray-700 rounded w-full px-2 py-1.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-[10px] text-gray-400 mb-1 uppercase tracking-wide font-semibold">Min Score</label>
                <input 
                  type="number" 
                  value={curatorConfig.min_playability_score} 
                  onChange={(e) => setCuratorConfig({...curatorConfig, min_playability_score: parseInt(e.target.value)})}
                  className="bg-gray-900 border border-gray-700 rounded w-full px-2 py-1.5 text-sm"
                />
              </div>
              <button 
                onClick={saveCuratorConfig}
                className="bg-gray-700 hover:bg-gray-600 px-3 py-1.5 rounded text-xs font-semibold w-full transition-colors"
              >
                Save Config
              </button>
            </div>
          )}

          {/* Metrics */}
          {curatorMetrics && curatorState.is_running && (
            <div className="pt-3 border-t border-gray-700">
              <div className="grid grid-cols-4 gap-2 mb-2">
                <div className="bg-gray-900 rounded p-2">
                  <div className="text-[10px] text-gray-400 mb-0.5">Batch</div>
                  <div className="text-sm font-bold">{curatorMetrics.currentBatchId || '-'}</div>
                </div>
                <div className="bg-gray-900 rounded p-2">
                  <div className="text-[10px] text-gray-400 mb-0.5">Generated</div>
                  <div className="text-sm font-bold text-blue-400">{curatorMetrics.levelsGenerated}</div>
                </div>
                <div className="bg-gray-900 rounded p-2">
                  <div className="text-[10px] text-gray-400 mb-0.5">Validated</div>
                  <div className="text-sm font-bold text-purple-400">{curatorMetrics.levelsValidated}</div>
                </div>
                <div className="bg-gray-900 rounded p-2">
                  <div className="text-[10px] text-gray-400 mb-0.5">Saved</div>
                  <div className="text-sm font-bold text-green-400">{curatorMetrics.levelsSaved}</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-2">
                <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                  <span>Progress</span>
                  <span>{curatorMetrics.levelsProcessed} / {curatorMetrics.levelsGenerated}</span>
                </div>
                <div className="w-full bg-gray-900 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-300"
                    style={{ width: `${curatorProgress}%` }}
                  ></div>
                </div>
              </div>

              {/* API Calls */}
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div className="bg-gray-900 rounded px-2 py-1">
                  <span className="text-gray-400">Gen Calls:</span>
                  <span className="ml-1 font-bold">{curatorMetrics.apiCallsGenerate}</span>
                </div>
                <div className="bg-gray-900 rounded px-2 py-1">
                  <span className="text-gray-400">Val Calls:</span>
                  <span className="ml-1 font-bold">{curatorMetrics.apiCallsValidate}</span>
                </div>
              </div>
            </div>
          )}
        </div>
        </div>
      </div>

      {/* Unified Logs Panel */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <div className="bg-gray-900 px-4 py-2 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-sm font-bold">Activity Logs</h2>
          <div className="flex gap-2 items-center">
            <div className="flex gap-1 bg-gray-700 rounded p-0.5">
              <button 
                onClick={() => setLogFilter('all')}
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
                  logFilter === 'all' ? 'bg-blue-600' : 'bg-transparent hover:bg-gray-600'
                }`}
              >
                ALL
              </button>
              <button 
                onClick={() => setLogFilter('word-generator')}
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
                  logFilter === 'word-generator' ? 'bg-blue-600' : 'bg-transparent hover:bg-gray-600'
                }`}
              >
                WORDS
              </button>
              <button 
                onClick={() => setLogFilter('level-curator')}
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
                  logFilter === 'level-curator' ? 'bg-purple-600' : 'bg-transparent hover:bg-gray-600'
                }`}
              >
                LEVELS
              </button>
            </div>
            <button 
              onClick={clearLogs}
              className="text-[10px] bg-gray-700 hover:bg-gray-600 px-2 py-0.5 rounded font-bold"
            >
              CLEAR
            </button>
          </div>
        </div>
        <div className="p-2 h-80 overflow-y-auto font-mono text-[11px] bg-black">
          {filteredLogs.length === 0 ? (
            <div className="text-gray-500 text-center py-8 text-xs">
              {streamConnected ? (
                logFilter === 'all' ? 'Waiting for logs...' : `No ${logFilter} logs yet...`
              ) : 'Connecting to stream...'}
            </div>
          ) : (
            <div className="space-y-0.5">
              {filteredLogs.map((log, idx) => (
                <div key={idx} className={`flex gap-1.5 items-start ${getLogColor(log.level)}`}>
                  <span className="text-gray-500 text-[10px] whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                  {getSourceBadge(log.source)}
                  <span className="flex-shrink-0">{getLogIcon(log.level)}</span>
                  <span className="flex-1 break-words leading-tight">{log.message}</span>
                </div>
              ))}
              <div ref={logsEndRef} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
