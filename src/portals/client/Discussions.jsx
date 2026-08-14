import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { files as fileApi, portalErrorMessage, projects as api, rooms } from "@/lib/api.js";
import { useAuth } from "@/context/AuthContext.jsx";
import SearchField from "@/components/ui/SearchField.jsx";

function Bubble({ me, m }) {
  const mine = String(m.author) === String(me?._id);
  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${mine ? "bg-primary text-white" : "bg-white/10"}`}>
        {!mine && <div className="text-xs text-white/60 mb-0.5">{m.authorRoleAtSend}</div>}
        <div>{m.text}</div>
        {(m.attachments || []).map((attachment) => (
          <a
            key={attachment.path || attachment.url || attachment.name}
            className="mt-2 block underline underline-offset-2"
            href={attachment.url}
            target="_blank"
            rel="noreferrer"
            download={attachment.name || undefined}
          >
            {attachment.name || "Download attachment"}
          </a>
        ))}
        <div className="text-[10px] opacity-70 mt-1">{new Date(m.sentAt || m.ts).toLocaleString()}</div>
      </div>
    </div>
  );
}

export default function Discussions() {
  const { user } = useAuth();
  const nav = useNavigate();
  const { projectId } = useParams();

  const [rows, setRows] = useState([]);
  const [q, setQ] = useState("");
  const [curr, setCurr] = useState(projectId || "");
  const [roomId, setRoomId] = useState("");
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState("");
  const [pendingFiles, setPendingFiles] = useState([]);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const [loadError, setLoadError] = useState("");
  const listRef = useRef(null);

  // Client sees only their projects
  useEffect(() => {
    (async () => {
      try {
        const d = await api.list();
        setRows(d.projects || []);
      } catch (error) {
        setLoadError(portalErrorMessage(error, "project room"));
      }
    })();
  }, [user?._id]);

  // Load messages when project changes
  useEffect(() => {
    (async () => {
      if (!curr) { setMsgs([]); setRoomId(""); return; }
      setLoadError("");
      try {
        const { roomId: rid, messages } = await rooms.get(curr);
        setRoomId(rid);
        setMsgs(messages || []);
        setTimeout(() => listRef.current?.scrollTo({ top: 9e9, behavior: "smooth" }), 0);
      } catch (error) {
        setRoomId("");
        setMsgs([]);
        setLoadError(portalErrorMessage(error, "project room"));
      }
    })();
  }, [curr]);

  useEffect(() => { if (projectId) setCurr(projectId); }, [projectId]);

  const filtered = useMemo(() => {
    const n = q.trim().toLowerCase();
    return (rows || []).filter(p => !n || `${p.title} ${p.summary}`.toLowerCase().includes(n));
  }, [rows, q]);

  async function send() {
    if ((!text.trim() && !pendingFiles.length) || !curr || sending) return;
    setSending(true);
    setSendError("");
    try {
      const uploaded = await Promise.all(
        pendingFiles.map(async (file) => {
          const result = await fileApi.upload(file, { purpose: "message", projectId: curr });
          return result.file;
        })
      );
      const { message } = await rooms.send(curr, { text: text.trim(), attachments: uploaded });
      setMsgs(prev => [...prev, message]);
      setText("");
      setPendingFiles([]);
      setTimeout(() => listRef.current?.scrollTo({ top: 9e9, behavior: "smooth" }), 0);
    } catch (error) {
      setSendError(portalErrorMessage(error, "project room"));
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="page-shell grid gap-5 md:grid-cols-[320px_1fr]">
      <div>
        <div className="card-surface p-4 mb-3">
          <div className="card-title mb-2">My Projects</div>
          <SearchField
            label="Search your project rooms"
            placeholder="Search project rooms"
            value={q}
            onValueChange={setQ}
          />
        </div>
        <div className="card-surface">
          <div className="list">
            {filtered.map(p => (
              <button
                key={p._id}
                className={`w-full text-left px-4 py-3 hover:bg-white/5 ${curr===p._id ? "bg-white/10" : ""}`}
                onClick={() => { setCurr(p._id); nav(`/client/discussions/${p._id}`, { replace: true }); }}
              >
                <div className="font-semibold line-clamp-1">{p.title}</div>
                {p.summary && <div className="row-sub line-clamp-1">{p.summary}</div>}
              </button>
            ))}
            {!filtered.length && <div className="empty-cell">No projects.</div>}
          </div>
        </div>
      </div>

      <div className="card-surface flex flex-col h-[70vh]">
        <div className="card-strip between">
          <div className="card-title">Room</div>
          {curr && <Link className="subtle-link" to={`/client/projects/${curr}`}>Open project</Link>}
        </div>

        <div ref={listRef} className="flex-1 overflow-y-auto p-4 space-y-3">
          {loadError && <div className="text-error" role="alert">{loadError}</div>}
          {!curr && <div className="empty-note">Pick a project on the left.</div>}
          {curr && !msgs.length && <div className="empty-note">No messages yet.</div>}
          {msgs.map(m => <Bubble key={m._id || m.id} me={user} m={m} />)}
        </div>

        <div className="border-t border-white/10 p-3">
          {sendError && <div className="text-error mb-2" role="alert">{sendError}</div>}
          <div className="flex gap-2">
          <input
            className="form-input flex-1"
            placeholder="Write a message…"
            value={text}
            onChange={(e)=>setText(e.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                send();
              }
            }}
            disabled={!roomId || sending}
          />
          <label className="btn btn-outline cursor-pointer">
            Attach
            <input
              className="sr-only"
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.txt,image/jpeg,image/png,image/webp"
              onChange={(event) => setPendingFiles(Array.from(event.target.files || []).slice(0, 5))}
              disabled={!roomId || sending}
            />
          </label>
          <button className="btn btn-primary" onClick={send} disabled={!roomId || (!text.trim() && !pendingFiles.length) || sending}>{sending ? "Sending..." : "Send"}</button>
          </div>
          {pendingFiles.length ? (
            <div className="text-muted-xs mt-2">
              {pendingFiles.map((file) => file.name).join(", ")}
              <button type="button" className="subtle-link ml-2" onClick={() => setPendingFiles([])}>Clear</button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
