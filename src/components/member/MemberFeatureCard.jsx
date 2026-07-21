export default function MemberFeatureCard({
  title,
  desc
}) {
  return (
    <div className="bg-zinc-900 border border-yellow-500/20 rounded-2xl p-6">

      <h2 className="text-2xl text-yellow-400 font-bold">
        {title}
      </h2>

      <p className="text-gray-400 mt-3">
        {desc}
      </p>

    </div>
  );
}