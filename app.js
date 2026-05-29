// ==============================
// # GLOBAL VARIABLES
// ==============================
let transactions = [];
let currentTab = 'transactions';
let userProfile = {
    name: '',
    dob: ''
};
const APP_VERSION = '0.3.0';

// ==============================
// # INITIALIZATION
// ==============================
document.addEventListener('DOMContentLoaded', () => {
    initApp();
    registerServiceWorker();
});

function initApp() {
    loadTransactions();
    loadUserProfile();
    
    // Check if we need to show onboarding
    if (!userProfile.name) {
        setTimeout(() => {
            showOnboarding();
        }, 2000);
    } else {
        setTimeout(() => {
            showMainApp();
        }, 2000);
    }
    
    renderTransactions();
    updateSummary();
    setupEventListeners();
    setCurrentDate();
    checkForUpdates();
}

function showOnboarding() {
    document.getElementById('splash-screen').style.display = 'none';
    document.getElementById('onboarding-screen').style.display = 'flex';
}

function showMainApp() {
    document.getElementById('splash-screen').style.display = 'none';
    document.getElementById('onboarding-screen').style.display = 'none';
    document.getElementById('main-app').style.display = 'flex';
    updateProfileDisplay();
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
// # USER PROFILE
// ==============================
function loadUserProfile() {
    const saved = localStorage.getItem('kas-digital-profile');
    if (saved) {
        userProfile = JSON.parse(saved);
    }
}

function saveUserProfile() {
    localStorage.setItem('kas-digital-profile', JSON.stringify(userProfile));
}

function updateProfileDisplay() {
    document.getElementById('profile-name').textContent = userProfile.name || 'User';
    const avatar = document.getElementById('profile-avatar');
    if (userProfile.name) {
        avatar.textContent = userProfile.name.charAt(0).toUpperCase();
    }
    
    // Also update settings form
    document.getElementById('settings-name').value = userProfile.name || '';
    document.getElementById('settings-dob').value = userProfile.dob || '';
}

// ==============================
// # EVENT LISTENERS
// ==============================
function setupEventListeners() {
    // Onboarding form
    document.getElementById('onboarding-form').addEventListener('submit', (e) => {
        e.preventDefault();
        userProfile.name = document.getElementById('onboarding-name').value;
        userProfile.dob = document.getElementById('onboarding-dob').value;
        saveUserProfile();
        showMainApp();
    });
    
    // Bottom nav items
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            handleTabChangeBottomNav(e.currentTarget.dataset.tab);
        });
    });
    
    // Quick actions
    document.getElementById('btn-add-income').addEventListener('click', () => openModal('income'));
    document.getElementById('btn-add-expense').addEventListener('click', () => openModal('expense'));
    
    // Modal - add transaction
    document.getElementById('btn-close-modal').addEventListener('click', closeModal);
    document.getElementById('modal-add').addEventListener('click', (e) => {
        if (e.target.id === 'modal-add') closeModal();
    });
    document.getElementById('transaction-form').addEventListener('submit', handleAddTransaction);
    
    // Settings modal
    document.getElementById('btn-settings').addEventListener('click', openSettingsModal);
    document.getElementById('btn-close-settings').addEventListener('click', closeSettingsModal);
    document.getElementById('settings-modal').addEventListener('click', (e) => {
        if (e.target.id === 'settings-modal') closeSettingsModal();
    });
    document.getElementById('btn-save-profile').addEventListener('click', saveProfileFromSettings);
    document.getElementById('btn-check-update').addEventListener('click', checkForUpdates);
    document.getElementById('btn-drive-sync-settings').addEventListener('click', syncToDrive);
    
    // Report buttons
    document.getElementById('btn-export-pdf').addEventListener('click', exportToPDF);
    document.getElementById('btn-export-excel').addEventListener('click', exportToExcel);
    document.getElementById('btn-export-json').addEventListener('click', exportToJSON);
    document.getElementById('import-json').addEventListener('change', importFromJSON);
    document.getElementById('btn-drive-sync').addEventListener('click', syncToDrive);
    
    // Update notification
    document.getElementById('update-btn').addEventListener('click', () => {
        window.location.reload();
    });
}

// ==============================
// # TAB HANDLING (Bottom Nav)
// ==============================
function handleTabChangeBottomNav(tab) {
    currentTab = tab;
    
    // Update bottom nav
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.tab === tab) {
            btn.classList.add('active');
        }
    });
    
    // Update content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tab}-tab`).classList.add('active');
}

// ==============================
// # MODAL FUNCTIONS
// ==============================
function openModal(type) {
    const modal = document.getElementById('modal-add');
    const title = document.getElementById('modal-title');
    const radioIncome = document.getElementById('type-income');
    const radioExpense = document.getElementById('type-expense');
    
    title.textContent = type === 'income' ? 'Tambah Pemasukan' : 'Tambah Pengeluaran';
    
    if (type === 'income') {
        radioIncome.checked = true;
    } else {
        radioExpense.checked = true;
    }
    
    modal.style.display = 'flex';
    document.getElementById('description').focus();
}

