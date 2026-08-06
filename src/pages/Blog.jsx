import {
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion as Motion, useReducedMotion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  LuArrowRight,
  LuCheck,
  LuChevronDown,
  LuLayers3,
  LuSearch,
  LuSparkles,
} from "react-icons/lu";
import Meta from "@/components/Meta.jsx";
import BlogCard from "@/components/blog/BlogCard.jsx";
import Container from "@/components/layout/Container.jsx";
import { publishedBlogPosts } from "@/data/blogPosts.js";
import { seoPages } from "@/data/seoPages.js";

const POSTS_PER_BATCH = 12;
const MAX_SEARCH_SUGGESTIONS = 7;

const normalizedSearch = (value) => value.trim().toLowerCase();

const postMatchesQuery = (post, query) => {
  if (!query) return true;

  const haystack = [
    post.title,
    post.excerpt,
    post.pillar,
    post.category,
    ...(post.tags || []),
  ]
    .join(" ")
    .toLowerCase();

  return query.split(/\s+/).every((token) => haystack.includes(token));
};

const sortNewestFirst = (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt);

const sortSuggestionPosts = (a, b) => {
  const aRank = a.popularRank ?? Number.POSITIVE_INFINITY;
  const bRank = b.popularRank ?? Number.POSITIVE_INFINITY;

  return aRank - bRank || sortNewestFirst(a, b);
};

