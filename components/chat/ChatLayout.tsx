'use client'

import React, { useState } from 'react'
import { Sidebar } from './Sidebar'
import { motion, AnimatePresence } from 'framer-motion'
import { SquarePen, PanelLeft, MessageSquare, Menu } from 'lucide-react'
import { ClaIcon } from '@/components/ui/ClaIcon'

interface Chat {
  id: string
  title: string
}

interface ChatLayoutProps {
  children: React.ReactNode
  chats: Chat[]
  activeChatId: string | null
  onChatSelect: (id: string) => void
  onChatDelete: (id: string) => void
  onChatRename: (id: string, newTitle: string) => void
  onNewChat: () => void
  isMobileMenuOpen: boolean
  setIsMobileMenuOpen: (open: boolean) => void
}

export function ChatLayout({
  children,
  chats,
  activeChatId,
  onChatSelect,
  onChatDelete,
  onChatRename,
  onNewChat,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}: ChatLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const handleChatSelect = (id: string) => {
    onChatSelect(id)
    setIsMobileMenuOpen(false) // auto-close drawer on mobile after selection
  }

  return (
    <div className="flex w-full h-screen overflow-hidden" style={{ background: 'var(--color-bg-base)' }}>

      {/* ── MOBILE: Backdrop overlay ── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/30 z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* ── MOBILE: Sidebar drawer ── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.aside
            key="mobile-sidebar"
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 30, stiffness: 280 }}
            className="fixed top-0 left-0 h-full z-50 md:hidden overflow-hidden"
            style={{ width: 260, background: 'var(--color-bg-sidebar)' }}
          >
            <Sidebar
              chats={chats}
              activeChatId={activeChatId}
              onChatSelect={handleChatSelect}
              onChatDelete={onChatDelete}
              onChatRename={onChatRename}
              onNewChat={() => { onNewChat(); setIsMobileMenuOpen(false) }}
              isSidebarOpen={true}
              setIsSidebarOpen={() => setIsMobileMenuOpen(false)}
            />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ── DESKTOP: Collapsed icon rail ── */}
      {!isSidebarOpen && (
        <div
          className="h-full hidden md:flex flex-col items-center py-5 shrink-0 border-r"
          style={{
            width: 56,
            background: 'var(--color-bg-sidebar)',
            borderColor: 'var(--color-border)',
            gap: 2,
          }}
        >
          {/* Toggle open */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="w-9 h-9 flex items-center justify-center rounded-xl transition-colors hover:bg-black/6"
            style={{ color: 'var(--color-text-secondary)' }}
            title="Open sidebar"
          >
            <PanelLeft size={17} />
          </button>

          {/* New chat */}
          <button
            onClick={onNewChat}
            className="w-9 h-9 flex items-center justify-center rounded-xl transition-colors hover:bg-black/6"
            style={{ color: 'var(--color-text-secondary)' }}
            title="New chat"
          >
            <SquarePen size={16} />
          </button>

          {/* Divider */}
          {chats.length > 0 && (
            <div className="my-3 w-5 border-t" style={{ borderColor: 'var(--color-border)' }} />
          )}

          {/* Recent chats — icon only, tooltip on hover */}
          {chats.slice(0, 6).map(chat => (
            <button
              key={chat.id}
              onClick={() => onChatSelect(chat.id)}
              className="w-9 h-9 flex items-center justify-center rounded-xl transition-all hover:bg-black/6"
              style={{
                color: activeChatId === chat.id ? 'var(--color-brand)' : 'var(--color-text-muted)',
                background: activeChatId === chat.id ? 'rgba(99,102,241,0.08)' : 'transparent',
              }}
              title={chat.title}
            >
              <MessageSquare size={15} />
            </button>
          ))}

          {/* Logo at bottom */}
          <div className="mt-auto">
            <ClaIcon size={28} />
          </div>
        </div>
      )}


      {/* ── DESKTOP: Full sidebar ── */}
      <AnimatePresence initial={false}>
        {isSidebarOpen && (
          <motion.aside
            key="sidebar"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 240, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 240 }}
            className="h-full shrink-0 overflow-hidden border-r hidden md:block"
            style={{ background: 'var(--color-bg-sidebar)', borderColor: 'var(--color-border)' }}
          >
            <div className="w-[240px] h-full">
              <Sidebar
                chats={chats}
                activeChatId={activeChatId}
                onChatSelect={onChatSelect}
                onChatDelete={onChatDelete}
                onChatRename={onChatRename}
                onNewChat={onNewChat}
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
              />
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 flex flex-col h-full min-w-0 overflow-hidden" style={{ background: 'var(--color-bg-base)' }}>

        {/* Mobile-only top bar */}
        <div
          className="flex md:hidden items-center justify-between px-4 py-3 border-b shrink-0"
          style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg-sidebar)' }}
        >
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="w-9 h-9 flex items-center justify-center rounded-xl transition-colors hover:bg-black/6"
            style={{ color: 'var(--color-text-secondary)' }}
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>

          <div className="flex items-center gap-2">
            <ClaIcon size={22} />
            <span className="text-[15px] font-bold tracking-tight" style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-display)' }}>
              Clabot
            </span>
          </div>

          <button
            onClick={onNewChat}
            className="w-9 h-9 flex items-center justify-center rounded-xl transition-colors hover:bg-black/6"
            style={{ color: 'var(--color-text-secondary)' }}
            aria-label="New chat"
          >
            <SquarePen size={18} />
          </button>
        </div>

        {children}
      </main>
    </div>
  )
}
