import { cn } from "@/lib/utils"

// NOTE: This is a placeholder for your ad code.
// You will need to replace the contents of this component with the actual
// ad script provided by Google AdSense or another ad network.

export default function AdBanner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center w-full h-[100px] bg-muted/50 rounded-lg border border-dashed border-border text-muted-foreground",
        className
      )}
    >
      <div className="text-center">
        <p className="font-semibold">Advertisement</p>
        <p className="text-xs">Your ad unit will be displayed here.</p>
      </div>
    </div>
  )
}
