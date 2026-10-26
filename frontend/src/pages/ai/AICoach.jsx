import React, { useState, useEffect, useRef } from 'react';
import {
  Bot, Send, Sparkles, AlertCircle, Info, RefreshCw,
  User, CheckCircle2, HeartPulse, ShieldCheck
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function AICoach() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `### Welcome to FitLife Coach!\n\nI am your personalized lifestyle and wellness assistant. I use your authorized profile targets (calories, hydration, sleep, and fitness goal) to help you:\n\n• **Plan Balanced Meals:** High-protein recipes aligned with your dietary preferences.\n• **Structure Training:** Progressive home or gym workout routines.\n• **Optimize Habits & Rest:** Sleep hygiene and atomic habit stacking.\n\n*Health Boundary:* I do not provide medical diagnoses or prescriptions. How can I assist your wellness journey today?`,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiStatus, setAiStatus] = useState(null);
  const messagesEndRef = useRef(null);

  const fetchStatus = async () => {
    try {
      const res = await api.get('/ai/status');
      if (res.data?.success) {
        setAiStatus(res.data.data);
      }
    } catch (err) {
      console.warn('Could not fetch AI status');
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (queryText) => {
    const textToSend = queryText || inputMessage;
    if (!textToSend.trim() || loading) return;

    const userMsg = {
      role: 'user',
      content: textToSend.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const res = await api.post('/ai/chat', { message: textToSend.trim() });
      if (res.data?.success) {
        const assistantMsg = {
          role: 'assistant',
          content: res.data.data.reply,
          isAIGenerated: res.data.data.isAIGenerated,
          mode: res.data.data.mode,
          statusMessage: res.data.data.statusMessage,
          timestamp: new Date(res.data.data.timestamp)
        };
        setMessages(prev => [...prev, assistantMsg]);
      }
    } catch (err) {
      const errorReply = err.response?.data?.message || 'Unable to process query at this time. Please try again.';
      toast.error(errorReply);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: `**[System Notice]:** ${errorReply}`,
          timestamp: new Date()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto flex flex-col h-[calc(100vh-5rem)] space-y-4 animate-fade-in">
      {/* Header & Status Banner */}
      <div className="pb-3 border-b border-gray-100 dark:border-dark-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-primary-500/10 text-primary-500 text-xs font-bold uppercase mb-1">
            <Bot size={13} /> Sanitized Intelligence
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <span>FitLife AI Lifestyle Coach</span>
          </h1>
        </div>

        {/* Engine status indicator */}
        {aiStatus && (
          <div className="flex items-center gap-2 text-xs">
            <span className={`w-2 h-2 rounded-full ${aiStatus.isConfigured ? 'bg-emerald-500 animate-pulse' : 'bg-cyan-500'}`} />
            <span className="text-gray-500 dark:text-gray-400 font-medium">
              {aiStatus.isConfigured ? 'Google Gemini 2.5 Flash' : 'Deterministic Scientific Engine'}
            </span>
          </div>
        )}
      </div>

      {/* Informational Banner if running in deterministic mode */}
      {aiStatus && !aiStatus.isConfigured && (
        <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-800 dark:text-cyan-300 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <Info size={16} className="shrink-0 text-cyan-500" />
            <span>
              <strong>Deterministic Mode Active:</strong> Operating via verified scientific algorithms and nutritional guidelines (Gemini API key not configured in server).
            </span>
          </div>
        </div>
      )}

      {/* Chat Messages Log Area */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4 rounded-2xl bg-white dark:bg-dark-900 border border-gray-200 dark:border-dark-700 shadow-sm">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start gap-3 ${
              msg.role === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                msg.role === 'user'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gradient-to-tr from-primary-500 to-accent-500 text-white shadow-sm'
              }`}
            >
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>

            {/* Content Bubble */}
            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-primary-600 text-white rounded-tr-none'
                  : 'bg-gray-50 dark:bg-dark-800 border border-gray-100 dark:border-dark-700 text-gray-800 dark:text-gray-200 rounded-tl-none whitespace-pre-line'
              }`}
            >
              {msg.content}

              {/* Status footer for assistant messages */}
              {msg.role === 'assistant' && msg.statusMessage && (
                <div className="mt-2 pt-2 border-t border-gray-200/50 dark:border-dark-700/50 text-[10px] text-gray-400 flex items-center justify-between">
                  <span>{msg.statusMessage}</span>
                  <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary-500 to-accent-500 text-white flex items-center justify-center animate-pulse">
              <Bot size={16} />
            </div>
            <div className="p-3.5 rounded-2xl rounded-tl-none bg-gray-50 dark:bg-dark-800 border border-gray-100 dark:border-dark-700 text-xs text-gray-500 flex items-center gap-2">
              <RefreshCw size={14} className="animate-spin text-primary-500" />
              <span>Analyzing your wellness profile & formulating recommendation...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompt Chips */}
      {aiStatus?.suggestions && aiStatus.suggestions.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 shrink-0">
          <span className="text-[11px] font-bold text-gray-400 shrink-0 flex items-center gap-1">
            <Sparkles size={12} className="text-primary-500" />
            <span>Suggested:</span>
          </span>
          {aiStatus.suggestions.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="text-xs px-3 py-1.5 rounded-xl border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-900 text-gray-600 dark:text-gray-300 hover:border-primary-500 hover:text-primary-500 shrink-0 transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Chat Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex items-center gap-2 shrink-0"
      >
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Ask FitLife Coach about meals, workouts, recovery, or hydration..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={loading}
            maxLength={500}
            className="input py-3 px-4 pr-12 text-xs sm:text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !inputMessage.trim()}
          className="btn-primary p-3 rounded-xl disabled:opacity-50 shrink-0"
          title="Send message"
        >
          <Send size={18} />
        </button>
      </form>

      {/* Non-medical Disclaimer Footer */}
      <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400 text-center shrink-0">
        <HeartPulse size={12} className="text-gray-400 shrink-0" />
        <span>FitLife Coach provides lifestyle education only. Not intended for disease diagnosis, clinical treatment, or prescriptions.</span>
      </div>
    </div>
  );
}
