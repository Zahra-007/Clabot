'use client'

import { oneLight, oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, ThumbsUp, ThumbsDown, RotateCcw, Check, FileText } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'

interface MessageBubbleProps {
  role: 'user' | 'assistant'
  content: string
  isLoading?: boolean
  timestamp?: number
  formatTime?: (ts: number) => string
  imagePreview?: string | null
  fileName?: string | null
}

export function MessageBubble({ role, content, isLoading, timestamp, formatTime, imagePreview, fileName }: MessageBubbleProps) {
  const isAssistant = role === 'assistant'
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (!content) return
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const timeStr = timestamp && formatTime ? formatTime(timestamp) : null

  if (!isAssistant) {
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="w-full flex justify-end py-2">
        <div className="max-w-[75%] flex flex-col items-end">
          {imagePreview && <img src={imagePreview} className="mb-2 rounded-2xl max-w-[220px] border" />}
          {fileName && (
            <div className="mb-2 flex items-center gap-2 px-3 py-2 rounded-xl border text-xs">
              <FileText size={14} />
              <span>{fileName}</span>
            </div>
          )}
          {content && <div className="px-4 py-3 rounded-2xl text-sm">{content}</div>}
          {timeStr && <span className="text-[11px] mt-1 opacity-60">{timeStr}</span>}
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full flex justify-start py-3">
      <div className="w-full max-w-3xl mx-auto px-4">
        <div className="max-w-[680px] text-[15px] leading-relaxed">
          {isLoading && !content ? (
            <div className="py-2">
              <span className="w-3 h-3 bg-gray-800 rounded-full animate-pulse inline-block" />
            </div>
          ) : (
            <div>
              <MarkdownContent content={content.replace(/\*+$/, '')} />
              {isLoading && content && (
                <span className="inline-block w-[2px] h-[1em] bg-current align-middle ml-0.5 animate-pulse" style={{ opacity: 0.7 }} />
              )}
            </div>
          )}
          {content && !isLoading && (
            <div className="flex items-center gap-2 mt-2">
              {timeStr && <span className="text-[11px] opacity-60">{timeStr}</span>}
              <div className="flex items-center gap-1 opacity-0 hover:opacity-100 transition">
                <ActionBtn onClick={handleCopy}>{copied ? <Check size={12} /> : <Copy size={12} />}</ActionBtn>
                <ActionBtn><ThumbsUp size={12} /></ActionBtn>
                <ActionBtn><ThumbsDown size={12} /></ActionBtn>
                <ActionBtn><RotateCcw size={12} /></ActionBtn>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// ───────── MARKDOWN ─────────
function MarkdownContent({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ node, inline, className, children, ...props }: any) {
          const match = /language-(\w+)/.exec(className || '')
          const language = match ? match[1] : ''
          const codeString = String(children).replace(/\n$/, '')
          if (!inline && (match || codeString.includes('\n'))) {
            return <CodeBlock language={language || 'text'} code={codeString} />
          }
          return (
            <code style={{ background: 'rgba(0,0,0,0.08)', borderRadius: 4, padding: '2px 6px', fontSize: '0.85em', fontFamily: 'monospace' }} {...props}>
              {children}
            </code>
          )
        },
        p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
        ul: ({ children }) => <ul className="list-disc pl-5 mb-2 space-y-1">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal pl-5 mb-2 space-y-1">{children}</ol>,
        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
        strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
        h1: ({ children }) => <h1 className="text-xl font-bold mt-3 mb-1">{children}</h1>,
        h2: ({ children }) => <h2 className="text-lg font-bold mt-3 mb-1">{children}</h2>,
        h3: ({ children }) => <h3 className="text-base font-semibold mt-2 mb-1">{children}</h3>,
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-gray-300 pl-3 italic text-gray-500 my-2">{children}</blockquote>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  )
}

// ───────── CODE BLOCK ─────────
const isDark = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches

function CodeBlock({ language, code }: { language: string; code: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{
      borderRadius: 12,
      overflow: "hidden",
      margin: "16px 0",
      border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
      background: isDark ? '#1e1e1e' : '#f8f8f8',
    }}>
      {/* Header — no traffic lights, just language + copy */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 14px",
        background: isDark ? '#2a2a2a' : '#efefef',
        borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
      }}>
        <span style={{
          fontFamily: "monospace",
          fontSize: 12,
          color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.45)',
        }}>
          {language || "code"}
        </span>

        <button
          onClick={handleCopy}
          style={{
            fontSize: 12,
            color: copied ? "#16a34a" : (isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'),
            background: "transparent",
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'}`,
            borderRadius: 6,
            padding: "4px 10px",
            cursor: "pointer",
          }}
        >
          {copied ? "Copied ✓" : "Copy"}
        </button>
      </div>

      {/* Code */}
      <SyntaxHighlighter
        language={language || "javascript"}
        PreTag="div"
        style={isDark ? oneDark : oneLight}
        customStyle={{
          margin: 0,
          padding: "16px",
          fontSize: "13px",
          lineHeight: 1.6,
          background: "transparent",
          fontFamily: '"Fira Code", "JetBrains Mono", "Cascadia Code", monospace',
        }}
        showLineNumbers={code.split("\n").length > 4}
        lineNumberStyle={{
          color: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.25)",
          fontSize: "12px",
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  )
}

// ───────── ACTION BUTTON ─────────
function ActionBtn({ children, onClick }: any) {
  return (
    <button onClick={onClick} className="p-1.5 rounded-md hover:bg-black/10 transition">
      {children}
    </button>
  )
}