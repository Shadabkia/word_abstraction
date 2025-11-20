import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDb } from './db.js';
import db from './db.js';
import { Worker } from './worker.js';
import { LevelCurator } from './levelCurator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3001; // Vite uses 3000 usually

app.use(cors());
app.use(express.json());

// Initialize DB
initDb();

// Initialize Worker and Level Curator
const worker = new Worker(db);
const levelCurator = new LevelCurator(db);

// Store SSE clients
const sseClients = new Set();

// --- Routes ---

// SSE endpoint for real-time logs and metrics
app.get('/api/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  // Send initial connection message
  res.write(`data: ${JSON.stringify({ type: 'connected', message: 'Stream connected' })}\n\n`);

  // Add client to set
  sseClients.add(res);

  // Send current metrics immediately
  res.write(`data: ${JSON.stringify({ type: 'metrics', data: worker.metrics })}\n\n`);
  res.write(`data: ${JSON.stringify({ type: 'curator-metrics', data: levelCurator.metrics })}\n\n`);

  // Handle client disconnect
  req.on('close', () => {
    sseClients.delete(res);
  });
});

// Setup worker event listeners
worker.on('log', (logEntry) => {
  const message = `data: ${JSON.stringify({ type: 'log', data: logEntry })}\n\n`;
  sseClients.forEach(client => {
    try {
      client.write(message);
    } catch (e) {
      sseClients.delete(client);
    }
  });
});

worker.on('metrics', (metrics) => {
  const message = `data: ${JSON.stringify({ type: 'metrics', data: metrics })}\n\n`;
  sseClients.forEach(client => {
    try {
      client.write(message);
    } catch (e) {
      sseClients.delete(client);
    }
  });
});

// Setup level curator event listeners
levelCurator.on('log', (logEntry) => {
  const message = `data: ${JSON.stringify({ type: 'log', data: logEntry })}\n\n`;
  sseClients.forEach(client => {
    try {
      client.write(message);
    } catch (e) {
      sseClients.delete(client);
    }
  });
});

levelCurator.on('metrics', (metrics) => {
  const message = `data: ${JSON.stringify({ type: 'curator-metrics', data: metrics })}\n\n`;
  sseClients.forEach(client => {
    try {
      client.write(message);
    } catch (e) {
      sseClients.delete(client);
    }
  });
});

// Process State
app.get('/api/state', (req, res) => {
  const state = db.prepare('SELECT * FROM process_state WHERE id = 1').get();
  state.config = JSON.parse(state.config);
  res.json({ ...state, is_running: worker.isRunning });
});

app.post('/api/config', (req, res) => {
  const { config } = req.body;
  db.prepare('UPDATE process_state SET config = ? WHERE id = 1').run(JSON.stringify(config));
  res.json({ success: true });
});

app.post('/api/apikey', (req, res) => {
  const { apiKey } = req.body;
  if (!apiKey) return res.status(400).json({ error: 'API Key required' });
  
  console.log('[SAVE API KEY] Received key length:', apiKey.length);
  console.log('[SAVE API KEY] Key prefix:', apiKey.substring(0, 10));
  console.log('[SAVE API KEY] Key suffix:', apiKey.substring(apiKey.length - 10));
  
  // Save API key to database
  db.prepare('UPDATE process_state SET api_key = ? WHERE id = 1').run(apiKey);
  
  // Verify what was saved
  const saved = db.prepare('SELECT api_key FROM process_state WHERE id = 1').get();
  console.log('[SAVE API KEY] Saved key length:', saved.api_key?.length);
  console.log('[SAVE API KEY] Saved key prefix:', saved.api_key?.substring(0, 10));
  console.log('[SAVE API KEY] Saved key suffix:', saved.api_key?.substring(saved.api_key.length - 10));
  console.log('[SAVE API KEY] Keys match:', saved.api_key === apiKey);
  
  res.json({ success: true });
});

