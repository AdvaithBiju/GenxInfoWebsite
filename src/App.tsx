import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Scene3D from "./Scene3D";

type Article = {
  tag: string;
  title: string;
  meta: string;
  hot: boolean;
  summary: string;
  source: string;
};

const scenes = [
  {
    id: "sports",
    label: "SPORTS",
    title: "Sports Arena",
    subtitle: "Live Scores & Highlights",
    accent: "#FF3B30",
    bg: "#0A0A0A",
    skyColor: "#1a0a0a",
    groundColor: "#1a0505",
    buildingColor: "#2a0808",
    accentLight: "#FF6B60",
    icon: "⚡",
    description:
      "From football and Formula 1 to basketball and tennis, stay on top of the biggest moments as they happen.",
    articles: [
      {
        tag: "LIVE",
        title: "Lakers vs Celtics — OT Thriller",
        meta: "NBA · 2 min ago",
        hot: true,
        summary:
          "An intense overtime battle turned into one of the wildest matchups of the week, with momentum swinging every few possessions.",
        source: "GenX Sports Desk",
      },
      {
        tag: "FINAL",
        title: "Man City clinch Premier League title",
        meta: "Football · 1 hr ago",
        hot: false,
        summary:
          "Manchester City sealed the title after a dominant run of form, showcasing control, depth, and consistency across the season.",
        source: "GenX Football",
      },
      {
        tag: "BREAKING",
        title: "Djokovic wins record 25th Grand Slam",
        meta: "Tennis · 3 hr ago",
        hot: true,
        summary:
          "Another milestone in an already historic career as Djokovic adds yet another major to his legacy.",
        source: "GenX Court Report",
      },
    ],
  },
  {
    id: "racing",
    label: "MOTORS",
    title: "Racetrack",
    subtitle: "Speed & Performance",
    accent: "#B8BDC7",
    bg: "#050505",
    skyColor: "#08090B",
    groundColor: "#0A0A0C",
    buildingColor: "#111214",
    accentLight: "#E2E5EA",
    icon: "🏎",
    description:
      "Cars, motorsport, performance tech, launches, racing drama, and everything that fuels speed culture.",
    articles: [
      {
        tag: "RACE",
        title: "Verstappen takes pole at Monaco GP",
        meta: "F1 · 30 min ago",
        hot: true,
        summary:
          "Precision, pace, and a near-perfect lap helped secure pole on one of the tightest and most demanding circuits in the world.",
        source: "GenX Motors",
      },
      {
        tag: "UPDATE",
        title: "Ferrari unveil revolutionary new engine",
        meta: "F1 Tech · 2 hr ago",
        hot: false,
        summary:
          "The team’s newest power unit hints at aggressive innovation, aiming for greater efficiency and stronger race-day performance.",
        source: "GenX Paddock",
      },
      {
        tag: "CRASH",
        title: "Safety car deployed — lap 34 incident",
        meta: "NASCAR · 4 hr ago",
        hot: true,
        summary:
          "A dramatic incident reshaped the race order and opened the door for strategic chaos in the closing stages.",
        source: "GenX Race Control",
      },
    ],
  },
  {
    id: "tech",
    label: "TECH",
    title: "Futuristic City",
    subtitle: "Innovation & Startups",
    accent: "#00C7FF",
    bg: "#000814",
    skyColor: "#000d1a",
    groundColor: "#000a14",
    buildingColor: "#001428",
    accentLight: "#40D9FF",
    icon: "◈",
    description:
      "AI, startups, gadgets, space, future tech, and the internet stories actually worth your attention.",
    articles: [
      {
        tag: "AI",
        title: "OpenAI announces GPT-5 with reasoning leaps",
        meta: "AI · 15 min ago",
        hot: true,
        summary:
          "The latest model pushes deeper reasoning, faster tool use, and stronger real-world usefulness across workflows.",
        source: "GenX AI Watch",
      },
      {
        tag: "FUNDING",
        title: "Fusion startup raises $2.3B Series D",
        meta: "Energy · 1 hr ago",
        hot: false,
        summary:
          "One of the biggest energy funding rounds in recent memory signals confidence in breakthrough power technologies.",
        source: "GenX Ventures",
      },
      {
        tag: "LAUNCH",
        title: "SpaceX Starship completes orbital flight",
        meta: "Space · 5 hr ago",
        hot: true,
        summary:
          "The latest mission marks another major step in long-term reusable spaceflight ambitions.",
        source: "GenX Spacefeed",
      },
    ],
  },
  {
    id: "trending",
    label: "TRENDING",
    title: "Social Square",
    subtitle: "What the World is Talking About",
    accent: "#BF5AF2",
    bg: "#080014",
    skyColor: "#0d0019",
    groundColor: "#0a0014",
    buildingColor: "#140028",
    accentLight: "#D070FF",
    icon: "✦",
    description:
      "Viral stories, internet moments, social buzz, crypto chatter, memes, creator culture, and what’s exploding online.",
    articles: [
      {
        tag: "VIRAL",
        title: "This video hit 100M views in 6 hours",
        meta: "Social · Just now",
        hot: true,
        summary:
          "A short-form clip crossed 100 million views at record speed, showing just how fast attention moves online.",
        source: "GenX Social",
      },
      {
        tag: "TREND",
        title: "#ClimateWalk trends globally with 40M posts",
        meta: "Twitter · 45 min ago",
        hot: false,
        summary:
          "A social movement around climate action surged into global trending territory as creators and communities joined in.",
        source: "GenX Internet Desk",
      },
      {
        tag: "BITCOIN",
        title: "Bitcoin dominates global trend charts again",
        meta: "Crypto · 2 hr ago",
        hot: true,
        summary:
          "Bitcoin has taken over timelines again as price moves, memes, and macro conversations collide into one giant trend wave.",
        source: "GenX TrendWire",
      },
    ],
  },
] as const;

