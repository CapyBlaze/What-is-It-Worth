import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const DATA_DIR = path.resolve("public/data");
const OUTPUT_FILE = path.join(DATA_DIR, "category-index.json");
const CHUNK_COUNT = 183;

const GAME_CATEGORIES = [
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

function splitCSVLine(line) {
    const result = [];
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

function categoryIdToGroup(categoryId) {
    for (const group of GAME_CATEGORIES) {
        if (group.id === "all") continue;
        if (group.categories.includes(categoryId)) return group.id;
    }
    return null;
}

async function run() {
    const index = {};
    for (const group of GAME_CATEGORIES) index[group.id] = new Set();

    let missing = 0;

    for (let i = 1; i <= CHUNK_COUNT; i++) {
        const filename = `amazon_products_${String(i).padStart(4, "0")}.csv`;
        const filepath = path.join(DATA_DIR, filename);

        let text;
        try {
            text = await readFile(filepath, "utf-8");
        } catch {
            console.warn(`⚠️  ${filename} not found, ignored`);
            missing++;
            continue;
        }

        const rows = text.split("\n").filter(Boolean).slice(1);
        const groupsInChunk = new Set();

        for (const line of rows) {
            const p = splitCSVLine(line);
            const categoryId = parseInt(p[6], 10);
            const group = categoryIdToGroup(categoryId);
            if (group) groupsInChunk.add(group);
        }

        for (const group of groupsInChunk) {
            index[group].add(i);
        }
        index.all.add(i);
    }

    const output = {};
    for (const [group, set] of Object.entries(index)) {
        output[group] = [...set].sort((a, b) => a - b);
    }

    await writeFile(OUTPUT_FILE, JSON.stringify(output, null, 2));

    console.log(`✅ Index written in${OUTPUT_FILE}`);
    if (missing > 0) console.log(`   (${missing}missing file(s) ignored)`);
    for (const [group, chunks] of Object.entries(output)) {
        console.log(`   - ${group}: ${chunks.length} chunk(s)`);
    }
}

run();
