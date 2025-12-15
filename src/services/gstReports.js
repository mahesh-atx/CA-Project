// GST Calculation and Report Services
import { formatCurrency, formatDate } from '../utils/formatters';

/**
 * Generate GSTR-1 Report (Outward Supplies)
 * B2B, B2C-Large, B2C-Small, Exports, Nil Rated, etc.
 */
export const generateGSTR1Report = (vouchers, ledgers, period = {}) => {
  const { startDate, endDate } = period;
  
  // Filter sales vouchers in period
  const salesVouchers = vouchers.filter(v => {
    const isSales = v.type === 'sales' || v.type === 'debit-note';
    const inPeriod = (!startDate || v.date >= startDate) && (!endDate || v.date <= endDate);
    return isSales && inPeriod;
  });

  // Categorize by type
  const b2b = []; // B2B supplies (to registered persons)
  const b2cLarge = []; // B2C Large (>2.5 lakh inter-state)
  const b2cSmall = []; // B2C Small
  const exports = [];
  const nilRated = [];
  const creditDebitNotes = [];

  salesVouchers.forEach(voucher => {
    const partyLedger = ledgers.find(l => l.id === voucher.partyLedgerId);
    const partyGSTIN = partyLedger?.gstin || '';
    const isRegistered = partyGSTIN && partyGSTIN.length === 15;
    
    // Calculate GST amounts from entries
    let taxableValue = 0;
    let cgst = 0;
    let sgst = 0;
    let igst = 0;
    let cess = 0;

    voucher.entries?.forEach(entry => {
      const ledger = ledgers.find(l => l.id === entry.ledgerId);
      if (ledger?.name?.toLowerCase().includes('cgst')) {
        cgst += entry.amount;
      } else if (ledger?.name?.toLowerCase().includes('sgst')) {
        sgst += entry.amount;
      } else if (ledger?.name?.toLowerCase().includes('igst')) {
        igst += entry.amount;
      } else if (ledger?.group?.includes('Income')) {
        taxableValue += entry.amount;
      }
    });

    const invoiceData = {
      invoiceNo: voucher.voucherNo,
      invoiceDate: voucher.date,
      customerName: partyLedger?.name || 'Unknown',
      gstin: partyGSTIN,
      placeOfSupply: partyLedger?.state || '',
      taxableValue,
      cgst,
      sgst,
      igst,
      cess,
      totalValue: taxableValue + cgst + sgst + igst + cess,
      invoiceType: voucher.type === 'debit-note' ? 'D' : 'R'
    };

    if (voucher.type === 'debit-note' || voucher.type === 'credit-note') {
      creditDebitNotes.push(invoiceData);
    } else if (isRegistered) {
      b2b.push(invoiceData);
    } else if (igst > 0 && taxableValue > 250000) {
      b2cLarge.push(invoiceData);
    } else {
      b2cSmall.push(invoiceData);
    }
  });

  // Calculate totals
  const calculateTotals = (items) => ({
    count: items.length,
    taxableValue: items.reduce((sum, i) => sum + i.taxableValue, 0),
    cgst: items.reduce((sum, i) => sum + i.cgst, 0),
    sgst: items.reduce((sum, i) => sum + i.sgst, 0),
    igst: items.reduce((sum, i) => sum + i.igst, 0),
    totalValue: items.reduce((sum, i) => sum + i.totalValue, 0)
  });

  return {
    period: { startDate, endDate },
    b2b: { items: b2b, totals: calculateTotals(b2b) },
    b2cLarge: { items: b2cLarge, totals: calculateTotals(b2cLarge) },
    b2cSmall: { items: b2cSmall, totals: calculateTotals(b2cSmall) },
    exports: { items: exports, totals: calculateTotals(exports) },
    nilRated: { items: nilRated, totals: calculateTotals(nilRated) },
    creditDebitNotes: { items: creditDebitNotes, totals: calculateTotals(creditDebitNotes) },
    grandTotals: calculateTotals([...b2b, ...b2cLarge, ...b2cSmall, ...exports])
  };
};

/**
 * Generate GSTR-3B Summary
 */
