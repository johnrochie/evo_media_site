const express = require('express');
const cors = require('cors');
const path = require('path');
const { analyzeWebsite } = require('./analyzer');
const { runBatch } = require('./batch');

const app = express();
const PORT = process.env.PORT || 4005;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// In-memory storage for scans
let scanHistory = [];
let leads = [];

// Health endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Website Upgrade Scanner',
    version: '1.0.0',
    scans: scanHistory.length,
    leads: leads.length,
    timestamp: new Date().toISOString()
  });
});

// Analyze single website
app.post('/api/analyze', async (req, res) => {
  try {
    const { url, businessName, category } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }
    
    console.log(`🔍 Analyzing: ${url}`);

    const analysis = await analyzeWebsite(url, { businessName, category });

    analysis.timestamp = new Date().toISOString();
    analysis.id = Date.now().toString();

    // Store in history
    scanHistory.unshift(analysis);
    if (scanHistory.length > 100) scanHistory.pop();

    // Flagged sites (and no-website / unreachable) become leads
    if (analysis.needsUpgrade) {
      const lead = {
        ...analysis,
        priority: analysis.priority || 'MEDIUM',
        estimatedValue: 500,
        status: 'new',
        addedAt: new Date().toISOString()
      };
      leads.unshift(lead);
    }

    res.json(analysis);
    
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ 
      error: 'Failed to analyze website',
      details: error.message 
    });
  }
});

// Get scan history
app.get('/api/history', (req, res) => {
  res.json({
    scans: scanHistory,
    total: scanHistory.length
  });
});

// Get leads
app.get('/api/leads', (req, res) => {
  const filtered = leads.filter(lead => lead.status !== 'converted');
  res.json({
    leads: filtered,
    total: filtered.length,
    potentialRevenue: filtered.length * 500
  });
});

// Update lead status
app.put('/api/leads/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  const lead = leads.find(l => l.id === id);
  if (lead) {
    lead.status = status;
    lead.updatedAt = new Date().toISOString();
    res.json(lead);
  } else {
    res.status(404).json({ error: 'Lead not found' });
  }
});

// Export leads
app.get('/api/export', (req, res) => {
  const csv = convertToCSV(leads);
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=evolution-media-leads.csv');
  res.send(csv);
});

const MAX_BATCH = 200;

// Bulk analyze (legacy shape: { websites: [...] }) — kept working, now backed by
// the shared batch runner and no longer capped at 20.
app.post('/api/bulk-analyze', async (req, res) => {
  try {
    const { websites, limit, concurrency } = req.body || {};

    if (!Array.isArray(websites) || websites.length === 0) {
      return res.status(400).json({ error: 'Websites array is required' });
    }

    const cap = Math.min(Number(limit) || websites.length, MAX_BATCH);
    console.log(`🔍 Bulk analyzing ${Math.min(websites.length, cap)} website(s)`);

    const { results, summary } = await runBatch(websites, {
      limit: cap,
      concurrency: Number(concurrency) || undefined,
    });

    // Legacy callers expect `results` to be the analysis objects themselves.
    res.json({
      results: results.map((r) => ({ ...r.analysis, url: r.url, businessName: r.businessName })),
      candidates: results,
      summary,
      total: results.length,
    });
  } catch (error) {
    console.error('Bulk analysis error:', error);
    res.status(500).json({ error: 'Bulk analysis failed', details: error.message });
  }
});

// Batch analyze — first-class entry point for the Lead Discovery pipeline.
// Accepts the candidates.json shape from Prompt 1 ({ candidates: [...] }), or
// { websites: [...] }, or a bare array. Returns the list enriched with an
// `analysis` block per entry plus a summary. One bad site never fails the run.
app.post('/api/batch-analyze', async (req, res) => {
  try {
    const body = req.body || {};
    const candidates = Array.isArray(body)
      ? body
      : body.candidates || body.websites || body.results;

    if (!Array.isArray(candidates) || candidates.length === 0) {
      return res.status(400).json({
        error: 'Provide a candidate list as `candidates`, `websites`, or a top-level array',
      });
    }

    const cap = Math.min(Number(body.limit) || candidates.length, MAX_BATCH);
    console.log(`🔍 Batch analyzing ${Math.min(candidates.length, cap)} candidate(s)`);

    const { results, summary } = await runBatch(candidates, {
      limit: cap,
      concurrency: Number(body.concurrency) || undefined,
      delayMs: Number(body.delayMs) || undefined,
      timeout: Number(body.timeout) || undefined,
      retries: Number.isFinite(body.retries) ? body.retries : undefined,
      render: !!body.render,
    });

    res.json({ summary, candidates: results, total: results.length });
  } catch (error) {
    console.error('Batch analysis error:', error);
    res.status(500).json({ error: 'Batch analysis failed', details: error.message });
  }
});

// Website scoring lives in ./analyzer.js (analyzeWebsite) and ./batch.js
// (runBatch). See CODE-REVIEW.md for why it was extracted and hardened.

// Convert to CSV
function convertToCSV(data) {
  if (data.length === 0) return '';
  
  const headers = ['Business Name', 'Website', 'Score', 'Priority', 'Category', 'Details', 'Estimated Value', 'Status'];
  const rows = data.map(item => [
    item.businessName || '',
    item.url || '',
    item.score || 0,
    item.priority || 'MEDIUM',
    item.category || '',
    item.details?.join(' | ') || '',
    '€500',
    item.status || 'new'
  ]);
  
  return [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\\n');
}

// Serve dashboard
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Website Upgrade Scanner running on port ${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}`);
  console.log(`🔧 API: http://localhost:${PORT}/api/health`);
});
