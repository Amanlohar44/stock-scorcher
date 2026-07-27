export function cn(...classes) {
  return classes
    .flat()
    .filter((cls) => typeof cls === "string" && cls.trim().length > 0)
    .join(" ");
}