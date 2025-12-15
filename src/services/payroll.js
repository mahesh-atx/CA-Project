// Payroll Service
import { STORAGE_KEYS } from '../constants';

/**
 * Payroll Components
 */
export const SALARY_COMPONENTS = {
  earnings: [
    { id: 'basic', name: 'Basic Salary', isDefault: true },
    { id: 'hra', name: 'House Rent Allowance', isDefault: true },
    { id: 'da', name: 'Dearness Allowance', isDefault: true },
    { id: 'conveyance', name: 'Conveyance Allowance', isDefault: false },
    { id: 'medical', name: 'Medical Allowance', isDefault: false },
    { id: 'special', name: 'Special Allowance', isDefault: false },
    { id: 'bonus', name: 'Bonus', isDefault: false },
    { id: 'overtime', name: 'Overtime', isDefault: false }
  ],
  deductions: [
    { id: 'pf', name: 'Provident Fund', isDefault: true, rate: 12 },
    { id: 'esi', name: 'ESI', isDefault: true, rate: 0.75 },
    { id: 'pt', name: 'Professional Tax', isDefault: true },
    { id: 'tds', name: 'TDS', isDefault: true },
    { id: 'loan', name: 'Loan Recovery', isDefault: false },
    { id: 'advance', name: 'Salary Advance', isDefault: false }
  ]
};

/**
 * Get employees
 */
export const getEmployees = (clientId) => {
  const key = `employees_${clientId}`;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

export const saveEmployee = (clientId, employee) => {
  const employees = getEmployees(clientId);
  const id = employee.id || `emp_${Date.now()}`;
  const existing = employees.findIndex(e => e.id === id);

  if (existing >= 0) {
    employees[existing] = { ...employees[existing], ...employee };
  } else {
    employees.push({ ...employee, id, createdAt: new Date().toISOString() });
  }

  localStorage.setItem(`employees_${clientId}`, JSON.stringify(employees));
  return employees;
};

export const deleteEmployee = (clientId, employeeId) => {
  const employees = getEmployees(clientId).filter(e => e.id !== employeeId);
  localStorage.setItem(`employees_${clientId}`, JSON.stringify(employees));
  return employees;
};

/**
 * Get salary slips
 */
export const getSalarySlips = (clientId, period = {}) => {
  const key = `salary_slips_${clientId}`;
  const data = localStorage.getItem(key);
  let slips = data ? JSON.parse(data) : [];

  if (period.month && period.year) {
    slips = slips.filter(s => s.month === period.month && s.year === period.year);
  }

  return slips;
};

export const saveSalarySlip = (clientId, slip) => {
  const slips = getSalarySlips(clientId);
  const id = slip.id || `slip_${Date.now()}`;
  const existing = slips.findIndex(s => s.id === id);

  if (existing >= 0) {
    slips[existing] = { ...slips[existing], ...slip };
  } else {
    slips.push({ ...slip, id, createdAt: new Date().toISOString() });
  }

  localStorage.setItem(`salary_slips_${clientId}`, JSON.stringify(slips));
  return slips;
};

/**
 * Calculate salary
 */
export const calculateSalary = (employee, month, year, workingDays, presentDays) => {
  const basicSalary = employee.basicSalary || 0;
  const hraPercent = employee.hraPercent || 40;
  const daPercent = employee.daPercent || 10;

  // Calculate earnings
  const basic = (basicSalary * presentDays) / workingDays;
  const hra = (basic * hraPercent) / 100;
  const da = (basic * daPercent) / 100;
  const conveyance = employee.conveyance || 0;
  const medical = employee.medical || 0;
  const special = employee.special || 0;

  const grossEarnings = basic + hra + da + conveyance + medical + special;

  // Calculate deductions
  const pfBase = basic + da;
  const pf = (pfBase * 12) / 100;
  const esi = grossEarnings <= 21000 ? (grossEarnings * 0.75) / 100 : 0;
  const pt = grossEarnings > 15000 ? 200 : grossEarnings > 10000 ? 150 : 0;
  const tds = employee.tds || 0;
  const loan = employee.loanDeduction || 0;
  const advance = employee.advance || 0;

  const totalDeductions = pf + esi + pt + tds + loan + advance;
  const netSalary = grossEarnings - totalDeductions;

  return {
    employeeId: employee.id,
    employeeName: employee.name,
    month,
    year,
    workingDays,
    presentDays,
    earnings: {
      basic: Math.round(basic),
      hra: Math.round(hra),
      da: Math.round(da),
      conveyance,
      medical,
      special,
      total: Math.round(grossEarnings)
    },
    deductions: {
      pf: Math.round(pf),
      esi: Math.round(esi),
      pt,
      tds,
      loan,
      advance,
      total: Math.round(totalDeductions)
    },
    netSalary: Math.round(netSalary),
    employerPF: Math.round(pf), // Employer contribution
    employerESI: grossEarnings <= 21000 ? Math.round((grossEarnings * 3.25) / 100) : 0
  };
};

/**
 * Generate payroll summary for a month
 */
export const generatePayrollSummary = (clientId, month, year, workingDays) => {
  const employees = getEmployees(clientId);
  
  const payroll = employees.map(emp => {
    const presentDays = emp.presentDays || workingDays;
    return calculateSalary(emp, month, year, workingDays, presentDays);
  });

  const totals = payroll.reduce((acc, p) => ({
    grossEarnings: acc.grossEarnings + p.earnings.total,
    totalDeductions: acc.totalDeductions + p.deductions.total,
    netSalary: acc.netSalary + p.netSalary,
    totalPF: acc.totalPF + p.deductions.pf + p.employerPF,
    totalESI: acc.totalESI + p.deductions.esi + p.employerESI
  }), { grossEarnings: 0, totalDeductions: 0, netSalary: 0, totalPF: 0, totalESI: 0 });

  return {
    month,
    year,
    workingDays,
    employeeCount: employees.length,
    payroll,
    totals
  };
};