const PARTICLE_COUNT = 30;
type Scene = (typeof scenes)[number];

function useParticles() {
  const [particles, setParticles] = useState(() =>
    Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      speed: Math.random() * 0.3 + 0.1,
      opacity: Math.random() * 0.45 + 0.12,
    }))
  );

  useEffect(() => {
    let frame = 0;

    const tick = () => {
      setParticles((prev) =>
        prev.map((p) => ({
          ...p,
          x: (p.x - p.speed * 0.35 + 100) % 100,
          y: (p.y - p.speed * 0.12 + 100) % 100,
        }))
      );
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return particles;
}

function SceneSky({ scene }: { scene: Scene }) {
  const particles = useParticles();

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `linear-gradient(180deg, ${scene.skyColor} 0%, ${scene.bg} 58%, ${scene.groundColor} 100%)`,
        overflow: "hidden",
      }}
    >
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: scene.accent,
            opacity: p.opacity,
            boxShadow: `0 0 ${p.size * 3}px ${scene.accent}`,
            transition: "background 0.8s ease",
          }}
        />
      ))}

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.02) 0%, transparent 18%, transparent 82%, rgba(0,0,0,0.4) 100%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          bottom: "32%",
          left: 0,
          right: 0,
          height: 140,
          background: `radial-gradient(ellipse 80% 60% at 50% 100%, ${scene.accent}18, transparent)`,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "40%",
          background: `linear-gradient(180deg, transparent, ${scene.groundColor})`,
        }}
      />
    </div>
  );
}

function WindowFrame({ accent }: { accent: string }) {
  return (
    <>
      {[
        { top: 0, left: 0, borderTop: `3px solid ${accent}`, borderLeft: `3px solid ${accent}` },
        { top: 0, right: 0, borderTop: `3px solid ${accent}`, borderRight: `3px solid ${accent}` },
        { bottom: 0, left: 0, borderBottom: `3px solid ${accent}`, borderLeft: `3px solid ${accent}` },
        { bottom: 0, right: 0, borderBottom: `3px solid ${accent}`, borderRight: `3px solid ${accent}` },
      ].map((style, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: 40,
            height: 40,
            ...style,
            pointerEvents: "none",
            zIndex: 30,
            transition: "border-color 0.8s ease",
          }}
        />
      ))}

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.035) 3px, rgba(0,0,0,0.035) 4px)",
          pointerEvents: "none",
          zIndex: 25,
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, rgba(0,0,0,0.72) 100%)",
          pointerEvents: "none",
          zIndex: 24,
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "40%",
          background: "linear-gradient(180deg, rgba(255,255,255,0.02) 0%, transparent 100%)",
          pointerEvents: "none",
          zIndex: 26,
        }}
      />
    </>
  );
}

