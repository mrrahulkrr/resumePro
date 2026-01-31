interface ScoreCardProps {
  label: string
  score: number
  color?: "primary" | "secondary" | "default"
}

export function ScoreCard({ label, score, color = "primary" }: ScoreCardProps) {
  const colorClasses = {
    primary: "bg-blue-50 border-blue-200",
    secondary: "bg-green-50 border-green-200",
    default: "bg-gray-50 border-gray-200",
  }

  return (
    <div className={`${colorClasses[color]} border rounded-lg p-6 text-center`}>
      <p className="text-sm text-muted-foreground mb-2">{label}</p>
      <div className="text-4xl font-bold text-primary">{score}%</div>
    </div>
  )
}
