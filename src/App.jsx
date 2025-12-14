import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  BookOpen, 
  FileText, 
  PieChart, 
  Calculator, 
  Settings, 
  LogOut, 
  Bell, 
  Search, 
  Plus, 
  Filter, 
  Download, 
  ChevronDown, 
  Briefcase,
  FileSpreadsheet,
  UploadCloud,
  Lock,
  Menu,
  X
} from 'lucide-react';

// --- Mock Data & Constants ---

const FINANCIAL_YEARS = ["2024-2025", "2023-2024", "2022-2023"];
const VOUCHER_TYPES = ["Sales", "Purchase", "Payment", "Receipt", "Journal", "Contra"];

const MOCK_CLIENTS = [
  { id: 1, name: "Apex Polylabs Ltd", gstin: "27AABCU9603R1ZN", group: "Manufacturing", status: "Active" },
  { id: 2, name: "Greenfield Estates", gstin: "27AABCG1234R1Z5", group: "Real Estate", status: "Active" },
  { id: 3, name: "Dr. Sharma Clinic", gstin: "Unregistered", group: "Service", status: "Pending" },
  { id: 4, name: "TechNova Solutions", gstin: "27AABCT9876R1Z1", group: "IT Services", status: "Active" },
];

const MOCK_LEDGERS = [
  { id: 1, name: "HDFC Bank (Main)", group: "Bank Accounts", balance: 450200.00, type: "Dr" },
  { id: 2, name: "Cash in Hand", group: "Cash-in-hand", balance: 12500.00, type: "Dr" },
  { id: 3, name: "Sales Account", group: "Sales Accounts", balance: 1250000.00, type: "Cr" },
  { id: 4, name: "Apex Polylabs (Debtor)", group: "Sundry Debtors", balance: 56000.00, type: "Dr" },
  { id: 5, name: "GST Output IGST", group: "Duties & Taxes", balance: 14500.00, type: "Cr" },
];

const MOCK_GSTR1_SUMMARY = [
  { title: "B2B Invoices", count: 145, value: 4500000, tax: 810000 },
  { title: "B2C Large", count: 12, value: 250000, tax: 45000 },
  { title: "B2C Small", count: 850, value: 120000, tax: 21600 },
  { title: "Credit Notes", count: 5, value: -50000, tax: -9000 },
];

// --- Components ---

const Card = ({ children, className = "" }) => (
  <div className={`bg-white border border-slate-200 rounded-lg shadow-sm ${className}`}>
    {children}
  </div>
);

