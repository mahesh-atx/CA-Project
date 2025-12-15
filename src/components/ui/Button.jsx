// Reusable Button component
const Button = ({ children, variant = "primary", icon: Icon, className = "", ...props }) => {
  const baseStyle = "inline-flex items-center px-4 py-2 rounded-sm text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-1";
  const variants = {
    primary: "bg-black text-white hover:bg-slate-800 focus:ring-black border border-black",
    secondary: "bg-white text-slate-900 border border-slate-300 hover:bg-slate-50 focus:ring-slate-300",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-600 border border-red-600",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100 border border-transparent",
  };
  
  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {Icon && <Icon className={`w-4 h-4 mr-2 ${variant === 'primary' ? 'text-white' : 'text-current'}`} />}
      {children}
    </button>
  );
};

export default Button;
