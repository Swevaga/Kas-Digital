// ==============================
// # GLOBAL VARIABLES
// ==============================
let transactions = [];

// ==============================
// # INITIALIZATION
// ==============================
document.addEventListener('DOMContentLoaded', () => {
    initApp();
    registerServiceWorker();
    setCurrentDate();
    loadConfig();
});

function initApp() {
    loadTransactions();
    renderTransactions();
    updateSummary();
    setupEventListeners();
}

// ==============================
// # SERVICE WORKER (PWA)
// ==============================
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('service-worker.js')
            .then(reg => console.log('Service Worker registered'))
            .catch(err => console.log('Service Worker registration failed:', err));
    }
}

// ==============================
// # EVENT LISTENERS
// ==============================
function setupEventListeners() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', handleTabChange);
    });
    
    document.getElementById('transaction-form').addEventListener('submit', handleAddTransaction);
    document.getElementById('export-pdf').addEventListener('click', exportToPDF);
    document.getElementById('export-json').addEventListener('click', exportToJSON);
    document.getElementById('import-json').addEventListener('change', importFromJSON);
    document.getElementById('save-config').addEventListener('click', saveConfig);
    document.getElementById('backup-drive').addEventListener('click', backupToDrive);
    document.getElementById('backup-github').addEventListener('click', syncToGitHub);
}

// ==============================
// # CONFIGURATION MANAGEMENT
// ==============================
function loadConfig() {
    const savedConfig = localStorage.getItem('kas-digital-config');
    if (savedConfig) {
        const config = JSON.parse(savedConfig);
        document.getElementById('github-pat').value = config.githubPat || '';
        document.getElementById('github-repo').value = config.githubRepo || '';
    }
}

function saveConfig() {
    const config = {
        githubPat: document.getElementById('github-pat').value,
        githubRepo: document.getElementById('github-repo').value
    };
    localStorage.setItem('kas-digital-config', JSON.stringify(config));
    alert('Konfigurasi berhasil disimpan!');
}

// ==============================
// # JSON IMPORT/EXPORT
// ==============================
function exportToJSON() {
    const dataStr = JSON.stringify(transactions, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kas-digital-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

function importFromJSON(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const imported = JSON.parse(event.target.result);
            if (Array.isArray(imported)) {
                transactions = imported;
                saveTransactions();
                renderTransactions();
                updateSummary();
                alert('Data berhasil diimport!');
            } else {
                alert('Format file tidak valid!');
            }
        } catch (err) {
            alert('Error membaca file: ' + err.message);
        }
    };
    reader.readAsText(file);
    e.target.value = '';
}

// ==============================
// # GOOGLE DRIVE BACKUP
// ==============================
function backupToDrive() {
    alert('Untuk menggunakan Google Drive:\n1. Buat project di Google Cloud Console\n2. Aktifkan Google Drive API\n3. Tambahkan OAuth 2.0 Client ID\n4. Implementasi OAuth flow\n\nLihat README.md untuk panduan lengkap!');
}

// ==============================
// # GITHUB SYNC
// ==============================
function syncToGitHub() {
    const config = JSON.parse(localStorage.getItem('kas-digital-config') || '{}');
    if (!config.githubPat || !config.githubRepo) {
        alert('Silakan simpan konfigurasi GitHub terlebih dahulu!');
        return;
    }
    alert('Untuk sinkronisasi penuh ke GitHub, gunakan GitHub Actions workflow yang disertakan!');
}

function handleTabChange(e) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.getElementById(`${e.target.dataset.tab}-tab`).classList.add('active');
}

function setCurrentDate() {
    document.getElementById('date').value = new Date().toISOString().split('T')[0];
}

// ==============================
// # TRANSACTIONS MANAGEMENT
// ==============================
function loadTransactions() {
    const saved = localStorage.getItem('kas-digital-transactions');
    transactions = saved ? JSON.parse(saved) : [];
}

function saveTransactions() {
    localStorage.setItem('kas-digital-transactions', JSON.stringify(transactions));
}

function handleAddTransaction(e) {
    e.preventDefault();
    
    const transaction = {
        id: Date.now(),
        type: document.getElementById('type').value,
        description: document.getElementById('description').value,
        amount: parseFloat(document.getElementById('amount').value),
        date: document.getElementById('date').value
    };
    
    transactions.unshift(transaction);
    saveTransactions();
    renderTransactions();
    updateSummary();
    e.target.reset();
    setCurrentDate();
    document.querySelector('[data-tab="transactions"]').click();
}

function deleteTransaction(id) {
    if (confirm('Hapus transaksi ini?')) {
        transactions = transactions.filter(t => t.id !== id);
        saveTransactions();
        renderTransactions();
        updateSummary();
    }
}

// ==============================
// # RENDERING
// ==============================
function renderTransactions() {
    const container = document.getElementById('transaction-list');
    
    if (transactions.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:white; padding:30px;">Belum ada transaksi</p>';
        return;
    }
    
    container.innerHTML = transactions.map(t => `
        <div class="transaction-item" ondblclick="deleteTransaction(${t.id})">
            <div class="transaction-info">
                <div class="transaction-desc">${t.description}</div>
                <div class="transaction-date">${formatDate(t.date)}</div>
            </div>
            <div class="transaction-amount ${t.type}">
                ${t.type === 'income' ? '+' : '-'} ${formatCurrency(t.amount)}
            </div>
        </div>
    `).join('');
}

function updateSummary() {
    const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const balance = income - expense;
    
    document.getElementById('balance').textContent = formatCurrency(balance);
    document.getElementById('total-income').textContent = formatCurrency(income);
    document.getElementById('total-expense').textContent = formatCurrency(expense);
}

// ==============================
// # UTILITY FUNCTIONS
// ==============================
function formatCurrency(amount) {
    return 'Rp ' + amount.toLocaleString('id-ID');
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

// ==============================
// # PDF EXPORT
// ==============================
function exportToPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text('Laporan Kas Digital', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Dicetak: ${new Date().toLocaleDateString('id-ID')}`, 105, 30, { align: 'center' });
    
    let y = 50;
    doc.setFont('helvetica', 'bold');
    doc.text('No', 20, y);
    doc.text('Tanggal', 40, y);
    doc.text('Keterangan', 80, y);
    doc.text('Jumlah', 160, y, { align: 'right' });
    
    y += 10;
    doc.setLineWidth(0.5);
    doc.line(20, y, 190, y);
    y += 10;
    
    doc.setFont('helvetica', 'normal');
    transactions.forEach((t, i) => {
        if (y > 280) {
            doc.addPage();
            y = 30;
        }
        doc.text(String(i + 1), 20, y);
        doc.text(formatDate(t.date), 40, y);
        doc.text(t.description, 80, y);
        doc.text(formatCurrency(t.amount), 190, y, { align: 'right' });
        y += 8;
    });
    
    y += 10;
    const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const balance = income - expense;
    
    doc.setFont('helvetica', 'bold');
    doc.text('Total Pemasukan:', 20, y);
    doc.text(formatCurrency(income), 190, y, { align: 'right' });
    y += 8;
    doc.text('Total Pengeluaran:', 20, y);
    doc.text(formatCurrency(expense), 190, y, { align: 'right' });
    y += 8;
    doc.text('Saldo Akhir:', 20, y);
    doc.text(formatCurrency(balance), 190, y, { align: 'right' });
    
    doc.save('laporan-kas-digital.pdf');
}
