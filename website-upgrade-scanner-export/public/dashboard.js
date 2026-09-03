// Dashboard JavaScript
const API_BASE = '/api';

// DOM Elements
let scanHistory = [];
let leads = [];

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    setInterval(loadData, 10000); // Refresh every 10 seconds
});

// Load data from API
async function loadData() {
    try {
        const [healthRes, historyRes, leadsRes] = await Promise.all([
            fetch(`${API_BASE}/health`),
            fetch(`${API_BASE}/history`),
            fetch(`${API_BASE}/leads`)
        ]);

        const health = await healthRes.json();
        const history = await historyRes.json();
        const leadsData = await leadsRes.json();

        scanHistory = history.scans || [];
        leads = leadsData.leads || [];

        updateStats(health, leadsData);
        updateRecentScans();
        updateLeadsList();
        
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

// Update statistics
function updateStats(health, leadsData) {
    document.getElementById('totalScans').textContent = health.scans || 0;
    document.getElementById('potentialRevenue').textContent = `€${leadsData.potentialRevenue || 0}`;
    document.getElementById('activeLeads').textContent = leadsData.total || 0;
    document.getElementById('leadsCount').textContent = leadsData.total || 0;
    
    // Calculate average score
    if (scanHistory.length > 0) {
        const avgScore = scanHistory.reduce((sum, scan) => sum + (scan.score || 0), 0) / scanHistory.length;
        document.getElementById('avgScore').textContent = `${avgScore.toFixed(1)}/15`;
    }
}

// Update recent scans list
function updateRecentScans() {
    const container = document.getElementById('recentScans');
    if (scanHistory.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center py-8">No scans yet. Analyze a website to see results here.</p>';
        return;
    }

    const recent = scanHistory.slice(0, 5);
    container.innerHTML = recent.map(scan => `
        <div class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
            <div class="flex justify-between items-start mb-2">
                <div class="font-semibold truncate" title="${scan.businessName || scan.url}">
                    ${scan.businessName || scan.url.substring(0, 30)}...
                </div>
                <span class="${getScoreClass(scan.score)} score-badge">
                    ${scan.score || 0}/15
                </span>
            </div>
            <div class="text-sm text-gray-600 mb-2 truncate" title="${scan.url}">
                ${scan.url.substring(0, 40)}...
            </div>
            <div class="text-xs text-gray-500">
                ${scan.summary || 'No summary'}
            </div>
        </div>
    `).join('');
}

// Update leads list
function updateLeadsList() {
    const container = document.getElementById('leadsList');
    const activeLeads = leads.filter(lead => lead.status !== 'converted');
    
    if (activeLeads.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center py-4">No leads yet. Scan low-scoring websites to generate leads.</p>';
        return;
    }

    container.innerHTML = activeLeads.slice(0, 5).map(lead => `
        <div class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
            <div class="flex justify-between items-start mb-2">
                <div class="font-semibold truncate" title="${lead.businessName || lead.url}">
                    ${lead.businessName || lead.url.substring(0, 25)}...
                </div>
                <span class="bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded">
                    €500
                </span>
            </div>
            <div class="flex justify-between items-center mb-2">
                <span class="${getScoreClass(lead.score)} score-badge">
                    Score: ${lead.score || 0}/15
                </span>
                <span class="text-xs font-semibold ${lead.priority === 'HIGH' ? 'text-red-600' : lead.priority === 'MEDIUM' ? 'text-yellow-600' : 'text-green-600'}">
                    ${lead.priority}
                </span>
            </div>
            <div class="text-xs text-gray-600 mb-2 truncate" title="${lead.details?.join(', ') || ''}">
                ${(lead.details?.[0] || '').substring(0, 50)}...
            </div>
            <div class="flex space-x-2">
                <button onclick="markLeadConverted('${lead.id}')" 
                        class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200">
                    Mark Converted
                </button>
                <button onclick="viewLeadDetails('${lead.id}')" 
                        class="
                        class="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200">
                    Details
                </button>
            </div>
        </div>
    `).join('');
}

// Get CSS class for score
function getScoreClass(score) {
    if (score < 5) return 'score-high';
    if (score < 10) return 'score-medium';
    return 'score-low';
}

// Analyze a website
async function analyzeWebsite() {
    const url = document.getElementById('websiteUrl').value.trim();
    const businessName = document.getElementById('businessName').value.trim();
    const category = document.getElementById('category').value;
    
    if (!url) {
        alert('Please enter a website URL');
        return;
    }
    
    // Show loading
    const analyzeBtn = document.querySelector('button[onclick="analyzeWebsite()"]');
    const originalText = analyzeBtn.innerHTML;
    analyzeBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Analyzing...';
    analyzeBtn.disabled = true;
    
    try {
        const response = await fetch(`${API_BASE}/analyze`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url, businessName, category })
        });
        
        const result = await response.json();
        
        // Display results
        showResults(result);
        
        // Clear form
        document.getElementById('websiteUrl').value = '';
        document.getElementById('businessName').value = '';
        document.getElementById('category').value = '';
        
        // Reload data
        setTimeout(loadData, 1000);
        
    } catch (error) {
        console.error('Analysis error:', error);
        alert('Failed to analyze website. Please try again.');
    } finally {
        analyzeBtn.innerHTML = originalText;
        analyzeBtn.disabled = false;
    }
}