function useDismissablePopover(isOpen, containerRef, onDismiss) {
  useEffect(() => {
    if (!isOpen) return undefined;

    const handlePointerDown = (event) => {
      if (!containerRef.current?.contains(event.target)) onDismiss();
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [containerRef, isOpen, onDismiss]);
}

export default function Blog() {
  const prefersReducedMotion = useReducedMotion();
  const navigate = useNavigate();
  const [activePillar, setActivePillar] = useState("All");
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_BATCH);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchActiveIndex, setSearchActiveIndex] = useState(0);
  const [topicOpen, setTopicOpen] = useState(false);
  const [topicQuery, setTopicQuery] = useState("");
  const [topicActiveIndex, setTopicActiveIndex] = useState(0);
  const searchPickerRef = useRef(null);
  const topicPickerRef = useRef(null);
  const topicTriggerRef = useRef(null);
  const topicSearchRef = useRef(null);

  const pillars = useMemo(
    () => [
      "All",
      ...new Set(
        publishedBlogPosts
          .map((post) => post.pillar)
          .filter(Boolean)
          .sort((a, b) => a.localeCompare(b)),
      ),
    ],
    [],
  );

  const query = normalizedSearch(deferredSearch);
  const suggestionQuery = normalizedSearch(search);

  const filteredPosts = useMemo(
    () =>
      publishedBlogPosts
        .filter((post) => activePillar === "All" || post.pillar === activePillar)
        .filter((post) => postMatchesQuery(post, query))
        .sort(sortNewestFirst),
    [activePillar, query],
  );

  const searchSuggestions = useMemo(
    () =>
      publishedBlogPosts
        .filter((post) => activePillar === "All" || post.pillar === activePillar)
        .filter((post) => postMatchesQuery(post, suggestionQuery))
        .sort(suggestionQuery ? sortNewestFirst : sortSuggestionPosts)
        .slice(0, MAX_SEARCH_SUGGESTIONS),
    [activePillar, suggestionQuery],
  );

  const pillarOptions = useMemo(
    () =>
      pillars.map((pillar) => ({
        value: pillar,
        label: pillar === "All" ? "All Posts" : pillar,
        count:
          pillar === "All"
            ? publishedBlogPosts.length
            : publishedBlogPosts.filter((post) => post.pillar === pillar).length,
      })),
    [pillars],
  );

  const filteredPillarOptions = useMemo(() => {
    const topicSearch = normalizedSearch(topicQuery);
    if (!topicSearch) return pillarOptions;
    return pillarOptions.filter((option) =>
      option.label.toLowerCase().includes(topicSearch),
    );
  }, [pillarOptions, topicQuery]);

  useEffect(() => {
    setVisibleCount(POSTS_PER_BATCH);
  }, [activePillar, query]);

  useEffect(() => {
    setSearchActiveIndex(searchSuggestions.length > 0 ? 0 : -1);
  }, [searchSuggestions]);

  useEffect(() => {
    const selectedIndex = filteredPillarOptions.findIndex(
      (option) => option.value === activePillar,
    );
    setTopicActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
  }, [activePillar, filteredPillarOptions]);

  const dismissSearchPicker = useCallback(() => setSearchOpen(false), []);
  const dismissTopicPicker = useCallback(() => {
    setTopicOpen(false);
    setTopicQuery("");
  }, []);

  useDismissablePopover(searchOpen, searchPickerRef, dismissSearchPicker);
  useDismissablePopover(topicOpen, topicPickerRef, dismissTopicPicker);

  const visiblePosts = filteredPosts.slice(0, visibleCount);
  const remainingCount = Math.max(filteredPosts.length - visiblePosts.length, 0);
  const nextBatchSize = Math.min(POSTS_PER_BATCH, remainingCount);
  const activePillarOption = pillarOptions.find(
    (option) => option.value === activePillar,
  );
  const activePillarCount = activePillarOption?.count ?? publishedBlogPosts.length;

  const openTopicPicker = () => {
    setSearchOpen(false);
    setTopicOpen(true);
    setTopicQuery("");
    const selectedIndex = pillarOptions.findIndex(
      (option) => option.value === activePillar,
    );
    setTopicActiveIndex(Math.max(selectedIndex, 0));
    requestAnimationFrame(() => topicSearchRef.current?.focus());
  };

  const selectTopic = (pillar) => {
    setActivePillar(pillar);
    setTopicOpen(false);
    setTopicQuery("");
    requestAnimationFrame(() => topicTriggerRef.current?.focus());
  };

  const openSuggestion = (post) => {
    setSearchOpen(false);
    navigate(`/blog/${post.slug}`);
  };

  const handleSearchKeyDown = (event) => {
    if (event.key === "Escape") {
      setSearchOpen(false);
      return;
    }

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setSearchOpen(true);
      if (searchSuggestions.length === 0) return;
      const direction = event.key === "ArrowDown" ? 1 : -1;
      setSearchActiveIndex((current) => {
        const next = current < 0 ? 0 : current + direction;
        return (next + searchSuggestions.length) % searchSuggestions.length;
      });
      return;
    }

    if (event.key === "Enter" && searchOpen && searchActiveIndex >= 0) {
      const suggestion = searchSuggestions[searchActiveIndex];
      if (suggestion) {
        event.preventDefault();
        openSuggestion(suggestion);
      }
    }
  };

  const handleTopicSearchKeyDown = (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      setTopicOpen(false);
      setTopicQuery("");
      topicTriggerRef.current?.focus();
      return;
    }

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (filteredPillarOptions.length === 0) return;
      const direction = event.key === "ArrowDown" ? 1 : -1;
      setTopicActiveIndex((current) => {
        const next = current < 0 ? 0 : current + direction;
        return (next + filteredPillarOptions.length) % filteredPillarOptions.length;
      });
      return;
    }

    if (event.key === "Enter" && topicActiveIndex >= 0) {
      const option = filteredPillarOptions[topicActiveIndex];
      if (option) {
        event.preventDefault();
        selectTopic(option.value);
      }
    }
  };

  return (
    <div className="blog-page">
      <Meta {...seoPages.blog} />

      <section className="blog-index-section" aria-labelledby="blog-title">
        <Container>
          <header className="blog-index-header">
            <p className="blog-index-kicker">
              <LuSparkles aria-hidden="true" />
              MSPixelPulse insights
            </p>
            <h1 id="blog-title">Blog</h1>
            <p>
              Practical notes on websites, local SEO, accessible UX, AI search,
              content, and online growth for Canadian small businesses.
            </p>
          </header>

          <div className="blog-index-controls">
            <div
              className={`blog-search-picker${searchOpen ? " is-open" : ""}`}
              ref={searchPickerRef}
            >
              <div className="blog-index-search">
                <label className="blog-visually-hidden" htmlFor="blog-search">
                  Search blog posts
                </label>
                <LuSearch aria-hidden="true" />
                <input
                  id="blog-search"
                  type="search"
                  role="combobox"
                  aria-autocomplete="list"
                  aria-controls="blog-search-suggestions"
                  aria-expanded={searchOpen}
                  aria-activedescendant={
                    searchOpen && searchActiveIndex >= 0
                      ? `blog-search-option-${searchActiveIndex}`
                      : undefined
                  }
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setSearchOpen(true);
                  }}
                  onFocus={() => {
                    setTopicOpen(false);
                    setSearchOpen(true);
                  }}
                  onKeyDown={handleSearchKeyDown}
                  placeholder="Search blog posts..."
                  autoComplete="off"
                />
              </div>

              <AnimatePresence>
                {searchOpen ? (
                  <Motion.div
                    className="blog-control-popover blog-search-popover"
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 6 }}
                    transition={{ duration: prefersReducedMotion ? 0 : 0.18 }}
                  >
                    <div className="blog-control-popover-heading">
                      <span>{suggestionQuery ? "Matching guides" : "Suggested guides"}</span>
                      <small>{searchSuggestions.length} shown</small>
                    </div>
                    <div
                      id="blog-search-suggestions"
                      className="blog-search-suggestions"
                      role="listbox"
                      aria-label="Blog post suggestions"
                    >
                      {searchSuggestions.length > 0 ? (
                        searchSuggestions.map((post, index) => (
                          <button
                            id={`blog-search-option-${index}`}
                            key={post.slug}
                            type="button"
                            role="option"
                            tabIndex={-1}
                            aria-selected={searchActiveIndex === index}
                            className={`blog-search-option${
                              searchActiveIndex === index ? " is-active" : ""
                            }`}
                            onMouseEnter={() => setSearchActiveIndex(index)}
                            onMouseDown={(event) => event.preventDefault()}
                            onClick={() => openSuggestion(post)}
                          >
                            <span>
                              <strong>{post.title}</strong>
                              <small>
                                {post.pillar}
                                {post.tags?.length ? ` · ${post.tags.slice(0, 2).join(", ")}` : ""}
                              </small>
                            </span>
                            <LuArrowRight aria-hidden="true" />
                          </button>
                        ))
                      ) : (
                        <div className="blog-control-empty" role="status">
                          <LuSearch aria-hidden="true" />
                          <span>
                            <strong>No guide suggestions yet</strong>
                            <small>Try a broader phrase or browse the filtered posts below.</small>
                          </span>
                        </div>
                      )}
                    </div>
                  </Motion.div>
                ) : null}
              </AnimatePresence>
            </div>

            <div
              className={`blog-topic-picker${topicOpen ? " is-open" : ""}`}
              ref={topicPickerRef}
            >
              <button
                ref={topicTriggerRef}
                id="blog-topic-trigger"
                type="button"
                className="blog-topic-select"
                aria-haspopup="listbox"
                aria-controls="blog-topic-options"
                aria-expanded={topicOpen}
                onClick={() => {
                  if (topicOpen) {
                    setTopicOpen(false);
                    setTopicQuery("");
                  } else {
                    openTopicPicker();
                  }
                }}
                onKeyDown={(event) => {
                  if (!topicOpen && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
                    event.preventDefault();
                    openTopicPicker();
                  }
                }}
              >
                <span className="blog-topic-select-icon" aria-hidden="true">
                  <LuLayers3 />
                </span>
                <span className="blog-topic-select-copy">
                  <span className="blog-topic-label">Topic</span>
                  <span className="blog-topic-value">
                    {activePillarOption?.label || "All Posts"}
                  </span>
                </span>
                <span className="blog-topic-select-count" aria-hidden="true">
                  {activePillarCount}
                </span>
                <LuChevronDown
                  className="blog-topic-select-chevron"
                  aria-hidden="true"
                />
              </button>

              <AnimatePresence>
                {topicOpen ? (
                  <Motion.div
                    className="blog-control-popover blog-topic-popover"
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 6 }}
                    transition={{ duration: prefersReducedMotion ? 0 : 0.18 }}
                  >
                    <label htmlFor="blog-topic-search">Find a topic</label>
                    <div className="blog-topic-search-field">
                      <LuSearch aria-hidden="true" />
                      <input
                        ref={topicSearchRef}
                        id="blog-topic-search"
                        type="search"
                        role="combobox"
                        aria-autocomplete="list"
                        aria-controls="blog-topic-options"
                        aria-expanded="true"
                        aria-activedescendant={
                          filteredPillarOptions[topicActiveIndex]
                            ? `blog-topic-option-${filteredPillarOptions[topicActiveIndex].value.replace(/\s+/g, "-").toLowerCase()}`
                            : undefined
                        }
                        value={topicQuery}
                        onChange={(event) => setTopicQuery(event.target.value)}
                        onKeyDown={handleTopicSearchKeyDown}
                        placeholder={`Search ${pillarOptions.length - 1} topics...`}
                        autoComplete="off"
                      />
                    </div>

                    <div
                      id="blog-topic-options"
                      className="blog-topic-options"
                      role="listbox"
                      aria-label="Blog topics"
                    >
                      {filteredPillarOptions.length > 0 ? (
                        filteredPillarOptions.map((option, index) => {
                          const isSelected = option.value === activePillar;
                          const isActive = index === topicActiveIndex;
                          const optionId = `blog-topic-option-${option.value
                            .replace(/\s+/g, "-")
                            .toLowerCase()}`;

                          return (
                            <button
                              id={optionId}
                              key={option.value}
                              type="button"
                              role="option"
                              tabIndex={-1}
                              aria-selected={isSelected}
                              className={`blog-topic-option${isSelected ? " is-selected" : ""}${
                                isActive ? " is-active" : ""
                              }`}
                              onMouseEnter={() => setTopicActiveIndex(index)}
                              onMouseDown={(event) => event.preventDefault()}
                              onClick={() => selectTopic(option.value)}
                            >
                              <span>
                                <strong>{option.label}</strong>
                                <small>
                                  {option.count} {option.count === 1 ? "article" : "articles"}
                                </small>
                              </span>
                              <span className="blog-topic-option-icon" aria-hidden="true">
                                {isSelected ? <LuCheck /> : <LuArrowRight />}
                              </span>
                            </button>
                          );
                        })
                      ) : (
                        <div className="blog-control-empty" role="status">
                          <LuSearch aria-hidden="true" />
                          <span>
                            <strong>No matching topic</strong>
                            <small>Try a shorter topic name.</small>
                          </span>
                        </div>
                      )}
                    </div>
                  </Motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </div>

          <p className="blog-results-summary" role="status" aria-live="polite" aria-atomic="true">
            Showing {visiblePosts.length} of {filteredPosts.length}{" "}
            {filteredPosts.length === 1 ? "post" : "posts"}
            {search.trim() ? ` matching “${search.trim()}”` : ""}
          </p>

          {visiblePosts.length > 0 ? (
            <Motion.div layout className="blog-library-grid" id="blog-results">
              <AnimatePresence mode="popLayout" initial={false}>
                {visiblePosts.map((post, index) => (
                  <Motion.div
                    layout
                    key={post.slug}
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                    transition={{
                      duration: 0.24,
                      delay: prefersReducedMotion ? 0 : Math.min(index * 0.025, 0.15),
                    }}
                  >
                    <BlogCard post={post} eager={index < 3} />
                  </Motion.div>
                ))}
              </AnimatePresence>
            </Motion.div>
          ) : (
            <div className="blog-empty-state">
              <LuSearch aria-hidden="true" />
              <h2>No matching posts</h2>
              <p>Try a broader search or return to all topics.</p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  setSearch("");
                  setActivePillar("All");
                }}
              >
                Reset filters
              </button>
            </div>
          )}

          {remainingCount > 0 ? (
            <div className="blog-load-more">
              <button
                type="button"
                className="blog-load-more-button"
                aria-controls="blog-results"
                onClick={() => setVisibleCount((count) => count + POSTS_PER_BATCH)}
              >
                <span>View {nextBatchSize} more</span>
                <small>{remainingCount} remaining</small>
                <LuChevronDown aria-hidden="true" />
              </button>
            </div>
          ) : null}

          <aside className="blog-index-cta" aria-label="Free website demo">
            <span>
              <LuSparkles aria-hidden="true" />
              Put the ideas into practice
            </span>
            <div>
              <h2>Want a clearer direction for your own website?</h2>
              <p>See a personalized demo direction before choosing a paid build.</p>
            </div>
            <Link to="/free-demo?source=blog">
              Request a free website demo
              <LuArrowRight aria-hidden="true" />
            </Link>
          </aside>
        </Container>
      </section>
    </div>
  );
}