function ArticleCard({
  article,
  accent,
  delay,
  onClick,
}: {
  article: Article;
  accent: string;
  delay: number;
  onClick?: () => void;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div
      onClick={onClick}
      style={{
        background: "rgba(0,0,0,0.64)",
        backdropFilter: "blur(12px)",
        border: `0.5px solid ${accent}33`,
        borderRadius: 10,
        padding: "12px 16px",
        cursor: "pointer",
        transition: "all 0.35s ease, opacity 0.5s ease, transform 0.5s ease",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(0,0,0,0.84)";
        e.currentTarget.style.borderColor = accent + "88";
        e.currentTarget.style.transform = "translateY(-2px) scale(1.01)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "rgba(0,0,0,0.64)";
        e.currentTarget.style.borderColor = accent + "33";
        e.currentTarget.style.transform = "translateY(0) scale(1)";
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 2,
          background: article.hot ? accent : accent + "44",
          boxShadow: article.hot ? `0 0 8px ${accent}` : "none",
        }}
      />

      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
        <span
          style={{
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: "0.12em",
            color: article.hot ? accent : "#ffffff88",
            background: article.hot ? accent + "18" : "transparent",
            padding: "2px 6px",
            borderRadius: 3,
            border: `0.5px solid ${article.hot ? accent + "44" : "transparent"}`,
            fontFamily: "monospace",
          }}
        >
          {article.tag}
        </span>

        {article.hot && (
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: accent,
              boxShadow: `0 0 8px ${accent}`,
              animation: "pulse 1.5s ease infinite",
            }}
          />
        )}
      </div>

      <div
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: "#ffffff",
          lineHeight: 1.4,
          marginBottom: 6,
          fontFamily: "'Georgia', serif",
        }}
      >
        {article.title}
      </div>

      <div
        style={{
          fontSize: 11,
          color: "#ffffff55",
          fontFamily: "monospace",
          letterSpacing: "0.05em",
        }}
      >
        {article.meta}
      </div>
    </div>
  );
}

function SceneContent({
  scene,
  active,
  onOpenArticle,
}: {
  scene: Scene;
  active: boolean;
  onOpenArticle: (article: Article, scene: Scene) => void;
}) {
  const [articlesKey, setArticlesKey] = useState(0);

  useEffect(() => {
    if (active) setArticlesKey((k) => k + 1);
  }, [active]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        alignItems: "flex-end",  
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        padding: "120px 36px 32px 36px",
        zIndex: 20,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 28,
          left: 36,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: active ? scene.accent : scene.accent + "44",
            boxShadow: active ? `0 0 12px ${scene.accent}` : "none",
            transition: "all 0.5s ease",
          }}
        />
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.25em",
            color: scene.accent,
            fontFamily: "monospace",
            opacity: active ? 1 : 0.4,
            transition: "opacity 0.5s ease",
          }}
        >
          {scene.label}
        </span>
      </div>

      <div
        style={{
          marginBottom: 16,
          opacity: active ? 1 : 0,
          transform: active ? "none" : "translateY(20px)",
          transition: "all 0.6s ease 0.1s",
          maxWidth: 560,
        }}
      >
        <div
          style={{
            fontSize: 11,
            color: scene.accent,
            letterSpacing: "0.2em",
            fontFamily: "monospace",
            marginBottom: 4,
            opacity: 0.85,
          }}
        >
          {scene.icon} NOW PASSING
        </div>

        <div
          style={{
            fontSize: 32,
            fontWeight: 800,
            color: "#ffffff",
            lineHeight: 1.1,
            fontFamily: "'Georgia', serif",
            textShadow: `0 0 40px ${scene.accent}22`,
          }}
        >
          {scene.title}
        </div>

        <div
          style={{
            fontSize: 13,
            color: scene.accent + "cc",
            fontFamily: "monospace",
            letterSpacing: "0.08em",
            marginTop: 4,
          }}
        >
          {scene.subtitle}
        </div>

        <p
          style={{
            marginTop: 12,
            color: "#ffffffbb",
            fontSize: 14,
            lineHeight: 1.6,
            maxWidth: 500,
          }}
        >
          {scene.description}
        </p>
      </div>

      <div
        key={articlesKey}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
         maxWidth: 360,
        }}
      >
        {scene.articles.map((a, i) => (
          <ArticleCard
            key={i}
            article={a}
            accent={scene.accent}
            delay={i * 120 + 200}
            onClick={() => onOpenArticle(a, scene)}
          />
        ))}
      </div>
    </div>
  );
}

function NavDot({
  scene,
  active,
  onClick,
}: {
  scene: Scene;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: "6px 4px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        opacity: active ? 1 : 0.4,
        transition: "all 0.3s ease",
      }}
    >
      <div
        style={{
          width: active ? 24 : 6,
          height: 6,
          borderRadius: 3,
          background: active ? scene.accent : "#ffffff88",
          boxShadow: active ? `0 0 8px ${scene.accent}` : "none",
          transition: "all 0.3s ease",
        }}
      />
      <span
        style={{
          fontSize: 8,
          color: active ? scene.accent : "#ffffff55",
          fontFamily: "monospace",
          letterSpacing: "0.1em",
          transition: "color 0.3s ease",
        }}
      >
        {scene.label}
      </span>
    </button>
  );
}

