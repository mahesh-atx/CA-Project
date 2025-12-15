// PDF and Excel Export Services
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { formatCurrency, formatDate } from '../utils/formatters';

/**
 * Generate PDF for Trial Balance
 */
export const exportTrialBalancePDF = (data, clientName, financialYear) => {
  try {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(clientName || 'Trial Balance', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Trial Balance', 105, 28, { align: 'center' });
    doc.text(`As on 31st March ${financialYear?.split('-')[1] || '2025'}`, 105, 35, { align: 'center' });
    
    // Table
    const tableData = data.entries.map(entry => [
      entry.ledgerName,
      entry.drAmount > 0 ? formatCurrency(entry.drAmount) : '-',
      entry.crAmount > 0 ? formatCurrency(entry.crAmount) : '-'
    ]);
    
    // Add totals row
    tableData.push([
      'Total',
      formatCurrency(data.totalDr),
      formatCurrency(data.totalCr)
    ]);
    
    autoTable(doc, {
      startY: 45,
      head: [['Particulars', 'Debit (₹)', 'Credit (₹)']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255] },
      footStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold' },
      columnStyles: {
        0: { cellWidth: 90 },
        1: { cellWidth: 45, halign: 'right' },
        2: { cellWidth: 45, halign: 'right' }
      }
    });
    
    // Footer
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(8);
    doc.text(`Generated on ${new Date().toLocaleDateString('en-IN')}`, 14, pageHeight - 10);
    doc.text('CA Pro Connect', 196, pageHeight - 10, { align: 'right' });
    
    doc.save(`TrialBalance_${clientName || 'Report'}_${financialYear || ''}.pdf`);
  } catch (error) {
    console.error('PDF Export Error:', error);
    alert('Failed to generate PDF. Please try again.');
  }
};

/**
 * Generate PDF for Profit & Loss
 */
