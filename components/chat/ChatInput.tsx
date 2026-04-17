'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { ArrowUp, Mic, Image, FileText, X, Square, Plus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface ChatInputProps {
  onSendMessage: (content: string, image?: File | null, file?: File | null) => void
  onStop: () => void
  isLoading: boolean
}

declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}
export function ChatInput({ onSendMessage, onStop, isLoading }: ChatInputProps) {
  const [input, setInput] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [speechSupported, setSpeechSupported] = useState(false)
  const [showAttachMenu, setShowAttachMenu] = useState(false)

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const recognitionRef = useRef<any>(null)
  const attachMenuRef = useRef<HTMLDivElement>(null)
  const plusBtnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    setSpeechSupported(!!SR)
  }, [])

  // Close attach menu on outside click
  useEffect(() => {
    if (!showAttachMenu) return
    const handler = (e: MouseEvent) => {
      const target = e.target as Node
      if (attachMenuRef.current?.contains(target)) return
      if (plusBtnRef.current?.contains(target)) return
      setShowAttachMenu(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [showAttachMenu])

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current
    if (el) {
      el.style.height = 'auto'
      el.style.height = `${Math.min(el.scrollHeight, 200)}px`
    }
  }, [input])

  const handleSend = useCallback(() => {
    if ((!input.trim() && !selectedImage && !selectedFile) || isLoading) return
    onSendMessage(input.trim(), selectedImage, selectedFile)
    setInput('')
    setSelectedImage(null)
    setSelectedFile(null)
    setImagePreview(null)
  }, [input, selectedImage, selectedFile, isLoading, onSendMessage])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items
    if (!items) return
    for (const item of Array.from(items)) {
      if (item.type.startsWith('image/')) {
        e.preventDefault()
        const file = item.getAsFile()
        if (file) {
          setSelectedImage(file)
          const reader = new FileReader()
          reader.onloadend = () => setImagePreview(reader.result as string)
          reader.readAsDataURL(file)
        }
        return
      }
    }
  }

  const startRecording = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) return
    const recognition = new SR()
    // Use the user's browser/OS language automatically (ko-KR, ar-SA, en-US, etc.)
    recognition.lang = navigator.language || navigator.languages?.[0] || 'en-US'
    recognition.continuous = true
    recognition.interimResults = true

    recognition.onstart = () => { setIsRecording(true); setTranscript('') }

    recognition.onresult = (event: any) => {
      let interim = ''
      let final = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) final += event.results[i][0].transcript + ' '
        else interim += event.results[i][0].transcript
      }
      setTranscript(interim)
      if (final) setInput(prev => prev + final)
    }

    recognition.onerror = () => { setIsRecording(false); setTranscript('') }
    recognition.onend = () => { setIsRecording(false); setTranscript('') }

    recognitionRef.current = recognition
    recognition.start()
  }, [])

  const stopRecording = useCallback(() => {
    recognitionRef.current?.stop()
    setIsRecording(false)
    setTranscript('')
  }, [])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      setSelectedFile(null)
      const reader = new FileReader()
      reader.onloadend = () => setImagePreview(reader.result as string)
      reader.readAsDataURL(file)
    }
    setShowAttachMenu(false)
    e.target.value = ''
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setSelectedImage(null)
      setImagePreview(null)
    }
    setShowAttachMenu(false)
    e.target.value = ''
  }

  const displayValue = isRecording && transcript ? input + transcript : input
  const hasContent = !!(input.trim() || selectedImage || selectedFile)

  return (
    <div className="w-full max-w-[680px] mx-auto px-3 pb-3 md:px-4 md:pb-5">

      {/* Recording indicator */}
      <AnimatePresence>
        {isRecording && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="mb-2 flex items-center gap-2 justify-center"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[12px] font-medium text-red-500">
              {transcript || 'Listening...'}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Box (Pill) */}
      <div
        className={cn(
          'relative w-full rounded-[28px] border transition-all duration-200 focus-within:ring-2 focus-within:ring-black/20 focus-within:border-black/30 backdrop-blur-md flex flex-col',
          isRecording ? 'border-red-200' : 'border-transparent'
        )}
        style={{
          background: 'var(--color-bg-surface)',
          boxShadow: 'var(--input-shadow)',
        }}
      >
        {/* Previews (INSIDE the pill border) */}
        <AnimatePresence>
          {(imagePreview || selectedFile) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ overflow: 'hidden' }}
            >
              <div className="flex gap-2 px-5 pt-4 pb-1">
                {imagePreview && (
                  <div className="relative w-[72px] h-[72px] rounded-xl overflow-hidden border bg-black/5 border-[var(--color-border)] group">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      onClick={() => { setSelectedImage(null); setImagePreview(null) }}
                      className="absolute top-1 right-1 p-1 bg-black/70 hover:bg-black/90 text-white rounded-full transition"
                    >
                      <X size={12} strokeWidth={3} />
                    </button>
                  </div>
                )}
                {selectedFile && (
                  <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border text-[13px] h-fit bg-[var(--color-bg-surface)] text-[var(--color-text-primary)] border-[var(--color-border)]">
                    <FileText size={16} className="text-[var(--color-brand)]" />
                    <span className="truncate max-w-[140px] font-medium">{selectedFile.name}</span>
                    <button onClick={() => setSelectedFile(null)} className="opacity-50 hover:opacity-100 transition ml-1">
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input Row */}
        <div className="flex items-end gap-1 px-1 py-1 md:gap-2 md:px-1.5 md:py-1.5">
          {/* Attach Button + Menu */}
          <div className="relative shrink-0 pb-1 pl-1 md:pb-1.5 md:pl-1.5">
            <AnimatePresence>
              {showAttachMenu && (
                <motion.div
                  ref={attachMenuRef}
                  initial={{ opacity: 0, y: 6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.97 }}
                  transition={{ duration: 0.12 }}
                  className="absolute bottom-full left-0 mb-3 w-48 rounded-2xl border shadow-xl overflow-hidden z-[100] bg-[var(--color-bg-surface)]"
                  style={{ borderColor: 'var(--color-border)' }}
                >
                  <label htmlFor="clabot-img-input" onClick={() => setShowAttachMenu(false)} className="flex items-center gap-3 w-full px-4 py-3 cursor-pointer hover:bg-black/5 transition-colors rounded-t-2xl group">
                    <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                      <Image size={15} className="text-purple-600" />
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-[var(--color-text-primary)]">Upload image</p>
                      <p className="text-[11px] text-[var(--color-text-secondary)]">JPG, PNG, WEBP</p>
                    </div>
                  </label>
                  <div className="mx-4 border-t border-[var(--color-border)]" />
                  <label htmlFor="clabot-doc-input" onClick={() => setShowAttachMenu(false)} className="flex items-center gap-3 w-full px-4 py-3 cursor-pointer hover:bg-black/5 transition-colors rounded-b-2xl group">
                    <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                      <FileText size={15} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-[var(--color-text-primary)]">Attach document</p>
                      <p className="text-[11px] text-[var(--color-text-secondary)]">PDF, TXT, CSV, JSON...</p>
                    </div>
                  </label>
                </motion.div>
              )}
            </AnimatePresence>
            <button
              ref={plusBtnRef}
              onClick={() => setShowAttachMenu(v => !v)}
              className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full transition hover:bg-black/5 active:scale-95 text-[var(--color-text-primary)] opacity-70 hover:opacity-100"
              title="Attach"
            >
              <Plus size={20} strokeWidth={2} className="md:hidden" />
              <Plus size={22} strokeWidth={2} className="hidden md:block" />
            </button>
            <input id="clabot-img-input" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            <input id="clabot-doc-input" type="file" accept=".pdf,.doc,.docx,.txt,.csv,.json,.md,.py,.js,.ts,.tsx,.jsx,.html,.css,.xml,.yaml,.yml,.log" onChange={handleFileChange} className="hidden" />
          </div>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={displayValue}
            onChange={e => !isRecording && setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            placeholder="Ask anything..."
            rows={1}
            readOnly={isRecording}
            className="flex-1 resize-none border-none outline-none bg-transparent text-[15px] md:text-[16px] tracking-tight leading-relaxed py-2 md:py-3 min-h-[38px] md:min-h-[46px] max-h-[200px] md:max-h-[240px] text-[var(--color-text-primary)] font-sans placeholder-[var(--color-text-secondary)] placeholder-opacity-70"
          />

          {/* Right Controls */}
          <div className="flex items-center gap-0.5 shrink-0 pb-1 pr-1 md:gap-1 md:pb-1.5 md:pr-1.5">
            {speechSupported && (
              <button
                onClick={() => isRecording ? stopRecording() : startRecording()}
                title={isRecording ? 'Stop recording' : 'Voice input'}
                className={cn(
                  'w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full transition-all duration-150 active:scale-95',
                  isRecording ? 'bg-red-100 text-red-500 shadow-[0_0_12px_rgba(239,68,68,0.3)] animate-pulse' : 'text-[var(--color-text-primary)] opacity-60 hover:opacity-100 hover:bg-black/5'
                )}
              >
                {isRecording ? <Square size={14} fill="currentColor" /> : <Mic size={18} strokeWidth={2} />}
              </button>
            )}

            {isLoading ? (
              <button
                onClick={onStop}
                className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full transition-all duration-200 active:scale-95 border border-gray-300 bg-white"
              >
                <span className="w-3.5 h-3.5 rounded-sm bg-black" />
              </button>
            ) : (
              <button
                onClick={handleSend}
                disabled={!hasContent || isRecording}
                className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full transition-all duration-200 active:scale-95 shadow-sm"
                style={{
                  background: hasContent && !isRecording ? '#6A6EF3' : '#ffffff',
                  color: hasContent && !isRecording ? '#ffffff' : '#A1A1AA',
                  border: '1.5px solid #E5E7EB',
                }}
              >
                <ArrowUp size={20} strokeWidth={2.5} />
              </button>
            )}
          </div>
        </div>
      </div>

      <p className="mt-2 text-center text-[11px]" style={{ color: 'var(--color-text-muted)' }}>
        Clabot can make mistakes. Verify important information.
      </p>
    </div>
  )
}
