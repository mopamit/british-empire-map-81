import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup, Marker } from "react-simple-maps";
import { geoCentroid } from "d3-geo";
import { heCountryName } from "@/lib/countries-he";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "התפשטות האימפריה הבריטית" },
      { name: "description", content: "מפה אינטראקטיבית של התפשטות האימפריה הבריטית" },
    ],
  }),
  component: Index,
});

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const heName = heCountryName;

type Stage = {
  title: string;
  countries: string[];
  description: string;
  period: string;
  info: string;
};

// Cumulative stages — each builds on the previous
const STAGES: Stage[] = [
  {
    title: "אנגליה",
    period: "המאה ה־16 ואילך",
    description: "הממלכה המאוחדת ואירלנד — נקודת המוצא של האימפריה",
    info: "אנגליה היא ליבת האימפריה הבריטית. מכאן יצאו הצי המלכותי, חברות הסחר והמתיישבים שהקימו מושבות בכל יבשת. אירלנד נשלטה בידי הכתר הבריטי מאות שנים ונחשבה למושבה הראשונה.",
    countries: ["United Kingdom", "Ireland"],
  },
  {
    title: "אמריקה — שלוש עשרה המושבות",
    period: "המאות 17–18 (עד 1783)",
    description:
      "ארה״ב, ג׳מייקה, ברבדוס, בליז, גויאנה, איי פוקלנד, בהאמה, טרינידד וטובגו ועוד",
    info: "המושבות הראשונות של בריטניה ביבשת אמריקה ובאיים הקריביים. שלוש עשרה המושבות בצפון אמריקה הכריזו עצמאות ב־1776 והפכו לארה״ב. נכסים קריביים (ג׳מייקה, ברבדוס וכו׳) נותרו בידי האימפריה עוד מאות שנים ושימשו למטעי סוכר וסחר עבדים.",
    countries: [
      "United States of America",
      "Jamaica",
      "Barbados",
      "Belize",
      "Guyana",
      "Falkland Is.",
      "Falkland Islands",
      "Bahamas",
      "The Bahamas",
      "Trinidad and Tobago",
      "Antigua and Barb.",
      "Dominica",
      "Grenada",
      "Saint Lucia",
      "St. Vin. and Gren.",
      "Saint Kitts and Nevis",
    ],
  },
  {
    title: "קנדה",
    period: "1763–1867",
    description: "קנדה כולה, כולל ניופאונדלנד ולברדור",
    info: "לאחר ניצחון בריטניה על צרפת במלחמת שבע השנים (1763) עברה קנדה לידיה. ב־1867 הפכה לדומיניון — מדינה חצי־עצמאית בתוך האימפריה.",
    countries: ["Canada"],
  },
  {
    title: "הודו",
    period: "1757–1947",
    description: "הודו, פקיסטן, בנגלדש, מיאנמר (בורמה), סרי לנקה, נפאל ומלזיה/סינגפור",
    info: "״פנינת הכתר״ של האימפריה. החל מקרב פלאסי (1757) השתלטה חברת הודו המזרחית הבריטית על תת־היבשת, וב־1858 עבר השלטון ישירות לכתר. ב־1947 קיבלו הודו ופקיסטן עצמאות.",
    countries: [
      "India",
      "Pakistan",
      "Bangladesh",
      "Myanmar",
      "Sri Lanka",
      "Nepal",
      "Bhutan",
      "Malaysia",
      "Singapore",
      "Brunei",
    ],
  },
  {
    title: "אוסטרליה",
    period: "1788–1901",
    description: "אוסטרליה כולה",
    info: "האירופים הגיעו לאוסטרליה ב־1788 והקימו תחילה מושבת עונשין. במהלך המאה ה־19 התרחבה ההתיישבות לכל היבשת, וב־1901 הוקם חבר העמים האוסטרלי כדומיניון.",
    countries: ["Australia"],
  },
  {
    title: "ניו זילנד והפסיפיק",
    period: "1840 ואילך",
    description: "ניו זילנד, פפואה גינאה החדשה, פיג׳י, איי שלמה, ונואטו",
    info: "ניו זילנד סופחה לאימפריה באמנת ויטאנגי (1840) עם שבטי המאורי. במקביל הוטלה שליטה בריטית על איים רבים באוקיינוס השקט — פיג׳י, איי שלמה, חלקי פפואה גינאה החדשה ועוד.",
    countries: [
      "New Zealand",
      "Papua New Guinea",
      "Fiji",
      "Solomon Is.",
      "Solomon Islands",
      "Vanuatu",
    ],
  },
  {
    title: "דרום אפריקה",
    period: "1806–1910",
    description: "דרום אפריקה, לסוטו, אסוואטיני, בוצואנה, זימבבואה, זמביה, מלאווי ונמיביה",
    info: "הבריטים השתלטו על מושבת הכף ב־1806. מלחמות הבורים (1880–1902) הביאו לאיחוד דרום אפריקה תחת הדגל הבריטי ב־1910, יחד עם פרוטקטורטים שכנים.",
    countries: [
      "South Africa",
      "Lesotho",
      "eSwatini",
      "Swaziland",
      "Botswana",
      "Zimbabwe",
      "Zambia",
      "Malawi",
      "Namibia",
    ],
  },
  {
    title: "מצרים",
    period: "1882–1956",
    description: "מצרים וסודן (כולל דרום סודן של היום)",
    info: "בריטניה כבשה את מצרים ב־1882 כדי לאבטח את תעלת סואץ — נתיב הים החיוני להודו. סודן נשלטה במשותף עם מצרים עד עצמאותה ב־1956.",
    countries: ["Egypt", "Sudan", "S. Sudan", "South Sudan"],
  },
  {
    title: "שאר אפריקה",
    period: "סוף המאה ה־19 — ״המרוץ לאפריקה״",
    description: "ניגריה, גאנה, קניה, אוגנדה, טנזניה, סיירה לאון, גמביה ועוד",
    info: "בעקבות ועידת ברלין (1884–85) חילקו המעצמות האירופיות את אפריקה. בריטניה זכתה בנתח עצום — מקייפטאון עד קהיר — וכללה את ניגריה, גאנה, קניה, אוגנדה, טנזניה, סיירה לאון, גמביה ועוד.",
    countries: [
      "Nigeria",
      "Ghana",
      "Kenya",
      "Uganda",
      "Tanzania",
      "United Republic of Tanzania",
      "Sierra Leone",
      "Gambia",
      "The Gambia",
      "Somaliland",
      "Somalia",
      "Cameroon",
    ],
  },
];

