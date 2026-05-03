import { useEffect, useState } from "react"

export default function CountUp({ value, duration = 2000 }) {
  const [displayValue, setDisplayValue] = useState(0)
  const numValue = parseFloat(value)
  const isNumeric = !isNaN(numValue)

  useEffect(() => {
    if (!isNumeric) return

    const startValue = 0
    const endValue = numValue
    let animationStart = null

    const animate = (timestamp) => {
      if (!animationStart) {
        animationStart = timestamp
      }

      const elapsed = timestamp - animationStart
      const progress = Math.min(elapsed / duration, 1)
      const current = startValue + (endValue - startValue) * progress

      setDisplayValue(Math.round(current))

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [isNumeric, numValue, duration])

  return isNumeric ? displayValue : value
}
