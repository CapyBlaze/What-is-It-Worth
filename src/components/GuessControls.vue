<template>
    <div class="guess-zone">
        <div class="price-target-tag">
            <span class="label">{{ validated ? "Result" : "Your estimate" }}</span>
            <span class="value" :class="{ revealed: validated }">
                {{ validated ? `Real price:${formatPrice(price)}` : formatPrice(modelValue) }}
            </span>
        </div>

        <div class="input-row">
            <div class="price-input-wrap">
                <span class="cur">€</span>
                <input
                    type="number"
                    min="0"
                    step="0.01"
                    inputmode="decimal"
                    :value="modelValue"
                    :disabled="validated"
                    @input="$emit('update:modelValue', Number($event.target.value) || 0)"
                />
            </div>
        </div>

        <div class="slider-row">
            <span>0€</span>
            <input
                type="range"
                min="0"
                :max="gaugeMax"
                step="0.5"
                :value="modelValue"
                :disabled="validated"
                @input="$emit('update:modelValue', Number($event.target.value) || 0)"
            />
            <span>{{ gaugeMax }}€</span>
        </div>

        <button class="validate-btn" :disabled="validated" @click="$emit('validate')">
            Validate my price
        </button>
    </div>
</template>

<script setup>
import { formatPrice } from "../composables/useGame";

defineProps({
    modelValue: { type: Number, required: true },
    gaugeMax: { type: Number, required: true },
    validated: { type: Boolean, required: true },
    price: { type: Number, required: true },
});
defineEmits(["update:modelValue", "validate"]);
</script>

<style scoped>
.guess-zone {
    padding: 26px 28px 30px;
    display: flex;
    flex-direction: column;
    gap: 18px;
}

.price-target-tag {
    align-self: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
}

.price-target-tag .label {
    font-family: var(--font-display);
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 2px;
    color: var(--ink-soft);
    text-transform: uppercase;
}

.price-target-tag .value {
    font-family: var(--font-display);
    font-size: 44px;
    font-weight: 800;
    color: var(--deal-red);
    line-height: 1.2;
    transition: all 0.25s ease;
    text-align: center;
}

.price-target-tag .value.revealed {
    color: var(--success-dark);
    font-size: 26px;
}

.input-row {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
}

.price-input-wrap {
    display: flex;
    align-items: center;
    background: #fff;
    border: 2px solid var(--navy-2);
    border-radius: 8px;
    overflow: hidden;
    height: 46px;
}

.price-input-wrap .cur {
    background: var(--navy-2);
    color: #fff;
    height: 100%;
    display: flex;
    align-items: center;
    padding: 0 12px;
    font-weight: 700;
    font-family: var(--font-display);
}

.price-input-wrap input {
    border: none;
    outline: none;
    font-size: 19px;
    font-family: var(--font-display);
    font-weight: 700;
    padding: 0 12px;
    width: 130px;
    color: var(--ink);
}

.slider-row {
    display: flex;
    align-items: center;
    gap: 12px;
    max-width: 420px;
    margin: 0 auto;
    width: 100%;
}

.slider-row span {
    font-size: 11px;
    color: var(--ink-soft);
    font-weight: 600;
}

input[type="range"] {
    flex: 1;
    height: 6px;
    border-radius: 4px;
    background: linear-gradient(90deg, var(--orange), var(--deal-red));
    outline: none;
    -webkit-appearance: none;
    appearance: none;
}

input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #fff;
    border: 3px solid var(--orange-dark);
    cursor: pointer;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

input[type="range"]::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #fff;
    border: 3px solid var(--orange-dark);
    cursor: pointer;
}

.validate-btn {
    align-self: center;
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 16px;
    letter-spacing: 0.5px;
    background: var(--orange);
    color: #fff;
    border: none;
    padding: 13px 34px;
    border-radius: 28px;
    cursor: pointer;
    box-shadow: 0 4px 14px rgba(255, 153, 0, 0.4);
    transition:
        transform 0.12s ease,
        box-shadow 0.12s ease;
}

.validate-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 18px rgba(255, 153, 0, 0.5);
}

.validate-btn:disabled {
    opacity: 0.4;
    cursor: default;
    box-shadow: none;
}
</style>
