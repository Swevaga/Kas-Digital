// ==============================
// # KAS DIGITAL v0.4 - FULL FEATURES
// ==============================

let transactions = [];
let currentTab = 'transactions';
let userProfile = {
    name: '',
    dob: '',
    email: '',
    picture: ''
};
const APP_VERSION = '0.4.0';
const GITHUB_REPO = 'Swevaga/Kas-Digital';

// ==============================
// # INITIALIZATION
// ==============================
document.addEventListener('DOMContentLoaded', () => {
    initApp();
    registerServiceWorker();
    initGoogleAPI();
});

function initApp() {
    loadUserProfile();
    loadTransactions();
    
    setTimeout(() => {
        if (!userProfile.name) {
            showOnboarding();
        } else {
            showMainApp();
        }
    }, 2000);
    
    renderTransactions();
    updateSummary();
    setupEventListeners();
    setCurrentDate();
    checkForUpdates();
}

function initGoogleAPI() {
    window.handleGoogleSignIn = handleGoogleSignIn;
}

// ==============================
// # COOKIE MANAGEMENT - AUTO SAVE
// ==============================
function setCookie(name, value, days = 365) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    const cookieValue = encodeURIComponent(JSON.stringify(value));
    document.cookie = `${name}=${cookieValue};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c.indexOf(nameEQ) === 0) {
            try {
                return JSON.parse(decodeURIComponent(c.substring(nameEQ.length)));
            } catch (e) {
                return null;
            }
        }
    }
    return null;
}

function eraseCookie(name) {
    document.cookie = `${name}=;Path=/;Expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

// ==============================
// # GOOGLE SIGN-IN
// ==============================
function handleGoogleSignIn(response) {
    try {
        const credential = response.credential;
        const data = parseJwt(credential);
        
        userProfile.email = data.email;
        userProfile.name = data.name;
        userProfile.picture = data.picture;
        
        saveUserProfile();
        showMainApp();
    } catch (error) {
        console.error('Google Sign-In error:', error);
    }
}

function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

function signOut() {
    userProfile = {
        name: '',
        dob: '',
        email: '',
        picture: ''
    };
    saveUserProfile();
    eraseCookie('userProfile');
    window.location.reload();
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
    const savedLocal = localStorage.getItem('kas-digital-profile');
    const savedCookie = getCookie('userProfile');
    
    if (savedLocal) {
        userProfile = JSON.parse(savedLocal);
    } else if (savedCookie) {
        userProfile = savedCookie;
    }
}

function saveUserProfile() {
    localStorage.setItem('kas-digital-profile', JSON.stringify(userProfile));
    setCookie('userProfile', userProfile);
    updateProfileDisplay();
}

function updateProfileDisplay() {
    const nameEl = document.getElementById('profile-name');
    const avatarEl = document.getElementById('profile-avatar');
    const avatarImgEl = document.getElementById('profile-avatar-img');
    
    if (nameEl) nameEl.textContent = userProfile.name || 'User';
    
    if (userProfile.picture && avatarImgEl) {
        avatarImgEl.src = userProfile.picture;
        avatarImgEl.style.display = 'block';
        if (avatarEl) avatarEl.style.display = 'none';
    } else if (avatarEl) {
        avatarEl.style.display = 'flex';
        if (avatarImgEl) avatarImgEl.style.display = 'none';
        avatarEl.textContent = userProfile.name ? userProfile.name.charAt(0).toUpperCase() : 'U';
    }
}

