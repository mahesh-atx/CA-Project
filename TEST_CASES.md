# CA Pro Connect - Comprehensive Test Cases

## Pre-requisite Setup

1. Open http://localhost:5174
2. Login with any email/password
3. Click **"Load Sample Data"** on Dashboard
4. Select **"ABC Industries Pvt Ltd"** from client dropdown

---

## TC-01: Client Management
| Test    | Steps                                                                 | Expected Result                 | Status |
| ------- | --------------------------------------------------------------------- | ------------------------------- | ------ |
| TC-01.1 | Go to Clients → Click "Add Client"                                    | Form opens                      | ☑      |
| TC-01.2 | Fill: Name="Test Corp", GSTIN="27AABCT1234A1Z5", Status=Active → Save | Client added to list            | ☑      |
| TC-01.3 | Click Edit on any client → Change name → Save                         | Name updated                    | ☑      |
| TC-01.4 | Click Delete on a client → Confirm                                    | Client removed                  | ☑      |
| TC-01.5 | Select client from header dropdown                                    | All data filters to that client | ☑      |

---

## TC-02: Ledger Management

| Test    | Steps                                                                      | Expected Result                     | Status |
| ------- | -------------------------------------------------------------------------- | ----------------------------------- | ------ |
| TC-02.1 | Ledgers → Add Ledger: "Test Bank", Group=Current Assets, Sub=Bank Accounts | Ledger created                      | ☑      |
| TC-02.2 | Add Ledger with Opening Balance: ₹50,000 Dr                                | Balance shows in trial balance      | ☑      |
| TC-02.3 | Edit ledger name                                                           | Name updated                        | ☑      |
| TC-02.4 | Delete ledger                                                              | Ledger removed                      | ☑      |
| TC-02.5 | Filter ledgers by group                                                    | Only matching ledgers show          | ☑      |
| TC-02.6 | Add a new Ledger or Client → Verify badge                                  | "New" badge visible next to item    | ☐      |
| TC-02.7 | Click Edit icon on ledger while scrolled down                              | Page scrolls to top with edit form  | ☐      |

---

## TC-03: Voucher Entry & Validation

| Test    | Steps                                                                                 | Expected Result              | Status |
| ------- | ------------------------------------------------------------------------------------- | ---------------------------- | ------ |
| TC-03.1 | Vouchers → Select "Payment" → Add unbalanced entry                                    | Error: "Debit ≠ Credit"      | ☐      |
| TC-03.2 | Create balanced Payment: Cash Dr ₹1000, Bank Cr ₹1000                                 | Voucher saved                | ☐      |
| TC-03.3 | Create Sales: Debtor Dr ₹11,800, Sales Cr ₹10,000, CGST Cr ₹900, SGST Cr ₹900         | Voucher saved with GST split | ☐      |
| TC-03.4 | Create Purchase: Purchase Dr ₹10,000, CGST Dr ₹900, SGST Dr ₹900, Creditor Cr ₹11,800 | Voucher saved                | ☐      |
| TC-03.5 | Create Receipt: Bank Dr ₹5000, Debtor Cr ₹5000                                        | Receipt recorded             | ☐      |
| TC-03.6 | Create Contra: Cash Dr ₹10,000, Bank Cr ₹10,000                                       | Bank to cash transfer        | ☐      |
| TC-03.7 | Create Journal entry                                                                  | Multi-line entry works       | ☐      |
| TC-03.8 | Edit existing voucher                                                                 | Changes saved                | ☐      |
| TC-03.9 | Delete voucher                                                                        | Voucher removed              | ☐      |

---

## TC-04: Day Book

| Test    | Steps                                | Expected Result               | Status |
| ------- | ------------------------------------ | ----------------------------- | ------ |
| TC-04.1 | Day Book → Select date with vouchers | Vouchers for that date appear | ☐      |
| TC-04.2 | Filter by "Sales" type               | Only sales vouchers show      | ☐      |
| TC-04.3 | Verify Debit/Credit totals           | Totals match voucher amounts  | ☐      |
| TC-04.4 | Select date with no vouchers         | "No transactions" message     | ☐      |

---

## TC-05: Ledger Statement

