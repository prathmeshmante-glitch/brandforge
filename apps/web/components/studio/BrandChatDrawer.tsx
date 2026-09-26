'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Send,
  MessageSquare,
  X,
  ChevronDown,
  Wand2,
  ShieldAlert,
  CheckCircle2,
  Terminal,
  Zap,
} from 'lucide-react';
import { api } from '../../lib/api';

interface ToolExecution {
  tool: string;
  status: string;
  summary: string;
  details?: any;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  tool_calls?: ToolExecution[];
  created_at?: string;
}

interface BrandChatDrawerProps {
  projectId: string;
  projectName: string;
  onBrandStateUpdated?: (newState: any) => void;
}

const QUICK_PROMPTS = [
  'Give me 5 stronger names',
  'Challenge this brand with Brand Battle',
  'Check cross-stage consistency',
  'Make the brand more premium',
  'Rewrite the launch copy and tagline',
  'Why did you choose this positioning?',
];

export const BrandChatDrawer: React.FC<BrandChatDrawerProps> = ({
  projectId,
  projectName,
  onBrandStateUpdated,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat history when drawer opens or projectId changes
  useEffect(() => {
    if (!projectId || !isOpen) return;

    let active = true;
    async function fetchHistory() {
      try {
        const data = await api.getChatHistory(projectId);
        if (active && Array.isArray(data?.messages)) {
          setMessages(data.messages);
        }
      } catch (err) {
        console.warn('Could not load chat history:', err);
      }
    }

    fetchHistory();
    return () => {
      active = false;
    };
  }, [projectId, isOpen]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isSending) return;

    const userTempId = `user-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userTempId,
      role: 'user',
      content: text,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsSending(true);

    try {
      const response = await api.sendChatMessage(projectId, text);

      const assistantMsg: ChatMessage = {
        id: `asst-${Date.now()}`,
        role: 'assistant',
        content: response.reply,
        tool_calls: response.tools_executed || [],
        created_at: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMsg]);

      if (response.updated_brand_state && onBrandStateUpdated) {
        onBrandStateUpdated(response.updated_brand_state);
      }
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `Error executing request: ${err.message || 'The studio assistant encountered an unexpected error.'}`,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background: 'linear-gradient(135deg, #7c5cff, #5a38e0)',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '999px',
            padding: '12px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 10px 30px rgba(124, 92, 255, 0.4)',
            cursor: 'pointer',
            zIndex: 40,
            fontSize: '12px',
            fontWeight: 600,
            letterSpacing: '0.04em',
            transition: 'all 0.2s ease',
          }}
          className="hover:scale-105 active:scale-95"
        >
          <Sparkles size={16} />
          <span>Brand Intelligence Assistant</span>
          <span
            style={{
              background: 'rgba(255,255,255,0.25)',
              borderRadius: '99px',
              padding: '2px 7px',
              fontSize: '10px',
            }}
          >
            AI
          </span>
        </button>
      )}

      {/* Slide-out Intelligence Drawer */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: '420px',
            maxWidth: 'calc(100vw - 32px)',
            height: '620px',
            maxHeight: 'calc(100vh - 48px)',
            background: 'linear-gradient(160deg, #121319ee, #0b0c10fa)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '20px',
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.7), 0 0 40px rgba(124, 92, 255, 0.15)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 50,
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '16px 20px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(255, 255, 255, 0.02)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'rgba(124, 92, 255, 0.15)',
                  border: '1px solid rgba(124, 92, 255, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--indigo)',
                }}
              >
                <Sparkles size={16} />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#fff' }}>
                  Brand Intelligence Assistant
                </h4>
                <span style={{ fontSize: '10px', color: 'var(--subtle)' }}>
                  Scoping project: <b style={{ color: 'var(--text)' }}>{projectName}</b>
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--subtle)',
                cursor: 'pointer',
                padding: '6px',
                borderRadius: '6px',
              }}
              className="hover:text-white"
            >
              <X size={16} />
            </button>
          </div>

          {/* Quick Prompts Carousel */}
          <div
            style={{
              padding: '10px 16px',
              background: 'rgba(0, 0, 0, 0.25)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
              display: 'flex',
              gap: '6px',
              overflowX: 'auto',
              whiteSpace: 'nowrap',
            }}
          >
            {QUICK_PROMPTS.map((qp, idx) => (
              <button
                key={idx}
                disabled={isSending}
                onClick={() => handleSendMessage(qp)}
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '999px',
                  padding: '4px 10px',
                  color: 'var(--muted)',
                  fontSize: '10px',
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'all 0.15s',
                }}
                className="hover:border-indigo-500 hover:text-white"
              >
                {qp}
              </button>
            ))}
          </div>

          {/* Messages Scroll Area */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            {messages.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '40px 20px',
                  color: 'var(--subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <Terminal size={28} style={{ color: 'var(--indigo)', opacity: 0.6 }} />
                <p style={{ margin: 0, fontSize: '12px', fontWeight: 500, color: 'var(--muted)' }}>
                  BrandForge Studio Assistant Ready
                </p>
                <p style={{ margin: 0, fontSize: '11px', lineHeight: 1.5, maxWidth: '280px' }}>
                  Ask questions about your brand positioning, request targeted revisions, or trigger Brand Battle critiques.
                </p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    gap: '4px',
                  }}
                >
                  <div
                    style={{
                      maxWidth: '88%',
                      padding: '10px 14px',
                      borderRadius: msg.role === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                      background:
                        msg.role === 'user'
                          ? 'linear-gradient(135deg, #7c5cff, #6540f5)'
                          : 'rgba(255, 255, 255, 0.05)',
                      border: msg.role === 'user' ? 'none' : '1px solid rgba(255, 255, 255, 0.08)',
                      color: msg.role === 'user' ? '#fff' : 'var(--text)',
                      fontSize: '12px',
                      lineHeight: 1.5,
                      whiteSpace: 'pre-wrap',
                      boxShadow: msg.role === 'user' ? '0 4px 12px rgba(124, 92, 255, 0.3)' : 'none',
                    }}
                  >
                    {/* Tool Badges */}
                    {msg.tool_calls && msg.tool_calls.length > 0 && (
                      <div
                        style={{
                          marginBottom: '8px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '4px',
                        }}
                      >
                        {msg.tool_calls.map((tc, tIdx) => (
                          <div
                            key={tIdx}
                            style={{
                              background: 'rgba(124, 92, 255, 0.12)',
                              border: '1px solid rgba(124, 92, 255, 0.25)',
                              borderRadius: '6px',
                              padding: '4px 8px',
                              fontSize: '10px',
                              color: 'var(--indigo)',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                            }}
                          >
                            <Zap size={11} />
                            <span>
                              Tool executed: <b>{tc.tool}</b> ({tc.status})
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                    {msg.content}
                  </div>
                </div>
              ))
            )}

            {isSending && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--indigo)', padding: '6px' }}>
                <Sparkles size={14} className="animate-spin" />
                <span style={{ fontSize: '11px', fontFamily: 'monospace' }}>
                  CONSULTING BRAND INTELLIGENCE ENGINE...
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div
            style={{
              padding: '12px 16px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              background: 'rgba(0, 0, 0, 0.3)',
              display: 'flex',
              gap: '8px',
              alignItems: 'center',
            }}
          >
            <input
              type="text"
              placeholder="Ask assistant or request a brand revision..."
              value={inputValue}
              disabled={isSending}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
              style={{
                flex: 1,
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '10px',
                padding: '10px 14px',
                color: '#fff',
                fontSize: '12px',
                outline: 'none',
              }}
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim() || isSending}
              style={{
                background: inputValue.trim() ? 'var(--indigo)' : 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                borderRadius: '10px',
                width: '38px',
                height: '38px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                cursor: inputValue.trim() && !isSending ? 'pointer' : 'not-allowed',
                transition: 'all 0.15s',
              }}
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
