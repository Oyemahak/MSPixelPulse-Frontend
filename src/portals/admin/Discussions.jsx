// src/portals/dev/Direct.jsx

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Link,
  useLocation,
  useParams,
} from "react-router-dom";

import {
  directory,
  dm,
} from "@/lib/api.js";

import { useAuth } from "@/context/AuthContext.jsx";
import SearchField from "@/components/ui/SearchField.jsx";
import PresenceIndicator from "@/components/portal/PresenceIndicator.jsx";
import { formatMessageTime } from "@/lib/messageTime.js";

export default function Direct() {
  const { user } = useAuth();

  const { peerId } =
    useParams();

  const { state } =
    useLocation();

  const [people, setPeople] =
    useState([]);

  const [q, setQ] =
    useState("");

  const [peer, setPeer] =
    useState(null);

  const [threadId, setThreadId] =
    useState("");

  const [msgs, setMsgs] =
    useState([]);

  const [text, setText] =
    useState("");

  const [sending, setSending] =
    useState(false);

  const [sendError, setSendError] =
    useState("");

  const boxRef =
    useRef(null);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const data =
          await directory.list();

        if (!alive) return;

        setPeople(
          (
            data.users || []
          ).filter(
            (person) =>
              String(
                person._id,
              ) !==
              String(
                user?._id,
              ),
          ),
        );
      } catch {
        if (alive) {
          setPeople([]);
        }
      }
    })();

    return () => {
      alive = false;
    };
  }, [user?._id]);

  useEffect(() => {
    let alive = true;

    (async () => {
      setMsgs([]);
      setThreadId("");
      setSendError("");

      if (!peerId) {
        setPeer(null);
        return;
      }

      const found =
        people.find(
          (person) =>
            String(
              person._id,
            ) ===
            String(
              peerId,
            ),
        ) ||
        (
          state?.peerEmail
            ? {
                _id:
                  peerId,

                name:
                  state.peerName,

                email:
                  state.peerEmail,

                lastSeenAt:
                  state.peerLastSeenAt,

                presence:
                  state.peerPresence,
              }
            : null
        );

      if (!found) {
        setPeer(null);
        return;
      }

      setPeer(found);

      try {
        const opened =
          await dm.open(
            found._id,
          );

        if (!alive) return;

        setThreadId(
          opened.threadId,
        );

        const response =
          await dm.get(
            opened.threadId,
          );

        if (!alive) return;

        setMsgs(
          response.messages ||
            [],
        );

        window.setTimeout(
          () =>
            boxRef.current?.scrollTo({
              top:
                999999,

              behavior:
                "smooth",
            }),
          0,
        );
      } catch (error) {
        if (!alive) return;

        setSendError(
          error?.message ||
            "Conversation could not be loaded.",
        );
      }
    })();

    return () => {
      alive = false;
    };
  }, [
    peerId,
    people,
    state?.peerEmail,
    state?.peerName,
    state?.peerLastSeenAt,
    state?.peerPresence,
  ]);

  async function send() {
    if (
      !text.trim() ||
      !threadId ||
      sending
    ) {
      return;
    }

    setSending(true);
    setSendError("");

    try {
      const { message } =
        await dm.send(
          threadId,
          {
            text:
              text.trim(),

            attachments: [],
          },
        );

      setMsgs(
        (previous) => [
          ...previous,
          message,
        ],
      );

      setText("");

      window.setTimeout(
        () =>
          boxRef.current?.scrollTo({
            top:
              999999,

            behavior:
              "smooth",
          }),
        0,
      );
    } catch (error) {
      setSendError(
        error?.message ||
          "Message could not be sent.",
      );
    } finally {
      setSending(false);
    }
  }

  const filtered =
    useMemo(() => {
      const needle =
        q.trim().toLowerCase();

      return people.filter(
        (person) =>
          !needle ||
          `${person.name} ${person.email} ${person.role}`
            .toLowerCase()
            .includes(
              needle,
            ),
      );
    }, [people, q]);

  return (
    <div className="page-shell grid gap-5 md:grid-cols-[320px_1fr]">
      <div>
        <div className="card-surface p-4 mb-3">
          <div className="card-title mb-2">
            People
          </div>

          <SearchField
            label="Search people"
            placeholder="Search people"
            value={q}
            onValueChange={setQ}
          />
        </div>

        <div className="card-surface">
          <div className="list">
            {filtered.map(
              (person) => (
                <Link
                  key={
                    person._id
                  }
                  to={`/dev/direct/${person._id}`}
                  state={{
                    peerEmail:
                      person.email,

                    peerName:
                      person.name,

                    peerLastSeenAt:
                      person.lastSeenAt,

                    peerPresence:
                      person.presence,
                  }}
                  className={`block px-4 py-3 hover:bg-white/5 ${
                    peerId ===
                    person._id
                      ? "bg-white/10"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="font-semibold line-clamp-1">
                      {person.name ||
                        "—"}
                    </div>
                  </div>

                  <div className="row-sub">
                    {person.email} ·{" "}
                    <span className="capitalize">
                      {
                        person.role
                      }
                    </span>
                  </div>

                  <div className="mt-1">
                    <PresenceIndicator
                      user={person}
                    />
                  </div>
                </Link>
              ),
            )}

            {!filtered.length && (
              <div className="empty-cell">
                No users.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card-surface flex flex-col h-[70vh]">
        <div className="card-strip">
          <div>
            <div className="card-title">
              {peer
                ? peer.name ||
                  peer.email ||
                  "Direct"
                : "Direct"}
            </div>

            {peer && (
              <div className="mt-1">
                <PresenceIndicator
                  user={peer}
                />
              </div>
            )}
          </div>
        </div>

        <div
          ref={boxRef}
          className="flex-1 overflow-y-auto p-4 space-y-3"
        >
          {!peer && (
            <div className="empty-note">
              Pick someone on the left.
            </div>
          )}

          {peer &&
            !msgs.length && (
              <div className="empty-note">
                No messages yet.
              </div>
            )}

          {msgs.map(
            (message) => {
              const mine =
                String(
                  message.author,
                ) ===
                String(
                  user?._id,
                );

              return (
                <div
                  key={
                    message._id ||
                    message.id
                  }
                  className={`flex ${
                    mine
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                      mine
                        ? "bg-primary text-white"
                        : "bg-white/10"
                    }`}
                  >
                    {!mine &&
                      message.authorNameAtSend && (
                        <div className="text-xs text-white/60 mb-0.5">
                          {
                            message.authorNameAtSend
                          }
                        </div>
                      )}

                    <div className="whitespace-pre-wrap break-words">
                      {
                        message.text
                      }
                    </div>

                    <div className="text-[10px] opacity-70 mt-1">
                      {formatMessageTime(
                        message,
                      )}
                    </div>
                  </div>
                </div>
              );
            },
          )}
        </div>

        <div className="border-t border-white/10 p-3">
          {sendError && (
            <div
              className="text-error mb-2"
              role="alert"
            >
              {sendError}
            </div>
          )}

          <div className="flex gap-2">
            <input
              className="form-input flex-1"
              placeholder="Message…"
              value={text}
              onChange={(event) =>
                setText(
                  event.target
                    .value,
                )
              }
              onKeyDown={(event) => {
                if (
                  event.key ===
                    "Enter" &&
                  !event.shiftKey
                ) {
                  event.preventDefault();
                  send();
                }
              }}
              disabled={
                !threadId ||
                sending
              }
            />

            <button
              className="btn btn-primary"
              onClick={send}
              disabled={
                !threadId ||
                !text.trim() ||
                sending
              }
            >
              {sending
                ? "Sending..."
                : "Send"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
