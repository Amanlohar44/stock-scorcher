export default function MemberStatCard({
  title,
  value,
  color
}) {
  return (
    <div className="bg-zinc-900 rounded-2xl border border-yellow-500/20 p-6">

      <p className="text-gray-400">
        {title}
      </p>

      <h2 className={`text-4xl font-bold mt-3 ${color}`}>
        {value}
      </h2>

    </div>
  );
}