function closeModal() {
    const modal = document.getElementById('modal-add');
    modal.style.display = 'none';
    document.getElementById('transaction-form').reset();
    setCurrentDate();
}

function openSettingsModal() {
    const modal = document.getElementById('settings-modal');
    document.getElementById('settings-name').value = userProfile.name || '';
    document.getElementById('settings-dob').value = userProfile.dob || '';
    modal.style.display = 'flex';
}

function closeSettingsModal() {
    const modal = document.getElementById('settings-modal');
    modal.style.display = 'none';
}

function saveProfileFromSettings() {
    userProfile.name = document.getElementById('settings-name').value;
    userProfile.dob = document.getElementById('settings-dob').value;
    saveUserProfile();
    updateProfileDisplay();
    closeSettingsModal();
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
        type: document.querySelector('input[name="type"]:checked').value,
        description: document.getElementById('description').value,
        amount: parseFloat(document.getElementById('amount').value),
        date: document.getElementById('date').value
    };
    
    transactions.unshift(transaction);
    saveTransactions();
    renderTransactions();
    updateSummary();
    closeModal();
}

function deleteTransaction(id) {
    if (confirm('Hapus transaksi ini?')) {
        transactions = transactions.filter(t => t.id !== id);
        saveTransactions();
        renderTransactions();
        updateSummary();
    }
}

function setCurrentDate() {
    document.getElementById('date').value = new Date().toISOString().split('T')[0];
}

// ==============================
// # RENDERING
// ==============================
function renderTransactions() {
    const container = document.getElementById('transaction-list');
    const emptyState = document.getElementById('empty-state');
    
    if (transactions.length === 0) {
        container.innerHTML = '';
        emptyState.style.display = 'block';
    } else {
        emptyState.style.display = 'none';
        container.innerHTML = transactions.map(t => `
            <div class="transaction-item" ondblclick="deleteTransaction(${t.id})">
                <div class="transaction-info">
                    <div class="transaction-desc">${escapeHtml(t.description)}</div>
                    <div class="transaction-date">${formatDate(t.date)}</div>
                </div>
                <div class="transaction-amount ${t.type}">
                    ${t.type === 'income' ? '+' : '-'} ${formatCurrency(t.amount)}
                </div>
            </div>
        `).join('');
    }
    
    renderSpreadsheet();
}