// ==============================
// # EVENT LISTENERS
// ==============================
function setupEventListeners() {
    // Onboarding form
    const onboardingForm = document.getElementById('onboarding-form');
    if (onboardingForm) {
        onboardingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            userProfile.name = document.getElementById('onboarding-name').value;
            userProfile.dob = document.getElementById('onboarding-dob').value;
            saveUserProfile();
            showMainApp();
        });
    }
    
    // Bottom nav items
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            handleTabChangeBottomNav(e.currentTarget.dataset.tab);
        });
    });
    
    // Quick actions
    const btnAddIncome = document.getElementById('btn-add-income');
    const btnAddExpense = document.getElementById('btn-add-expense');
    if (btnAddIncome) btnAddIncome.addEventListener('click', () => openModal('income'));
    if (btnAddExpense) btnAddExpense.addEventListener('click', () => openModal('expense'));
    
    // Modal - add transaction
    const btnCloseModal = document.getElementById('btn-close-modal');
    const modalAdd = document.getElementById('modal-add');
    const transactionForm = document.getElementById('transaction-form');
    
    if (btnCloseModal) btnCloseModal.addEventListener('click', closeModal);
    if (modalAdd) {
        modalAdd.addEventListener('click', (e) => {
            if (e.target.id === 'modal-add') closeModal();
        });
    }
    if (transactionForm) transactionForm.addEventListener('submit', handleAddTransaction);
    
    // Settings modal
    const btnSettings = document.getElementById('btn-settings');
    const btnCloseSettings = document.getElementById('btn-close-settings');
    const settingsModal = document.getElementById('settings-modal');
    const btnSaveProfile = document.getElementById('btn-save-profile');
    const btnSignOut = document.getElementById('btn-sign-out');
    const btnCheckUpdate = document.getElementById('btn-check-update');
    
    if (btnSettings) btnSettings.addEventListener('click', openSettingsModal);
    if (btnCloseSettings) btnCloseSettings.addEventListener('click', closeSettingsModal);
    if (settingsModal) {
        settingsModal.addEventListener('click', (e) => {
            if (e.target.id === 'settings-modal') closeSettingsModal();
        });
    }
    if (btnSaveProfile) btnSaveProfile.addEventListener('click', saveProfileFromSettings);
    if (btnSignOut) btnSignOut.addEventListener('click', signOut);
    if (btnCheckUpdate) btnCheckUpdate.addEventListener('click', () => checkForUpdates(true));
    
    // Report buttons
    const btnExportPdf = document.getElementById('btn-export-pdf');
    const btnExportExcel = document.getElementById('btn-export-excel');
    const btnExportJson = document.getElementById('btn-export-json');
    const importJson = document.getElementById('import-json');
    const btnDriveSync = document.getElementById('btn-drive-sync');
    const btnDriveSyncSettings = document.getElementById('btn-drive-sync-settings');
    const btnSyncDrive = document.getElementById('btn-sync-drive');
    
    if (btnExportPdf) btnExportPdf.addEventListener('click', exportToPDF);
    if (btnExportExcel) btnExportExcel.addEventListener('click', exportToExcel);
    if (btnExportJson) btnExportJson.addEventListener('click', exportToJSON);
    if (importJson) importJson.addEventListener('change', importFromJSON);
    if (btnDriveSync) btnDriveSync.addEventListener('click', syncToDrive);
    if (btnDriveSyncSettings) btnDriveSyncSettings.addEventListener('click', syncToDrive);
    if (btnSyncDrive) btnSyncDrive.addEventListener('click', syncToDrive);
    
    // Update notification
    const updateBtn = document.getElementById('update-btn');
    if (updateBtn) updateBtn.addEventListener('click', () => window.location.reload());
}

// ==============================
// # TAB HANDLING (Bottom Nav)
// ==============================
function handleTabChangeBottomNav(tab) {
    currentTab = tab;
    
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.tab === tab) {
            btn.classList.add('active');
        }
    });
    
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    const tabContent = document.getElementById(`${tab}-tab`);
    if (tabContent) tabContent.classList.add('active');
}

// ==============================
// # MODAL FUNCTIONS
// ==============================
function showOnboarding() {
    const splashScreen = document.getElementById('splash-screen');
    const onboardingScreen = document.getElementById('onboarding-screen');
    if (splashScreen) splashScreen.style.display = 'none';
    if (onboardingScreen) onboardingScreen.style.display = 'flex';
}

