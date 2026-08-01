import { useEffect, useRef, useState } from 'react';
import { aiAPI } from '../services/api';

const starterPrompts = [
  'आज मेरा focus कैसे बेहतर हो?',
  'Make a simple plan for my day',
  'Mujhe habit consistency improve karni hai',
];

export default function AICoach() {
  const [insights, setInsights] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const messagesRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [insightResponse, chatResponse] = await Promise.all([aiAPI.getInsights(), aiAPI.getChat()]);
        setInsights(insightResponse.data);
        setMessages(Array.isArray(chatResponse.data) ? chatResponse.data : []);
      } catch {
        setError('Could not load your coach history. Please refresh once.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const container = messagesRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages, sending]);

  const sendMessage = async (preset) => {
    const message = (preset ?? input).trim();
    if (!message || sending) return;

    const optimisticMessage = {
      id: `local-${Date.now()}`,
      role: 'user',
      message,
      created_at: new Date().toISOString(),
    };
    setMessages((current) => [...current, optimisticMessage]);
    setInput('');
    setError('');
    setSending(true);

    try {
      const response = await aiAPI.sendMessage({ message });
      setMessages((current) => [...current, response.data]);
    } catch (requestError) {
      setMessages((current) => current.filter((item) => item.id !== optimisticMessage.id));
      setError(requestError.response?.data?.message || 'Coach is unavailable right now. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="coach-page">
      <section className="coach-hero">
        <div className="coach-orb">✦</div>
        <div>
          <p className="coach-eyebrow">PROJECT RESTART · AI COACH</p>
          <h1>Your daily clarity, one chat away.</h1>
          <p>Ask in Hindi, Hinglish, or English. Your coach will reply in the same language.</p>
        </div>
      </section>

      <div className="coach-layout">
        <aside className="coach-side">
          <h2>This week</h2>
          {loading ? <p className="coach-muted">Loading insights…</p> : (
            <>
              <div className="coach-stat-grid">
                <div><strong>{insights?.stats?.study_hours || 0}h</strong><span>Study</span></div>
                <div><strong>{insights?.stats?.habit_completion || 0}%</strong><span>Habits</span></div>
                <div><strong>{insights?.stats?.streak || 0}</strong><span>Streak</span></div>
              </div>
              <div className="coach-insights">
                {(insights?.insights || []).slice(0, 3).map((insight, index) => <p key={index}>💡 {insight}</p>)}
                {(insights?.recommendations || []).slice(0, 2).map((recommendation, index) => <p key={`rec-${index}`}>🎯 {recommendation}</p>)}
              </div>
            </>
          )}
        </aside>

        <section className="coach-chat" aria-label="AI Coach chat">
          <div className="coach-chat-header">
            <div><span className="coach-online" /> Gemini Coach</div>
            <small>Hindi · Hinglish · English</small>
          </div>
          <div className="coach-messages" ref={messagesRef}>
            {!loading && messages.length === 0 && (
              <div className="coach-welcome">
                <span>✦</span><h2>What would you like to work on?</h2>
                <p>I can help you plan, focus, build habits, and review your progress.</p>
                <div className="coach-prompts">
                  {starterPrompts.map((prompt) => <button key={prompt} onClick={() => sendMessage(prompt)}>{prompt}</button>)}
                </div>
              </div>
            )}
            {messages.map((message) => (
              <article key={message.id || `${message.created_at}-${message.message}`} className={`coach-message ${message.role === 'user' ? 'coach-user' : 'coach-assistant'}`}>
                <span className="coach-avatar">{message.role === 'user' ? 'You' : '✦'}</span>
                <div><p>{message.message}</p><time>{message.created_at ? new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</time></div>
              </article>
            ))}
            {sending && <article className="coach-message coach-assistant"><span className="coach-avatar">✦</span><div className="coach-typing"><i /><i /><i /></div></article>}
          </div>
          {error && <p className="coach-error" role="alert">{error}</p>}
          <form className="coach-composer" onSubmit={(event) => { event.preventDefault(); sendMessage(); }}>
            <input value={input} onChange={(event) => setInput(event.target.value)} maxLength="4000" disabled={sending} placeholder="Apna question likhiye… / Ask anything…" aria-label="Message AI Coach" />
            <button type="submit" disabled={!input.trim() || sending}>{sending ? 'Thinking…' : 'Send ↑'}</button>
          </form>
        </section>
      </div>
    </div>
  );
}