export const exportProfitLossPDF = (data, clientName, financialYear) => {
  try {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(clientName || 'Profit & Loss Account', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Profit & Loss Account', 105, 28, { align: 'center' });
    doc.text(`For the year ending 31st March ${financialYear?.split('-')[1] || '2025'}`, 105, 35, { align: 'center' });
    
    // Expenses Table
    const expenseData = data.expenseItems.map(item => [item.name, formatCurrency(item.amount)]);
    if (data.netProfit > 0) {
      expenseData.push(['Net Profit', formatCurrency(data.netProfit)]);
    }
    expenseData.push(['Total', formatCurrency(data.totalExpenses + Math.max(0, data.netProfit))]);
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Expenses', 14, 50);
    
    autoTable(doc, {
      startY: 55,
      head: [['Particulars', 'Amount (₹)']],
      body: expenseData,
      theme: 'grid',
      headStyles: { fillColor: [0, 0, 0] },
      columnStyles: {
        0: { cellWidth: 70 },
        1: { cellWidth: 30, halign: 'right' }
      },
      margin: { left: 14, right: 110 }
    });
    
    // Income Table
    const incomeData = data.incomeItems.map(item => [item.name, formatCurrency(item.amount)]);
    if (data.netProfit < 0) {
      incomeData.push(['Net Loss', formatCurrency(Math.abs(data.netProfit))]);
    }
    incomeData.push(['Total', formatCurrency(data.totalIncome + Math.max(0, -data.netProfit))]);
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Income', 110, 50);
    
    autoTable(doc, {
      startY: 55,
      head: [['Particulars', 'Amount (₹)']],
      body: incomeData,
      theme: 'grid',
      headStyles: { fillColor: [0, 0, 0] },
      columnStyles: {
        0: { cellWidth: 70 },
        1: { cellWidth: 30, halign: 'right' }
      },
      margin: { left: 110, right: 14 }
    });
    
    // Footer
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated on ${new Date().toLocaleDateString('en-IN')}`, 14, pageHeight - 10);
    doc.text('CA Pro Connect', 196, pageHeight - 10, { align: 'right' });
    
    doc.save(`ProfitLoss_${clientName || 'Report'}_${financialYear || ''}.pdf`);
  } catch (error) {
    console.error('PDF Export Error:', error);
    alert('Failed to generate PDF. Please try again.');
  }
};

/**
 * Generate PDF for Balance Sheet
 */
export const exportBalanceSheetPDF = (data, clientName, financialYear) => {
  try {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(clientName || 'Balance Sheet', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Balance Sheet', 105, 28, { align: 'center' });
    doc.text(`As on 31st March ${financialYear?.split('-')[1] || '2025'}`, 105, 35, { align: 'center' });
    
    // Liabilities Table
    const liabData = [...data.capital, ...data.liabilities].map(item => [item.name, formatCurrency(item.amount)]);
    liabData.push(['Total', formatCurrency(data.totalLiabilitiesAndCapital)]);
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Liabilities & Capital', 14, 50);
    
    autoTable(doc, {
      startY: 55,
      head: [['Particulars', 'Amount (₹)']],
      body: liabData,
      theme: 'grid',
      headStyles: { fillColor: [0, 0, 0] },
      columnStyles: {
        0: { cellWidth: 70 },
        1: { cellWidth: 30, halign: 'right' }
      },
      margin: { left: 14, right: 110 }
    });
    
    // Assets Table
    const assetData = data.assets.map(item => [item.name, formatCurrency(item.amount)]);
    assetData.push(['Total', formatCurrency(data.totalAssets)]);
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Assets', 110, 50);
    
    autoTable(doc, {
      startY: 55,
      head: [['Particulars', 'Amount (₹)']],
      body: assetData,
      theme: 'grid',
      headStyles: { fillColor: [0, 0, 0] },
      columnStyles: {
        0: { cellWidth: 70 },
        1: { cellWidth: 30, halign: 'right' }
      },
      margin: { left: 110, right: 14 }
    });
    
    // Footer
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated on ${new Date().toLocaleDateString('en-IN')}`, 14, pageHeight - 10);
    doc.text('CA Pro Connect', 196, pageHeight - 10, { align: 'right' });
    
    doc.save(`BalanceSheet_${clientName || 'Report'}_${financialYear || ''}.pdf`);
  } catch (error) {
    console.error('PDF Export Error:', error);
    alert('Failed to generate PDF. Please try again.');
  }
};

/**
 * Generate PDF for Voucher
 */
