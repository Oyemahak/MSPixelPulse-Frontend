import { useCallback, useEffect, useMemo, useState } from "react";
import { portalErrorMessage, supportTickets } from "@/lib/api.js";

function formatDate(value) {
  return value ? new Date(value).toLocaleString() : "";
}

export default function Support() {
  const [tickets, setTickets] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [busy, setBusy] = useState(false);
  const [ok, setOk] = useState("");
  const [err, setErr] = useState("");

  const load = useCallback(async () => {
    try {
      const data = await supportTickets.list();
      setTickets(data.tickets || []);
      setErr("");
    } catch (error) {
      setErr(portalErrorMessage(error, "support request"));
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const selected = useMemo(
    () => tickets.find((ticket) => ticket._id === selectedId) || null,
    [selectedId, tickets]
  );

  async function create(event) {
    event.preventDefault();
    setErr("");
    setOk("");
    if (!subject.trim() || !message.trim()) {
      setErr("Please write a subject and a message.");
      return;
    }
    setBusy(true);
    try {
      const data = await supportTickets.create({ subject: subject.trim(), message: message.trim() });
      setSubject("");
      setMessage("");
      setSelectedId(data.ticket?._id || "");
      setOk("Support request created.");
      await load();
    } catch (error) {
      setErr(portalErrorMessage(error, "support request"));
    } finally {
      setBusy(false);
    }
  }

  async function sendReply() {
    if (!selected || !reply.trim() || busy) return;
    setBusy(true);
    setErr("");
    try {
      await supportTickets.reply(selected._id, reply.trim());
      setReply("");
      setOk("Reply saved.");
      await load();
    } catch (error) {
      setErr(portalErrorMessage(error, "support request"));
    } finally {
      setBusy(false);
    }
  }

  async function toggleStatus() {
    if (!selected || busy) return;
    const status = selected.status === "closed" ? "open" : "closed";
    setBusy(true);
    setErr("");
    try {
      await supportTickets.updateStatus(selected._id, status);
      setOk(status === "closed" ? "Support request closed." : "Support request reopened.");
      await load();
    } catch (error) {
      setErr(portalErrorMessage(error, "support request"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="page-shell space-y-6">
      <div className="page-header">
        <div>
          <h2 className="page-title">Support</h2>
          <div className="text-muted-xs">Requests and replies are saved to your portal account.</div>
        </div>
        <div />
      </div>

      {(ok || err) && (
        <div aria-live="polite">
          {ok ? <div className="text-success">{ok}</div> : null}
          {err ? <div className="text-error">{err}</div> : null}
        </div>
      )}

      <form className="card-surface p-4 space-y-4" onSubmit={create}>
        <div className="card-title">Create a support request</div>
        <label className="form-field">
          <div className="form-label">Subject</div>
          <input
            className="form-input"
            placeholder="Billing, project question, or technical issue"
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            maxLength={180}
            disabled={busy}
          />
        </label>
        <label className="form-field">
          <div className="form-label">Message</div>
          <textarea
            className="form-input min-h-[140px]"
            placeholder="Tell us what you need help with."
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            maxLength={5000}
            disabled={busy}
          />
        </label>
        <button type="submit" className="btn btn-primary" disabled={busy || !subject.trim() || !message.trim()}>
          {busy ? "Saving…" : "Create request"}
        </button>
      </form>

      <div className="grid gap-5 md:grid-cols-[320px_1fr]">
        <section className="card-surface overflow-hidden">
          <div className="card-strip"><div className="card-title">Your requests</div></div>
          <div className="list">
            {tickets.map((ticket) => (
              <button
                key={ticket._id}
                type="button"
                className={`w-full text-left px-4 py-3 hover:bg-white/5 ${selectedId === ticket._id ? "bg-white/10" : ""}`}
                onClick={() => setSelectedId(ticket._id)}
              >
                <div className="font-semibold line-clamp-1">{ticket.subject}</div>
                <div className="row-sub capitalize">{ticket.status.replace("_", " ")} · {formatDate(ticket.lastActivityAt)}</div>
              </button>
            ))}
            {!tickets.length ? <div className="empty-cell">No support requests yet.</div> : null}
          </div>
        </section>

        <section className="card-surface min-h-[360px] flex flex-col">
          {!selected ? (
            <div className="empty-cell">Select a request to view its saved conversation.</div>
          ) : (
            <>
              <div className="card-strip between">
                <div>
                  <div className="card-title">{selected.subject}</div>
                  <div className="row-sub capitalize">{selected.status.replace("_", " ")}</div>
                </div>
                <button type="button" className="btn btn-outline btn-sm" onClick={toggleStatus} disabled={busy}>
                  {selected.status === "closed" ? "Reopen" : "Close"}
                </button>
              </div>
              <div className="flex-1 p-4 space-y-3">
                {(selected.replies || []).map((item) => (
                  <div key={item._id || item.sentAt} className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <div className="between text-muted-xs">
                      <span>{item.authorNameAtSend || item.authorRoleAtSend}</span>
                      <span>{formatDate(item.sentAt)}</span>
                    </div>
                    <p className="mt-2 whitespace-pre-wrap">{item.body}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/10 p-3">
                <textarea
                  className="form-input min-h-[90px]"
                  placeholder="Write a reply"
                  value={reply}
                  onChange={(event) => setReply(event.target.value)}
                  maxLength={5000}
                  disabled={busy}
                />
                <button type="button" className="btn btn-primary mt-2" onClick={sendReply} disabled={busy || !reply.trim()}>
                  {busy ? "Saving…" : "Reply"}
                </button>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
