import { useState } from 'react'

export function CodeBlock({ code, language = 'solidity' }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <div style={{ position: 'relative', background: 'var(--s1)', border: '1px solid var(--b-soft)', borderRadius: 'var(--r-md)', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 16px', borderBottom: '1px solid var(--b-dim)', background: 'var(--s2)' }}>
        <span className="label">{language}</span>
        <button onClick={copy} className="btn btn-ghost btn-sm" style={{ fontSize: 11 }}>
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <pre style={{ margin: 0, padding: '16px', overflowX: 'auto', fontSize: 13, lineHeight: 1.6, color: 'var(--fg-2)', fontFamily: "'SF Mono','JetBrains Mono',monospace" }}>
        <code>{code}</code>
      </pre>
    </div>
  )
}