function showMainApp() {
    const splashScreen = document.getElementById('splash-screen');
    const onboardingScreen = document.getElementById('onboarding-screen');
    const mainApp = document.getElementById('main-app');
    
    if (splashScreen) splashScreen.style.display = 'none';
    if (onboardingScreen) onboardingScreen.style.display = 'none';
    if (mainApp) mainApp.style.display = 'flex';
    updateProfileDisplay();
}

function openModal(type) {
    const modal = document.getElementById('modal-add');
    const title = document.getElementById('modal-title');
    const radioIncome = document.getElementById('type-income');
    const radioExpense = document.getElementById('type-expense');
    
    if (title) title.textContent = type === 'income' ? 'Tambah Pemasukan' : 'Tambah Pengeluaran';
    
    if (type === 'income' && radioIncome) radioIncome.checked = true;
    else if (radioExpense) radioExpense.checked = true;
    
    if (modal) modal.style.display = 'flex';
    const descInput = document.getElementById('description');
    if (descInput) descInput.focus();
}

function closeModal() {
    const modal = document.getElementById('modal-add');
    if (modal) modal.style.display = 'none';
    const form = document.getElementById('transaction-form');
    if (form) form.reset();
    setCurrentDate();
}

function openSettingsModal() {
    const modal = document.getElementById('settings-modal');
    const settingsName = document.getElementById('settings-name');
    const settingsDob = document.getElementById('settings-dob');
    
    if (settingsName) settingsName.value = userProfile.name || '';
    if (settingsDob) settingsDob.value = userProfile.dob || '';
    
    if (modal) modal.style.display = 'flex';
}

function closeSettingsModal() {
    const modal = document.getElementById('settings-modal');
    if (modal) modal.style.display = 'none';
}

function saveProfileFromSettings() {
    const settingsName = document.getElementById('settings-name');
    const settingsDob = document.getElementById('settings-dob');
    
    if (settingsName) userProfile.name = settingsName.value;
    if (settingsDob) userProfile.dob = settingsDob.value;
    saveUserProfile();
    closeSettingsModal();
}

// ==============================
// # TRANSACTIONS MANAGEMENT
// ==============================
function loadTransactions() {
    const savedLocal = localStorage.getItem('kas-digital-transactions');
    const savedCookie = getCookie('transactions');
    
    if (savedLocal) {
        transactions = JSON.parse(savedLocal);
    } else if (savedCookie) {
        transactions = savedCookie;
    }
}

function saveTransactions() {
    localStorage.setItem('kas-digital-transactions', JSON.stringify(transactions));
    setCookie('transactions', transactions);
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
    const dateInput = document.getElementById('date');
    if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];
}

