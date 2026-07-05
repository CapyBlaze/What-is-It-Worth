import { computed, onMounted, reactive, ref } from "vue";

const BASE_URL = import.meta.env.BASE_URL;

const products = ref<Product[]>([]);
let currentChunk = 0;

const CHUNK_COUNT = 183;

let categoryIndexCache: Record<string, number[]> | null = null;

async function loadCategoryIndex(): Promise<Record<string, number[]>> {
    if (categoryIndexCache) return categoryIndexCache;

    const res = await fetch(`${BASE_URL}data/category-index.json`);
    if (!res.ok) throw new Error("Impossible de charger l'index des catégories.");

    categoryIndexCache = await res.json();
    return categoryIndexCache as Record<string, number[]>;
}

async function loadChunk(categoryGroupId: string) {
    const index = await loadCategoryIndex();
    const candidates = index[categoryGroupId]?.length
        ? index[categoryGroupId]
        : Array.from({ length: CHUNK_COUNT }, (_, i) => i + 1);

    currentChunk = candidates[Math.floor(Math.random() * candidates.length)];

    const filename = `${BASE_URL}data/amazon_products_${String(currentChunk).padStart(4, "0")}.csv`;
    const text = await fetch(filename).then((r) => r.text());

    let parsed = parseCSV(text);

    if (categoryGroupId !== "all") {
        const groupCategoryIds =
            GAME_CATEGORIES.find((g) => g.id === categoryGroupId)?.categories ?? [];
        const filtered = parsed.filter((p) => groupCategoryIds.includes(p.categoryId));

        parsed = filtered.length > 0 ? filtered : parsed;
    }

    products.value = parsed;
}

type Product = {
    asin: string;
    title: string;
    image: string;
    rating: number;
    reviews: number;
    price: number;
    categoryId: number;
};

function splitCSVLine(line: string): string[] {
    const result: string[] = [];
    let field = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (inQuotes) {
            if (char === '"') {
                if (line[i + 1] === '"') {
                    field += '"';
                    i++;
                } else {
                    inQuotes = false;
                }
            } else {
                field += char;
            }
        } else if (char === '"') {
            inQuotes = true;
        } else if (char === ",") {
            result.push(field);
            field = "";
        } else {
            field += char;
        }
    }
    result.push(field);
    return result;
}

function parseCSV(text: string): Product[] {
    return text
        .split("\n")
        .filter(Boolean)
        .slice(1)
        .map((line) => {
            const p = splitCSVLine(line);
            return {
                asin: p[0]?.trim() ?? "",
                title: p[1]?.trim() ?? "",
                image: p[2]?.trim() ?? "",
                rating: parseFloat(p[3]),
                reviews: parseInt(p[4], 10),
                price: parseFloat(p[5]),
                categoryId: parseInt(p[6], 10),
            };
        });
}

export const GAME_CATEGORIES = [
    {
        id: "all",
        categories: [],
    },
    {
        id: "electronics",
        categories: [56, 57, 68, 69, 70, 71, 72, 73, 74, 75, 77, 79, 80, 81, 82, 83],
    },
    {
        id: "home",
        categories: [163, 164, 165, 166, 169, 170, 171, 173, 175, 176, 201],
    },
    {
        id: "smart-home",
        categories: [185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197],
    },
    {
        id: "tools",
        categories: [204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 215],
    },
    {
        id: "sports",
        categories: [198, 199, 200],
    },
    {
        id: "pets",
        categories: [178, 179, 180, 181, 182, 183, 184],
    },
    {
        id: "travel",
        categories: [99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109],
    },
    {
        id: "toys",
        categories: [
            217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233,
            234, 235, 236, 237, 238, 239, 240, 270,
        ],
    },
];

const MESSAGES = {
    perfect: {
        badge: "PRIX EXACT !",
        cls: "win",
        detail: "Perfect score, you found the price to the nearest cent.",
    },
    excellent: {
        badge: "Excellent !",
        cls: "win",
        detail: "You are less than 2% of the real price.",
    },
    great: {
        badge: "Very good move!",
        cls: "win",
        detail: "You are less than 5% of the real price.",
    },
    good: {
        badge: "Well done",
        cls: "win",
        detail: "You are less than 10% off the real price.",
    },
    ok: {
        badge: "Not bad",
        cls: "warn",
        detail: "You're in the right zone, but you can refine.",
    },
    far: {
        badge: "Far from the count",
        cls: "warn",
        detail: "You haven't exceeded the price, but the gap is significant.",
    },
    bust: {
        badge: "Smashed price!",
        cls: "bust",
        detail: "Your estimate exceeds the real price: at the Right Price, it doesn't count.",
    },
};
type ResultType = keyof typeof MESSAGES;
type Result = {
    type: ResultType;
    points: number;
};