| Test    | Steps                                         | Expected Result                 | Status |
| ------- | --------------------------------------------- | ------------------------------- | ------ |
| TC-05.1 | Ledger A/c → Select "HDFC Bank"               | Shows all bank transactions     | ☐      |
| TC-05.2 | Verify Opening Balance                        | First row shows opening balance | ☐      |
| TC-05.3 | Verify Running Balance                        | Each row = Previous + Dr - Cr   | ☐      |
| TC-05.4 | Filter by date range                          | Only period transactions show   | ☐      |
| TC-05.5 | Select Select ledger → Verify closing balance | Matches last running balance    | ☐      |

---

## TC-06: Trial Balance Calculation

| Test    | Steps                                            | Expected Result                     | Status |
| ------- | ------------------------------------------------ | ----------------------------------- | ------ |
| TC-06.1 | Reports → Trial Balance                          | All ledgers with balances appear    | ☐      |
| TC-06.2 | Verify Total Debit = Total Credit                | Columns match (accounting equation) | ☐      |
| TC-06.3 | Ledger with Dr balance shows in Dr column        | Correct placement                   | ☐      |
| TC-06.4 | Ledger with Cr balance shows in Cr column        | Correct placement                   | ☐      |
| TC-06.5 | Opening balance + Transactions = Closing balance | Math correct                        | ☐      |

---

## TC-07: Profit & Loss Statement

| Test    | Steps                                        | Expected Result           | Status |
| ------- | -------------------------------------------- | ------------------------- | ------ |
| TC-07.1 | Reports → Profit & Loss                      | Income and Expenses shown | ☐      |
| TC-07.2 | Income section shows Sales, Other Income     | Grouped correctly         | ☐      |
| TC-07.3 | Expense section shows Purchase, Salary, Rent | Grouped correctly         | ☐      |
| TC-07.4 | Net Profit = Total Income - Total Expenses   | Calculation correct       | ☐      |
| TC-07.5 | Gross Profit = Sales - Purchases             | Calculation correct       | ☐      |

---

## TC-08: Balance Sheet

| Test    | Steps                                       | Expected Result              | Status |
| ------- | ------------------------------------------- | ---------------------------- | ------ |
| TC-08.1 | Reports → Balance Sheet                     | Assets and Liabilities shown | ☐      |
| TC-08.2 | Assets = Liabilities + Capital              | Equation balances            | ☐      |
| TC-08.3 | Current Assets includes Bank, Cash, Debtors | Correct grouping             | ☐      |
| TC-08.4 | Fixed Assets shows Machinery, Furniture     | Correct grouping             | ☐      |
| TC-08.5 | Net Profit added to Capital                 | P&L flows correctly          | ☐      |

---

## TC-09: GST Calculations (GSTR-1)

| Test    | Steps                                         | Expected Result       | Status |
| ------- | --------------------------------------------- | --------------------- | ------ |
| TC-09.1 | GSTR-1 → Select December 2024                 | Sales vouchers appear | ☐      |
| TC-09.2 | B2B section shows sales to registered parties | GSTIN displayed       | ☐      |
| TC-09.3 | B2C section shows sales to unregistered       | No GSTIN              | ☐      |
| TC-09.4 | Taxable Value + CGST + SGST = Invoice Value   | Math correct          | ☐      |
| TC-09.5 | Total matches sum of all invoices             | Totals correct        | ☐      |

---

## TC-10: GST Calculations (GSTR-3B)

| Test    | Steps                                         | Expected Result        | Status |
| ------- | --------------------------------------------- | ---------------------- | ------ |
| TC-10.1 | GSTR-3B → Select December 2024                | Summary report appears | ☐      |
| TC-10.2 | Outward Supplies = Sum of Sales taxable value | Correct                | ☐      |
| TC-10.3 | Output Tax = CGST + SGST from sales           | Correct                | ☐      |
| TC-10.4 | Input Tax Credit = CGST + SGST from purchases | Correct                | ☐      |
| TC-10.5 | Net Payable = Output Tax - Input Tax          | Calculation correct    | ☐      |
| TC-10.6 | Tax Paid via ITC utilization shown            | ITC offset applied     | ☐      |

**Expected for Sample Data:**

- Sales: ₹5,00,000 → CGST ₹45,000, SGST ₹45,000
- Purchases: ₹1,75,000 → CGST Input ₹15,750, SGST Input ₹15,750
- Net Payable: ₹45,000 - ₹15,750 = ₹29,250 each

---

## TC-11: Bank Reconciliation

