<script setup lang="ts">
import { formatPrice } from "../composables/useGame";

const props = defineProps({
    validated: { type: Boolean, required: true },
    needleAngle: { type: Number, required: true },
    targetMark: { type: Object, required: true },
    gaugeMax: { type: Number, required: true },
    price: { type: Number, required: true },
    guess: { type: Number, required: true },
});

function angleForValue(value: number, max: number) {
    const pct = Math.max(0, Math.min(1, value / max));
    return -90 + pct * 180;
}

function pointForValue(value: number, max: number) {
    const angle = angleForValue(value, max);
    return {
        cx: 210 + 178 * Math.cos((angle * Math.PI) / 180 - Math.PI / 2),
        cy: 190 + 178 * Math.sin((angle * Math.PI) / 180 - Math.PI / 2),
    };
}

const realMark = pointForValue(props.price, props.gaugeMax);
</script>

<template>
    <div class="gauge-zone" :class="{ show: validated }">
        <div class="price-compare">
            <div class="price-block">
                <span class="price-swatch dot-swatch"></span>
                <div>
                    <div class="price-block-label">Ton estimation</div>
                    <div class="price-block-value">{{ formatPrice(guess) }}</div>
                </div>
            </div>
            <div class="price-block">
                <span class="price-swatch needle-swatch"></span>
                <div>
                    <div class="price-block-label">Prix réel</div>
                    <div class="price-block-value">{{ formatPrice(price) }}</div>
                </div>
            </div>
        </div>

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
                r="10"
                fill="#067D62"
                stroke="#fff"
                stroke-width="2.5"
                :opacity="targetMark.opacity"
            />
            <circle
                :cx="realMark.cx"
                :cy="realMark.cy"
                r="10"
                fill="#2f8ebb"
                stroke="#fff"
                stroke-width="2.5"
                :opacity="validated ? 1 : 0"
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

        <div class="gauge-caption">
            {{ validated ? `Écart : ${formatPrice(Math.abs(price - guess))}` : "" }}
        </div>
    </div>
</template>

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
    max-height: 400px;
    opacity: 1;
    padding: 22px 20px 14px;
}

.price-compare {
    display: flex;
    gap: 28px;
    flex-wrap: wrap;
    justify-content: center;
}

.price-block {
    display: flex;
    align-items: center;
    gap: 10px;
}

.price-swatch {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    flex-shrink: 0;
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.15);
}

.needle-swatch {
    background: #2f8ebb;
}

.dot-swatch {
    background: #067d62;
}

.real-swatch {
    background: #cc0c39;
}

.price-block-label {
    font-family: var(--font-display);
    font-size: 10.5px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #aab7b8;
    line-height: 1.2;
}

.price-block-value {
    font-family: var(--font-display);
    font-size: 20px;
    font-weight: 800;
    color: #5d5d5d;
    line-height: 1.2;
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
    color: #5d5d5d;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.5px;
    min-height: 20px;
    text-align: center;
    opacity: 0.85;
}

@media (prefers-reduced-motion: reduce) {
    .gauge-zone .needle {
        transition: none;
    }
}
</style>