export function formatPrice(v: number) {
    return (Number(v) || 0).toFixed(2).replace(".", ",") + "\u00A0€";
}

function niceMax(price: number) {
    const minRatio = price < 50 ? 2.0 : price < 300 ? 1.6 : 1.3;
    const maxRatio = price < 50 ? 5.0 : price < 300 ? 3.5 : 2.5;

    const randomRatio = minRatio + Math.random() * (maxRatio - minRatio);
    const raw = price * randomRatio;

    const step = raw < 20 ? 5 : raw < 100 ? 10 : raw < 500 ? 50 : 100;
    return Math.ceil(raw / step) * step;
}

function angleForValue(v: number, max: number) {
    const pct = Math.max(0, Math.min(1, v / max));
    return -90 + pct * 180;
}

function computeResult(g: number, price: number): Result {
    if (g > price) return { type: "bust", points: 0 };

    const diffPct = (price - g) / price;

    if (diffPct === 0) return { type: "perfect", points: 1000 };
    if (diffPct <= 0.02) return { type: "excellent", points: 800 };
    if (diffPct <= 0.05) return { type: "great", points: 600 };
    if (diffPct <= 0.1) return { type: "good", points: 400 };
    if (diffPct <= 0.2) return { type: "ok", points: 200 };
    if (diffPct <= 0.35) return { type: "far", points: 100 };
    if (diffPct <= 0.6) return { type: "far", points: 40 };

    return { type: "far", points: Math.max(0, Math.round(20 * (1 - diffPct))) };
}

export function useGame() {
    const current = ref<Product | null>(null);
    const totalScore = ref(Number(localStorage.getItem("totalScore")) || 0);
    const gaugeMax = ref(50);
    const guess = ref(0);
    const validated = ref(false);
    const needleAngle = ref(-90);
    const targetMark = reactive({ cx: 210, cy: 10, opacity: 0 });
    const isLoading = ref(true);
    const loadError = ref<string | null>(null);
    const selectedCategory = ref("all");

    type ResultType = keyof typeof MESSAGES;
    const resultType = ref<ResultType | null>(null);

    const resultPoints = ref(0);

    const resultMsg = computed(() => {
        if (!resultType.value) {
            return {
                badge: "",
                cls: "",
                detail: "",
            };
        }

        return MESSAGES[resultType.value];
    });

    async function pickProduct() {
        isLoading.value = true;
        loadError.value = null;

        try {
            await loadChunk(selectedCategory.value);

            if (products.value.length === 0) {
                throw new Error("Le fichier chargé ne contient aucun produit.");
            }

            current.value = products.value[Math.floor(Math.random() * products.value.length)];

            gaugeMax.value = niceMax(current.value.price);

            guess.value = 0;
            validated.value = false;
            needleAngle.value = -90;
            targetMark.cx = 210;
            targetMark.cy = 10;
            targetMark.opacity = 0;
            resultType.value = null;
            resultPoints.value = 0;
        } catch (err) {
            loadError.value =
                err instanceof Error ? err.message : "Impossible de charger un produit.";
        } finally {
            isLoading.value = false;
        }
    }

    function setCategory(categoryId: string) {
        if (selectedCategory.value === categoryId) return;
        selectedCategory.value = categoryId;
        pickProduct();
    }

    function onValidate() {
        if (validated.value || !current.value) return;
        const g = Number(guess.value) || 0;
        const price = current.value.price;
        const result = computeResult(g, price);

        validated.value = true;

        const guessAngle = angleForValue(g, gaugeMax.value);
        targetMark.cx = 210 + 178 * Math.cos((guessAngle * Math.PI) / 180 - Math.PI / 2);
        targetMark.cy = 190 + 178 * Math.sin((guessAngle * Math.PI) / 180 - Math.PI / 2);
        targetMark.opacity = 1;

        requestAnimationFrame(() => {
            needleAngle.value = angleForValue(price, gaugeMax.value);
        });

        resultType.value = result.type;
        resultPoints.value = result.points;
        totalScore.value += result.points;

        localStorage.setItem("totalScore", totalScore.value.toString());
    }

    onMounted(pickProduct);

    function resetScore() {
        totalScore.value = 0;
        localStorage.setItem("totalScore", "0");
    }

    return {
        current,
        totalScore,
        gaugeMax,
        guess,
        validated,
        needleAngle,
        targetMark,
        resultMsg,
        resultPoints,
        isLoading,
        loadError,
        selectedCategory,
        pickProduct,
        onValidate,
        setCategory,
        resetScore,
    };
}