function renderSpreadsheet() {
    const tbody = document.getElementById('spreadsheet-body');
    const tfoot = document.getElementById('spreadsheet-summary');
    
    if (transactions.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="padding: 40px; text-align: center; color: #6b7280;">Belum ada transaksi</td></tr>';
        tfoot.innerHTML = '';
        return;
    }
    
    tbody.innerHTML = transactions.map((t, i) => `
        <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 12px 16px;">${i + 1}</td>
            <td style="padding: 12px 16px;">${t.date}</td>
            <td style="padding: 12px 16px;">${escapeHtml(t.description)}</td>
            <td style="padding: 12px 16px; color: ${t.type === 'income' ? '#10b981' : '#ef4444'};">
                ${t.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}
            </td>
            <td style="padding: 12px 16px; text-align: right; color: ${t.type === 'income' ? '#10b981' : '#ef4444'};">
                ${formatCurrency(t.amount)}
            </td>
        </tr>
    `).join('');
    
    const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const balance = income - expense;
    
    tfoot.innerHTML = `
        <tr>
            <td colspan="3" style="padding: 12px 16px;">Total Pemasukan</td>
            <td style="padding: 12px 16px; color: #10b981;">${formatCurrency(income)}</td>
            <td></td>
        </tr>
        <tr style="background: #e5e7eb;">
            <td colspan="3" style="padding: 12px 16px;">Total Pengeluaran</td>
            <td style="padding: 12px 16px; color: #ef4444;">${formatCurrency(expense)}</td>
            <td></td>
        </tr>
        <tr>
            <td colspan="3" style="padding: 12px 16px;">Saldo Akhir</td>
            <td style="padding: 12px 16px; color: #008a4b;">${formatCurrency(balance)}</td>
            <td></td>
        </tr>
    `;
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

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ==============================
// # EXPORT FUNCTIONS
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

function exportToExcel() {
    if (typeof XLSX === 'undefined') {
        alert('Library XLSX tidak tersedia!');
        return;
    }
    
    const data = transactions.map(t => ({
        'Tanggal': t.date,
        'Keterangan': t.description,
        'Tipe': t.type === 'income' ? 'Pemasukan' : 'Pengeluaran',
        'Jumlah': t.amount
    }));
    
    const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const balance = income - expense;
    
    const summaryData = [
        { 'Keterangan': 'Total Pemasukan', 'Jumlah': income },
        { 'Keterangan': 'Total Pengeluaran', 'Jumlah': expense },
        { 'Keterangan': 'Saldo Akhir', 'Jumlah': balance }
    ];
    
    const wb = XLSX.utils.book_new();
    const ws1 = XLSX.utils.json_to_sheet(data);
    const ws2 = XLSX.utils.json_to_sheet(summaryData);
    
    XLSX.utils.book_append_sheet(wb, ws1, 'Transaksi');
    XLSX.utils.book_append_sheet(wb, ws2, 'Ringkasan');
    
    XLSX.writeFile(wb, `laporan-kas-digital-${new Date().toISOString().split('T')[0]}.xlsx`);
}

function exportToPDF() {
    if (typeof jspdf === 'undefined' || typeof jspdf.jsPDF === 'undefined') {
        alert('Library jsPDF tidak tersedia!');
        return;
    }
    
    const { jsPDF } = jspdf;
    const doc = new jsPDF();
    
    // Header
    doc.setFillColor(0, 138, 75);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('LAPORAN KAS DIGITAL', 105, 25, { align: 'center' });
    
    // Subtitle
    doc.setTextColor(107, 114, 128);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Dicetak pada: ${new Date().toLocaleDateString('id-ID')}`, 105, 50, { align: 'center' });
    
    // Summary Box
    doc.setFillColor(243, 244, 246);
    doc.roundedRect(20, 60, 170, 40, 3, 3, 'F');
    
    const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const balance = income - expense;
    
    doc.setTextColor(17, 24, 39);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Total Pemasukan', 30, 75);
    doc.setTextColor(16, 185, 129);
    doc.text(formatCurrency(income), 190, 75, { align: 'right' });
    
    doc.setTextColor(17, 24, 39);
    doc.text('Total Pengeluaran', 30, 88);
    doc.setTextColor(239, 68, 68);
    doc.text(formatCurrency(expense), 190, 88, { align: 'right' });
    
    doc.setTextColor(17, 24, 39);
    doc.text('Saldo Akhir', 30, 101);
    doc.setTextColor(0, 138, 75);
    doc.text(formatCurrency(balance), 190, 101, { align: 'right' });
    
    // Table Header
    let y = 115;
    doc.setTextColor(255, 255, 255);
    doc.setFillColor(0, 138, 75);
    doc.roundedRect(20, y, 170, 10, 2, 2, 'F');
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('No', 25, y + 7);
    doc.text('Tanggal', 40, y + 7);
    doc.text('Keterangan', 85, y + 7);
    doc.text('Jumlah', 190, y + 7, { align: 'right' });
    
    y += 15;
    
    // Table Content
    doc.setTextColor(17, 24, 39);
    doc.setFont('helvetica', 'normal');
    
    transactions.forEach((t, i) => {
        if (y > 270) {
            doc.addPage();
            y = 20;
        }
        
        // Alternating row color
        if (i % 2 === 0) {
            doc.setFillColor(248, 250, 252);
            doc.rect(20, y - 5, 170, 8, 'F');
        }
        
        doc.text(String(i + 1), 25, y);
        doc.text(t.date, 40, y);
        doc.text(t.description, 85, y);
        doc.setTextColor(t.type === 'income' ? 16 : 239, t.type === 'income' ? 185 : 68, t.type === 'income' ? 129 : 68);
        doc.text(`${t.type === 'income' ? '+' : '-'} ${formatCurrency(t.amount)}`, 190, y, { align: 'right' });
        doc.setTextColor(17, 24, 39);
        
        y += 8;
    });
    
    // Footer
    doc.setTextColor(156, 163, 175);
    doc.setFontSize(9);
    doc.text('Kas Digital by Evaga (Rouf)', 105, 290, { align: 'center' });
    
    doc.save(`laporan-kas-digital-${new Date().toISOString().split('T')[0]}.pdf`);
}

// ==============================
// # UPDATE & SYNC
// ==============================
function checkForUpdates() {
    // Simulate checking for updates
    const lastUpdateCheck = localStorage.getItem('kas-digital-last-update-check');
    const now = Date.now();
    
    if (!lastUpdateCheck || (now - lastUpdateCheck > 86400000)) {
        localStorage.setItem('kas-digital-last-update-check', String(now));
        // In a real app, you'd check a server here
    }
}

function showUpdateNotification() {
    document.getElementById('update-notification').style.display = 'flex';
}

function syncToDrive() {
    alert('Untuk menyinkronkan dengan Google Drive:\n\n1. Buka Google Cloud Console\n2. Buat project baru\n3. Aktifkan Google Drive API\n4. Buat OAuth 2.0 Client ID\n5. Tambahkan origin ke Authorized JavaScript origins\n\nData Anda disimpan secara lokal. Gunakan Export JSON untuk mencadangkan!');
}

function syncToGitHub() {
    alert('Konfigurasi GitHub sudah diatur di GitHub Actions! Push kode Anda untuk deployment otomatis!');
}
