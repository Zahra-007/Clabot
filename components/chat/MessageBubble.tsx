'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Copy, ThumbsUp, ThumbsDown, RotateCcw, Check, FileText } from 'lucide-react'

interface MessageBubbleProps {
  role: 'user' | 'assistant'
  content: string
  isLoading?: boolean
  timestamp?: number
  formatTime?: (ts: number) => string
  imagePreview?: string | null
  fileName?: string | null
}

export function MessageBubble({
  role,
  content,
  isLoading,
  timestamp,
  formatTime,
  imagePreview,
  fileName,
}: MessageBubbleProps) {
  const isAssistant = role === 'assistant'
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (!content) return
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const timeStr = timestamp && formatTime ? formatTime(timestamp) : null

  // ───────── USER MESSAGE ─────────
  if (!isAssistant) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full flex justify-end py-2"
      >
        <div className="max-w-[75%] flex flex-col items-end">

          {imagePreview && (
            <img
              src={imagePreview}
              className="mb-2 rounded-2xl max-w-[220px] border"
            />
          )}

          {fileName && (
            <div className="mb-2 flex items-center gap-2 px-3 py-2 rounded-xl border text-xs">
              <FileText size={14} />
              <span>{fileName}</span>
            </div>
          )}

          {content && (
            <div
              className="px-4 py-3 rounded-2xl text-white text-sm"
              style={{ background: 'var(--color-brand)' }}
            >
              {content}
            </div>
          )}

          {timeStr && (
            <span className="text-[11px] mt-1 opacity-60">{timeStr}</span>
          )}
        </div>
      </motion.div>
    )
  }

  // ───────── ASSISTANT MESSAGE ─────────
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full flex justify-start py-3"
    >
      <div className="w-full max-w-3xl mx-auto px-4">
        <div className="max-w-[680px] text-[15px] leading-relaxed">

          {isLoading && !content ? (
            <div className="flex gap-1.5 py-2">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150" />
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300" />
            </div>
          ) : isLoading ? (
            <TypingText text={content} />
          ) : (
            <MarkdownContent content={content} />
          )}

          {content && (
            <div className="flex items-center gap-2 mt-2">
              {timeStr && (
                <span className="text-[11px] opacity-60">{timeStr}</span>
              )}

              <div className="flex items-center gap-1 opacity-0 hover:opacity-100 transition">
                <ActionBtn onClick={handleCopy}>
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                </ActionBtn>
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

// ───────── TYPING EFFECT ─────────
function TypingText({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState("")

  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i))
      i++
      if (i > text.length) clearInterval(interval)
    }, 10)

    return () => clearInterval(interval)
  }, [text])

  return <MarkdownContent content={displayed} />
}

// ───────── MARKDOWN ─────────
function MarkdownContent({ content }: { content: string }) {
  return (
    <p className="whitespace-pre-wrap leading-relaxed">
      {content}
    </p>
  )
}

// ───────── ACTION BUTTON ─────────
function ActionBtn({ children, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className="p-1.5 rounded-md hover:bg-black/10 transition"
    >
      {children}
    </button>
  )
}