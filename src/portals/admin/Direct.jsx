// src/portals/admin/Direct.jsx

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useLocation,
  useParams,
} from "react-router-dom";

import {
  directory,
  dm,
} from "@/lib/api.js";

import { useAuth } from "@/context/AuthContext.jsx";
import PresenceIndicator from "@/components/portal/PresenceIndicator.jsx";
import { formatMessageTime } from "@/lib/messageTime.js";

export default function Direct() {
  const { user } = useAuth();

  const { peerId } =
    useParams();

  const { state } =
    useLocation();

  const [threadId, setThreadId] =
    useState("");

  const [peer, setPeer] =
    useState(null);

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
      if (!peerId) return;

      setSendError("");

      let resolvedPeer = {
        _id: peerId,

        name:
          state?.peerName ||
          "",

        email:
          state?.peerEmail ||
          "",

        lastSeenAt:
          state?.peerLastSeenAt ||
          "",

        presence:
          state?.peerPresence ||
          null,
      };

      try {
        const directoryData =
          await directory.list();

        const fresh =
          (
            directoryData.users ||
            []
          ).find(
            (candidate) =>
              String(
                candidate._id,
              ) ===
              String(
                peerId,
              ),
          );

        if (fresh) {
          resolvedPeer =
            fresh;
        }
      } catch {
        // Route state remains a safe UI fallback.
      }

      if (!alive) return;

      setPeer(
        resolvedPeer,
      );

      try {
        const opened =
          await dm.open(peerId);

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
        (messages) => [
          ...messages,
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

  return (
    <div className="page-shell space-y-4">
      <div className="page-header">
        <div>
          <h2 className="page-title">
            {peer
              ? peer.name ||
                peer.email
              : "Direct"}
          </h2>

          {peer && (
            <div className="mt-1">
              <PresenceIndicator
                user={peer}
              />
            </div>
          )}
        </div>

        <div />
      </div>

      <div className="card-surface flex flex-col h-[70vh]">
        <div
          ref={boxRef}
          className="flex-1 overflow-y-auto p-4 space-y-3"
        >
          {!msgs.length && (
            <div className="empty-note">
              No messages yet.
            </div>
          )}

          {msgs.map((message) => {
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
                      <div className="mb-0.5 text-xs text-white/60">
                        {
                          message.authorNameAtSend
                        }
                      </div>
                    )}

                  <div className="whitespace-pre-wrap break-words">
                    {message.text}
                  </div>

                  <div className="text-[10px] opacity-70 mt-1">
                    {formatMessageTime(
                      message,
                    )}
                  </div>
                </div>
              </div>
            );
          })}
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