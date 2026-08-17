// src/portals/dev/Discussions.jsx

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  files as fileApi,
  projects as api,
  rooms,
} from "@/lib/api.js";

import { useAuth } from "@/context/AuthContext.jsx";
import SearchField from "@/components/ui/SearchField.jsx";
import { formatMessageTime } from "@/lib/messageTime.js";

function Bubble({
  me,
  message,
}) {
  const mine =
    String(
      message.author,
    ) ===
    String(
      me?._id,
    );

  return (
    <div
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
        {!mine && (
          <div className="text-xs text-white/60 mb-0.5">
            {message.authorNameAtSend ||
              message.authorRoleAtSend ||
              "Portal user"}
          </div>
        )}

        {message.text && (
          <div className="whitespace-pre-wrap break-words">
            {message.text}
          </div>
        )}

        {(message.attachments || []).map(
          (attachment) => (
            <a
              key={
                attachment.path ||
                attachment.url ||
                attachment.name
              }
              className="mt-2 block underline underline-offset-2"
              href={
                attachment.url ||
                undefined
              }
              target="_blank"
              rel="noreferrer"
              download={
                attachment.name ||
                undefined
              }
            >
              {attachment.name ||
                "Download attachment"}
            </a>
          ),
        )}

        <div className="text-[10px] opacity-70 mt-1">
          {formatMessageTime(
            message,
          )}
        </div>
      </div>
    </div>
  );
}

