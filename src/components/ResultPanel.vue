<template>
    <div class="result-panel" :class="{ show: validated }">
        <div class="result-badge" :class="resultMsg.cls">{{ resultMsg.badge }}</div>
        <div class="result-detail">{{ resultMsg.detail }}</div>
        <div class="result-bottom">
            <div class="points-earned">
                +<b>{{ resultPoints }}</b> points
            </div>
            <button class="next-btn" @click="$emit('next')">Next product</button>
        </div>
    </div>
</template>

<script setup>
defineProps({
    validated: { type: Boolean, required: true },
    resultMsg: { type: Object, required: true },
    resultPoints: { type: Number, required: true },
});
defineEmits(["next"]);
</script>

<style scoped>
.result-panel {
    padding: 0 28px;
    text-align: center;
    display: none;
    flex-direction: column;
    gap: 14px;
    align-items: center;
}

.result-panel.show {
    display: flex;
    padding: 22px 28px 30px;
}

.result-badge {
    font-family: var(--font-display);
    font-weight: 800;
    font-size: 26px;
    padding: 6px 0;
}

.result-badge.win {
    color: var(--success-dark);
}

.result-badge.warn {
    color: var(--orange-dark);
}

.result-badge.bust {
    color: var(--deal-red);
}

.result-bottom {
    display: flex;
    gap: 20px;
    flex-direction: row;
    align-items: center;
}

.result-detail {
    font-size: 14px;
    color: var(--ink-soft);
    max-width: 420px;
}

.points-earned {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 15px;
    background: #f0f2f2;
    padding: 8px 18px;
    border-radius: 20px;
    color: var(--ink);
}

.points-earned b {
    color: var(--success-dark);
    font-size: 19px;
}

.next-btn {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 14px;
    background: var(--navy);
    color: #fff;
    border: none;
    padding: 11px 26px;
    border-radius: 24px;
    cursor: pointer;
}

.next-btn:hover {
    background: var(--navy-2);
}
</style>
