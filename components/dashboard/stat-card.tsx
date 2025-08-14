import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconBg?: string;
  iconColor?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  iconBg = "bg-[#FCEBE5]",
  iconColor = "text-[#E98E75]",
}: StatCardProps) {
  return (
    <div className="rounded-2xl bg-[#FBEAE4] px-4 py-8 flex items-center justify-between shadow-sm">
      <div className="flex flex-col gap-1">
        <p className="text-sm text-zinc-600">{title}</p>
        <h2 className="text-2xl font-semibold text-zinc-900">{value}</h2>
      </div>
      <div
        className={cn(
          "flex items-center justify-center w-9 h-9 rounded-lg",
          iconBg,
        )}
      >
        <Icon className={cn("w-5 h-5", iconColor)} strokeWidth={2} />
      </div>
    </div>
  );
}
