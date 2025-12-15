// Reusable Input component
const Input = ({ label, className = "", ...props }) => (
  <div className={`flex flex-col ${className}`}>
    {label && <label className="mb-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-widest">{label}</label>}
    <input 
      className="px-3 py-2 border border-slate-200 rounded-sm text-sm font-mono focus:outline-none focus:border-black focus:ring-1 focus:ring-black disabled:bg-slate-50 disabled:text-slate-400 placeholder:font-sans"
      {...props}
    />
  </div>
);

export default Input;