export const exportVoucherPDF = (voucher, clientName) => {
  try {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(clientName || 'Voucher', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`${voucher.typeLabel || voucher.type} Voucher`, 105, 28, { align: 'center' });
    
    // Voucher details
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Voucher No: ${voucher.voucherNo}`, 14, 45);
    doc.text(`Date: ${formatDate(voucher.date)}`, 150, 45);
    
    if (voucher.partyLedgerName) {
      doc.text(`Party: ${voucher.partyLedgerName}`, 14, 52);
    }
    if (voucher.referenceNo) {
      doc.text(`Reference: ${voucher.referenceNo}`, 150, 52);
    }
    
    // Entries table
    const tableData = voucher.entries.map((entry, i) => [
      i + 1,
      entry.ledgerName,
      entry.type === 'Dr' ? formatCurrency(entry.amount) : '-',
      entry.type === 'Cr' ? formatCurrency(entry.amount) : '-'
    ]);
    
    const totalDr = voucher.entries.filter(e => e.type === 'Dr').reduce((sum, e) => sum + e.amount, 0);
    const totalCr = voucher.entries.filter(e => e.type === 'Cr').reduce((sum, e) => sum + e.amount, 0);
    tableData.push(['', 'Total', formatCurrency(totalDr), formatCurrency(totalCr)]);
    
    autoTable(doc, {
      startY: 60,
      head: [['#', 'Particulars', 'Debit (₹)', 'Credit (₹)']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [0, 0, 0] },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 100 },
        2: { cellWidth: 35, halign: 'right' },
        3: { cellWidth: 35, halign: 'right' }
      }
    });
    
    // Narration
    if (voucher.narration) {
      const finalY = doc.lastAutoTable?.finalY || 120;
      doc.setFont('helvetica', 'bold');
      doc.text('Narration:', 14, finalY + 10);
      doc.setFont('helvetica', 'normal');
      doc.text(voucher.narration, 14, finalY + 17, { maxWidth: 180 });
    }
    
    // Footer
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(8);
    doc.text(`Generated on ${new Date().toLocaleDateString('en-IN')}`, 14, pageHeight - 10);
    
    doc.save(`Voucher_${voucher.voucherNo.replace(/\//g, '-')}.pdf`);
  } catch (error) {
    console.error('PDF Export Error:', error);
    alert('Failed to generate PDF. Please try again.');
  }
};

/**
 * Export data to Excel
 */
export const exportToExcel = (data, filename, sheetName = 'Sheet1') => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};

/**
 * Export Trial Balance to Excel
 */
export const exportTrialBalanceExcel = (data, clientName, financialYear) => {
  const excelData = data.entries.map(entry => ({
    'Particulars': entry.ledgerName,
    'Debit (₹)': entry.drAmount > 0 ? entry.drAmount : '',
    'Credit (₹)': entry.crAmount > 0 ? entry.crAmount : ''
  }));
  
  // Add totals
  excelData.push({
    'Particulars': 'Total',
    'Debit (₹)': data.totalDr,
    'Credit (₹)': data.totalCr
  });
  
  exportToExcel(excelData, `TrialBalance_${clientName || 'Report'}_${financialYear || ''}`, 'Trial Balance');
};

/**
 * Export Clients to Excel
 */
export const exportClientsExcel = (clients) => {
  const excelData = clients.map(client => ({
    'Name': client.name,
    'GSTIN': client.gstin || 'N/A',
    'PAN': client.pan || 'N/A',
    'Group': client.group,
    'Status': client.status,
    'Email': client.email || '',
    'Phone': client.phone || '',
    'Address': client.address || ''
  }));
  
  exportToExcel(excelData, `Clients_${new Date().toISOString().split('T')[0]}`, 'Clients');
};

/**
 * Export Ledgers to Excel
 */
export const exportLedgersExcel = (ledgers, clientName) => {
  const excelData = ledgers.map(ledger => ({
    'Name': ledger.name,
    'Group': ledger.group,
    'Sub-Group': ledger.subGroup || '',
    'Opening Balance': ledger.openingBalance || 0,
    'Balance Type': ledger.openingBalanceType || 'Dr',
    'GST Applicable': ledger.gstApplicable ? 'Yes' : 'No',
    'GST Rate': ledger.gstRate || ''
  }));
  
  exportToExcel(excelData, `Ledgers_${clientName || 'All'}_${new Date().toISOString().split('T')[0]}`, 'Ledgers');
};

/**
 * Export Vouchers to Excel
 */
export const exportVouchersExcel = (vouchers, clientName) => {
  const excelData = vouchers.map(voucher => ({
    'Voucher No': voucher.voucherNo,
    'Type': voucher.typeLabel || voucher.type,
    'Date': formatDate(voucher.date),
    'Party': voucher.partyLedgerName || '',
    'Amount': voucher.totalAmount || 0,
    'Reference': voucher.referenceNo || '',
    'Narration': voucher.narration || ''
  }));
  
  exportToExcel(excelData, `Vouchers_${clientName || 'All'}_${new Date().toISOString().split('T')[0]}`, 'Vouchers');
};

/**
 * Export all data as JSON backup
 */
export const exportDataBackup = (clients, ledgers, vouchers, settings) => {
  const backup = {
    exportedAt: new Date().toISOString(),
    version: '1.0',
    data: {
      clients,
      ledgers,
      vouchers,
      settings
    }
  };
  
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `CAProConnect_Backup_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

/**
 * Import data from JSON backup
 */
export const importDataBackup = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const backup = JSON.parse(e.target.result);
        if (backup.data) {
          resolve(backup.data);
        } else {
          reject(new Error('Invalid backup format'));
        }
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
};