// ==============================
// # RENDERING
// ==============================
function renderTransactions() {
    const container = document.getElementById('transaction-list');
    const emptyState = document.getElementById('empty-state');
    
    if (!container) return;
    
    if (transactions.length === 0) {
        container.innerHTML = '';
        if (emptyState) emptyState.style.display = 'block';
    } else {
        if (emptyState) emptyState.style.display = 'none';
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
    
    if (!tbody || !tfoot) return;
    
    if (transactions.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="padding: 40px; text-align: center; color: #6B7280;">Belum ada transaksi</td></tr>';
        tfoot.innerHTML = '';
        return;
    }
    
    tbody.innerHTML = transactions.map((t, i) => `
        <tr style="border-bottom: 1px solid #E5E7EB;">
            <td style="padding: 14px 16px;">${i + 1}</td>
            <td style="padding: 14px 16px;">${t.date}</td>
            <td style="padding: 14px 16px;">${escapeHtml(t.description)}</td>
            <td style="padding: 14px 16px; color: ${t.type === 'income' ? '#10B981' : '#EF4444'};">
                ${t.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}
            </td>
            <td style="padding: 14px 16px; text-align: right; color: ${t.type === 'income' ? '#10B981' : '#EF4444'};">
                ${formatCurrency(t.amount)}
            </td>
        </tr>
    `).join('');
    
    const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const balance = income - expense;
    
    tfoot.innerHTML = `
        <tr>
            <td colspan="3" style="padding: 14px 16px;">Total Pemasukan</td>
            <td style="padding: 14px 16px; color: #10B981;">${formatCurrency(income)}</td>
            <td></td>
        </tr>
        <tr style="background: #E5E7EB;">
            <td colspan="3" style="padding: 14px 16px;">Total Pengeluaran</td>
            <td style="padding: 14px 16px; color: #EF4444;">${formatCurrency(expense)}</td>
            <td></td>
        </tr>
        <tr>
            <td colspan="3" style="padding: 14px 16px;">Saldo Akhir</td>
            <td style="padding: 14px 16px; color: #008A4B;">${formatCurrency(balance)}</td>
            <td></td>
        </tr>
    `;
}

function updateSummary() {
    const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const balance = income - expense;
    
    const balanceEl = document.getElementById('balance');
    const totalIncomeEl = document.getElementById('total-income');
    const totalExpenseEl = document.getElementById('total-expense');
    
    if (balanceEl) balanceEl.textContent = formatCurrency(balance);
    if (totalIncomeEl) totalIncomeEl.textContent = formatCurrency(income);
    if (totalExpenseEl) totalExpenseEl.textContent = formatCurrency(expense);
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
// # UPDATE CHECK & GITHUB RELEASES
// ==============================
async function checkForUpdates(manual = false) {
    try {
        const lastCheck = localStorage.getItem('kas-digital-last-check');
        const now = Date.now();
        
        if (!manual && lastCheck && (now - parseInt(lastCheck) < 3600000)) {
            return;
        }
        
        localStorage.setItem('kas-digital-last-check', now.toString());
        
        const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/releases/latest`);
        
        if (!response.ok) {
            if (manual) alert('Tidak dapat memeriksa pembaruan');
            return;
        }
        
        const data = await response.json();
        
        if (data.tag_name && data.tag_name !== `v${APP_VERSION}`) {
            showUpdateNotification(data);
        } else if (manual) {
            alert('Anda sudah menggunakan versi terbaru!');
        }
    } catch (error) {
        console.error('Update check error:', error);
        if (manual) alert('Gagal memeriksa pembaruan');
    }
}

function showUpdateNotification(releaseData) {
    const notification = document.getElementById('update-notification');
    const updateText = document.querySelector('.update-text');
    
    if (updateText && releaseData) {
        updateText.textContent = `🎊 ${releaseData.name || 'Pembaruan baru tersedia'} - Klik untuk memperbarui`;
    }
    
    if (notification) notification.style.display = 'flex';
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
    
    const wb = XLSX.utils.book_new();
    const ws1 = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws1, 'Transaksi');
    
    XLSX.writeFile(wb, `laporan-kas-digital-${new Date().toISOString().split('T')[0]}.xlsx`);
}

function exportToPDF() {
    if (typeof jspdf === 'undefined' || typeof jspdf.jsPDF === 'undefined') {
        alert('Library jsPDF tidak tersedia!');
        return;
    }
    
    const { jsPDF } = jspdf;
    const doc = new jsPDF();
    
    doc.setFillColor(0, 138, 75);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('LAPORAN KAS DIGITAL', 105, 25, { align: 'center' });
    
    doc.setTextColor(107, 114, 128);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Dicetak pada: ${new Date().toLocaleDateString('id-ID')}`, 105, 50, { align: 'center' });
    
    const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const balance = income - expense;
    
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
    doc.setTextColor(17, 24, 39);
    doc.setFont('helvetica', 'normal');
    
    transactions.forEach((t, i) => {
        if (y > 270) {
            doc.addPage();
            y = 20;
        }
        
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
    
    doc.setTextColor(156, 163, 175);
    doc.setFontSize(9);
    doc.text('Kas Digital by Evaga (Rouf)', 105, 290, { align: 'center' });
    
    doc.save(`laporan-kas-digital-${new Date().toISOString().split('T')[0]}.pdf`);
}

// ==============================
// # GOOGLE DRIVE SYNC
// ==============================
function syncToDrive() {
    alert('Sinkronisasi Google Drive dalam pengembangan.\n\nUntuk saat ini, gunakan Export JSON untuk mencadangkan data Anda!');
}
