export default function MemberStatCard({
  title,
  value,
  color = "text-yellow-400",
}) {
  return (
    <div className="bg-zinc-900 rounded-2xl border border-yellow-500/20 p-4 md:p-6 transition hover:border-yellow-400/40">

      <p className="text-sm md:text-base text-gray-400">
        {title}
      </p>

      <h2
        className={`text-2xl md:text-4xl font-bold mt-2 md:mt-3 break-words ${color}`}
      >
        {value}
      </h2>

    </div>
  );
}