interface PasswordStrengthIndicatorProps {
  strength: number
}

export function PasswordStrengthIndicator({ strength }: PasswordStrengthIndicatorProps) {
  const getStrengthText = () => {
    if (strength === 0) return "Muito fraca"
    if (strength === 1) return "Fraca"
    if (strength === 2) return "Média"
    if (strength === 3) return "Boa"
    if (strength === 4) return "Forte"
    return "Muito forte"
  }

  const getStrengthColor = () => {
    if (strength <= 1) return "bg-red-500"
    if (strength === 2) return "bg-orange-500"
    if (strength === 3) return "bg-yellow-500"
    if (strength === 4) return "bg-green-500"
    return "bg-green-600"
  }

  return (
    <div className="mt-2 space-y-1">
      <div className="flex h-2 w-full overflow-hidden rounded-full bg-gray-200">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className={`h-full w-1/5 ${i < strength ? getStrengthColor() : "bg-gray-200"} ${i > 0 ? "ml-1" : ""}`}
          />
        ))}
      </div>
      <p className="text-xs text-gray-600">
        Força da senha: <span className="font-medium">{getStrengthText()}</span>
      </p>
    </div>
  )
}