export default function Discussions() {
  const { user } = useAuth();

  const nav =
    useNavigate();

  const { projectId } =
    useParams();

  const [rows, setRows] =
    useState([]);

  const [q, setQ] =
    useState("");

  const [curr, setCurr] =
    useState(
      projectId || "",
    );

  const [roomId, setRoomId] =
    useState("");

  const [msgs, setMsgs] =
    useState([]);

  const [text, setText] =
    useState("");

  const [
    pendingFiles,
    setPendingFiles,
  ] = useState([]);

  const [sending, setSending] =
    useState(false);

  const [sendError, setSendError] =
    useState("");

  const [loadError, setLoadError] =
    useState("");

  const listRef =
    useRef(null);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const data =
          await api.list();

        if (!alive) return;

        /*
         * Backend already enforces role/project access.
         * Keep an extra frontend filter for compatibility with
         * populated project responses.
         */
        const projects =
          data.projects || [];

        const assigned =
          projects.filter(
            (project) => {
              const developerId =
                project
                  .developer
                  ?._id ||
                project
                  .developerId ||
                project
                  .developer;

              return (
                !developerId ||
                String(
                  developerId,
                ) ===
                  String(
                    user?._id,
                  )
              );
            },
          );

        setRows(assigned);
      } catch (error) {
        if (alive) {
          setLoadError(
            error?.message ||
              "Projects could not be loaded.",
          );
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
      if (!curr) {
        setMsgs([]);
        setRoomId("");
        return;
      }

      setLoadError("");

      try {
        const response =
          await rooms.get(
            curr,
          );

        if (!alive) return;

        setRoomId(
          response.roomId,
        );

        setMsgs(
          response.messages ||
            [],
        );

        window.setTimeout(
          () =>
            listRef.current?.scrollTo({
              top:
                999999,

              behavior:
                "smooth",
            }),
          0,
        );
      } catch (error) {
        if (!alive) return;

        setRoomId("");
        setMsgs([]);

        setLoadError(
          error?.message ||
            "Project room could not be loaded.",
        );
      }
    })();

    return () => {
      alive = false;
    };
  }, [curr]);

  useEffect(() => {
    if (projectId) {
      setCurr(projectId);
    }
  }, [projectId]);

  const filtered =
    useMemo(() => {
      const needle =
        q.trim().toLowerCase();

      return rows.filter(
        (project) =>
          !needle ||
          `${project.title} ${project.summary}`
            .toLowerCase()
            .includes(
              needle,
            ),
      );
    }, [rows, q]);

  async function send() {
    if (
      (
        !text.trim() &&
        !pendingFiles.length
      ) ||
      !curr ||
      sending
    ) {
      return;
    }

    setSending(true);
    setSendError("");

    try {
      const uploaded =
        await Promise.all(
          pendingFiles.map(
            async (file) => {
              const result =
                await fileApi.upload(
                  file,
                  {
                    purpose:
                      "message",

                    projectId:
                      curr,
                  },
                );

              return result.file;
            },
          ),
        );

      const { message } =
        await rooms.send(
          curr,
          {
            text:
              text.trim(),

            attachments:
              uploaded,
          },
        );

      setMsgs(
        (previous) => [
          ...previous,
          message,
        ],
      );

      setText("");
      setPendingFiles([]);

      window.setTimeout(
        () =>
          listRef.current?.scrollTo({
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
    <div className="page-shell grid gap-5 md:grid-cols-[320px_1fr]">
      <div>
        <div className="card-surface p-4 mb-3">
          <div className="card-title mb-2">
            My Projects
          </div>

          <SearchField
            label="Search assigned project rooms"
            placeholder="Search project rooms"
            value={q}
            onValueChange={setQ}
          />
        </div>

        <div className="card-surface">
          <div className="list">
            {filtered.map(
              (project) => (
                <div
                  key={
                    project._id
                  }
                  className={`px-4 py-3 ${
                    curr ===
                    project._id
                      ? "bg-white/10"
                      : "hover:bg-white/5"
                  }`}
                >
                  <div className="font-semibold line-clamp-1">
                    <Link
                      to={`/dev/projects/${project._id}`}
                      className="row-link"
                    >
                      {
                        project.title
                      }
                    </Link>
                  </div>

                  {project.summary && (
                    <div className="row-sub line-clamp-1">
                      {
                        project.summary
                      }
                    </div>
                  )}

                  <div className="mt-2 flex gap-2">
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => {
                        setCurr(
                          project._id,
                        );

                        nav(
                          `/dev/discussions/${project._id}`,
                          {
                            replace:
                              true,
                          },
                        );
                      }}
                    >
                      Open room
                    </button>

                    <Link
                      className="btn btn-outline btn-sm"
                      to={`/dev/projects/${project._id}`}
                    >
                      Open project
                    </Link>
                  </div>
                </div>
              ),
            )}

            {!filtered.length && (
              <div className="empty-cell">
                No projects.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card-surface flex flex-col h-[70vh]">
        <div className="card-strip between">
          <div className="card-title">
            Room
          </div>

          {curr && (
            <Link
              className="subtle-link"
              to={`/dev/projects/${curr}`}
            >
              Open project
            </Link>
          )}
        </div>

        <div
          ref={listRef}
          className="flex-1 overflow-y-auto p-4 space-y-3"
        >
          {loadError && (
            <div
              className="text-error"
              role="alert"
            >
              {loadError}
            </div>
          )}

          {!curr && (
            <div className="empty-note">
              Pick a project on the left.
            </div>
          )}

          {curr &&
            !msgs.length && (
              <div className="empty-note">
                No messages yet.
              </div>
            )}

          {msgs.map(
            (message) => (
              <Bubble
                key={
                  message._id ||
                  message.id
                }
                me={user}
                message={message}
              />
            ),
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
              placeholder="Write a message…"
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
                !roomId ||
                sending
              }
            />

            <label className="btn btn-outline cursor-pointer">
              Attach

              <input
                className="sr-only"
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.txt,image/jpeg,image/png,image/webp"
                onChange={(event) =>
                  setPendingFiles(
                    Array.from(
                      event.target
                        .files ||
                        [],
                    ).slice(
                      0,
                      5,
                    ),
                  )
                }
                disabled={
                  !roomId ||
                  sending
                }
              />
            </label>

            <button
              className="btn btn-primary"
              onClick={send}
              disabled={
                !roomId ||
                (
                  !text.trim() &&
                  !pendingFiles.length
                ) ||
                sending
              }
            >
              {sending
                ? "Sending..."
                : "Send"}
            </button>
          </div>

          {pendingFiles.length >
          0 ? (
            <div className="text-muted-xs mt-2">
              {pendingFiles
                .map(
                  (file) =>
                    file.name,
                )
                .join(", ")}

              <button
                type="button"
                className="subtle-link ml-2"
                onClick={() =>
                  setPendingFiles(
                    [],
                  )
                }
              >
                Clear
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}