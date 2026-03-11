export default function Button({ children, className = "", ...props }) {
  return (
    <button
      {...props}
      className={`px-6 py-3 rounded-xl font-semibold 
      bg-gradient-to-r from-gold to-yellow-400 
      text-black hover:shadow-glow transition duration-300 
      ${className}`}
    >
      {children}
    </button>
  );
}
