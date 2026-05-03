import { motion } from "motion/react"
import { useEffect, useState } from "react"

export default function CountUpStat({ value, label, delay = 0 }) {
  const [displayValue, setDisplayValue] = useState(0)
  const numValue = parseFloat(value)
  const isNumeric = !isNaN(numValue)
  
  useEffect(() => {
    if (!isNumeric) return
    
    const startValue = 0
    const endValue = numValue
    const duration = 2000 // 2 seconds animation
    
    let animationStart = null
    
    const animate = (timestamp) => {
      if (!animationStart) {
        animationStart = timestamp
      }
      
      const elapsed = timestamp - animationStart
      const progress = Math.min(elapsed / duration, 1)
      const current = startValue + (endValue - startValue) * progress
      
      setDisplayValue(Math.floor(current * 100) / 100)
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    
    const timer = setTimeout(() => {
      requestAnimationFrame(animate)
    }, delay * 100)
    
    return () => clearTimeout(timer)
  }, [isNumeric, numValue, delay])

  return (
    <motion.div
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: delay * 0.1 }}
    >
      <p className="text-3xl font-bold text-blue-400">
        {isNumeric ? displayValue : value}
        {value.includes("ms") && "ms"}
      </p>
      <p className="text-gray-500 text-xs mt-1">{label}</p>
    </motion.div>
  )
}

