<template>
    <header class="topbar">
        <div class="brand">
            <!-- <span>What's It Worth?</span> -->
            <img src="../assets/logo.png" alt="What's It Worth?" height="32" />
        </div>

        <div class="search">
            <select name="category" id="category-select">
                <option value="">All categories</option>
                <option value="dog">Chien</option>
                <option value="cat">Chat</option>
                <option value="hamster">Hamster</option>
                <option value="parrot">Perroquet</option>
                <option value="spider">Araignée</option>
                <option value="goldfish">Poisson rouge</option>
            </select>
            <input type="text" placeholder="Search for a product..." disabled />
            <button tabindex="-1">
                <svg viewBox="0 0 24 24" fill="none" stroke="#131921" stroke-width="2.5">
                    <circle cx="11" cy="11" r="7" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
            </button>
        </div>

        <div class="score-pill">
            <svg
                class="cart-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
            >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <div>
                <div class="score-label">Score</div>
                <div class="score-number">{{ totalScore }}</div>
            </div>
        </div>
    </header>
</template>

<script setup>
defineProps({
    totalScore: { type: Number, required: true },
});
</script>

<style scoped>
.topbar {
    background: var(--navy);
    color: #fff;
    padding: 14px 20px;
    display: flex;
    align-items: center;
    gap: 18px;
    flex-wrap: wrap;
    border-bottom: 3px solid var(--navy-2);
}

.brand {
    display: flex;
    align-items: baseline;
    gap: 8px;
    font-family: var(--font-display);
    font-weight: 800;
    letter-spacing: 0.5px;
    white-space: nowrap;
}

.search {
    flex: 1 1 260px;
    display: flex;
    height: 38px;
    border-radius: 4px;
    overflow: hidden;
    min-width: 180px;
    opacity: 0.9;
}

.search select {
    border: none;
    background: #c5c5c5;
    padding: 0px 0px 0px 8px;
    border-right: 8px solid transparent;
    cursor: pointer;
    color: #212121;
}

.search select option {
    background: var(--bg);
}

.search input {
    flex: 1;
    border: none;
    padding: 0 12px;
    font-size: 14px;
    font-family: var(--font-body);
    color: var(--ink-soft);
    background: #fff;
}

.search input::placeholder {
    color: #9aa0a0;
}

.search button {
    width: 44px;
    background: var(--orange);
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: default;
}

.search svg {
    width: 18px;
    height: 18px;
}

.score-pill {
    display: flex;
    align-items: center;
    gap: 8px;
    background: var(--navy-2);
    padding: 8px 14px 8px 10px;
    border-radius: 24px;
    cursor: default;
    flex-shrink: 0;
}

.score-pill .cart-icon {
    width: 24px;
    height: 24px;
    color: var(--orange);
}

.score-pill .score-label {
    font-size: 10px;
    color: #aab7b8;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: 700;
    line-height: 1;
}

.score-pill .score-num {
    font-family: var(--font-display);
    font-size: 19px;
    font-weight: 700;
    color: #fff;
    line-height: 1.1;
}
</style>