function SpeedLines({ accent }: { accent: string }) {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 5 }}>
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: `${10 + i * 10}%`,
            left: 0,
            right: 0,
            height: 1,
            background: `linear-gradient(90deg, transparent 0%, ${accent}${i % 2 === 0 ? "14" : "08"} 40%, ${accent}05 70%, transparent 100%)`,
            animation: `speedLine ${1.5 + i * 0.2}s linear infinite`,
            animationDelay: `${i * 0.18}s`,
          }}
        />
      ))}
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
  accent,
}: {
  eyebrow: string;
  title: string;
  description: string;
  accent?: string;
}) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div
        style={{
          fontSize: 11,
          color: accent || "#7dd3fc",
          letterSpacing: "0.22em",
          fontFamily: "monospace",
          marginBottom: 8,
        }}
      >
        {eyebrow}
      </div>
      <h2
        style={{
          fontSize: "clamp(28px, 4vw, 44px)",
          lineHeight: 1.05,
          color: "#fff",
          margin: 0,
          fontFamily: "'Georgia', serif",
        }}
      >
        {title}
      </h2>
      <p
        style={{
          color: "#cfcfcf",
          maxWidth: 760,
          lineHeight: 1.7,
          fontSize: 15,
          marginTop: 12,
        }}
      >
        {description}
      </p>
    </div>
  );
}

