export function TestTokenIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="12" fill="#94a3b8" opacity="0.15" />
      <circle cx="12" cy="12" r="9" stroke="#94a3b8" strokeWidth="1.5" fill="none" opacity="0.5" />
      <text x="12" y="16" textAnchor="middle" fontSize="7" fill="#94a3b8" fontWeight="700">T</text>
    </svg>
  )
}
