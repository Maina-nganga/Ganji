export default function Card({ children, className = "" }) {
  return (
    <div
      className={`bg-card backdrop-blur-md 
      p-6 rounded-2xl border border-gray-800 
      ${className}`}
    >
      {children}
    </div>
  );
}