// Show analysis results
function showResults(result) {
    const resultsDiv = document.getElementById('results');
    const contentDiv = document.getElementById('resultContent');
    
    const scoreClass = getScoreClass(result.score);
    const needsUpgrade = result.score < 10;
    
    contentDiv.innerHTML = `
        <div class="bg-gray-50 rounded-lg p-6 mb-4">
            <div class="flex justify-between items-center mb-4">
                <div>
                    <h4 class="font-bold text-lg">${result.businessName || result.url}</h4>
                    <p class="text-gray-600 text-sm">${result.url}</p>
                </div>
                <div class="text-center">
                    <div class="text-3xl font-bold ${scoreClass.includes('high') ? 'text-red-600' : scoreClass.includes('medium') ? 'text-yellow-600' : 'text-green-600'}">
                        ${result.score}/15
                    </div>
                    <div class="text-sm ${needsUpgrade ? 'text-red-600 font-semibold' : 'text-green-600'}">
                        ${needsUpgrade ? '🚨 NEEDS UPGRADE' : '✅ GOOD WEBSITE'}
                    </div>
                </div>
            </div>
            
            <div class="mb-4">
                <h5 class="font-semibold mb-2">Analysis Details:</h5>
                <ul class="space-y-1">
                    ${result.details?.map(detail => `
                        <li class="flex items-start">
                            <i class="fas fa-chevron-right text-gray-400 mt-1 mr-2 text-xs"></i>
                            <span>${detail}</span>
                        </li>
                    `).join('') || '<li>No details available</li>'}
                </ul>
            </div>
            
            ${needsUpgrade ? `
            <div class="bg-red-50 border border-red-200 rounded-lg p-4">
                <div class="flex items-center">
                    <i class="fas fa-euro-sign text-red-600 text-xl mr-3"></i>
                    <div>
                        <h5 class="font-bold text-red-700">Evolution Media Opportunity</h5>
                        <p class="text-red-600">This website needs improvement. Estimated value: <strong>€500</strong> for a modern rebuild.</p>
                    </div>
                </div>
            </div>
            ` : ''}
        </div>
    `;
    
    resultsDiv.classList.remove('hidden');
    resultsDiv.scrollIntoView({ behavior: 'smooth' });
}

// Scan example website
function scanExample(url, name, category) {
    document.getElementById('websiteUrl').value = url;
    document.getElementById('businessName').value = name;
    document.getElementById('category').value = category;
    analyzeWebsite();
}

// Export leads to CSV
function exportLeads() {
    window.open(`${API_BASE}/export`, '_blank');
}

// Mark lead as converted
async function markLeadConverted(leadId) {
    try {
        await fetch(`${API_BASE}/leads/${leadId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'converted' })
        });
        
        loadData();
        alert('Lead marked as converted!');
    } catch (error) {
        console.error('Error updating lead:', error);
        alert('Failed to update lead');
    }
}

// View lead details
function viewLeadDetails(leadId) {
    const lead = leads.find(l => l.id === leadId);
    if (lead) {
        alert(`Lead Details:\n\nBusiness: ${lead.businessName || 'Unknown'}\nWebsite: ${lead.url}\nScore: ${lead.score}/15\nPriority: ${lead.priority}\nDetails: ${lead.details?.join('\\n') || 'None'}\n\nEstimated Value: €500`);
    }
}

// Clear all data
async function clearData() {
    if (confirm('Are you sure you want to clear all scan history and leads? This cannot be undone.')) {
        try {
            // Note: This is a client-side clear only
            // For a real implementation, we'd need a server endpoint
            scanHistory = [];
            leads = [];
            updateRecentScans();
            updateLeadsList();
            updateStats({ scans: 0 }, { total: 0, potentialRevenue: 0 });
            alert('All data cleared!');
        } catch (error) {
            console.error('Error clearing data:', error);
            alert('Failed to clear data');
        }
    }
}
