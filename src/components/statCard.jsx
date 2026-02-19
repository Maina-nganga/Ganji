import Card from "./Card";

export default function StatCard({ title, value }) {
  return (
    <Card className="hover:shadow-glow transition">
      <p className="text-gray-400 text-sm">{title}</p>
      <h2 className="text-2xl font-bold text-gold mt-2">{value}</h2>
    </Card>
  );
}
