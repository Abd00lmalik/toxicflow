export function USDCIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="12" fill="#2775CA" opacity="0.15" />
      <circle cx="12" cy="12" r="9" stroke="#2775CA" strokeWidth="1.5" fill="none" opacity="0.7" />
      <text x="12" y="16" textAnchor="middle" fontSize="8" fill="#2775CA" fontWeight="700">$</text>
    </svg>
  )
}
