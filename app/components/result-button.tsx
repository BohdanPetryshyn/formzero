import { useEffect, useState } from "react"
import { Button } from "#/components/ui/button"
import { Loader2, Check } from "lucide-react"
import { cn } from "#/lib/utils"

type ResultButtonProps = {
  isSubmitting: boolean
  isSuccess: boolean
  loadingText?: string
  successText?: string
  children: React.ReactNode
  className?: string
} & Omit<React.ComponentProps<typeof Button>, "children">

export function ResultButton({
  isSubmitting,
  isSuccess,
  loadingText = "Loading...",
  successText = "Success!",
  children,
  className,
  ...props
}: ResultButtonProps) {
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    if (isSuccess) {
      setShowSuccess(true)
      const timer = setTimeout(() => {
        setShowSuccess(false)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [isSuccess])

  return (
    <Button
      className={cn(
        showSuccess && "bg-green-600 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-600",
        className
      )}
      disabled={isSubmitting || showSuccess}
      {...props}
    >
      {isSubmitting ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          {loadingText}
        </>
      ) : showSuccess ? (
        <>
          <Check className="h-4 w-4" />
          {successText}
        </>
      ) : (
        children
      )}
    </Button>
  )
}
