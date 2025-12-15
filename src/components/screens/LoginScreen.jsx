// Login Screen
import React, { useState } from 'react';
import { Calculator } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button, Input } from '../ui';

const LoginScreen = () => {
  const { login } = useApp();
  const [email, setEmail] = useState('admin@ca-office.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }
    
    const success = login(email, password);
    if (!success) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-mono">
      <div className="bg-white p-8 border border-slate-200 w-full max-w-md shadow-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-black text-white rounded-sm mx-auto flex items-center justify-center mb-4">
            <Calculator className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-sans">CA Pro Connect</h1>
          <p className="text-slate-500 text-xs mt-2 uppercase tracking-widest">Authorized Access Only</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-sm">
              {error}
            </div>
          )}
          
          <Input 
            label="Email ID" 
            type="email" 
            placeholder="admin@ca-office.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="font-sans" 
          />
          <Input 
            label="Password" 
            type="password" 
            placeholder="••••••••" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="font-sans" 
          />
          
          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center text-slate-600 font-sans">
              <input type="checkbox" className="mr-2 rounded-sm border-slate-300 text-black focus:ring-black" />
              Remember me
            </label>
          </div>

          <Button type="submit" className="w-full justify-center font-sans">Secure Login</Button>
        </form>
        
        <p className="text-xs text-slate-400 text-center mt-6 font-sans">
          Demo: Use any email/password
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;