export const generateGSTR3BReport = (vouchers, ledgers, period = {}) => {
  const { startDate, endDate } = period;
  
  // Filter vouchers in period
  const periodVouchers = vouchers.filter(v => {
    const inPeriod = (!startDate || v.date >= startDate) && (!endDate || v.date <= endDate);
    return inPeriod;
  });

  // Initialize sections according to GSTR-3B format
  const report = {
    // 3.1 Tax on outward and reverse charge inward supplies
    outwardSupplies: {
      taxableOutward: { taxableValue: 0, igst: 0, cgst: 0, sgst: 0, cess: 0 },
      zeroRated: { taxableValue: 0, igst: 0, cgst: 0, sgst: 0, cess: 0 },
      nilRated: { taxableValue: 0, igst: 0, cgst: 0, sgst: 0, cess: 0 },
      inwardReverseCharge: { taxableValue: 0, igst: 0, cgst: 0, sgst: 0, cess: 0 },
      nonGST: { taxableValue: 0, igst: 0, cgst: 0, sgst: 0, cess: 0 }
    },
    // 3.2 Inter-State supplies
    interStateSupplies: {
      unreg: { taxableValue: 0 },
      composition: { taxableValue: 0 },
      uin: { taxableValue: 0 }
    },
    // 4. Eligible ITC
    eligibleITC: {
      itcAvailable: { igst: 0, cgst: 0, sgst: 0, cess: 0 },
      itcReversed: { igst: 0, cgst: 0, sgst: 0, cess: 0 },
      netITC: { igst: 0, cgst: 0, sgst: 0, cess: 0 },
      ineligibleITC: { igst: 0, cgst: 0, sgst: 0, cess: 0 }
    },
    // 5. Values of exempt, nil-rated and non-GST inward supplies
    inwardSuppliesExempt: {
      interState: 0,
      intraState: 0
    },
    // 6. Payment of tax
    taxPayable: { igst: 0, cgst: 0, sgst: 0, cess: 0 },
    taxPaidCash: { igst: 0, cgst: 0, sgst: 0, cess: 0 },
    taxPaidITC: { igst: 0, cgst: 0, sgst: 0, cess: 0 }
  };

  // Process vouchers
  periodVouchers.forEach(voucher => {
    voucher.entries?.forEach(entry => {
      const ledger = ledgers.find(l => l.id === entry.ledgerId);
      const amount = entry.amount || 0;
      const isCr = entry.type === 'Cr';

      // Output tax (Sales)
      if (voucher.type === 'sales') {
        if (ledger?.name?.toLowerCase().includes('cgst') && !ledger?.name?.toLowerCase().includes('input')) {
          report.outwardSupplies.taxableOutward.cgst += amount;
          report.taxPayable.cgst += amount;
        } else if (ledger?.name?.toLowerCase().includes('sgst') && !ledger?.name?.toLowerCase().includes('input')) {
          report.outwardSupplies.taxableOutward.sgst += amount;
          report.taxPayable.sgst += amount;
        } else if (ledger?.name?.toLowerCase().includes('igst') && !ledger?.name?.toLowerCase().includes('input')) {
          report.outwardSupplies.taxableOutward.igst += amount;
          report.taxPayable.igst += amount;
        } else if (ledger?.group?.includes('Income') && isCr) {
          report.outwardSupplies.taxableOutward.taxableValue += amount;
        }
      }

      // Input tax (Purchases)
      if (voucher.type === 'purchase') {
        if (ledger?.name?.toLowerCase().includes('input') && ledger?.name?.toLowerCase().includes('cgst')) {
          report.eligibleITC.itcAvailable.cgst += amount;
        } else if (ledger?.name?.toLowerCase().includes('input') && ledger?.name?.toLowerCase().includes('sgst')) {
          report.eligibleITC.itcAvailable.sgst += amount;
        } else if (ledger?.name?.toLowerCase().includes('input') && ledger?.name?.toLowerCase().includes('igst')) {
          report.eligibleITC.itcAvailable.igst += amount;
        }
      }
    });
  });

  // Calculate Net ITC
  report.eligibleITC.netITC = {
    igst: report.eligibleITC.itcAvailable.igst - report.eligibleITC.itcReversed.igst,
    cgst: report.eligibleITC.itcAvailable.cgst - report.eligibleITC.itcReversed.cgst,
    sgst: report.eligibleITC.itcAvailable.sgst - report.eligibleITC.itcReversed.sgst,
    cess: report.eligibleITC.itcAvailable.cess - report.eligibleITC.itcReversed.cess
  };

  // Calculate tax to be paid (Payable - ITC)
  report.taxPaidITC = {
    igst: Math.min(report.taxPayable.igst, report.eligibleITC.netITC.igst),
    cgst: Math.min(report.taxPayable.cgst, report.eligibleITC.netITC.cgst),
    sgst: Math.min(report.taxPayable.sgst, report.eligibleITC.netITC.sgst),
    cess: Math.min(report.taxPayable.cess, report.eligibleITC.netITC.cess)
  };

  report.taxPaidCash = {
    igst: Math.max(0, report.taxPayable.igst - report.taxPaidITC.igst),
    cgst: Math.max(0, report.taxPayable.cgst - report.taxPaidITC.cgst),
    sgst: Math.max(0, report.taxPayable.sgst - report.taxPaidITC.sgst),
    cess: Math.max(0, report.taxPayable.cess - report.taxPaidITC.cess)
  };

  return {
    period: { startDate, endDate },
    ...report
  };
};

/**
 * Get GST filing status for multiple periods
 */
export const getGSTFilingStatus = (clientId) => {
  const key = `gst_filing_${clientId}`;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

export const saveGSTFilingStatus = (clientId, filings) => {
  const key = `gst_filing_${clientId}`;
  localStorage.setItem(key, JSON.stringify(filings));
};

/**
 * HSN Summary from stock items
 */
export const generateHSNSummary = (stockItems, vouchers) => {
  const hsnMap = {};

  stockItems.forEach(item => {
    if (item.hsnCode) {
      if (!hsnMap[item.hsnCode]) {
        hsnMap[item.hsnCode] = {
          hsnCode: item.hsnCode,
          description: item.name,
          uqc: item.unit,
          totalQty: 0,
          totalValue: 0,
          taxableValue: 0,
          igst: 0,
          cgst: 0,
          sgst: 0
        };
      }
      // Add opening stock
      hsnMap[item.hsnCode].totalQty += item.openingQty || 0;
      hsnMap[item.hsnCode].totalValue += (item.openingQty || 0) * (item.openingRate || 0);
    }
  });

  return Object.values(hsnMap);
};
