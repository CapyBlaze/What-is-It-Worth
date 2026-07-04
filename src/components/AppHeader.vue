<template>
    <header class="topbar">
        <div class="brand">
            <img src="../assets/logo.png" alt="What's It Worth?" height="32" />
        </div>

        <div class="search">
            <select
                name="category"
                id="category-select"
                :value="modelValue"
                @change="$emit('update:modelValue', $event.target.value)"
            >
                <option value="all">All categories</option>
                <option value="electronics">Electronics</option>
                <option value="home">Home</option>
                <option value="smart-home">Smart home</option>
                <option value="tools">DIY</option>
                <option value="sports">Sports</option>
                <option value="pets">Pets</option>
                <option value="travel">Travel</option>
                <option value="toys">Toys</option>
            </select>
            <input type="text" placeholder="Search for a product..." disabled />
            <button tabindex="-1">
                <svg viewBox="0 0 24 24" fill="none" stroke="#131921" stroke-width="2.5">
                    <circle cx="11" cy="11" r="7" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
            </button>
        </div>

        <div class="score-wrap" v-click-outside="closeScorePanel">
            <div class="score-pill" @click="showScorePanel = !showScorePanel">
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

            <div v-if="showScorePanel" class="score-panel">
                <div class="score-panel-title">Your basket of points</div>
                <div class="score-panel-value">{{ totalScore }}</div>
                <button @click="$emit('reset-score')">Clear score</button>
            </div>
        </div>
    </header>
</template>

<script setup>
import { ref } from "vue";

defineProps({
    totalScore: { type: Number, required: true },
    modelValue: { type: String, required: true },
});
defineEmits(["update:modelValue", "reset-score"]);

const showScorePanel = ref(false);

function closeScorePanel() {
    showScorePanel.value = false;
}

const vClickOutside = {
    mounted(el, binding) {
        el.__clickOutsideHandler__ = (event) => {
            if (!el.contains(event.target)) binding.value();
        };
        document.addEventListener("click", el.__clickOutsideHandler__, true);
    },
    unmounted(el) {
        document.removeEventListener("click", el.__clickOutsideHandler__, true);
    },
};
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
    position: fixed;
    width: stretch;
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

.score-wrap {
    position: relative;
    flex-shrink: 0;
}

.score-pill {
    display: flex;
    align-items: center;
    gap: 8px;
    background: var(--navy-2);
    padding: 8px 14px 8px 10px;
    border-radius: 4px;
    flex-shrink: 0;
    height: 38px;
    box-sizing: border-box;
    cursor: pointer;
    user-select: none;
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

.score-pill .score-number {
    font-family: var(--font-display);
    font-size: 19px;
    font-weight: 700;
    color: #fff;
    line-height: 1.1;
}

.score-panel {
    position: absolute;
    top: calc(100% + 10px);
    right: 0;
    background: #fff;
    color: var(--ink);
    border-radius: 8px;
    padding: 18px 22px;
    min-width: 180px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
    text-align: center;
    z-index: 50;
    animation: score-panel-in 0.15s ease;
    display: flex;
    flex-direction: column;
}

.score-panel button {
    background: var(--orange);
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: default;
    padding: 5px 10px;
    border-radius: 4px;
    margin-top: 10px;
    cursor: pointer;
}

.score-panel button:hover {
    background: var(--orange-dark);
}

.score-panel::before {
    content: "";
    position: absolute;
    top: -6px;
    right: 18px;
    width: 12px;
    height: 12px;
    background: #fff;
    transform: rotate(45deg);
    box-shadow: -2px -2px 3px rgba(0, 0, 0, 0.04);
}

.score-panel-title {
    font-family: var(--font-display);
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--ink-soft);
    margin-bottom: 6px;
}

.score-panel-value {
    font-family: var(--font-display);
    font-size: 32px;
    font-weight: 800;
    color: var(--orange-dark, var(--orange));
}

.score-panel-caption {
    font-size: 12px;
    color: var(--ink-soft);
    margin-top: 4px;
}

@keyframes score-panel-in {
    from {
        opacity: 0;
        transform: translateY(-6px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
