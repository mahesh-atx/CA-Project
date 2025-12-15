// Client List Screen with CRUD
import React, { useState } from 'react';
import { Search, Plus, Filter, ChevronRight, X, Edit2, Trash2, FileSpreadsheet } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card, Badge, Button, Input } from '../ui';
import { CLIENT_GROUPS, CLIENT_STATUS } from '../../constants';
import { exportClientsExcel } from '../../services/exports';

const ClientList = () => {
  const { clients, addClient, updateClient, removeClient, setSelectedClient } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    gstin: '',
    pan: '',
    group: 'Service',
    status: 'Active',
    email: '',
    phone: '',
    address: ''
  });

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.gstin?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.pan?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) return;
    
    if (editingClient) {
      updateClient({ ...editingClient, ...formData });
    } else {
      addClient(formData);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({ name: '', gstin: '', pan: '', group: 'Service', status: 'Active', email: '', phone: '', address: '' });
    setEditingClient(null);
    setShowForm(false);
  };

  const handleEdit = (client) => {
    setFormData({
      name: client.name || '',
      gstin: client.gstin || '',
      pan: client.pan || '',
      group: client.group || 'Service',
      status: client.status || 'Active',
      email: client.email || '',
      phone: client.phone || '',
      address: client.address || ''
    });
    setEditingClient(client);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this client? All related data will be removed.')) {
      removeClient(id);
    }
  };

  const handleExport = () => {
    exportClientsExcel(clients);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search clients by name, GSTIN or PAN..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all" 
          />
        </div>
        <div className="flex space-x-2 w-full sm:w-auto">
          <Button variant="secondary" icon={FileSpreadsheet} onClick={handleExport}>Export</Button>
          <Button variant="secondary" icon={Filter}>Filter</Button>
          <Button icon={Plus} onClick={() => setShowForm(true)}>Add Client</Button>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <Card className="p-6 border-t-4 border-t-orange-500">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-900 uppercase tracking-wider text-xs">
              {editingClient ? 'Edit Client' : 'Add New Client'}
            </h3>
            <button onClick={resetForm} className="text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Input 
              label="Client Name *" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Enter client name"
              required
            />
            <Input 
              label="GSTIN" 
              value={formData.gstin}
              onChange={(e) => setFormData({...formData, gstin: e.target.value.toUpperCase()})}
              placeholder="27AABCU9603R1ZN"
              maxLength={15}
            />
            <Input 
              label="PAN" 
              value={formData.pan}
              onChange={(e) => setFormData({...formData, pan: e.target.value.toUpperCase()})}
              placeholder="AABCU9603R"
              maxLength={10}
            />
            <div className="flex flex-col">
              <label className="mb-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Group</label>
              <select 
                value={formData.group}
                onChange={(e) => setFormData({...formData, group: e.target.value})}
                className="px-3 py-2 border border-slate-200 rounded-sm text-sm focus:outline-none focus:border-black"
              >
                {CLIENT_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div className="flex flex-col">
              <label className="mb-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Status</label>
              <select 
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="px-3 py-2 border border-slate-200 rounded-sm text-sm focus:outline-none focus:border-black"
              >
                {CLIENT_STATUS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <Input 
              label="Email" 
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="client@email.com"
            />
            <Input 
              label="Phone" 
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              placeholder="+91 98765 43210"
            />
            <div className="md:col-span-2">
              <Input 
                label="Address" 
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                placeholder="Full address"
              />
            </div>
            <div className="md:col-span-3 flex justify-end space-x-3 pt-4 border-t border-slate-100">
              <Button type="button" variant="secondary" onClick={resetForm}>Cancel</Button>
              <Button type="submit">{editingClient ? 'Update' : 'Save'} Client</Button>
            </div>
          </form>
        </Card>
      )}

      {/* Client Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[11px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 whitespace-nowrap">Client Name</th>
                <th className="px-6 py-3 whitespace-nowrap">GSTIN / ID</th>
                <th className="px-6 py-3 whitespace-nowrap hidden sm:table-cell">Group</th>
                <th className="px-6 py-3 whitespace-nowrap">Status</th>
                <th className="px-6 py-3 text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredClients.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-400">
                    {searchTerm ? 'No clients found matching your search' : 'No clients yet. Click "Add Client" to get started.'}
                  </td>
                </tr>
              ) : (
                filteredClients.map((client) => (
                  <tr 
                    key={client.id} 
                    className="hover:bg-slate-50 transition-colors cursor-pointer group"
                    onClick={() => setSelectedClient(client)}
                  >
                    <td className="px-6 py-4 font-semibold text-slate-900">{client.name}</td>
                    <td className="px-6 py-4 font-mono text-slate-600 text-xs">{client.gstin || client.pan || 'N/A'}</td>
                    <td className="px-6 py-4 text-slate-600 hidden sm:table-cell text-xs uppercase tracking-wide">{client.group}</td>
                    <td className="px-6 py-4">
                      <Badge type={client.status === 'Active' ? 'success' : client.status === 'Pending' ? 'warning' : 'neutral'}>
                        {client.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleEdit(client); }}
                          className="p-1 text-slate-400 hover:text-blue-600"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleDelete(client.id); }}
                          className="p-1 text-slate-400 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <ChevronRight className="w-4 h-4 text-slate-300" />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
      
      {filteredClients.length > 0 && (
        <p className="text-xs text-slate-400 text-center">
          Showing {filteredClients.length} of {clients.length} clients
        </p>
      )}
    </div>
  );
};

export default ClientList;