| Test    | Steps                                            | Expected Result              | Status |
| ------- | ------------------------------------------------ | ---------------------------- | ------ |
| TC-11.1 | Bank Recon → Select "HDFC Bank"                  | Bank transactions appear     | ☐      |
| TC-11.2 | Click checkbox on a transaction                  | Marked as reconciled (green) | ☐      |
| TC-11.3 | Progress bar updates                             | Shows reconciliation %       | ☐      |
| TC-11.4 | Unreconciled deposits/payments shown             | Amounts correct              | ☐      |
| TC-11.5 | Book Balance ≠ Bank Balance until all reconciled | Difference shown             | ☐      |
| TC-11.6 | Filter "Unreconciled only"                       | Only pending items show      | ☐      |

---

## TC-12: Inventory / Stock Items

| Test    | Steps                                                 | Expected Result     | Status |
| ------- | ----------------------------------------------------- | ------------------- | ------ |
| TC-12.1 | Inventory → View stock items                          | Sample items appear | ☐      |
| TC-12.2 | Add new item: "Test Item", Qty=100, Rate=50, HSN=1234 | Item created        | ☐      |
| TC-12.3 | Edit stock item                                       | Changes saved       | ☐      |
| TC-12.4 | Delete stock item                                     | Item removed        | ☐      |
| TC-12.5 | Opening Value = Qty × Rate                            | Calculation correct | ☐      |
| TC-12.6 | Low Stock Alert shows items below reorder level       | Warning displayed   | ☐      |

---

## TC-13: Stock Summary Report

| Test    | Steps                              | Expected Result                   | Status |
| ------- | ---------------------------------- | --------------------------------- | ------ |
| TC-13.1 | Stock Report → View "Summary" mode | All items listed                  | ☐      |
| TC-13.2 | View "Detailed" mode               | Shows inward/outward transactions | ☐      |
| TC-13.3 | View "By Group" mode               | Items grouped by category         | ☐      |
| TC-13.4 | Filter by group                    | Only that group's items           | ☐      |
| TC-13.5 | Total Stock Value calculated       | Sum of all item values            | ☐      |

---

## TC-14: Payroll

| Test    | Steps                                         | Expected Result             | Status |
| ------- | --------------------------------------------- | --------------------------- | ------ |
| TC-14.1 | Payroll → View "Employees" tab                | Sample employees appear     | ☐      |
| TC-14.2 | Add Employee: Name, Basic=30000, HRA=40%      | Employee created            | ☐      |
| TC-14.3 | Switch to "Salary Register" tab               | Monthly calculations appear | ☐      |
| TC-14.4 | Verify: Gross = Basic + HRA + DA + Allowances | Calculation correct         | ☐      |
| TC-14.5 | Verify: PF = 12% of (Basic + DA)              | Calculation correct         | ☐      |
| TC-14.6 | Verify: ESI = 0.75% if Gross ≤ ₹21,000        | Applied correctly           | ☐      |
| TC-14.7 | Verify: PT based on salary slab               | ₹200 if Gross > ₹15,000     | ☐      |
| TC-14.8 | Net Salary = Gross - Total Deductions         | Correct                     | ☐      |
| TC-14.9 | Change month/year                             | Recalculates for period     | ☐      |

---

## TC-15: PDF Export

| Test    | Steps                                 | Expected Result     | Status |
| ------- | ------------------------------------- | ------------------- | ------ |
| TC-15.1 | Reports → Trial Balance → PDF         | Downloads .pdf file | ☐      |
| TC-15.2 | Reports → P&L → PDF                   | Downloads .pdf file | ☐      |
| TC-15.3 | Reports → Balance Sheet → PDF         | Downloads .pdf file | ☐      |
| TC-15.4 | Vouchers → Select one → Print         | PDF generated       | ☐      |
| TC-15.5 | Open PDF - verify data matches screen | Content correct     | ☐      |

---

## TC-16: Excel Export

| Test    | Steps                             | Expected Result      | Status |
| ------- | --------------------------------- | -------------------- | ------ |
| TC-16.1 | Reports → Trial Balance → Excel   | Downloads .xlsx file | ☐      |
| TC-16.2 | Open Excel - data in columns      | Formatted properly   | ☐      |
| TC-16.3 | Verify Dr/Cr columns have numbers | Not text             | ☐      |

---

## TC-17: Print Functionality