export default function MetroNewsWebsite() {
  const [activeScene, setActiveScene] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [dragStart, setDragStart] = useState<number | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<{
    article: Article;
    scene: Scene;
  } | null>(null);

  const heroRef = useRef<HTMLDivElement | null>(null);
  const scene = scenes[activeScene];

  const allArticles = useMemo(
    () =>
      scenes.flatMap((s) =>
        s.articles.map((article) => ({
          ...article,
          sceneId: s.id,
          sceneLabel: s.label,
          sceneAccent: s.accent,
          sceneTitle: s.title,
        }))
      ),
    []
  );

  const goTo = useCallback(
    (idx: number) => {
      if (idx === activeScene || isTransitioning) return;

      setIsTransitioning(true);
      setScrollProgress(idx > activeScene ? 1 : -1);

      setTimeout(() => {
        setActiveScene(idx);
        setScrollProgress(0);
        setTimeout(() => setIsTransitioning(false), 50);
      }, 400);
    },
    [activeScene, isTransitioning]
  );

  const next = useCallback(() => goTo(Math.min(scenes.length - 1, activeScene + 1)), [activeScene, goTo]);
  const prev = useCallback(() => goTo(Math.max(0, activeScene - 1)), [activeScene, goTo]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "Escape") setSelectedArticle(null);
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [next, prev]);

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      const el = heroRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const insideHero = rect.top <= 0 && rect.bottom >= 0;

      if (!insideHero) return;

      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        if (e.deltaY > 30) next();
        else if (e.deltaY < -30) prev();
      }
    },
    [next, prev]
  );

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setDragStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (dragStart === null) return;

    const delta = dragStart - e.changedTouches[0].clientX;
    if (delta > 60) next();
    else if (delta < -60) prev();

    setDragStart(null);
  };

  const scrollX = scrollProgress * 120;

  const openArticle = (article: Article, scene: Scene) => {
    setSelectedArticle({ article, scene });
  };

  return (
    <div
      style={{
        background: "#020202",
        minHeight: "100vh",
        color: "#fff",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <style>{`
        html { scroll-behavior: smooth; }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }

        @keyframes speedLine {
          0% { transform: translateX(-100%); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateX(100%); opacity: 0; }
        }

        @keyframes flicker {
          0%, 100% { opacity: 1; }
          92% { opacity: 1; }
          93% { opacity: 0.6; }
          94% { opacity: 1; }
          96% { opacity: 0.8; }
          97% { opacity: 1; }
        }

        @keyframes tickerScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        @keyframes floatY {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
      `}</style>

      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 120,
          backdropFilter: "blur(18px)",
          background: "rgba(0,0,0,0.55)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "14px 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 18,
            flexWrap: "wrap",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 800,
                letterSpacing: "0.05em",
                fontFamily: "'Georgia', serif",
              }}
            >
              GENXINFO
            </div>
            <div
              style={{
                fontSize: 9,
                color: scene.accent,
                letterSpacing: "0.34em",
                fontFamily: "monospace",
              }}
            >
              NEWS FOR THE NEXT WAVE
            </div>
          </div>

          <nav
            style={{
              display: "flex",
              gap: 14,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            {["hero", "featured", "categories", "about", "download"].map((item) => (
              <a
                key={item}
                href={`#${item}`}
                style={{
                  color: "#ddd",
                  textDecoration: "none",
                  fontSize: 13,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  fontFamily: "monospace",
                }}
              >
                {item}
              </a>
            ))}

            <a
              href="#download"
              style={{
                textDecoration: "none",
                padding: "10px 14px",
                borderRadius: 999,
                background: scene.accent,
                color: "#000",
                fontWeight: 800,
                fontSize: 12,
                letterSpacing: "0.06em",
              }}
            >
              GET APP
            </a>
          </nav>
        </div>
      </header>

      <section
        id="hero"
        ref={heroRef}
        style={{
          width: "100%",
          height: "100vh",
          minHeight: 640,
          background: "#000",
          overflow: "hidden",
          position: "relative",
          userSelect: "none",
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            opacity: isTransitioning ? 0.3 : 1,
            transform: isTransitioning ? `translateX(${scrollX < 0 ? 80 : -80}px) scale(0.97)` : "none",
            transition: isTransitioning ? "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)" : "none",
            overflow: "hidden",
          }}
        >
          <SceneSky scene={scene} />
          <div style={{ position: "absolute", inset: 0, zIndex: 2 }}>
  <Scene3D sceneId={scene.id as "sports" | "racing" | "tech" | "trending"} accent={scene.accent} />
</div>
          <SpeedLines accent={scene.accent} />
          <WindowFrame accent={scene.accent} />
          <SceneContent scene={scene} active={!isTransitioning} onOpenArticle={openArticle} />
        </div>

        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            padding: "20px 36px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            zIndex: 50,
            pointerEvents: "none",
          }}
        >
          <div
  style={{
    pointerEvents: "auto",
    maxWidth: 420,
    position: "relative",
    zIndex: 60,
  }}
>
            <div
  style={{
    fontSize: "clamp(32px, 5vw, 64px)",
    fontWeight: 800,
    color: "#ffffff",
    letterSpacing: "-0.03em",
    fontFamily: "'Georgia', serif",
    lineHeight: 0.9,
    marginTop: 52,
    maxWidth: 380,
  }}
>
              A website that
              <br />
              feels alive.
            </div>

          <p
  style={{
    color: "#e6e6e6",
    lineHeight: 1.65,
    maxWidth: 390,
    fontSize: 14,
    marginTop: 16,
  }}
>
              GenXInfo is where fast-moving stories in sports, motors, tech, and culture become a
              cinematic browsing experience instead of a boring list of links.
            </p>

            <div
              style={{
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
                marginTop: 18,
                pointerEvents: "auto",
              }}
            >
              <a
                href="#featured"
                style={{
                  textDecoration: "none",
                  background: scene.accent,
                  color: "#000",
                  padding: "12px 18px",
                  borderRadius: 999,
                  fontWeight: 800,
                  fontSize: 13,
                }}
              >
                EXPLORE STORIES
              </a>

              <a
                href="#download"
                style={{
                  textDecoration: "none",
                  border: `1px solid ${scene.accent}66`,
                  color: "#fff",
                  padding: "12px 18px",
                  borderRadius: 999,
                  fontWeight: 700,
                  fontSize: 13,
                  background: "rgba(0,0,0,0.35)",
                }}
              >
                DOWNLOAD THE APP
              </a>
            </div>
          </div>

          <div
            style={{
              fontSize: 10,
              color: "#ffffff33",
              fontFamily: "monospace",
              textAlign: "right",
              pointerEvents: "none",
              animation: "flicker 8s ease infinite",
              marginTop: 12,
            }}
          >
            <div style={{ color: scene.accent + "99", marginBottom: 2 }}>
              {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </div>
            <div>STOP {activeScene + 1}/{scenes.length}</div>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 64,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: 8,
            zIndex: 50,
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(12px)",
            padding: "8px 16px",
            borderRadius: 20,
            border: "0.5px solid rgba(255,255,255,0.08)",
          }}
        >
          {scenes.map((s, i) => (
            <NavDot key={s.id} scene={s} active={i === activeScene} onClick={() => goTo(i)} />
          ))}
        </div>

        {activeScene > 0 && (
          <button
            onClick={prev}
            style={{
              position: "absolute",
              left: 16,
              top: "50%",
              transform: "translateY(-50%)",
              background: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(12px)",
              border: `0.5px solid ${scene.accent}33`,
              borderRadius: "50%",
              width: 44,
              height: 44,
              cursor: "pointer",
              color: scene.accent,
              fontSize: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 50,
              transition: "all 0.3s ease",
            }}
          >
            ‹
          </button>
        )}

        {activeScene < scenes.length - 1 && (
          <button
            onClick={next}
            style={{
              position: "absolute",
              right: 16,
              top: "50%",
              transform: "translateY(-50%)",
              background: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(12px)",
              border: `0.5px solid ${scene.accent}33`,
              borderRadius: "50%",
              width: 44,
              height: 44,
              cursor: "pointer",
              color: scene.accent,
              fontSize: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 50,
              transition: "all 0.3s ease",
            }}
          >
            ›
          </button>
        )}

        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 30,
            background: scene.accent,
            transition: "background 0.8s ease",
            display: "flex",
            alignItems: "center",
            overflow: "hidden",
            zIndex: 50,
          }}
        >
          <div
            style={{
              whiteSpace: "nowrap",
              display: "flex",
              gap: 60,
              fontSize: 11,
              fontWeight: 700,
              color: "#000",
              letterSpacing: "0.08em",
              fontFamily: "monospace",
              animation: "tickerScroll 20s linear infinite",
            }}
          >
            {[...Array(4)].map((_, r) =>
              scenes.map((s) =>
                s.articles.map((a, j) => (
                  <span key={`${r}-${s.id}-${j}`}>
                    [{s.label}] {a.title} &nbsp;&nbsp;&nbsp;
                  </span>
                ))
              )
            )}
          </div>
        </div>
      </section>

      <main>
        <section
          id="featured"
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "90px 20px 40px",
          }}
        >
          <SectionHeading
            eyebrow="FEATURED STORIES"
            title="The website’s job is to help people browse, discover, and stay."
            description="This section makes GenXInfo feel like a real destination on the web, not just an app clone. It shows your strongest stories in a clean, shareable layout."
            accent={scene.accent}
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 18,
            }}
          >
            {allArticles.slice(0, 8).map((article, index) => (
              <div
                key={index}
                onClick={() =>
                  setSelectedArticle({
                    article,
                    scene: scenes.find((s) => s.id === article.sceneId)!,
                  })
                }
                style={{
                  background: "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
                  border: `1px solid ${article.sceneAccent}33`,
                  borderRadius: 20,
                  padding: 20,
                  cursor: "pointer",
                  transition: "transform 0.25s ease, border-color 0.25s ease",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
                }}
              >
                <div
                  style={{
                    height: 160,
                    borderRadius: 16,
                    marginBottom: 16,
                    background: `radial-gradient(circle at 30% 20%, ${article.sceneAccent}55, transparent 35%), linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.01))`,
                    border: "1px solid rgba(255,255,255,0.06)",
                    display: "flex",
                    alignItems: "flex-end",
                    padding: 16,
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 14,
                      right: 14,
                      fontSize: 11,
                      fontFamily: "monospace",
                      color: article.sceneAccent,
                      background: article.sceneAccent + "18",
                      border: `1px solid ${article.sceneAccent}44`,
                      padding: "4px 8px",
                      borderRadius: 999,
                    }}
                  >
                    {article.sceneLabel}
                  </div>

                  <div
                    style={{
                      fontSize: 34,
                      opacity: 0.95,
                      animation: "floatY 3s ease-in-out infinite",
                    }}
                  >
                    {article.sceneId === "sports"
                      ? "🏆"
                      : article.sceneId === "racing"
                      ? "🏎"
                      : article.sceneId === "tech"
                      ? "◈"
                      : "₿"}
                  </div>
                </div>

                <div
                  style={{
                    fontSize: 11,
                    color: article.sceneAccent,
                    letterSpacing: "0.14em",
                    fontFamily: "monospace",
                    marginBottom: 8,
                  }}
                >
                  {article.tag}
                </div>

                <h3
                  style={{
                    margin: 0,
                    fontSize: 22,
                    lineHeight: 1.15,
                    fontFamily: "'Georgia', serif",
                  }}
                >
                  {article.title}
                </h3>

                <p
                  style={{
                    color: "#cfcfcf",
                    lineHeight: 1.65,
                    marginTop: 12,
                    marginBottom: 12,
                    fontSize: 14,
                  }}
                >
                  {article.summary}
                </p>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    color: "#8f8f8f",
                    fontSize: 12,
                    fontFamily: "monospace",
                  }}
                >
                  <span>{article.meta}</span>
                  <span>Read story →</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section
          id="categories"
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "40px 20px 40px",
          }}
        >
          <SectionHeading
            eyebrow="BROWSE CATEGORIES"
            title="A website should help users jump directly into what they care about."
            description="Instead of only swiping like the app, the website should let users enter categories quickly, scan highlights, and open stories with less friction."
            accent="#a78bfa"
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: 18,
            }}
          >
            {scenes.map((s, i) => (
              <div
                key={s.id}
                onClick={() => {
                  setActiveScene(i);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                style={{
                  borderRadius: 22,
                  padding: 22,
                  cursor: "pointer",
                  background: `linear-gradient(180deg, ${s.bg}, rgba(255,255,255,0.02))`,
                  border: `1px solid ${s.accent}33`,
                  minHeight: 220,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: -40,
                    right: -20,
                    width: 120,
                    height: 120,
                    borderRadius: "50%",
                    background: `${s.accent}18`,
                    filter: "blur(8px)",
                  }}
                />

                <div
                  style={{
                    fontSize: 12,
                    color: s.accent,
                    letterSpacing: "0.14em",
                    fontFamily: "monospace",
                    marginBottom: 10,
                  }}
                >
                  {s.label}
                </div>

                <h3
                  style={{
                    margin: 0,
                    fontSize: 26,
                    fontFamily: "'Georgia', serif",
                    marginBottom: 12,
                  }}
                >
                  {s.title}
                </h3>

                <p
                  style={{
                    color: "#d5d5d5",
                    lineHeight: 1.7,
                    fontSize: 14,
                    marginBottom: 14,
                  }}
                >
                  {s.description}
                </p>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  {s.articles.map((a, j) => (
                    <div
                      key={j}
                      style={{
                        fontSize: 13,
                        color: "#fff",
                        padding: "10px 12px",
                        borderRadius: 12,
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.05)",
                      }}
                    >
                      {a.title}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section
          id="about"
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "40px 20px 40px",
          }}
        >
          <SectionHeading
            eyebrow="WHY THIS WEBSITE EXISTS"
            title="The app is for fast consumption. The website is for discovery, trust, and depth."
            description="This is the difference you were asking about. The site should not copy the app. It should support the app."
            accent="#34d399"
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 18,
            }}
          >
            {[
              {
                title: "Discoverability",
                text: "A website can rank on search, be shared by link, and become the public face of GenXInfo.",
              },
              {
                title: "Browse + Read",
                text: "Users can scan categories, compare stories, and stay longer than they would inside a swipe-only interface.",
              },
              {
                title: "Branding",
                text: "This gives GenXInfo a stronger identity with a homepage, sections, footer, and a more professional presence.",
              },
              {
                title: "App Funnel",
                text: "The website should constantly guide visitors into downloading the app for the full immersive experience.",
              },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  borderRadius: 22,
                  padding: 24,
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <h3
                  style={{
                    marginTop: 0,
                    marginBottom: 10,
                    fontSize: 22,
                    fontFamily: "'Georgia', serif",
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    margin: 0,
                    color: "#cfcfcf",
                    lineHeight: 1.75,
                    fontSize: 14,
                  }}
                >
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section
          id="download"
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "40px 20px 100px",
          }}
        >
          <div
            style={{
              borderRadius: 30,
              padding: "34px 26px",
              background: `linear-gradient(135deg, ${scene.accent}22, rgba(255,255,255,0.03))`,
              border: `1px solid ${scene.accent}33`,
              display: "grid",
              gridTemplateColumns: "1.3fr 0.9fr",
              gap: 20,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 11,
                  color: scene.accent,
                  letterSpacing: "0.18em",
                  fontFamily: "monospace",
                  marginBottom: 10,
                }}
              >
                DOWNLOAD THE APP
              </div>

              <h2
                style={{
                  margin: 0,
                  fontSize: "clamp(30px, 4vw, 48px)",
                  fontFamily: "'Georgia', serif",
                  lineHeight: 1.05,
                }}
              >
                Let the website attract people.
                <br />
                Let the app keep them coming back.
              </h2>

              <p
                style={{
                  color: "#d7d7d7",
                  lineHeight: 1.75,
                  maxWidth: 640,
                  marginTop: 14,
                  fontSize: 15,
                }}
              >
                This is the best split for GenXInfo. The website builds discovery, brand, and
                trust. The app delivers the fast, immersive, Gen Z-first experience.
              </p>

              <div
                style={{
                  display: "flex",
                  gap: 12,
                  flexWrap: "wrap",
                  marginTop: 18,
                }}
              >
                <button
                  style={{
                    background: scene.accent,
                    color: "#000",
                    border: "none",
                    borderRadius: 999,
                    padding: "13px 18px",
                    fontWeight: 800,
                    cursor: "pointer",
                  }}
                >
                  Google Play
                </button>

                <button
                  style={{
                    background: "transparent",
                    color: "#fff",
                    border: "1px solid rgba(255,255,255,0.14)",
                    borderRadius: 999,
                    padding: "13px 18px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Join Waitlist
                </button>
              </div>
            </div>

            <div
              style={{
                borderRadius: 24,
                background: "rgba(0,0,0,0.35)",
                border: "1px solid rgba(255,255,255,0.08)",
                minHeight: 260,
                padding: 18,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  color: scene.accent,
                  fontFamily: "monospace",
                  letterSpacing: "0.12em",
                }}
              >
                GENXINFO APP
              </div>

              <div
                style={{
                  borderRadius: 20,
                  border: "1px solid rgba(255,255,255,0.06)",
                  background: "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
                  padding: 18,
                }}
              >
                <div style={{ fontSize: 12, color: "#8f8f8f", marginBottom: 10 }}>Inside the app</div>
                <div style={{ display: "grid", gap: 10 }}>
                  {[
                    "Vertical swipe feed",
                    "Fast category switching",
                    "Bookmarks / likes",
                    "Push alerts later",
                    "Gen Z visual experience",
                  ].map((item, i) => (
                    <div
                      key={i}
                      style={{
                        padding: "10px 12px",
                        borderRadius: 12,
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.05)",
                        fontSize: 14,
                      }}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div
                style={{
                  fontSize: 12,
                  color: "#8f8f8f",
                  fontFamily: "monospace",
                  marginTop: 12,
                }}
              >
                Website = discovery • App = retention
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          padding: "26px 20px 40px",
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            gap: 20,
            flexWrap: "wrap",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 800,
                fontFamily: "'Georgia', serif",
              }}
            >
              GENXINFO
            </div>
            <div
              style={{
                fontSize: 11,
                color: "#8d8d8d",
                marginTop: 8,
                maxWidth: 420,
                lineHeight: 1.7,
              }}
            >
              News, culture, tech, motors, and momentum — shaped into a web experience that feels
              cinematic and modern.
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: 24,
              flexWrap: "wrap",
              alignItems: "flex-start",
            }}
          >
            {["About", "Contact", "Privacy Policy", "Terms", "Download App"].map((item) => (
              <a
                key={item}
                href="#"
                style={{
                  color: "#d0d0d0",
                  textDecoration: "none",
                  fontSize: 13,
                }}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </footer>

      {selectedArticle && (
        <div
          onClick={() => setSelectedArticle(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.72)",
            backdropFilter: "blur(10px)",
            zIndex: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "min(760px, 100%)",
              borderRadius: 24,
              overflow: "hidden",
              background: "#0a0a0a",
              border: `1px solid ${selectedArticle.scene.accent}33`,
              boxShadow: "0 30px 80px rgba(0,0,0,0.45)",
            }}
          >
            <div
              style={{
                padding: "18px 20px",
                background: `linear-gradient(135deg, ${selectedArticle.scene.accent}20, rgba(255,255,255,0.02))`,
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                alignItems: "flex-start",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 11,
                    color: selectedArticle.scene.accent,
                    fontFamily: "monospace",
                    letterSpacing: "0.15em",
                    marginBottom: 8,
                  }}
                >
                  {selectedArticle.scene.label} • {selectedArticle.article.tag}
                </div>
                <h3
                  style={{
                    margin: 0,
                    fontSize: 30,
                    lineHeight: 1.1,
                    fontFamily: "'Georgia', serif",
                  }}
                >
                  {selectedArticle.article.title}
                </h3>
              </div>

              <button
                onClick={() => setSelectedArticle(null)}
                style={{
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "#fff",
                  borderRadius: 999,
                  width: 36,
                  height: 36,
                  cursor: "pointer",
                  fontSize: 18,
                }}
              >
                ×
              </button>
            </div>

            <div style={{ padding: 20 }}>
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  flexWrap: "wrap",
                  marginBottom: 16,
                  fontFamily: "monospace",
                  color: "#8f8f8f",
                  fontSize: 12,
                }}
              >
                <span>{selectedArticle.article.meta}</span>
                <span>•</span>
                <span>{selectedArticle.article.source}</span>
              </div>

              <p
                style={{
                  color: "#dfdfdf",
                  lineHeight: 1.85,
                  fontSize: 15,
                  marginTop: 0,
                }}
              >
                {selectedArticle.article.summary}
              </p>

              <p
                style={{
                  color: "#bebebe",
                  lineHeight: 1.85,
                  fontSize: 15,
                }}
              >
                This is where you would later connect your real article page, news API, CMS, or
                database-backed story detail view. Right now this modal gives your website a more
                complete editorial feel without needing full routing yet.
              </p>

              <div
                style={{
                  marginTop: 18,
                  display: "flex",
                  gap: 12,
                  flexWrap: "wrap",
                }}
              >
                <button
                  style={{
                    background: selectedArticle.scene.accent,
                    color: "#000",
                    border: "none",
                    borderRadius: 999,
                    padding: "12px 16px",
                    fontWeight: 800,
                    cursor: "pointer",
                  }}
                >
                  Open full article
                </button>

                <button
                  style={{
                    background: "transparent",
                    color: "#fff",
                    border: "1px solid rgba(255,255,255,0.14)",
                    borderRadius: 999,
                    padding: "12px 16px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Share story
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}