app.post('/api/apikey/test', async (req, res) => {
  const { apiKey } = req.body;
  if (!apiKey) return res.status(400).json({ error: 'API Key required' });
  
  try {
    // Test the API key with a simple call using fetch
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-5',
        messages: [{ role: 'user', content: 'Say "API key is valid" in one sentence.' }],
        max_tokens: 50
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      // API returned an error
      return res.status(400).json({ 
        success: false, 
        error: data.error?.message || 'Invalid API key',
        details: data.error?.type || 'authentication_error'
      });
    }
    
    res.json({ 
      success: true, 
      message: 'API key is valid and working!',
      testResponse: data.choices?.[0]?.message?.content || 'Success'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to test API key',
      details: error.message 
    });
  }
});

app.get('/api/apikey/saved', (req, res) => {
  const state = db.prepare('SELECT api_key FROM process_state WHERE id = 1').get();
  // Return masked version for security
  const apiKey = state.api_key;
  if (apiKey) {
    const masked = apiKey.substring(0, 7) + '...' + apiKey.substring(apiKey.length - 4);
    res.json({ hasSaved: true, masked });
  } else {
    res.json({ hasSaved: false, masked: null });
  }
});

app.post('/api/process/start', (req, res) => {
  let { apiKey } = req.body;
  
  console.log('[START] Request API key:', apiKey ? `${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 10)} (len: ${apiKey.length})` : 'none');
  
  // If no API key provided, try to use saved one
  if (!apiKey) {
    const state = db.prepare('SELECT api_key FROM process_state WHERE id = 1').get();
    apiKey = state?.api_key;
    console.log('[START] Loaded saved API key:', apiKey ? `${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 10)} (len: ${apiKey.length})` : 'none');
    
    if (apiKey) {
      console.log('[START] Full key check - starts with sk-:', apiKey.startsWith('sk-'));
      console.log('[START] Key type:', typeof apiKey);
      console.log('[START] Key has spaces:', apiKey.includes(' '));
      console.log('[START] Key has newlines:', apiKey.includes('\n'));
    }
  }
  
  if (!apiKey) {
    console.log('[START] No API key available');
    return res.status(400).json({ error: 'API Key required. Please save an API key first.' });
  }
  
  try {
    console.log('[START] Starting worker with API key:', apiKey.substring(0, 10) + '...');
    worker.start(apiKey);
    res.json({ success: true });
  } catch (e) {
    console.error('[START] Error starting worker:', e.message);
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/process/stop', (req, res) => {
  worker.stop();
  res.json({ success: true });
});

// Level Curator endpoints
app.get('/api/curator/state', (req, res) => {
  const state = db.prepare('SELECT * FROM curator_state WHERE id = 1').get();
  state.config = JSON.parse(state.config);
  res.json({ ...state, is_running: levelCurator.isRunning });
});

app.post('/api/curator/config', (req, res) => {
  const { config } = req.body;
  db.prepare('UPDATE curator_state SET config = ? WHERE id = 1').run(JSON.stringify(config));
  res.json({ success: true });
});

app.post('/api/curator/start', (req, res) => {
  let { apiKey } = req.body;
  
  console.log('[CURATOR START] Request API key:', apiKey ? `${apiKey.substring(0, 10)}... (len: ${apiKey.length})` : 'none');
  
  // If no API key provided, try to use saved one from process_state
  if (!apiKey) {
    const state = db.prepare('SELECT api_key FROM process_state WHERE id = 1').get();
    apiKey = state?.api_key;
    console.log('[CURATOR START] Loaded saved API key:', apiKey ? `${apiKey.substring(0, 10)}... (len: ${apiKey.length})` : 'none');
  }
  
  if (!apiKey) {
    console.log('[CURATOR START] No API key available');
    return res.status(400).json({ error: 'API Key required. Please save an API key first.' });
  }
  
  try {
    console.log('[CURATOR START] Starting level curator with API key');
    levelCurator.start(apiKey);
    res.json({ success: true });
  } catch (e) {
    console.error('[CURATOR START] Error starting level curator:', e.message);
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/curator/stop', (req, res) => {
  levelCurator.stop();
  res.json({ success: true });
});

// Groups
app.get('/api/groups', (req, res) => {
  const { status, page = 1, limit = 50 } = req.query;
  const offset = (page - 1) * limit;
  
  let query = 'SELECT * FROM groups';
  const params = [];
  
  if (status && status !== 'all') {
    query += ' WHERE status = ?';
    params.push(status);
  }
  
  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);
  
  const groups = db.prepare(query).all(...params);
  const count = db.prepare('SELECT COUNT(*) as count FROM groups' + (status && status !== 'all' ? ' WHERE status = ?' : '')).get(...(status && status !== 'all' ? [status] : [])).count;
  
  res.json({ groups, total: count });
});

app.post('/api/groups/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body; // Expected: { status, manual_notes, tags, relation_clean, ... }
  
  const fields = Object.keys(updates).map(k => `${k} = ?`).join(', ');
  const values = Object.values(updates);
  
  if (fields.length > 0) {
    db.prepare(`UPDATE groups SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`).run(...values, id);
  }
  
  res.json({ success: true });
});

