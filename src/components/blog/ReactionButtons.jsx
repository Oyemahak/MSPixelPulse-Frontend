import { LuThumbsDown, LuThumbsUp } from "react-icons/lu";

export default function ReactionButtons({ counts, viewerReaction, pending, onReact }) {
  const options = [
    { value: "like", label: "Like", count: counts.likes, Icon: LuThumbsUp },
    { value: "dislike", label: "Dislike", count: counts.dislikes, Icon: LuThumbsDown },
  ];

  return (
    <div className="blog-reaction-buttons" aria-label="Article reactions">
      {options.map((option) => {
        const { value, label, count } = option;
        const active = viewerReaction === value;
        return (
          <button
            key={value}
            type="button"
            className={active ? "blog-reaction-button is-active" : "blog-reaction-button"}
            onClick={() => onReact(value)}
            aria-pressed={active}
            aria-label={`${active ? `Remove ${label.toLowerCase()}` : label} from this article. ${count} total.`}
            disabled={pending}
          >
            <option.Icon aria-hidden="true" />
            <span>{label}</span>
            <strong aria-hidden="true">{count}</strong>
          </button>
        );
      })}
    </div>
  );
}