// Map every country -> the stage index it belongs to (first match wins).
const COUNTRY_TO_STAGE: Record<string, number> = {};
STAGES.forEach((s, i) => {
  s.countries.forEach((c) => {
    if (!(c in COUNTRY_TO_STAGE)) COUNTRY_TO_STAGE[c] = i;
  });
});

function Index() {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1500); // ms per stage
  const [zoom, setZoom] = useState(1);
  const [hovered, setHovered] = useState<{ name: string; x: number; y: number } | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  const activeCountries = new Set<string>();
  for (let i = 0; i < step; i++) {
    STAGES[i].countries.forEach((c) => activeCountries.add(c));
  }

  const currentStage = step === 0 ? null : STAGES[step - 1];
  const isDone = step >= STAGES.length;

  // Auto-advance
  useEffect(() => {
    if (!playing) return;
    if (isDone) {
      setPlaying(false);
      return;
    }
    const t = setTimeout(() => setStep((s) => s + 1), speed);
    return () => clearTimeout(t);
  }, [playing, step, speed, isDone]);

  const advance = () => {
    if (isDone) setStep(0);
    else setStep((s) => s + 1);
  };
  const reset = () => {
    setStep(0);
    setPlaying(false);
  };

  const selectedStageIdx = selected != null ? COUNTRY_TO_STAGE[selected] : undefined;
  const selectedStage =
    selectedStageIdx !== undefined ? STAGES[selectedStageIdx] : null;

  return (
    <div
      dir="rtl"
      className="relative min-h-screen w-full select-none bg-background text-foreground"
    >
      <header className="flex flex-col items-center gap-2 px-6 pt-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight md:text-4xl">
          התפשטות האימפריה הבריטית
        </h1>
        {currentStage ? (
          <p className="text-base font-semibold text-red-600 md:text-lg">
            שלב {step} / {STAGES.length} — {currentStage.title}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">לחצו "התחל" או "השלב הבא" כדי להתקדם</p>
        )}
        {currentStage && (
          <p className="max-w-3xl text-xs text-muted-foreground md:text-sm">
            {currentStage.description}
          </p>
        )}
      </header>

      {/* Controls */}
      <div className="mx-auto mt-4 flex max-w-5xl flex-wrap items-center justify-center gap-3 px-4 text-sm">
        <button
          onClick={() => {
            if (isDone) reset();
            setPlaying((p) => !p);
          }}
          className="rounded-md bg-red-600 px-4 py-2 font-semibold text-white shadow hover:bg-red-700"
        >
          {playing ? "⏸ עצור" : isDone ? "↻ הפעל מחדש" : "▶ הפעלה אוטומטית"}
        </button>
        <button
          onClick={advance}
          className="rounded-md border border-border bg-card px-4 py-2 font-medium hover:bg-muted"
        >
          {isDone ? "התחל מחדש" : "השלב הבא ←"}
        </button>
        <button
          onClick={reset}
          className="rounded-md border border-border bg-card px-3 py-2 font-medium hover:bg-muted"
        >
          איפוס
        </button>
        <label className="flex items-center gap-2">
          <span className="text-muted-foreground">מהירות:</span>
          <input
            type="range"
            min={400}
            max={3500}
            step={100}
            value={3900 - speed}
            onChange={(e) => setSpeed(3900 - Number(e.target.value))}
            className="w-40 accent-red-600"
          />
          <span className="tabular-nums text-xs text-muted-foreground">
            {(speed / 1000).toFixed(1)} שנ׳/שלב
          </span>
        </label>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setZoom((z) => Math.max(1, z / 1.3))}
            className="h-9 w-9 rounded-md border border-border bg-card font-bold hover:bg-muted"
          >
            −
          </button>
          <span className="w-12 text-center tabular-nums text-xs text-muted-foreground">
            {zoom.toFixed(1)}x
          </span>
          <button
            onClick={() => setZoom((z) => Math.min(8, z * 1.3))}
            className="h-9 w-9 rounded-md border border-border bg-card font-bold hover:bg-muted"
          >
            +
          </button>
        </div>
      </div>

      {/* Map */}
      <div className="mx-auto mt-4 w-full max-w-7xl px-2">
        <div
          className="relative overflow-hidden rounded-lg border border-border bg-card shadow-sm"
          onMouseLeave={() => setHovered(null)}
        >
          <ComposableMap
            projectionConfig={{ scale: 175 }}
            width={1200}
            height={620}
            style={{ width: "100%", height: "auto" }}
          >
            <ZoomableGroup zoom={zoom} center={[0, 20]} maxZoom={8}>
              <Geographies geography={GEO_URL}>
                {({ geographies }: { geographies: any[] }) =>
                  <>
                    {geographies.map((geo: any) => {
                      const name: string = geo.properties.name;
                      const isActive = activeCountries.has(name);
                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          onClick={() => setSelected(name)}
                          onMouseEnter={() =>
                            setHovered({ name, x: 0, y: 0 })
                          }
                          onMouseMove={(e: React.MouseEvent<SVGPathElement>) => {
                            const svg = e.currentTarget.ownerSVGElement;
                            const rect = (svg?.parentElement as HTMLElement | null)?.getBoundingClientRect();
                            if (rect) {
                              setHovered({
                                name,
                                x: e.clientX - rect.left,
                                y: e.clientY - rect.top,
                              });
                            }
                          }}
                          onMouseLeave={() => setHovered(null)}
                          style={{
                            default: {
                              fill: isActive ? "#dc2626" : "#9ca3af",
                              stroke: "#ffffff",
                              strokeWidth: 0.4,
                              outline: "none",
                              transition: "fill 700ms ease",
                            },
                            hover: {
                              fill: isActive ? "#b91c1c" : "#6b7280",
                              outline: "none",
                              cursor: "pointer",
                            },
                            pressed: {
                              fill: isActive ? "#dc2626" : "#9ca3af",
                              outline: "none",
                            },
                          }}
                        >
                          <title>{heName(name)}</title>
                        </Geography>
                      );
                    })}
                    {zoom >= 2 &&
                      geographies.map((geo: any) => {
                        const name: string = geo.properties.name;
                        const isActive = activeCountries.has(name);
                        let centroid: [number, number];
                        try {
                          centroid = geoCentroid(geo) as [number, number];
                        } catch {
                          return null;
                        }
                        if (!isFinite(centroid[0]) || !isFinite(centroid[1])) return null;
                        const label = heName(name);
                        const fontSize = Math.max(6, 11 / zoom);
                        return (
                          <Marker key={`lbl-${geo.rsmKey}`} coordinates={centroid}>
                            <text
                              textAnchor="middle"
                              style={{
                                fontFamily: "system-ui, sans-serif",
                                fontSize,
                                fontWeight: 600,
                                fill: isActive ? "#fff" : "#1f2937",
                                stroke: isActive ? "#7f1d1d" : "#fff",
                                strokeWidth: 0.3,
                                paintOrder: "stroke",
                                pointerEvents: "none",
                              }}
                            >
                              {label}
                            </text>
                          </Marker>
                        );
                      })}
                  </>
                }
              </Geographies>
            </ZoomableGroup>
          </ComposableMap>
          {hovered && (
            <div
              className="pointer-events-none absolute z-20 rounded-md bg-foreground/90 px-2 py-1 text-xs font-semibold text-background shadow-lg"
              style={{
                left: hovered.x + 12,
                top: hovered.y + 12,
              }}
            >
              {heName(hovered.name)}
            </div>
          )}
        </div>
        <p className="mt-1 text-center text-xs text-muted-foreground">
          ניתן לגרור את המפה, להשתמש בגלגלת לזום, ולרחף עם העכבר כדי לראות שם מדינה
        </p>
      </div>

      {/* Reference table */}
      <section className="mx-auto mt-8 max-w-5xl px-4 pb-12">
        <h2 className="mb-3 text-lg font-bold md:text-xl">טבלת ליווי — מה כולל כל שלב</h2>
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-right text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="w-12 p-2">#</th>
                <th className="p-2">שלב במפה</th>
                <th className="p-2">אזורים/מדינות מודרניים לדוגמה</th>
              </tr>
            </thead>
            <tbody>
              {STAGES.map((s, i) => {
                const reached = step > i;
                const current = step === i + 1;
                return (
                  <tr
                    key={s.title}
                    className={
                      current
                        ? "bg-red-50 dark:bg-red-950/30"
                        : reached
                          ? "bg-card"
                          : "bg-card opacity-60"
                    }
                  >
                    <td className="p-2 font-mono text-muted-foreground">{i + 1}</td>
                    <td className="p-2 font-semibold">
                      <span className={reached ? "text-red-600" : ""}>{s.title}</span>
                    </td>
                    <td className="p-2 text-muted-foreground">{s.description}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <Dialog open={selected !== null} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent dir="rtl" className="max-w-md">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="text-right text-2xl">
                  {heName(selected)}
                </DialogTitle>
                <DialogDescription className="text-right">
                  {selectedStage ? (
                    <span className="inline-flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-red-600 px-2 py-0.5 text-xs font-semibold text-white">
                        שלב {(selectedStageIdx ?? 0) + 1}: {selectedStage.title}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {selectedStage.period}
                      </span>
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      לא הייתה חלק מהאימפריה הבריטית
                    </span>
                  )}
                </DialogDescription>
              </DialogHeader>
              <div className="text-right text-sm leading-relaxed">
                {selectedStage ? (
                  selectedStage.info
                ) : (
                  <p className="text-muted-foreground">
                    מדינה זו אינה נכללת באחד משלבי ההתפשטות שמוצגים במפה זו.
                  </p>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
