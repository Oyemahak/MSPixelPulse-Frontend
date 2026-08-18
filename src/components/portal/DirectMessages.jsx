import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { LuMessageSquare, LuRefreshCw, LuSend } from "react-icons/lu";

import PresenceIndicator from "@/components/portal/PresenceIndicator.jsx";
import SearchField from "@/components/ui/SearchField.jsx";
import { useAuth } from "@/context/AuthContext.jsx";
import { directory, dm } from "@/lib/api.js";
import { formatLocalDateTime, formatMessageTime } from "@/lib/messageTime.js";

function initials(person) {
  return String(person?.name || person?.email || "MS")
    .split(/[ @._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "MS";
}

function peerIdFromThread(thread, currentUserId) {
  return String(
    thread?.peer?._id ||
    (thread?.participants || []).find((id) => String(id) !== String(currentUserId)) ||
    "",
  );
}

function ContactAvatar({ person }) {
  const [failed, setFailed] = useState(false);

  return (
    <span className="direct-avatar" aria-hidden="true">
      {person?.avatarUrl && !failed ? (
        <img src={person.avatarUrl} alt="" onError={() => setFailed(true)} />
      ) : initials(person)}
    </span>
  );
}

export default function DirectMessages() {
  const { user, role } = useAuth();
  const { peerId = "" } = useParams();
  const [contacts, setContacts] = useState([]);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [threadId, setThreadId] = useState("");
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const messageBoxRef = useRef(null);

  const portalBase = role === "admin" ? "/admin" : role === "developer" ? "/dev" : "/client";

  const loadContacts = useCallback(async () => {
    setLoadingContacts(true);
    setError("");

    try {
      const [directoryData, threadData] = await Promise.all([
        directory.list(),
        dm.threads(),
      ]);
      const threads = threadData.threads || [];
      const threadsByPeer = new Map(
        threads.map((thread) => [peerIdFromThread(thread, user?._id), thread]),
      );
      const people = (directoryData.users || [])
        .filter((person) => String(person._id) !== String(user?._id))
        .map((person) => ({
          ...person,
          thread: threadsByPeer.get(String(person._id)) || null,
        }))
        .sort((left, right) => {
          const leftTime = new Date(left.thread?.lastMessageAt || 0).getTime();
          const rightTime = new Date(right.thread?.lastMessageAt || 0).getTime();
          return rightTime - leftTime || String(left.name || left.email).localeCompare(String(right.name || right.email));
        });

      setContacts(people);
    } catch (requestError) {
      setError(requestError?.message || "Authorized contacts could not be loaded.");
      setContacts([]);
    } finally {
      setLoadingContacts(false);
    }
  }, [user?._id]);

  useEffect(() => { void loadContacts(); }, [loadContacts]);

  const selected = useMemo(
    () => contacts.find((person) => String(person._id) === String(peerId)) || null,
    [contacts, peerId],
  );

  useEffect(() => {
    let active = true;

    async function loadConversation() {
      setMessages([]);
      setThreadId("");
      setText("");

      if (!peerId || loadingContacts) return;
      if (!selected) {
        setError("This conversation is not available for your current project access.");
        return;
      }

      setLoadingMessages(true);
      setError("");

      try {
        const resolvedThreadId = selected.thread?._id || (await dm.open(selected._id)).threadId;
        const response = await dm.get(resolvedThreadId);

        if (!active) return;
        setThreadId(String(resolvedThreadId));
        setMessages(response.messages || []);
        window.setTimeout(() => messageBoxRef.current?.scrollTo({ top: messageBoxRef.current.scrollHeight }), 0);
      } catch (requestError) {
        if (active) setError(requestError?.message || "Conversation could not be loaded.");
      } finally {
        if (active) setLoadingMessages(false);
      }
    }

    void loadConversation();
    return () => { active = false; };
  }, [loadingContacts, peerId, selected]);

  const roles = useMemo(
    () => Array.from(new Set(contacts.map((person) => person.role).filter(Boolean))).sort(),
    [contacts],
  );

  const visibleContacts = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return contacts.filter((person) => (
      (!roleFilter || person.role === roleFilter) &&
      (!needle || `${person.name || ""} ${person.email || ""} ${person.roleLabel || person.role || ""} ${person.thread?.latestMessagePreview || ""}`.toLowerCase().includes(needle))
    ));
  }, [contacts, query, roleFilter]);

  async function sendMessage() {
    const clean = text.trim();
    if (!clean || !threadId || sending) return;

    setSending(true);
    setError("");

    try {
      const response = await dm.send(threadId, { text: clean, attachments: [] });
      const message = response.message;
      setMessages((current) => [...current, message]);
      setText("");
      setContacts((current) => current.map((person) => (
        String(person._id) === String(selected?._id)
          ? {
              ...person,
              thread: {
                ...(person.thread || {}),
                _id: threadId,
                lastMessageAt: message.sentAt,
                latestMessagePreview: message.text,
                latestMessageAuthor: user?._id,
              },
            }
          : person
      )));
      window.setTimeout(() => messageBoxRef.current?.scrollTo({ top: messageBoxRef.current.scrollHeight, behavior: "smooth" }), 0);
    } catch (requestError) {
      setError(requestError?.message || "Message could not be sent.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="page-shell direct-messages-layout">
      <aside className="direct-contacts-panel" aria-label="Authorized direct message contacts">
        <div className="direct-contacts-head">
          <div>
            <div className="text-muted-xs">Private one-to-one conversations</div>
            <h2 className="page-title">Direct messages</h2>
          </div>
          <button type="button" className="portal-icon-button" onClick={loadContacts} disabled={loadingContacts} aria-label="Refresh conversations" title="Refresh conversations">
            <LuRefreshCw className={loadingContacts ? "h-4 w-4 animate-spin" : "h-4 w-4"} aria-hidden="true" />
          </button>
        </div>

        <div className="direct-contact-filters">
          <SearchField label="Search conversations" placeholder="Search conversations" value={query} onValueChange={setQuery} />
          {roles.length > 1 ? (
            <label className="form-field">
              <span className="sr-only">Filter conversations by role</span>
              <select value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)} aria-label="Filter conversations by role">
                <option value="">All roles</option>
                {roles.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </label>
          ) : null}
        </div>

        <div className="direct-contact-list">
          {visibleContacts.map((person) => {
            const active = String(peerId) === String(person._id);
            const preview = person.thread?.latestMessagePreview || "Start a private conversation";
            return (
              <Link
                key={person._id}
                to={`${portalBase}/messages/${person._id}`}
                className={active ? "direct-contact-row is-active" : "direct-contact-row"}
              >
                <ContactAvatar person={person} />
                <span className="direct-contact-copy">
                  <span className="direct-contact-name-row">
                    <strong>{person.name || person.email}</strong>
                    <span>{formatLocalDateTime(person.thread?.lastMessageAt, "")}</span>
                  </span>
                  <span className="direct-contact-meta">{person.roleLabel || person.role}</span>
                  <span className="direct-contact-preview">{preview}</span>
                  <PresenceIndicator user={person} />
                </span>
              </Link>
            );
          })}
          {loadingContacts ? <div className="empty-cell">Loading authorized contacts…</div> : null}
          {!loadingContacts && !visibleContacts.length ? <div className="empty-cell">No authorized contacts match these filters.</div> : null}
        </div>
      </aside>

      <section className="direct-conversation-panel" aria-label="Direct message conversation">
        <header className="direct-conversation-head">
          {selected ? (
            <>
              <ContactAvatar person={selected} />
              <div>
                <h3>{selected.name || selected.email}</h3>
                <div className="direct-contact-meta">{selected.roleLabel || selected.role}</div>
                <PresenceIndicator user={selected} />
              </div>
            </>
          ) : (
            <>
              <span className="direct-empty-icon"><LuMessageSquare aria-hidden="true" /></span>
              <div><h3>Select a conversation</h3><p>Choose an authorized contact to view saved messages.</p></div>
            </>
          )}
        </header>

        {error ? <div className="text-error direct-message-alert" role="alert">{error}</div> : null}

        <div ref={messageBoxRef} className="direct-message-scroll" aria-live="polite">
          {loadingMessages ? <div className="empty-note">Loading messages…</div> : null}
          {!loadingMessages && selected && !messages.length ? <div className="empty-note">No messages yet. Start the conversation below.</div> : null}
          {!selected ? <div className="direct-conversation-empty">Project-based permissions determine who appears in this list.</div> : null}
          {messages.map((message) => {
            const mine = String(message.author) === String(user?._id);
            return (
              <article key={message._id || message.id} className={mine ? "direct-message is-mine" : "direct-message"}>
                <div className="direct-message-bubble">
                  {!mine ? <div className="direct-message-author">{message.authorNameAtSend || selected?.name}</div> : null}
                  <p>{message.text}</p>
                  <time dateTime={message.sentAt || undefined}>{formatMessageTime(message)}</time>
                </div>
              </article>
            );
          })}
        </div>

        <div className="direct-composer">
          <label className="sr-only" htmlFor="direct-message-input">Message</label>
          <textarea
            id="direct-message-input"
            rows="2"
            value={text}
            onChange={(event) => setText(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                void sendMessage();
              }
            }}
            placeholder={selected ? `Message ${selected.name || selected.email}` : "Select a contact first"}
            disabled={!threadId || sending}
          />
          <button type="button" className="btn btn-primary" onClick={sendMessage} disabled={!threadId || !text.trim() || sending}>
            <LuSend className="h-4 w-4" aria-hidden="true" /> {sending ? "Sending…" : "Send"}
          </button>
        </div>
      </section>
    </div>
  );
}
