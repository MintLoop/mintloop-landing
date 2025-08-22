import { useEffect, useMemo, useState } from "react";

type Shard = { id: number; x: number; y: number; r: number; d: number };

export default function MintyClicker() {
  const TARGET = 10;                   // clicks to unlock Cat’s Out
  const [count, setCount] = useState(0);
  const [justPopped, setJustPopped] = useState(false);
  const [burst, setBurst] = useState<Shard[]>([]);

  // load/save clicks locally
  useEffect(() => {
    const saved = Number(localStorage.getItem("minty_clicks") || 0);
    if (!Number.isNaN(saved)) setCount(saved);
  }, []);
  useEffect(() => {
    localStorage.setItem("minty_clicks", String(count));
  }, [count]);

  // simple “confetti” shards (CSS only, no deps)
  const makeBurst = () => {
    const shards: Shard[] = Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: 40 + Math.random() * 20,
      r: Math.random() * 360,
      d: 6 + Math.random() * 10, // duration
    }));
    setBurst(shards);
    setTimeout(() => setBurst([]), 11000); // clean after animation
  };

  const pct = Math.min(100, Math.round((count / TARGET) * 100));
  const unlocked = count >= TARGET;

  const handleClick = () => {
    setCount((c) => c + 1);
    setJustPopped(true);
    makeBurst();
    setTimeout(() => setJustPopped(false), 250);
  };

  const reset = () => {
    localStorage.removeItem("minty_clicks");
    setCount(0);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border p-6 text-white"
         style={{ borderColor: "var(--stroke)", background: "var(--card)" }}>
      <div className="mb-4 flex items-center gap-3">
        <span className="inline-grid h-10 w-10 place-items-center rounded-xl bg-brand/20">
          🪙
        </span>
        <div>
          <h3 className="text-lg font-semibold">$MINTY Clicker</h3>
          <p className="text-sm text-zinc-300">Pop to fill the meter. Unlock Cat’s Out at {TARGET}.</p>
        </div>
      </div>

      {/* meter */}
      <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-zinc-800">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, backgroundColor: "var(--brand-500)" }}
        />
      </div>
      <div className="mb-5 text-sm text-zinc-300">{count} / {TARGET} pops</div>

      {/* pop button */}
      <button
        onClick={handleClick}
        className={`w-full rounded-xl px-4 py-3 font-semibold text-black transition
                    ${justPopped ? "scale-[1.02]" : ""}`}
        style={{ backgroundColor: "var(--brand-500)" }}
      >
        Pop $MINTY
      </button>

      {/* actions */}
      <div className="mt-3 flex flex-wrap items-center gap-3">
        {!unlocked ? (
          <span className="text-xs text-zinc-400">Keep popping to unlock Cat’s Out…</span>
        ) : (
          <a
            href="/mintlabs/catsout"
            className="rounded-lg border px-3 py-1.5 text-sm"
            style={{ color: "var(--brand-500)", borderColor: "color-mix(in oklab, var(--brand-500) 45%, white)" }}
          >
            🎉 Cat’s Out unlocked → Play teaser
          </a>
        )}
        <button onClick={reset} className="text-xs text-zinc-500 hover:text-zinc-300">Reset</button>
      </div>

      {/* confetti shards */}
      <div className="pointer-events-none absolute inset-0">
        {burst.map((s) => (
          <span
            key={s.id}
            className="absolute block h-2 w-2 rounded-[2px]"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              backgroundColor: "var(--brand-500)",
              transform: `rotate(${s.r}deg)`,
              animation: `mintyFall ${s.d}s linear forwards`,
              opacity: 0.9,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes mintyFall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(200%) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
