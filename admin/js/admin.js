// ── VEOMA Labs Admin Dashboard ──

const API_BASE = 'https://veoma-labs-backend.onrender.com';
const PAGE_SIZE = 10;

// ── State ──
const state = {
    stats: null,
    data: { workshop: [], printing: [], scanning: [], designing: [], feedback: [], contact: [] },
    filtered: {},
    currentPage: {},
    activePage: 'dashboard'
};

const pageTitles = {
    dashboard: 'Dashboard', workshop: 'Workshops',
    printing: 'Printing', scanning: 'Scanning',
    designing: 'Designing', feedback: 'Feedback', contact: 'Messages'
};

// ── Table config (columns per section) ──
const tableConfig = {
    workshop: {
        title: 'Workshop Registrations',
        subtitle: 'All workshop registration records',
        cols: ['#','Full Name','Email','Mobile','Qualification','Workshop Type','Level','Date'],
        row: (r, i) => `
            <td>${i+1}</td>
            <td>${r.full_name || '—'}</td>
            <td>${r.email || '—'}</td>
            <td>${r.mobile_number || '—'}</td>
            <td>${r.qualification || '—'}</td>
            <td>${badge(r.workshop_type, 'blue')}</td>
            <td>${badge(r.workshop_name, 'green')}</td>
            <td>${fmtDate(r.created_at)}</td>`
    },
    printing: {
        title: '3D Printing Quotes',
        subtitle: 'All printing quote requests',
        cols: ['#','Full Name','Email','WhatsApp','Material','Dimensions','File','Details','Date'],
        row: (r, i) => `
            <td>${i+1}</td>
            <td>${r.full_name || '—'}</td>
            <td>${r.email || '—'}</td>
            <td>${r.whatsapp_number || '—'}</td>
            <td>${badge(r.material, 'cyan')}</td>
            <td>${r.length_x ? `${r.length_x}×${r.width_y}×${r.height_z}mm` : '—'}</td>
            <td>${r.file_url ? badge('Uploaded','green') : badge('No File','red')}</td>
            <td title="${r.project_details || ''}">${trunc(r.project_details)}</td>
            <td>${fmtDate(r.created_at)}</td>`
    },
    scanning: {
        title: '3D Scanning Quotes',
        subtitle: 'All scanning quote requests',
        cols: ['#','Full Name','Email','WhatsApp','Images','Details','Date'],
        row: (r, i) => `
            <td>${i+1}</td>
            <td>${r.full_name || '—'}</td>
            <td>${r.email || '—'}</td>
            <td>${r.whatsapp_number || '—'}</td>
            <td>${r.image_urls?.length ? badge(r.image_urls.length+' Images','green') : badge('No Images','red')}</td>
            <td title="${r.project_details || ''}">${trunc(r.project_details)}</td>
            <td>${fmtDate(r.created_at)}</td>`
    },
    designing: {
        title: '3D Designing Quotes',
        subtitle: 'All designing quote requests',
        cols: ['#','Full Name','Email','WhatsApp','Images','Details','Date'],
        row: (r, i) => `
            <td>${i+1}</td>
            <td>${r.full_name || '—'}</td>
            <td>${r.email || '—'}</td>
            <td>${r.whatsapp_number || '—'}</td>
            <td>${r.product_images?.length ? badge(r.product_images.length+' Images','green') : badge('No Images','red')}</td>
            <td title="${r.project_details || ''}">${trunc(r.project_details)}</td>
            <td>${fmtDate(r.created_at)}</td>`
    },
    feedback: {
        title: 'Customer Feedback',
        subtitle: 'All submitted feedback and ratings',
        cols: ['#','Name','Profession','Message','Rating','Date'],
        row: (r, i) => `
            <td>${i+1}</td>
            <td>${r.name || '—'}</td>
            <td>${r.profession || '—'}</td>
            <td title="${r.message || ''}">${trunc(r.message)}</td>
            <td>${stars(r.rating)}</td>
            <td>${fmtDate(r.created_at)}</td>`
    },
    contact: {
        title: 'Contact Messages',
        subtitle: 'All messages from the contact form',
        cols: ['#','Full Name','Email','Mobile','Location','Message','Date'],
        row: (r, i) => `
            <td>${i+1}</td>
            <td>${r.full_name || '—'}</td>
            <td>${r.email || '—'}</td>
            <td>${r.mobile_number || '—'}</td>
            <td>${r.location || '—'}</td>
            <td title="${r.user_message || ''}">${trunc(r.user_message)}</td>
            <td>${fmtDate(r.created_at)}</td>`
    }
};

