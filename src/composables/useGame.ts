import { computed, onMounted, reactive, ref } from "vue";

const products = ref<Product[]>([]);
let currentChunk = 0;

const CHUNK_COUNT = 183; // amazon_products_0001.csv → amazon_products_0183.csv

async function loadChunk() {
    currentChunk = Math.floor(Math.random() * CHUNK_COUNT) + 1;

    const filename = `/data/amazon_products_${String(currentChunk).padStart(4, "0")}.csv`;

    const text = await fetch(filename).then((r) => r.text());

    products.value = parseCSV(text);
}

type Product = {
    asin: string;
    title: string;
    image: string;
    rating: number;
    reviews: number;
    price: number;
    bought: number;
};

// Parse une ligne CSV en respectant les champs entre guillemets
// (ex: un titre contenant des virgules), à la manière d'un vrai parseur CSV.
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
        .map((line) => {
            const p = splitCSVLine(line);
            return {
                asin: p[0]?.trim() ?? "",
                title: p[1]?.trim() ?? "",
                image: p[2]?.trim() ?? "",
                rating: parseFloat(p[3]),
                reviews: parseInt(p[4], 10),
                price: parseFloat(p[5]),
                bought: parseInt(p[6], 10),
            };
        });
}

const MESSAGES = {
    perfect: {
        badge: "🎉 PRIX EXACT !",
        cls: "win",
        detail: "Score parfait, tu as trouvé le prix au centime près.",
    },
    excellent: {
        badge: "🔥 Excellent !",
        cls: "win",
        detail: "Tu es à moins de 2% du vrai prix.",
    },
    great: {
        badge: "👏 Très bon coup !",
        cls: "win",
        detail: "Tu es à moins de 5% du vrai prix.",
    },
    good: {
        badge: "✅ Bien joué",
        cls: "win",
        detail: "Tu es à moins de 10% du vrai prix.",
    },
    ok: {
        badge: "🙂 Pas mal",
        cls: "warn",
        detail: "Tu es dans la bonne zone, mais tu peux affiner.",
    },
    far: {
        badge: "😬 Loin du compte",
        cls: "warn",
        detail: "Tu n'as pas dépassé le prix, mais l'écart est important.",
    },
    bust: {
        badge: "💥 Prix crevé !",
        cls: "bust",
        detail: "Ton estimation dépasse le vrai prix : au Juste Prix, ça ne compte pas.",
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
    const raw = price * 2.2;
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

    return { type: "far", points: 50 };
}

export function useGame() {
    const current = ref<Product | null>(null);
    const totalScore = ref(0);
    const gaugeMax = ref(50);
    const guess = ref(0);
    const validated = ref(false);
    const needleAngle = ref(-90);
    const targetMark = reactive({ cx: 210, cy: 10, opacity: 0 });
    const isLoading = ref(true);
    const loadError = ref<string | null>(null);

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
            // à chaque manche : on choisit un nouveau fichier au hasard,
            // puis un item au hasard dans ce fichier
            await loadChunk();

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

    function onValidate() {
        if (validated.value || !current.value) return;
        const g = Number(guess.value) || 0;
        const price = current.value.price;
        const result = computeResult(g, price);

        validated.value = true;
        needleAngle.value = angleForValue(g, gaugeMax.value);

        requestAnimationFrame(() => {
            const targetAngle = angleForValue(price, gaugeMax.value);
            needleAngle.value = targetAngle;
            targetMark.cx = 210 + 178 * Math.cos((targetAngle * Math.PI) / 180 - Math.PI / 2);
            targetMark.cy = 190 + 178 * Math.sin((targetAngle * Math.PI) / 180 - Math.PI / 2);
            targetMark.opacity = 1;
        });

        resultType.value = result.type;
        resultPoints.value = result.points;
        totalScore.value += result.points;
    }

    onMounted(pickProduct);

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
        pickProduct,
        onValidate,
    };
}

// id,category_name
// 56,Computer Monitors
// 57,Computers & Tablets
// 68,Wearable Technology
// 69,Televisions & Video Products
// 70,GPS & Navigation
// 71,Headphones & Earbuds
// 72,Office Electronics
// 73,Portable Audio & Video
// 74,eBook Readers & Accessories
// 75,Cell Phones & Accessories
// 77,Video Projectors
// 79,Camera & Photo
// 80,Security & Surveillance Equipment
// 81,Computers
// 82,Home Audio & Theater Products
// 83,Video Game Consoles & Accessories
// 99,Travel Duffel Bags
// 100,Messenger Bags
// 101,Travel Tote Bags
// 102,Garment Bags
// 103,Luggage Sets
// 104,Suitcases
// 105,Travel Accessories
// 106,Rain Umbrellas
// 107,Backpacks
// 108,Luggage
// 109,Laptop Bags
// 163,Bath Products
// 164,Bedding
// 165,Home Décor Products
// 166,Furniture
// 169,Home Lighting & Ceiling Fans
// 170,Kitchen & Dining
// 171,"Heating, Cooling & Air Quality"
// 173,Home Storage & Organization
// 175,Vacuum Cleaners & Floor Care
// 176,Ironing Products
// 178,Pet Bird Supplies
// 179,Cat Supplies
// 180,Dog Supplies
// 181,Fish & Aquatic Pets
// 182,Horse Supplies
// 183,Reptiles & Amphibian Supplies
// 184,Small Animal Supplies
// 185,Smart Home: New Smart Devices
// 186,Smart Home: Voice Assistants and Hubs
// 187,Smart Home: Smart Locks and Entry
// 188,Smart Home: Home Entertainment
// 189,Smart Home: WiFi and Networking
// 190,Smart Home: Security Cameras and Systems
// 191,Smart Home: Lighting
// 192,Smart Home: Plugs and Outlets
// 193,Smart Home: Vacuums and Mops
// 194,Smart Home Thermostats - Compatibility Checker
// 195,Smart Home: Lawn and Garden
// 196,Smart Home: Other Solutions
// 197,Smart Home - Heating & Cooling
// 198,Sports & Fitness
// 199,Outdoor Recreation
// 200,Sports & Outdoors
// 201,Home Appliances
// 204,"Paint, Wall Treatments & Supplies"
// 205,Safety & Security
// 206,Light Bulbs
// 207,Power Tools & Hand Tools
// 208,Kitchen & Bath Fixtures
// 209,Lighting & Ceiling Fans
// 210,Electrical Equipment
// 211,Hardware
// 212,Building Supplies
// 213,Measuring & Layout
// 215,Tools & Home Improvement
// 217,Toy Figures & Playsets
// 218,Novelty Toys & Amusements
// 219,Arts & Crafts Supplies
// 220,Building Toys
// 221,Dolls & Accessories
// 222,Kids' Electronics
// 223,Games & Accessories
// 224,Learning & Education Toys
// 225,Kids' Dress Up & Pretend Play
// 226,Puppets & Puppet Theaters
// 227,Puzzles
// 228,Sports & Outdoor Play Toys
// 229,Stuffed Animals & Plush Toys
// 230,Baby & Toddler Toys
// 231,"Tricycles, Scooters & Wagons"
// 232,Finger Toys
// 233,Toy Vehicle Playsets
// 234,Kids' Play Trains & Trams
// 235,Kids' Play Trucks
// 236,Kids' Play Cars & Race Cars
// 237,Kids' Play Boats
// 238,Kids' Play Buses
// 239,Kids' Play Tractors
// 240,"Slot Cars, Race Tracks & Accessories"
// 270,Toys & Games
