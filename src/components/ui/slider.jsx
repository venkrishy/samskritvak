import * as React from "react"
import { cn } from "@/lib/utils"

const Slider = React.forwardRef(({ className, value, onValueChange, min = 0, max = 100, step = 1, ...props }, ref) => {
  const handleChange = (e) => {
    const newValue = parseInt(e.target.value)
    onValueChange?.([newValue])
  }

  return (
    <div className={cn("relative flex w-full items-center", className)}>
      <input
        ref={ref}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value?.[0] || min}
        onChange={handleChange}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        style={{
          background: `linear-gradient(to right, #2563eb 0%, #2563eb ${((value?.[0] || min) - min) / (max - min) * 100}%, #e5e7eb ${((value?.[0] || min) - min) / (max - min) * 100}%, #e5e7eb 100%)`
        }}
        {...props}
      />
    </div>
  )
})
Slider.displayName = "Slider"

export { Slider }