// ── Helpers ──
function badge(val, color) {
    if (!val) return '—';
    return `<span class="badge badge-${color}">${val}</span>`;
}

function stars(n) {
    const r = parseInt(n) || 0;
    return `<span class="badge badge-${r>=4?'green':r>=3?'yellow':'red'}">${'★'.repeat(r)}${'☆'.repeat(5-r)} ${r}/5</span>`;
}

function fmtDate(d) {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function trunc(s, n=35) {
    if (!s) return '—';
    return s.length > n ? s.slice(0, n) + '...' : s;
}

function showToast(msg, type='success') {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.className = `toast ${type} show`;
    setTimeout(() => t.className = 'toast', 3000);
}

// ── Fetch ──
async function fetchJSON(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
}

async function loadStats() {
    try {
        const s = await fetchJSON(`${API_BASE}/admin/stats`);
        state.stats = s;

        // Update cards
        const grid = document.getElementById('statsGrid');
        grid.innerHTML = `
        ${statCard('card-cyan', workshopSVG(), s.total_workshops, 'Total Workshops')}
        ${statCard('card-blue', printSVG(), s.total_printing, 'Printing Quotes')}
        ${statCard('card-purple', scanSVG(), s.total_scanning, 'Scanning Quotes')}
        ${statCard('card-green', designSVG(), s.total_designing, 'Designing Quotes')}
        ${statCard('card-orange', docSVG(), s.total_requests, 'Total Requests')}`;

        // Update badges
        const badgeKeyMap = {
            workshop: 'total_workshops',
            printing: 'total_printing',
            scanning: 'total_scanning',
            designing: 'total_designing',
            contact: 'total_contact'
        };
        Object.entries(badgeKeyMap).forEach(([k, statKey]) => {
            const el = document.getElementById(`badge-${k}`);
            if (el) el.textContent = s[statKey] ?? '0';
        });

        document.getElementById('lastUpdated').textContent = 'Updated: ' + new Date().toLocaleTimeString();
    } catch(e) {
        console.error('Stats error:', e);
        showToast('Failed to load stats', 'error');
    }
}

function statCard(cls, svg, val, label) {
    return `<div class="summary-card ${cls}">
        <div class="card-icon">${svg}</div>
        <div class="card-info">
            <div class="card-value">${val ?? '—'}</div>
            <div class="card-label">${label}</div>
        </div>
    </div>`;
}

async function loadSection(key) {
    try {
        const data = await fetchJSON(`${API_BASE}/admin/${key}`);
        state.data[key] = Array.isArray(data) ? data : [];
        state.filtered[key] = [...state.data[key]];
        state.currentPage[key] = 1;
        renderPage(key);
        renderDistributionChart();
        renderRecentActivity();
    } catch(e) {
        console.error(`${key} error:`, e);
        const page = document.getElementById(`page-${key}`);
        if (page) page.innerHTML = `<div class="error-row">❌ Failed to load ${key} data. Check your API connection.</div>`;
        showToast(`Failed to load ${key}`, 'error');
    }
}

async function loadAll() {
    const btn = document.getElementById('refreshBtn');
    if (btn) btn.classList.add('spinning');
    await loadStats();
    await Promise.all(Object.keys(state.data).map(k => loadSection(k)));
    if (btn) btn.classList.remove('spinning');
    showToast('Data refreshed successfully');
}

// ── Render page ──
function renderPage(key) {
    const cfg   = tableConfig[key];
    const items = state.filtered[key] || [];
    const page  = state.currentPage[key] || 1;
    const total = items.length;
    const start = (page - 1) * PAGE_SIZE;
    const slice = items.slice(start, start + PAGE_SIZE);
    const totalPages = Math.ceil(total / PAGE_SIZE) || 1;

    const miniStats = buildMiniStats(key);

    const html = `
    <div class="page-header">
        <div>
            <h1>${cfg.title}</h1>
            <p>${cfg.subtitle}</p>
        </div>
        <div class="header-actions">
            <button class="export-btn export-pdf-btn" onclick="exportPDF('${key}')">
                ${pdfSVG()} Export PDF
            </button>
            <button class="export-btn" onclick="exportCSV('${key}')">
                ${downloadSVG()} Export CSV
            </button>
        </div>
    </div>
    ${miniStats}
    <div class="section-card full">
        <div class="section-card-header">
            <h3>All Records <span style="color:var(--muted);font-weight:400;font-size:0.8rem;">(${total})</span></h3>
            <div class="table-controls">
                <input type="text" class="search-input" placeholder="Search by name, email..."
                    oninput="searchTable('${key}', this.value)">
            </div>
        </div>
        <div class="table-wrap">
            <table class="data-table">
                <thead><tr>${cfg.cols.map(c=>`<th>${c}</th>`).join('')}<th class="no-print">Action</th></tr></thead>
                <tbody>
                    ${slice.length
                        ? slice.map((r,i) => `<tr>${cfg.row(r, start+i)}<td class="no-print"><button class="delete-btn" onclick="deleteRecord('${key}', '${r.id || r._id || ''}', this)">Delete</button></td></tr>`).join('')
                        : `<tr><td colspan="${cfg.cols.length + 1}" class="empty-row">No records found</td></tr>`
                    }
                </tbody>
            </table>
        </div>
        <div class="pagination">
            <span class="pagination-info">Showing ${total ? start+1 : 0}–${Math.min(start+PAGE_SIZE, total)} of ${total} records</span>
            <div class="pagination-btns">
                <button class="page-btn" onclick="changePage('${key}', ${page-1})" ${page<=1?'disabled':''}>← Prev</button>
                ${buildPageButtons(key, page, totalPages)}
                <button class="page-btn" onclick="changePage('${key}', ${page+1})" ${page>=totalPages?'disabled':''}>Next →</button>
            </div>
        </div>
    </div>`;

    document.getElementById(`page-${key}`).innerHTML = html;
}

function buildPageButtons(key, current, total) {
    let html = '';
    const range = 3;
    for (let i = 1; i <= total; i++) {
        if (i === 1 || i === total || (i >= current - range && i <= current + range)) {
            html += `<button class="page-btn ${i===current?'active':''}" onclick="changePage('${key}', ${i})">${i}</button>`;
        } else if (html.slice(-3) !== '...') {
            html += `<span style="color:var(--muted);padding:0 4px;">...</span>`;
        }
    }
    return html;
}

function buildMiniStats(key) {
    const d = state.data[key] || [];
    const total = d.length;

    if (key === 'workshop') {
        const printing = d.filter(r => r.workshop_type?.toLowerCase().includes('print')).length;
        const scanning = d.filter(r => r.workshop_type?.toLowerCase().includes('scan')).length;
        const foundation  = d.filter(r => r.workshop_name?.toLowerCase().includes('foundation')).length;
        const accelerator = d.filter(r => r.workshop_name?.toLowerCase().includes('accelerator')).length;
        const online      = d.filter(r => r.workshop_name?.toLowerCase().includes('online')).length;
        return miniGrid([total,'3D Printing','3D Scanning','Foundation','Accelerator','Online'],
                        [total, printing, scanning, foundation, accelerator, online]);
    }
    if (key === 'printing') {
        const counts = {};
        d.forEach(r => { if(r.material) counts[r.material] = (counts[r.material]||0)+1; });
        const labels = ['Total',...Object.keys(counts)];
        const vals   = [total, ...Object.values(counts)];
        return miniGrid(labels, vals);
    }
    if (key === 'scanning' || key === 'designing') {
        const imgKey = key === 'scanning' ? 'image_urls' : 'product_images';
        const withImg = d.filter(r => r[imgKey]?.length).length;
        return miniGrid(['Total','With Images','No Images'], [total, withImg, total - withImg]);
    }
    if (key === 'feedback') {
        const avg = d.length ? (d.reduce((s,r)=>s+(r.rating||0),0)/d.length).toFixed(1) : '—';
        const five = d.filter(r=>r.rating===5).length;
        return miniGrid(['Total','Avg Rating','5 Stars'], [total, avg, five]);
    }
    if (key === 'contact') {
        return miniGrid(['Total Messages'], [total]);
    }
    return '';
}

function miniGrid(labels, vals) {
    return `<div class="cards-grid mini" style="margin-bottom:20px;">
        ${labels.map((l,i)=>`<div class="mini-card"><div class="mini-val">${vals[i]}</div><div class="mini-label">${l}</div></div>`).join('')}
    </div>`;
}

// ── Recent Activity ──
function renderRecentActivity() {
    const all = [
        ...state.data.printing.slice(0,3).map(r=>({...r, _type:'Printing', _badge:'blue'})),
        ...state.data.scanning.slice(0,2).map(r=>({...r, _type:'Scanning', _badge:'purple'})),
        ...state.data.designing.slice(0,2).map(r=>({...r, _type:'Designing', _badge:'cyan'})),
        ...state.data.workshop.slice(0,3).map(r=>({...r, _type:'Workshop', _badge:'orange'})),
    ].sort((a,b) => new Date(b.created_at) - new Date(a.created_at)).slice(0,8);

    if (!all.length) {
        document.getElementById('recentActivity').innerHTML = '<div class="empty-row">No recent activity</div>';
        return;
    }

    document.getElementById('recentActivity').innerHTML = `
    <table class="data-table">
        <thead><tr><th>Name</th><th>Type</th><th>Date</th></tr></thead>
        <tbody>
            ${all.map(r=>`<tr>
                <td>${r.full_name || r.name || '—'}</td>
                <td>${badge(r._type, r._badge)}</td>
                <td>${fmtDate(r.created_at)}</td>
            </tr>`).join('')}
        </tbody>
    </table>`;
}

// ── Distribution Chart ──
function renderDistributionChart() {
    const items = [
        { label:'3D Printing Quotes', val: state.data.printing.length, cls:'bar-blue' },
        { label:'3D Scanning Quotes', val: state.data.scanning.length, cls:'bar-purple' },
        { label:'3D Designing Quotes',val: state.data.designing.length,cls:'bar-green' },
        { label:'Workshop Regs',      val: state.data.workshop.length, cls:'bar-cyan' },
    ];
    const max = Math.max(...items.map(i=>i.val), 1);
    document.getElementById('distributionChart').innerHTML = items.map(item => `
        <div class="breakdown-item">
            <span class="breakdown-label">${item.label}</span>
            <div class="breakdown-bar"><div class="bar-fill ${item.cls}" style="width:${Math.round(item.val/max*100)}%"></div></div>
            <span class="breakdown-val">${item.val}</span>
        </div>`).join('');
}

// ── Search ──
function searchTable(key, query) {
    const q = query.toLowerCase().trim();
    state.filtered[key] = q
        ? state.data[key].filter(r => JSON.stringify(r).toLowerCase().includes(q))
        : [...state.data[key]];
    state.currentPage[key] = 1;
    renderPage(key);
}

// ── Pagination ──
function changePage(key, page) {
    const total = Math.ceil((state.filtered[key]?.length || 0) / PAGE_SIZE);
    if (page < 1 || page > total) return;
    state.currentPage[key] = page;
    renderPage(key);
    document.getElementById(`page-${key}`).scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ── Export CSV ──
function exportCSV(key) {
    const data = state.filtered[key] || [];
    if (!data.length) { showToast('No data to export', 'error'); return; }

    const headers = Object.keys(data[0]);
    const rows = data.map(r => headers.map(h => {
        const v = r[h];
        if (Array.isArray(v)) return `"${v.join(', ')}"`;
        if (typeof v === 'string' && v.includes(',')) return `"${v}"`;
        return v ?? '';
    }).join(','));

    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url;
    a.download = `veoma_${key}_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Exported ${data.length} records`);
}

// ── Delete Record ──
async function deleteRecord(key, id, btn) {
    if (!id) { showToast('No ID found for this record', 'error'); return; }
    if (!confirm('Delete this record? This cannot be undone.')) return;
    btn.disabled = true;
    btn.textContent = '...';
    try {
        const res = await fetch(`${API_BASE}/admin/${key}/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        // Remove from state
        state.data[key]     = state.data[key].filter(r => (r.id || r._id) != id);
        state.filtered[key] = state.filtered[key].filter(r => (r.id || r._id) != id);
        renderPage(key);
        renderDistributionChart();
        renderRecentActivity();
        // Update badge count
        const badge = document.getElementById(`badge-${key}`);
        if (badge) badge.textContent = Math.max(0, parseInt(badge.textContent) - 1);
        showToast('Record deleted successfully');
    } catch(e) {
        console.error('Delete error:', e);
        btn.disabled = false;
        btn.textContent = 'Delete';
        showToast('Failed to delete record', 'error');
    }
}

// ── Export PDF ──
function exportPDF(key) {
    const cfg   = tableConfig[key];
    const items = state.filtered[key] || [];
    if (!items.length) { showToast('No data to export', 'error'); return; }

    const win = window.open('', '_blank');
    const rows = items.map((r, i) => {
        const cells = cfg.row(r, i).replace(/<span[^>]*badge[^>]*>([^<]*)<\/span>/gi, '$1')
                         .replace(/<[^>]+>/g, '').trim();
        const tds = cfg.row(r, i).split('</td>').slice(0, -1)
            .map(td => `<td>${td.replace(/<[^>]+>/g,'').trim() || '—'}</td>`).join('');
        return `<tr>${tds}</tr>`;
    }).join('');

    win.document.write(`<!DOCTYPE html><html><head><title>${cfg.title}</title><style>
        body{font-family:Arial,sans-serif;font-size:11px;color:#111;padding:20px;}
        h2{margin-bottom:4px;}p{color:#666;margin-bottom:12px;font-size:10px;}
        table{width:100%;border-collapse:collapse;}
        th{background:#0a0f1c;color:#fff;padding:8px 10px;text-align:left;font-size:10px;text-transform:uppercase;}
        td{padding:7px 10px;border-bottom:1px solid #e5e7eb;}
        tr:nth-child(even)td{background:#f9fafb;}
    </style></head><body>
        <h2>${cfg.title}</h2>
        <p>Exported on ${new Date().toLocaleString('en-IN')} · ${items.length} records</p>
        <table><thead><tr>${cfg.cols.map(c=>`<th>${c}</th>`).join('')}</tr></thead>
        <tbody>${rows}</tbody></table>
    </body></html>`);
    win.document.close();
    win.focus();
    win.print();
}


document.getElementById('globalSearch').addEventListener('input', function() {
    const key = state.activePage;
    if (key === 'dashboard') return;
    searchTable(key, this.value);
});

// ── Navigation ──
function switchPage(key) {
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelector(`[data-page="${key}"]`)?.classList.add('active');
    document.getElementById(`page-${key}`)?.classList.add('active');
    document.getElementById('pageTitle').textContent = pageTitles[key] || key;
    state.activePage = key;
    if (window.innerWidth <= 768) document.getElementById('sidebar').classList.remove('open');
}

document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', e => {
        e.preventDefault();
        switchPage(item.dataset.page);
    });
});

document.getElementById('menuToggle').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
});

document.getElementById('refreshBtn').addEventListener('click', loadAll);

// ── Auto-refresh every 60s ──
setInterval(loadAll, 60000);

// ── SVG Icons ──
function workshopSVG() { return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`; }
function printSVG()    { return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>`; }
function scanSVG()     { return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><circle cx="12" cy="12" r="3"/></svg>`; }
function designSVG()   { return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>`; }
function docSVG()      { return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`; }
function starSVG()     { return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`; }
function downloadSVG() { return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`; }
function pdfSVG()      { return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/><line x1="10" y1="9" x2="12" y2="9"/></svg>`; }

// ── Init ──
loadAll();