// Levels
app.get('/api/levels', (req, res) => {
  const levels = db.prepare('SELECT * FROM levels ORDER BY created_at DESC').all();
  res.json(levels);
});

app.post('/api/levels', (req, res) => {
  const { name, name_en, difficulty, group_ids, icon_conversions, tags } = req.body;
  const result = db.prepare(`
    INSERT INTO levels (name, name_en, difficulty, group_ids, icon_conversions, tags)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    name, 
    name_en || null, 
    difficulty, 
    JSON.stringify(group_ids), 
    JSON.stringify(icon_conversions || {}),
    JSON.stringify(tags || [])
  );
  
  res.json({ id: result.lastInsertRowid });
});

app.get('/api/levels/:id', (req, res) => {
  const { id } = req.params;
  const level = db.prepare('SELECT * FROM levels WHERE id = ?').get(id);
  
  if (!level) {
    return res.status(404).json({ error: 'Level not found' });
  }
  
  // Parse JSON fields
  level.group_ids = JSON.parse(level.group_ids);
  level.icon_conversions = JSON.parse(level.icon_conversions || '{}');
  level.tags = JSON.parse(level.tags || '[]');
  
  // Fetch full group data
  const groups = level.group_ids.map(id => {
    return db.prepare('SELECT * FROM groups WHERE id = ?').get(id);
  }).filter(Boolean);
  
  res.json({ ...level, groups });
});

app.put('/api/levels/:id', (req, res) => {
  const { id } = req.params;
  const { name, name_en, difficulty, group_ids, icon_conversions, tags, status } = req.body;
  
  const updates = [];
  const values = [];
  
  if (name !== undefined) { updates.push('name = ?'); values.push(name); }
  if (name_en !== undefined) { updates.push('name_en = ?'); values.push(name_en); }
  if (difficulty !== undefined) { updates.push('difficulty = ?'); values.push(difficulty); }
  if (group_ids !== undefined) { updates.push('group_ids = ?'); values.push(JSON.stringify(group_ids)); }
  if (icon_conversions !== undefined) { updates.push('icon_conversions = ?'); values.push(JSON.stringify(icon_conversions)); }
  if (tags !== undefined) { updates.push('tags = ?'); values.push(JSON.stringify(tags)); }
  if (status !== undefined) { updates.push('status = ?'); values.push(status); }
  
  if (updates.length > 0) {
    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);
    db.prepare(`UPDATE levels SET ${updates.join(', ')} WHERE id = ?`).run(...values);
  }
  
  res.json({ success: true });
});

// Serve static files from the build directory (only in production)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../build')));
  
  // Handle client-side routing by returning index.html for all non-API routes
  app.get(/^(?!\/api).+/, (req, res) => {
    const indexPath = path.join(__dirname, '../build', 'index.html');
    res.sendFile(indexPath);
  });
}

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