| Test    | Steps                                     | Expected Result     | Status |
| ------- | ----------------------------------------- | ------------------- | ------ |
| TC-17.1 | Reports → Print button                    | Print dialog opens  | ☐      |
| TC-17.2 | Verify sidebar is HIDDEN in print preview | Only report shows   | ☐      |
| TC-17.3 | Verify header is HIDDEN                   | Clean print         | ☐      |
| TC-17.4 | Verify buttons are HIDDEN                 | No actions in print | ☐      |

---

## TC-18: Document Upload/Download

| Test    | Steps                           | Expected Result       | Status |
| ------- | ------------------------------- | --------------------- | ------ |
| TC-18.1 | Documents → Drag & drop a PDF   | File uploaded         | ☐      |
| TC-18.2 | Select folder "GST Returns"     | Categorized correctly | ☐      |
| TC-18.3 | Click Download icon on file     | File downloads        | ☐      |
| TC-18.4 | Refresh page → File still there | Persists in IndexedDB | ☐      |
| TC-18.5 | Click Delete → Confirm          | File removed          | ☐      |

---

## TC-19: Keyboard Shortcuts

| Test    | Steps             | Expected Result          | Status |
| ------- | ----------------- | ------------------------ | ------ |
| TC-19.1 | Press F5 anywhere | Goes to Payment voucher  | ☐      |
| TC-19.2 | Press F6          | Goes to Receipt voucher  | ☐      |
| TC-19.3 | Press F8          | Goes to Sales voucher    | ☐      |
| TC-19.4 | Press F9          | Goes to Purchase voucher | ☐      |
| TC-19.5 | Press Escape      | Closes modal/form        | ☐      |

---

## TC-20: Sample Data

| Test    | Steps                           | Expected Result         | Status |
| ------- | ------------------------------- | ----------------------- | ------ |
| TC-20.1 | Dashboard → Load Sample Data    | Success message appears | ☐      |
| TC-20.2 | Select "ABC Industries Pvt Ltd" | Client selected         | ☐      |
| TC-20.3 | Verify 23 ledgers exist         | Count matches           | ☐      |
| TC-20.4 | Verify 10 vouchers exist        | Count matches           | ☐      |
| TC-20.5 | Dashboard → Clear Sample Data   | Data removed            | ☐      |

---

## Expected Calculations (Sample Data)

### Trial Balance Totals

| Item             | Debit           | Credit          |
| ---------------- | --------------- | --------------- |
| HDFC Bank        | ₹7,97,000       | -               |
| Cash in Hand     | ₹38,000         | -               |
| Sales            | -               | ₹5,00,000       |
| Purchase         | ₹1,75,000       | -               |
| GST Output       | -               | ₹90,000         |
| GST Input        | ₹31,500         | -               |
| Sundry Creditors | -               | ₹88,500         |
| Fixed Assets     | ₹17,00,000      | -               |
| Capital          | -               | ₹20,00,000      |
| **TOTAL**        | **~₹27,41,500** | **~₹27,41,500** |

### Net Profit (Approx)

- Revenue: ₹5,00,000
- Purchases: ₹1,75,000
- Expenses: ₹1,87,000 (Salary + Rent + Electricity + Telephone)
- **Net Profit: ~₹1,38,000**

---

## Test Completion Summary

- [ ] TC-01: Client Management (5 tests)
- [ ] TC-02: Ledger Management (5 tests)
- [ ] TC-03: Voucher Entry (9 tests)
- [ ] TC-04: Day Book (4 tests)
- [ ] TC-05: Ledger Statement (5 tests)
- [ ] TC-06: Trial Balance (5 tests)
- [ ] TC-07: Profit & Loss (5 tests)
- [ ] TC-08: Balance Sheet (5 tests)
- [ ] TC-09: GSTR-1 (5 tests)
- [ ] TC-10: GSTR-3B (6 tests)
- [ ] TC-11: Bank Reconciliation (6 tests)
- [ ] TC-12: Stock Items (6 tests)
- [ ] TC-13: Stock Summary (5 tests)
- [ ] TC-14: Payroll (9 tests)
- [ ] TC-15: PDF Export (5 tests)
- [ ] TC-16: Excel Export (3 tests)
- [ ] TC-17: Print (4 tests)
- [ ] TC-18: Documents (5 tests)
- [ ] TC-19: Keyboard Shortcuts (5 tests)
- [ ] TC-20: Sample Data (5 tests)

**Total: 102 Test Cases**
