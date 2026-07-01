<template>
    <div class="gauge-zone" :class="{ show: validated }">
        <svg viewBox="0 0 420 220" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="#CC0C39" />
                    <stop offset="45%" stop-color="#FF9900" />
                    <stop offset="55%" stop-color="#FF9900" />
                    <stop offset="100%" stop-color="#CC0C39" />
                </linearGradient>
            </defs>
            <path
                d="M 30 190 A 180 180 0 0 1 390 190"
                fill="none"
                stroke="url(#arcGrad)"
                stroke-width="18"
                stroke-linecap="round"
            />
            <circle
                :cx="targetMark.cx"
                :cy="targetMark.cy"
                r="7"
                fill="#067D62"
                stroke="#fff"
                stroke-width="2"
                :opacity="targetMark.opacity"
            />
            <g class="needle" :style="{ transform: `rotate(${needleAngle}deg)` }">
                <line
                    x1="210"
                    y1="190"
                    x2="210"
                    y2="42"
                    stroke="#575757"
                    stroke-width="4"
                    stroke-linecap="round"
                />
                <circle cx="210" cy="190" r="9" fill="#242424" />
            </g>
            <text x="20" y="220" fill="#AAB7B8" font-size="16" font-family="Inter">0€</text>
            <text
                x="408"
                y="220"
                fill="#AAB7B8"
                font-size="16"
                font-family="Inter"
                text-anchor="end"
            >
                {{ gaugeMax }}€
            </text>
        </svg>
        <div class="gaupe-caption">
            {{ validated ? `Actual price: ${formatPrice(price)}` : "" }}
        </div>
    </div>
</template>

<script setup>
import { formatPrice } from "../composables/useGame";

defineProps({
    validated: { type: Boolean, required: true },
    needleAngle: { type: Number, required: true },
    targetMark: { type: Object, required: true },
    gaugeMax: { type: Number, required: true },
    price: { type: Number, required: true },
});
</script>

<style scoped>
.gauge-zone {
    background: transparent;
    padding: 0 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    max-height: 0;
    opacity: 0;
    overflow: hidden;
    transition:
        max-height 0.5s ease,
        opacity 0.4s ease 0.1s,
        padding 0.5s ease;
}

.gauge-zone.show {
    max-height: 320px;
    opacity: 1;
    padding: 26px 20px 14px;
}

.gauge-zone svg {
    width: 100%;
    max-width: 420px;
    height: auto;
}

.gauge-zone .needle {
    transform-origin: 210px 190px;
    transition: transform 1.1s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.gauge-caption {
    font-family: var(--font-display);
    color: #fff;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.5px;
    min-height: 20px;
    text-align: center;
}

@media (prefers-reduced-motion: reduce) {
    .gauge-zone .needle {
        transition: none;
    }
}
</style>
