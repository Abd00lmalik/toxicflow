export function ETHIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="12" fill="#627EEA" opacity="0.15" />
      <path d="M12 3.5L7 12.5L12 15.5L17 12.5L12 3.5Z" fill="#627EEA" opacity="0.6" />
      <path d="M12 15.5L7 12.5L12 20.5L17 12.5L12 15.5Z" fill="#627EEA" />
      <path d="M12 3.5V9.5L17 12.5L12 3.5Z" fill="white" opacity="0.3" />
      <path d="M12 9.5V15.5L17 12.5L12 9.5Z" fill="white" opacity="0.15" />
    </svg>
  )
}
