import { useEffect, useRef, useState } from "react";
import "./Leaderboard.css";

/**
 * Optional: pass a custom fetcher if you already wrote one.
 * Otherwise, this component will try GET /leaderboard and fall back to localStorage/mock.
 *
 * @param {Object} props
 * @param {boolean} props.open
 * @param {() => void} props.onClose
 * @param {() => Promise<{entries?: any[], leaderboard?: any[]}>>} [props.fetchLeaderboard]
 */
export default function LeaderboardModal({ open, onClose, fetchLeaderboard }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(open);
  const [error, setError] = useState("");
  const cardRef = useRef(null);

  // simple ordinal helper
  const ordinal = (n) => {
    const s = ["th", "st", "nd", "rd"], v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  // default fetcher if none provided
  const defaultFetch = async () => {
    // Try backend
    try {
      const res = await fetch("http://localhost:5000/leaderboard");
      if (res.ok) {
        const data = await res.json();
        // accept either { entries: [...] } or { leaderboard: [...] }
        const list = data.entries ?? data.leaderboard ?? [];
        if (Array.isArray(list)) return { entries: list };
      }
    } catch {
      // ignore; we'll fall back
    }
    // Fallback: localStorage or mock
    try {
      const local = JSON.parse(localStorage.getItem("tg.leaderboard") || "[]");
      if (Array.isArray(local) && local.length) {
        return { entries: local.map((u, i) => ({ ...u, rank: i + 1 })) };
      }
    } catch {}
    // Minimal mock so UI is never empty in dev
    const mock = Array.from({ length: 5 }, (_, i) => ({
      id: String(i + 1),
      displayName: `Explorer ${i + 1}`,
      wins: Math.floor(Math.random() * 10) + (5 - i),
      rank: i + 1,
    }));
    return { entries: mock };
  };

  // Fetch on open
  useEffect(() => {
    if (!open) return;
    let alive = true;
    setLoading(true);
    setError("");
    (fetchLeaderboard || defaultFetch)()
      .then((data) => {
        if (!alive) return;
        const list = data?.entries ?? data?.leaderboard ?? [];
        setRows(Array.isArray(list) ? list : []);
      })
      .catch(() => alive && setError("Unable to load leaderboard"))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [open, fetchLeaderboard]);

  // Close on ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose?.(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="lb-backdrop" onClick={onClose} role="presentation">
      <div
        className="lb-card"
        role="dialog"
        aria-modal="true"
        aria-label="Leaderboard"
        onClick={(e) => e.stopPropagation()}
        ref={cardRef}
      >
        <div className="lb-header">
          <h3 className="lb-title">🏆 Leaderboard</h3>
          <button className="lb-close" onClick={onClose} aria-label="Close">✖</button>
        </div>

        {loading && <p className="lb-status">Loading…</p>}
        {!loading && error && <p className="lb-error">{error}</p>}

        {!loading && !error && (
          rows.length === 0 ? (
            <p className="lb-empty">No entries yet — be the first!</p>
          ) : (
            <ol className="lb-list">
              {rows.map((r, i) => {
                const rank = r.rank ?? (i + 1);
                const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : null;
                const name = r.displayName || r.user || "Anonymous";
                const score = r.wins ?? r.score ?? 0;
                return (
                  <li key={r.id ?? `${name}-${i}`} className="lb-item">
                    <span className="lb-rank">{medal || ordinal(rank)}</span>
                    <span className="lb-name" title={name}>{name}</span>
                    <span className="lb-score">{score}</span>
                  </li>
                );
              })}
            </ol>
          )
        )}
      </div>
    </div>
  );
}
