// Reusable Badge component
const Badge = ({ children, type = "neutral" }) => {
  const styles = {
    neutral: "bg-slate-100 text-slate-600 border-slate-200",
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    danger: "bg-red-50 text-red-700 border-red-200",
    brand: "bg-blue-50 text-blue-700 border-blue-200",
  };
  return (
    <span className={`px-2 py-0.5 rounded-sm text-[10px] uppercase tracking-wider font-mono border ${styles[type]}`}>
      {children}
    </span>
  );
};

export default Badge;
