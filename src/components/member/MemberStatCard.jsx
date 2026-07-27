export default function MemberStatCard({
  title,
  value,
  color = "text-yellow-400",
  icon,
}) {
  return (
    <div className="bg-zinc-900/80 backdrop-blur-sm rounded-2xl border border-yellow-500/20 p-4 md:p-6 transition-all duration-300 hover:border-yellow-400/50 hover:shadow-[0_0_20px_rgba(250,204,21,0.1)]">
      
      <div className="flex items-center justify-between">
        <p className="text-xs md:text-sm font-semibold text-gray-400 uppercase tracking-wider">
          {title}
        </p>
        {icon && <span className="text-yellow-400 text-base md:text-lg">{icon}</span>}
      </div>

      <h2
        className={`text-2xl md:text-3xl font-black mt-2 md:mt-3 break-words ${color}`}
      >
        {value}
      </h2>

    </div>
  );
}