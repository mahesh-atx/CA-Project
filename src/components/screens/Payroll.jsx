// Payroll Screen
import React, { useState, useMemo, useEffect } from 'react';
import { Users, Plus, Edit2, Trash2, X, Download, Calendar, DollarSign } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card, Badge, Button, Input, ShortcutBar } from '../ui';
import { getEmployees, saveEmployee, deleteEmployee, generatePayrollSummary, SALARY_COMPONENTS } from '../../services/payroll';
import { formatCurrency } from '../../utils/formatters';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const Payroll = () => {
  const { selectedClient, selectedFinancialYear } = useApp();

  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [workingDays, setWorkingDays] = useState(26);
  const [viewMode, setViewMode] = useState('employees'); // employees, payroll

  const [formData, setFormData] = useState({
    name: '',
    employeeId: '',
    designation: '',
    department: '',
    joiningDate: '',
    pan: '',
    uan: '',
    bankAccount: '',
    basicSalary: 0,
    hraPercent: 40,
    daPercent: 10,
    conveyance: 1600,
    medical: 1250,
    special: 0,
    tds: 0,
    loanDeduction: 0
  });

  // Load employees
  useEffect(() => {
    if (selectedClient) {
      setEmployees(getEmployees(selectedClient.id));
    }
  }, [selectedClient]);

  // Generate payroll
  const payrollSummary = useMemo(() => {
    if (!selectedClient || employees.length === 0) return null;
    return generatePayrollSummary(selectedClient.id, selectedMonth, selectedYear, workingDays);
  }, [selectedClient, employees, selectedMonth, selectedYear, workingDays]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.basicSalary) return;

    const empData = {
      ...formData,
      basicSalary: parseFloat(formData.basicSalary) || 0,
      hraPercent: parseFloat(formData.hraPercent) || 40,
      daPercent: parseFloat(formData.daPercent) || 10,
      conveyance: parseFloat(formData.conveyance) || 0,
      medical: parseFloat(formData.medical) || 0,
      special: parseFloat(formData.special) || 0,
      tds: parseFloat(formData.tds) || 0,
      loanDeduction: parseFloat(formData.loanDeduction) || 0
    };

    if (editingEmployee) {
      saveEmployee(selectedClient.id, { ...editingEmployee, ...empData });
    } else {
      saveEmployee(selectedClient.id, empData);
    }

    setEmployees(getEmployees(selectedClient.id));
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '', employeeId: '', designation: '', department: '', joiningDate: '',
      pan: '', uan: '', bankAccount: '', basicSalary: 0, hraPercent: 40, daPercent: 10,
      conveyance: 1600, medical: 1250, special: 0, tds: 0, loanDeduction: 0
    });
    setEditingEmployee(null);
    setShowForm(false);
  };

  const handleEdit = (emp) => {
    setFormData({ ...emp });
    setEditingEmployee(emp);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this employee?')) {
      deleteEmployee(selectedClient.id, id);
      setEmployees(getEmployees(selectedClient.id));
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center">
            <DollarSign className="w-5 h-5 mr-2 text-emerald-500" />
            Payroll Management
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {selectedClient?.name || 'Select a client'} • {employees.length} employees
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="secondary" icon={Download}>Export</Button>
          <Button icon={Plus} onClick={() => setShowForm(true)} disabled={!selectedClient}>
            Add Employee
          </Button>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-1 p-1 bg-slate-100 rounded-md">
          {['employees', 'payroll'].map(mode => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-sm transition-all ${
                viewMode === mode ? 'bg-black text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {mode === 'employees' ? 'Employees' : 'Salary Register'}
            </button>
          ))}
        </div>
        {viewMode === 'payroll' && (
          <div className="flex items-center space-x-3">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="px-3 py-2 border border-slate-200 rounded-sm text-sm"
            >
              {MONTHS.map((m, i) => <option key={i} value={i}>{m}</option>)}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="px-3 py-2 border border-slate-200 rounded-sm text-sm"
            >
              <option value={2024}>2024</option>
              <option value={2025}>2025</option>
            </select>
            <Input
              type="number"
              value={workingDays}
              onChange={(e) => setWorkingDays(parseInt(e.target.value) || 26)}
              className="w-20"
              placeholder="Days"
            />
          </div>
        )}
      </div>

      {/* Employee Form */}
      {showForm && (
        <Card className="p-6 border-t-4 border-t-emerald-500">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-900 uppercase tracking-wider text-xs">
              {editingEmployee ? 'Edit Employee' : 'Add Employee'}
            </h3>
            <button onClick={resetForm} className="text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <Input label="Employee Name *" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
              <Input label="Employee ID" value={formData.employeeId} onChange={(e) => setFormData({...formData, employeeId: e.target.value})} />
              <Input label="Designation" value={formData.designation} onChange={(e) => setFormData({...formData, designation: e.target.value})} />
              <Input label="Department" value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <Input label="PAN" value={formData.pan} onChange={(e) => setFormData({...formData, pan: e.target.value})} />
              <Input label="UAN" value={formData.uan} onChange={(e) => setFormData({...formData, uan: e.target.value})} />
              <Input label="Bank A/c" value={formData.bankAccount} onChange={(e) => setFormData({...formData, bankAccount: e.target.value})} />
              <Input label="Joining Date" type="date" value={formData.joiningDate} onChange={(e) => setFormData({...formData, joiningDate: e.target.value})} />
            </div>

            <div className="border-t border-slate-200 pt-4 mt-4">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Salary Structure</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Input label="Basic Salary *" type="number" value={formData.basicSalary} onChange={(e) => setFormData({...formData, basicSalary: e.target.value})} required />
                <Input label="HRA %" type="number" value={formData.hraPercent} onChange={(e) => setFormData({...formData, hraPercent: e.target.value})} />
                <Input label="DA %" type="number" value={formData.daPercent} onChange={(e) => setFormData({...formData, daPercent: e.target.value})} />
                <Input label="Conveyance" type="number" value={formData.conveyance} onChange={(e) => setFormData({...formData, conveyance: e.target.value})} />
                <Input label="Medical" type="number" value={formData.medical} onChange={(e) => setFormData({...formData, medical: e.target.value})} />
                <Input label="Special Allowance" type="number" value={formData.special} onChange={(e) => setFormData({...formData, special: e.target.value})} />
                <Input label="TDS" type="number" value={formData.tds} onChange={(e) => setFormData({...formData, tds: e.target.value})} />
                <Input label="Loan Deduction" type="number" value={formData.loanDeduction} onChange={(e) => setFormData({...formData, loanDeduction: e.target.value})} />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 mt-4 border-t border-slate-100">
              <Button type="button" variant="secondary" onClick={resetForm}>Cancel</Button>
              <Button type="submit">{editingEmployee ? 'Update' : 'Add'} Employee</Button>
            </div>
          </form>
        </Card>
      )}

      {/* Employees View */}
      {viewMode === 'employees' && (
        <Card className="overflow-hidden">
          {employees.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No employees added yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left">Employee</th>
                    <th className="px-4 py-3 text-left">ID</th>
                    <th className="px-4 py-3 text-left">Designation</th>
                    <th className="px-4 py-3 text-right">Basic</th>
                    <th className="px-4 py-3 text-right">Gross</th>
                    <th className="px-4 py-3 w-20"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {employees.map((emp) => {
                    const gross = (emp.basicSalary || 0) * (1 + (emp.hraPercent || 40)/100 + (emp.daPercent || 10)/100) + (emp.conveyance || 0) + (emp.medical || 0) + (emp.special || 0);
                    return (
                      <tr key={emp.id} className="hover:bg-slate-50 group">
                        <td className="px-4 py-3">
                          <p className="font-semibold text-slate-800">{emp.name}</p>
                          <p className="text-[10px] text-slate-400">{emp.department}</p>
                        </td>
                        <td className="px-4 py-3 font-mono text-xs">{emp.employeeId || '-'}</td>
                        <td className="px-4 py-3 text-slate-600">{emp.designation || '-'}</td>
                        <td className="px-4 py-3 text-right font-mono">{formatCurrency(emp.basicSalary || 0)}</td>
                        <td className="px-4 py-3 text-right font-mono font-bold text-emerald-600">{formatCurrency(gross)}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end space-x-1 opacity-0 group-hover:opacity-100">
                            <button onClick={() => handleEdit(emp)} className="p-1 text-slate-400 hover:text-blue-600">
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDelete(emp.id)} className="p-1 text-slate-400 hover:text-red-600">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      {/* Payroll View */}
      {viewMode === 'payroll' && payrollSummary && (
        <>
          {/* Totals */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4 border-l-4 border-l-blue-500">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Gross Earnings</p>
              <p className="text-xl font-bold font-mono text-slate-900">{formatCurrency(payrollSummary.totals.grossEarnings)}</p>
            </Card>
            <Card className="p-4 border-l-4 border-l-red-500">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Total Deductions</p>
              <p className="text-xl font-bold font-mono text-red-600">{formatCurrency(payrollSummary.totals.totalDeductions)}</p>
            </Card>
            <Card className="p-4 border-l-4 border-l-emerald-500 bg-emerald-50">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Net Payable</p>
              <p className="text-xl font-bold font-mono text-emerald-700">{formatCurrency(payrollSummary.totals.netSalary)}</p>
            </Card>
            <Card className="p-4 border-l-4 border-l-violet-500">
              <p className="text-[10px] font-bold text-slate-400 uppercase">PF + ESI (Employer)</p>
              <p className="text-xl font-bold font-mono text-violet-600">{formatCurrency(payrollSummary.totals.totalPF + payrollSummary.totals.totalESI)}</p>
            </Card>
          </div>

          {/* Salary Register */}
          <Card className="overflow-hidden">
            <div className="p-4 bg-emerald-800 text-white">
              <h3 className="font-bold">Salary Register - {MONTHS[selectedMonth]} {selectedYear}</h3>
              <p className="text-xs text-emerald-200">{payrollSummary.employeeCount} employees • {workingDays} working days</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 border-b">
                  <tr>
                    <th className="px-3 py-2 text-left">Employee</th>
                    <th className="px-3 py-2 text-right">Basic</th>
                    <th className="px-3 py-2 text-right">HRA</th>
                    <th className="px-3 py-2 text-right">DA</th>
                    <th className="px-3 py-2 text-right">Gross</th>
                    <th className="px-3 py-2 text-right">PF</th>
                    <th className="px-3 py-2 text-right">ESI</th>
                    <th className="px-3 py-2 text-right">PT</th>
                    <th className="px-3 py-2 text-right">TDS</th>
                    <th className="px-3 py-2 text-right">Deductions</th>
                    <th className="px-3 py-2 text-right font-bold">Net Pay</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {payrollSummary.payroll.map((p) => (
                    <tr key={p.employeeId} className="hover:bg-slate-50">
                      <td className="px-3 py-2 font-sans font-medium text-slate-800">{p.employeeName}</td>
                      <td className="px-3 py-2 text-right">{formatCurrency(p.earnings.basic)}</td>
                      <td className="px-3 py-2 text-right">{formatCurrency(p.earnings.hra)}</td>
                      <td className="px-3 py-2 text-right">{formatCurrency(p.earnings.da)}</td>
                      <td className="px-3 py-2 text-right text-blue-600">{formatCurrency(p.earnings.total)}</td>
                      <td className="px-3 py-2 text-right text-red-500">{formatCurrency(p.deductions.pf)}</td>
                      <td className="px-3 py-2 text-right text-red-500">{formatCurrency(p.deductions.esi)}</td>
                      <td className="px-3 py-2 text-right text-red-500">{formatCurrency(p.deductions.pt)}</td>
                      <td className="px-3 py-2 text-right text-red-500">{formatCurrency(p.deductions.tds)}</td>
                      <td className="px-3 py-2 text-right text-red-600 font-bold">{formatCurrency(p.deductions.total)}</td>
                      <td className="px-3 py-2 text-right text-emerald-600 font-bold">{formatCurrency(p.netSalary)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-100 border-t-2 border-slate-300 font-bold">
                  <tr>
                    <td className="px-3 py-2 text-right uppercase text-[10px]">Total</td>
                    <td colSpan="3"></td>
                    <td className="px-3 py-2 text-right font-mono text-blue-600">{formatCurrency(payrollSummary.totals.grossEarnings)}</td>
                    <td colSpan="4"></td>
                    <td className="px-3 py-2 text-right font-mono text-red-600">{formatCurrency(payrollSummary.totals.totalDeductions)}</td>
                    <td className="px-3 py-2 text-right font-mono text-emerald-600">{formatCurrency(payrollSummary.totals.netSalary)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </Card>
        </>
      )}

      <ShortcutBar context="default" />
    </div>
  );
};

export default Payroll;
