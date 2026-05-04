import * as React from "react"
import { cn } from "@/lib/utils"

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
  max?: number
  variant?: "default" | "success" | "warning"
}

function Progress({
  className,
  value = 0,
  max = 100,
  variant = "default",
  ...props
}: ProgressProps) {
  const percentage = Math.min((value / max) * 100, 100)

  return (
    <div
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-gray-100",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "h-full w-full flex-1 rounded-full transition-all duration-500",
          {
            "bg-blue-600": variant === "default",
            "bg-green-500": variant === "success",
            "bg-yellow-500": variant === "warning",
          }
        )}
        style={{ transform: `translateX(-${100 - percentage}%)` }}
      />
    </div>
  )
}

export { Progress }
