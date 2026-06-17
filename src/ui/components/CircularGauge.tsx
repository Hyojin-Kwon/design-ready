interface Props {
  value: number;
  size?: number;
  label?: string;
}

export function CircularGauge({ value, size = 80, label }: Props) {
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, value));
  const offset = circumference * (1 - clamped / 100);
  const color =
    clamped >= 80 ? "var(--chart-accent)" : clamped >= 50 ? "var(--warning)" : "var(--critical)";

  return (
    <div class="gauge">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="var(--border)"
          stroke-width={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          stroke-width={strokeWidth}
          fill="none"
          stroke-linecap="round"
          stroke-dasharray={circumference}
          stroke-dashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: "stroke-dashoffset 0.4s ease" }}
        />
      </svg>
      <div class="gauge-center">
        <div class="gauge-value">{clamped}</div>
        {label && <div class="gauge-label">{label}</div>}
      </div>
    </div>
  );
}