const Badge = ({ children, type = "neutral" }) => {
  const styles = {
    neutral: "bg-slate-100 text-slate-600",
    success: "bg-emerald-100 text-emerald-700",
    warning: "bg-amber-100 text-amber-700",
    danger: "bg-red-100 text-red-700",
    brand: "bg-blue-100 text-blue-700",
  };
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${styles[type]}`}>
      {children}
    </span>
  );
};

const Button = ({ children, variant = "primary", icon: Icon, className = "", ...props }) => {
  const baseStyle = "inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1";
  const variants = {
    primary: "bg-slate-900 text-white hover:bg-slate-800 focus:ring-slate-900",
    secondary: "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 focus:ring-slate-300",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-600",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100",
  };
  
  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {Icon && <Icon className="w-4 h-4 mr-2" />}
      {children}
    </button>
  );
};

const Input = ({ label, className = "", ...props }) => (
  <div className={`flex flex-col ${className}`}>
    {label && <label className="mb-1 text-xs font-semibold text-slate-600 uppercase">{label}</label>}
    <input 
      className="px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-slate-100 disabled:text-slate-500"
      {...props}
    />
  </div>
);

const Select = ({ label, options, className = "", ...props }) => (
  <div className={`flex flex-col ${className}`}>
    {label && <label className="mb-1 text-xs font-semibold text-slate-600 uppercase">{label}</label>}
    <select 
      className="px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
      {...props}
    >
      {options.map((opt, idx) => (
        <option key={idx} value={opt.value || opt}>{opt.label || opt}</option>
      ))}
    </select>
  </div>
);

// --- Screen Components ---

const LoginScreen = ({ onLogin }) => (
  <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
    <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border-t-4 border-slate-900">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-slate-900 rounded-lg mx-auto flex items-center justify-center mb-4">
          <Calculator className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">CA Pro Connect</h1>
        <p className="text-slate-500 text-sm mt-1">Authorized Access Only</p>
      </div>
      
      <form onSubmit={(e) => { e.preventDefault(); onLogin(); }} className="space-y-4">
        <Input label="Email ID" type="email" placeholder="ca.admin@firm.com" defaultValue="admin@ca-office.com" />
        <Input label="Password" type="password" placeholder="••••••••" defaultValue="password" />
        
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center text-slate-600">
            <input type="checkbox" className="mr-2 rounded text-blue-600 focus:ring-blue-500" />
            Remember me
          </label>
          <a href="#" className="text-blue-700 hover:underline">Forgot password?</a>
        </div>

        <Button type="submit" className="w-full justify-center">Secure Login</Button>
      </form>
      
      <div className="mt-6 text-center text-xs text-slate-400">
        &copy; 2024 FinTech Solutions. v2.4.0
      </div>
    </div>
  </div>
);

const Dashboard = () => (
  <div className="space-y-6 animate-fade-in">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[
        { label: "Active Clients", value: "42", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
        { label: "Pending Returns", value: "8", icon: FileText, color: "text-amber-600", bg: "bg-amber-50" },
        { label: "Ledgers Created", value: "1,204", icon: BookOpen, color: "text-emerald-600", bg: "bg-emerald-50" },
        { label: "System Alerts", value: "2", icon: Bell, color: "text-red-600", bg: "bg-red-50" },
      ].map((stat, i) => (
        <Card key={i} className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
          </div>
          <div className={`p-3 rounded-full ${stat.bg}`}>
            <stat.icon className={`w-6 h-6 ${stat.color}`} />
          </div>
        </Card>
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-slate-800">Income vs Expense (YTD)</h3>
          <select className="text-xs border-slate-300 rounded-md p-1 bg-slate-50">
            <option>Last 6 Months</option>
            <option>This Year</option>
          </select>
        </div>
        {/* Simple CSS Chart Visualization */}
        <div className="flex items-end justify-between h-64 space-x-4">
          {[65, 40, 75, 55, 80, 45].map((h, i) => (
            <div key={i} className="flex-1 flex flex-col justify-end group">
              <div className="w-full flex space-x-1 items-end h-full">
                <div style={{ height: `${h}%` }} className="flex-1 bg-slate-800 rounded-t-sm relative group-hover:bg-slate-700 transition-all">
                   <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">₹{h}L</div>
                </div>
                <div style={{ height: `${h * 0.6}%` }} className="flex-1 bg-slate-300 rounded-t-sm relative"></div>
              </div>
              <p className="text-xs text-center text-slate-500 mt-2">{['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'][i]}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-center space-x-6 mt-4">
          <div className="flex items-center text-xs text-slate-600"><div className="w-3 h-3 bg-slate-800 mr-2"></div>Income</div>
          <div className="flex items-center text-xs text-slate-600"><div className="w-3 h-3 bg-slate-300 mr-2"></div>Expense</div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-bold text-slate-800 mb-4">Upcoming Deadlines</h3>
        <div className="space-y-4">
          {[
            { title: "GSTR-1 Filing", date: "11 Oct", entity: "Apex Polylabs", status: "urgent" },
            { title: "TDS Payment", date: "07 Oct", entity: "Greenfield Est.", status: "normal" },
            { title: "Advance Tax", date: "15 Dec", entity: "TechNova Sol.", status: "normal" },
            { title: "Annual Audit", date: "30 Sep", entity: "Dr. Sharma", status: "late" },
          ].map((item, i) => (
            <div key={i} className="flex items-start pb-4 border-b border-slate-100 last:border-0 last:pb-0">
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-800">{item.title}</p>
                <p className="text-xs text-slate-500">{item.entity}</p>
              </div>
              <div className="text-right">
                <span className={`text-xs font-bold ${
                  item.status === 'urgent' ? 'text-amber-600' : 
                  item.status === 'late' ? 'text-red-600' : 'text-slate-600'
                }`}>
                  {item.date}
                </span>
              </div>
            </div>
          ))}
        </div>
        <Button variant="secondary" className="w-full mt-4 text-xs">View Calendar</Button>
      </Card>
    </div>
  </div>
);

const ClientList = () => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <h2 className="text-xl font-bold text-slate-800">Client Directory</h2>
      <Button icon={Plus}>Add New Client</Button>
    </div>

    <Card className="overflow-hidden">
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
        <div className="relative w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Search clients..." className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500" />
        </div>
        <Button variant="secondary" icon={Filter} className="text-xs">Filter</Button>
      </div>
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-100 text-slate-600 font-semibold uppercase text-xs">
          <tr>
            <th className="px-6 py-3">Client Name</th>
            <th className="px-6 py-3">GSTIN</th>
            <th className="px-6 py-3">Group</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {MOCK_CLIENTS.map((client) => (
            <tr key={client.id} className="hover:bg-slate-50 transition-colors cursor-pointer">
              <td className="px-6 py-4 font-medium text-slate-900">{client.name}</td>
              <td className="px-6 py-4 font-mono text-slate-600">{client.gstin}</td>
              <td className="px-6 py-4 text-slate-600">{client.group}</td>
              <td className="px-6 py-4">
                <Badge type={client.status === 'Active' ? 'success' : 'warning'}>{client.status}</Badge>
              </td>
              <td className="px-6 py-4 text-right">
                <button className="text-blue-600 hover:text-blue-800 font-medium text-xs">Manage</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  </div>
);

const VoucherEntry = () => {
  const [activeType, setActiveType] = useState("Sales");

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">Voucher Entry</h2>
        <div className="text-sm text-slate-500">
          Voucher No: <span className="font-mono font-bold text-slate-900">SAL/24-25/0042</span>
        </div>
      </div>

      <div className="flex space-x-1 border-b border-slate-200 overflow-x-auto pb-1">
        {VOUCHER_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => setActiveType(type)}
            className={`px-4 py-2 text-sm font-medium rounded-t-md transition-colors ${
              activeType === type 
                ? 'bg-slate-800 text-white' 
                : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <Card className="p-6">
        {/* Header Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Input label="Voucher Date" type="date" defaultValue="2024-10-15" />
          <Input label="Reference No" placeholder="PO/Inv No." />
          <div className="md:col-span-2">
             <label className="mb-1 text-xs font-semibold text-slate-600 uppercase block">Party A/c Name</label>
             <div className="relative">
                <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm" placeholder="Select Ledger..." defaultValue="Apex Polylabs Ltd" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-green-600 font-mono">Curr Bal: 45,000 Dr</span>
             </div>
          </div>
        </div>

        {/* Item Table */}
        <div className="border border-slate-200 rounded-md overflow-hidden mb-6">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-slate-700 text-xs uppercase font-semibold">
              <tr>
                <th className="px-4 py-2 text-left w-12">No.</th>
                <th className="px-4 py-2 text-left">Particulars</th>
                <th className="px-4 py-2 text-right w-32">Rate %</th>
                <th className="px-4 py-2 text-right w-40">Amount</th>
                <th className="px-4 py-2 text-center w-16">Dr/Cr</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="px-4 py-2 text-slate-500">1</td>
                <td className="px-4 py-2">
                  <input type="text" className="w-full border-none focus:ring-0 p-0 text-sm font-medium" defaultValue="Consultancy Charges" />
                </td>
                <td className="px-4 py-2 text-right text-slate-500">18%</td>
                <td className="px-4 py-2 text-right font-mono">25,000.00</td>
                <td className="px-4 py-2 text-center text-xs font-bold text-slate-600">Cr</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-slate-500">2</td>
                <td className="px-4 py-2">
                  <input type="text" className="w-full border-none focus:ring-0 p-0 text-sm font-medium" defaultValue="Output CGST 9%" />
                </td>
                <td className="px-4 py-2 text-right text-slate-500">-</td>
                <td className="px-4 py-2 text-right font-mono">2,250.00</td>
                <td className="px-4 py-2 text-center text-xs font-bold text-slate-600">Cr</td>
              </tr>
               <tr>
                <td className="px-4 py-2 text-slate-500">3</td>
                <td className="px-4 py-2">
                  <input type="text" className="w-full border-none focus:ring-0 p-0 text-sm font-medium" defaultValue="Output SGST 9%" />
                </td>
                <td className="px-4 py-2 text-right text-slate-500">-</td>
                <td className="px-4 py-2 text-right font-mono">2,250.00</td>
                <td className="px-4 py-2 text-center text-xs font-bold text-slate-600">Cr</td>
              </tr>
               {/* Empty Row for entry */}
               <tr className="bg-slate-50">
                <td className="px-4 py-2 text-slate-500">4</td>
                <td className="px-4 py-2">
                  <input type="text" className="w-full bg-transparent border-none focus:ring-0 p-0 text-sm italic text-slate-400" placeholder="Type to search ledger..." />
                </td>
                <td className="px-4 py-2 text-right"></td>
                <td className="px-4 py-2 text-right"></td>
                <td className="px-4 py-2 text-center"></td>
              </tr>
            </tbody>
            <tfoot className="bg-slate-50 border-t border-slate-200 font-bold">
              <tr>
                <td colSpan="3" className="px-4 py-3 text-right uppercase text-xs text-slate-600">Total</td>
                <td className="px-4 py-3 text-right font-mono text-slate-900">29,500.00</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-600 uppercase">Narration</label>
            <textarea className="w-full border border-slate-300 rounded-md p-2 text-sm h-20" placeholder="Being invoice raised for..." defaultValue="Being professional fees charged for Q2 audit." />
          </div>
          <div className="flex items-end justify-end space-x-3">
             <Button variant="ghost">Cancel</Button>
             <Button variant="secondary">Save & Print</Button>
             <Button>Save Voucher</Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

const ReportScreen = () => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <h2 className="text-xl font-bold text-slate-800">Profit & Loss A/c</h2>
      <div className="flex space-x-2">
         <Button variant="secondary" icon={Download} className="text-xs">Export PDF</Button>
         <Button variant="secondary" icon={FileSpreadsheet} className="text-xs">Export Excel</Button>
      </div>
    </div>

    <Card className="p-6">
      <div className="flex justify-between items-end border-b border-slate-900 pb-4 mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 uppercase tracking-widest">TechNova Solutions</h3>
          <p className="text-sm text-slate-600">For the year ending 31st March 2025</p>
        </div>
        <div className="text-right">
           <p className="text-xs text-slate-500">Figures in INR</p>
        </div>
      </div>

      {/* Classic T-Format / Vertical Format Simulation */}
      <table className="w-full text-sm">
        <thead className="bg-slate-100 text-slate-700 font-semibold uppercase text-xs border-y border-slate-300">
          <tr>
            <th className="px-4 py-2 text-left">Particulars</th>
            <th className="px-4 py-2 text-right w-40">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          <tr className="bg-slate-50">
            <td className="px-4 py-2 font-bold text-slate-800">Gross Revenue</td>
            <td className="px-4 py-2 text-right font-mono font-bold">45,20,000.00</td>
          </tr>
          <tr>
             <td className="px-8 py-2 text-slate-600">Sales of Services</td>
             <td className="px-4 py-2 text-right font-mono">42,00,000.00</td>
          </tr>
          <tr>
             <td className="px-8 py-2 text-slate-600">Other Income</td>
             <td className="px-4 py-2 text-right font-mono">3,20,000.00</td>
          </tr>
          
          <tr className="bg-slate-50">
            <td className="px-4 py-2 font-bold text-slate-800 mt-4">Direct Expenses</td>
            <td className="px-4 py-2 text-right font-mono font-bold">(12,40,000.00)</td>
          </tr>
          <tr>
             <td className="px-8 py-2 text-slate-600">Consultant Fees</td>
             <td className="px-4 py-2 text-right font-mono">8,00,000.00</td>
          </tr>
          <tr>
             <td className="px-8 py-2 text-slate-600">Software Licenses</td>
             <td className="px-4 py-2 text-right font-mono">4,40,000.00</td>
          </tr>

           <tr className="bg-blue-50">
            <td className="px-4 py-3 font-bold text-slate-900 uppercase text-xs tracking-wider">Gross Profit</td>
            <td className="px-4 py-3 text-right font-mono font-bold text-slate-900 border-t border-slate-400">32,80,000.00</td>
          </tr>

           <tr className="bg-slate-50">
            <td className="px-4 py-2 font-bold text-slate-800">Indirect Expenses</td>
            <td className="px-4 py-2 text-right font-mono font-bold">(8,50,000.00)</td>
          </tr>
           <tr>
             <td className="px-8 py-2 text-slate-600">Rent & Utilities</td>
             <td className="px-4 py-2 text-right font-mono">3,00,000.00</td>
          </tr>
          <tr>
             <td className="px-8 py-2 text-slate-600">Office Expenses</td>
             <td className="px-4 py-2 text-right font-mono">1,50,000.00</td>
          </tr>
           <tr>
             <td className="px-8 py-2 text-slate-600">Salaries</td>
             <td className="px-4 py-2 text-right font-mono">4,00,000.00</td>
          </tr>
        </tbody>
        <tfoot className="border-t-2 border-slate-900 bg-slate-100">
          <tr>
             <td className="px-4 py-4 font-bold text-lg text-slate-900 uppercase">Net Profit</td>
             <td className="px-4 py-4 text-right font-mono font-bold text-lg text-slate-900">24,30,000.00</td>
          </tr>
        </tfoot>
      </table>
    </Card>
  </div>
);

const GSTDashboard = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h2 className="text-xl font-bold text-slate-800">GST Compliance</h2>
      <Badge type="success">Monthly Filing: Regular</Badge>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
       <Card className="p-4 bg-blue-50 border-blue-100">
          <p className="text-xs font-bold text-blue-700 uppercase">Input Tax Credit (ITC)</p>
          <h3 className="text-2xl font-mono font-bold text-slate-800 mt-2">₹1,24,500</h3>
          <p className="text-xs text-slate-500 mt-1">Available in Electronic Ledger</p>
       </Card>
       <Card className="p-4 bg-red-50 border-red-100">
          <p className="text-xs font-bold text-red-700 uppercase">Output Liability</p>
          <h3 className="text-2xl font-mono font-bold text-slate-800 mt-2">₹3,45,000</h3>
          <p className="text-xs text-slate-500 mt-1">For Oct 2024</p>
       </Card>
       <Card className="p-4 bg-slate-50 border-slate-200 col-span-2">
          <p className="text-xs font-bold text-slate-600 uppercase">Cash Liability (Net)</p>
          <div className="flex items-end justify-between">
             <h3 className="text-2xl font-mono font-bold text-slate-800 mt-2">₹2,20,500</h3>
             <Button size="sm" className="text-xs py-1 px-3 h-8">Generate Challan</Button>
          </div>
       </Card>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <div className="p-4 border-b border-slate-100 flex justify-between items-center">
           <h3 className="font-bold text-slate-800">GSTR-1 Summary</h3>
           <span className="text-xs text-slate-500">Oct 2024</span>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-xs text-slate-500 uppercase">
             <tr>
                <th className="px-4 py-2 text-left">Section</th>
                <th className="px-4 py-2 text-right">Count</th>
                <th className="px-4 py-2 text-right">Taxable Val</th>
                <th className="px-4 py-2 text-right">Tax Liab</th>
             </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {MOCK_GSTR1_SUMMARY.map((row, i) => (
              <tr key={i}>
                <td className="px-4 py-3 font-medium text-slate-700">{row.title}</td>
                <td className="px-4 py-3 text-right">{row.count}</td>
                <td className="px-4 py-3 text-right font-mono">{row.value.toLocaleString()}</td>
                <td className="px-4 py-3 text-right font-mono">{row.tax.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Card>
        <div className="p-4 border-b border-slate-100 flex justify-between items-center">
           <h3 className="font-bold text-slate-800">GSTR-3B Status</h3>
           <Badge type="warning">Due in 5 Days</Badge>
        </div>
        <div className="p-6 space-y-4">
           <div className="flex justify-between items-center text-sm">
              <span className="text-slate-600">3.1 Tax on outward supplies</span>
              <span className="font-mono font-bold">3,45,000</span>
           </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-600">4. Eligible ITC</span>
              <span className="font-mono font-bold text-green-600">(1,24,500)</span>
           </div>
           <div className="border-t border-slate-200 pt-3 flex justify-between items-center">
              <span className="font-bold text-slate-800">Net Tax Payable</span>
              <span className="font-mono font-bold text-lg text-slate-900">2,20,500</span>
           </div>
           <div className="pt-4">
              <Button className="w-full justify-center">Proceed to File</Button>
           </div>
        </div>
      </Card>
    </div>
  </div>
);

const Documents = () => (
   <div className="space-y-4">
    <div className="flex justify-between items-center">
      <h2 className="text-xl font-bold text-slate-800">Client Documents</h2>
      <Button icon={UploadCloud}>Upload Files</Button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
       {['Invoices', 'Bank Statements', 'Deeds & Contracts', 'Tax Notices'].map((folder, i) => (
          <Card key={i} className="p-4 hover:bg-slate-50 cursor-pointer transition-colors border border-slate-200">
             <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded text-blue-600">
                   <Briefcase className="w-6 h-6" />
                </div>
                <div>
                   <h4 className="font-medium text-slate-800">{folder}</h4>
                   <p className="text-xs text-slate-500">12 Files</p>
                </div>
             </div>
          </Card>
       ))}
    </div>

    <Card className="mt-4">
       <div className="p-4 border-b border-slate-200">
          <h3 className="font-bold text-sm uppercase text-slate-600">Recent Uploads</h3>
       </div>
       <table className="w-full text-sm">
          <tbody className="divide-y divide-slate-100">
             {[1,2,3].map((item) => (
                <tr key={item} className="hover:bg-slate-50">
                   <td className="px-4 py-3 w-8"><FileText className="w-4 h-4 text-slate-400" /></td>
                   <td className="px-4 py-3 font-medium text-slate-700">HDFC_Stmt_Oct24.pdf</td>
                   <td className="px-4 py-3 text-slate-500 text-xs">Bank Statements</td>
                   <td className="px-4 py-3 text-slate-500 text-xs">12 Oct 2024</td>
                   <td className="px-4 py-3 text-right">
                      <Button variant="ghost" className="p-1 h-auto"><Download className="w-4 h-4" /></Button>
                   </td>
                </tr>
             ))}
          </tbody>
       </table>
    </Card>
   </div>
)

// --- Main App Layout & Logic ---

export default function AccountingApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [selectedClient, setSelectedClient] = useState(MOCK_CLIENTS[0]);
  const [selectedYear, setSelectedYear] = useState(FINANCIAL_YEARS[0]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (!isLoggedIn) {
    return <LoginScreen onLogin={() => setIsLoggedIn(true)} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case "Dashboard": return <Dashboard />;
      case "Clients": return <ClientList />;
      case "Vouchers": return <VoucherEntry />;
      case "Reports": return <ReportScreen />;
      case "GST": return <GSTDashboard />;
      case "Documents": return <Documents />;
      default: return (
        <div className="flex flex-col items-center justify-center h-96 text-slate-400">
           <Lock className="w-12 h-12 mb-4" />
           <p>Module under construction or restricted.</p>
        </div>
      );
    }
  };

  const NavItem = ({ id, icon: Icon, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium transition-colors ${
        activeTab === id
          ? "bg-slate-800 text-white border-r-4 border-blue-500"
          : "text-slate-400 hover:bg-slate-800 hover:text-white"
      }`}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-slate-100 font-sans text-slate-900 overflow-hidden">
      
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-slate-900 flex-shrink-0 transition-all duration-300 flex flex-col z-20`}>
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
           {sidebarOpen ? (
             <div className="flex items-center space-x-2 text-white font-bold text-lg tracking-tight">
               <Calculator className="w-6 h-6 text-blue-500" />
               <span>CA Pro</span>
             </div>
           ) : (
             <Calculator className="w-6 h-6 text-blue-500 mx-auto" />
           )}
        </div>

        <nav className="flex-1 overflow-y-auto py-4 space-y-1">
          <NavItem id="Dashboard" icon={LayoutDashboard} label={sidebarOpen ? "Dashboard" : ""} />
          <NavItem id="Clients" icon={Building2} label={sidebarOpen ? "Clients" : ""} />
          <NavItem id="Companies" icon={Briefcase} label={sidebarOpen ? "Companies" : ""} />
          <NavItem id="Ledgers" icon={BookOpen} label={sidebarOpen ? "Ledgers" : ""} />
          <NavItem id="Vouchers" icon={FileText} label={sidebarOpen ? "Vouchers" : ""} />
          <NavItem id="GST" icon={PieChart} label={sidebarOpen ? "GST Portal" : ""} />
          <NavItem id="Reports" icon={FileSpreadsheet} label={sidebarOpen ? "Reports" : ""} />
          <NavItem id="Documents" icon={UploadCloud} label={sidebarOpen ? "Documents" : ""} />
          <NavItem id="Settings" icon={Settings} label={sidebarOpen ? "Settings" : ""} />
        </nav>

        <div className="p-4 border-t border-slate-800">
           <button onClick={() => setIsLoggedIn(false)} className="flex items-center space-x-3 text-slate-400 hover:text-white w-full">
              <LogOut className="w-5 h-5" />
              {sidebarOpen && <span className="text-sm">Sign Out</span>}
           </button>
        </div>
      </aside>

      {/* Main Layout */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm z-10">
          <div className="flex items-center space-x-4">
             <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-slate-100 rounded text-slate-500 lg:hidden">
                <Menu className="w-5 h-5" />
             </button>
             
             {/* Context Selectors - The "CA" workflow heart */}
             <div className="hidden md:flex items-center space-x-2 bg-slate-50 p-1 rounded-md border border-slate-200">
                <div className="flex items-center px-3 py-1 border-r border-slate-200">
                   <Building2 className="w-4 h-4 text-slate-500 mr-2" />
                   <select 
                      className="bg-transparent text-sm font-semibold text-slate-700 focus:outline-none cursor-pointer"
                      value={selectedClient.id}
                      onChange={(e) => setSelectedClient(MOCK_CLIENTS.find(c => c.id === parseInt(e.target.value)))}
                   >
                      {MOCK_CLIENTS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                   </select>
                </div>
                <div className="flex items-center px-3 py-1">
                   <select 
                      className="bg-transparent text-sm font-medium text-slate-600 focus:outline-none cursor-pointer"
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                   >
                      {FINANCIAL_YEARS.map(y => <option key={y} value={y}>FY {y}</option>)}
                   </select>
                </div>
             </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-slate-400 hover:text-slate-600">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            <div className="h-8 w-8 bg-blue-900 rounded-full flex items-center justify-center text-white text-xs font-bold">
              CA
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-6">
           <div className="max-w-7xl mx-auto">
              {renderContent()}
           </div>
        </main>
      </div>
    </div>
  );
}