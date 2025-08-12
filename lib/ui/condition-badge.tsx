// Centralized condition badge helper for consistent semantics & styling
import { Badge } from "@/components/ui/badge"

const CONDITION_STYLE_MAP: Record<string, { className: string; label: string; icon?: string }> = {
  new: { className: "bg-emerald-600 text-white", label: "New", icon: "✨" },
  like_new: { className: "bg-indigo-600 text-white", label: "Like New", icon: "✨" },
  good: { className: "bg-blue-600 text-white", label: "Good", icon: "✨" },
  fair: { className: "bg-amber-600 text-white", label: "Fair", icon: "✨" },
}

export interface ConditionBadgeProps {
  condition: string | null | undefined
  size?: "sm" | "md"
  asSpan?: boolean
  className?: string
  ariaPrefix?: string
}

export function normalizeCondition(value?: string | null) {
  if (!value) return "like_new"
  return value.toLowerCase().replace(/\s+/g, "_")
}

export function getConditionMeta(value?: string | null) {
  const key = normalizeCondition(value)
  return CONDITION_STYLE_MAP[key] || CONDITION_STYLE_MAP.like_new
}

export function ConditionBadge({ condition, size = "md", asSpan, className = "", ariaPrefix = "Condition" }: ConditionBadgeProps) {
  const meta = getConditionMeta(condition)
  const Comp: any = asSpan ? 'span' : Badge
  const sizeClasses = size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-[11px] md:text-xs px-2.5 py-1'
  return (
    <Comp aria-label={`${ariaPrefix}: ${meta.label}`} className={`${meta.className} font-semibold shadow-md border-0 inline-flex items-center gap-1 rounded-md ${sizeClasses} ${className}`}> {meta.icon && <span aria-hidden>{meta.icon}</span>} {meta.label}</Comp>
  )
}
