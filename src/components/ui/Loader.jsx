import { Loader2 } from "lucide-react";

export default function Loader({
  size = 24,
}) {
  return (
    <div className="flex items-center justify-center py-8">
      <Loader2
        size={size}
        className="animate-spin text-yellow-400"
      />
    </div>
  );
}