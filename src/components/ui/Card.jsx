// Reusable Card component
const Card = ({ children, className = "" }) => (
  <div className={`bg-white border border-slate-200 rounded-none shadow-[0_2px_4px_rgba(0,0,0,0.02)] ${className}`}>
    {children}
  </div>
);

export default Card;
