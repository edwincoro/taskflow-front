import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";

interface MetricProps {
  label: string;
  value: number;
  icon: ReactNode;
  delta: string;
  color: "coral" | "green" | "yellow";
}

export function Metric({ label, value, icon, delta, color }: MetricProps) {
  return (
    <article className="metric">
      <span className={`metric-icon ${color}`}>{icon}</span>
      <div className="metric-label">{label}</div>
      <div className="metric-value">{value}</div>
      <div className="metric-delta">
        <ArrowUpRight size={13} />
        {delta}
      </div>
      <span className="metric-decoration" />
    </article>
  );
}
