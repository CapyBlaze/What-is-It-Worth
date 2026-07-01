<template>
    <AppHeader :totalScore="totalScore" />
    <HeroBanner />

    <main v-if="current">
        <div class="game-card">
            <ProductCard :product="current" />

            <div v-if="!validated">
                <GuessControls
                    v-model="guess"
                    :gauge-max="gaugeMax"
                    :validated="validated"
                    :price="current.price"
                    @validate="onValidate"
                />
            </div>
            <div v-else class="result">
                <PriceGauge
                    :validated="validated"
                    :needle-angle="needleAngle"
                    :target-mark="targetMark"
                    :gauge-max="gaugeMax"
                    :price="current.price"
                />

                <ResultPanel
                    :validated="validated"
                    :result-msg="resultMsg"
                    :result-points="resultPoints"
                    @next="pickProduct"
                />
            </div>
        </div>
    </main>
</template>

<script setup lang="ts">
import AppHeader from "./components/AppHeader.vue";
import GuessControls from "./components/GuessControls.vue";
import HeroBanner from "./components/HeroBanner.vue";
import PriceGauge from "./components/PriceGauge.vue";
import ProductCard from "./components/ProductCard.vue";
import ResultPanel from "./components/ResultPanel.vue";
import { useGame } from "./composables/useGame";

const {
    current,
    totalScore,
    gaugeMax,
    guess,
    validated,
    needleAngle,
    targetMark,
    resultMsg,
    resultPoints,
    pickProduct,
    onValidate,
} = useGame();
</script>

<style scoped>
main {
    max-width: 920px;
    margin: 10px auto 50px auto;
    padding: 0 16px;
}

.game-card {
    background: var(--card);
    border-radius: 10px;
    box-shadow:
        0 2px 6px rgba(0, 0, 0, 0.08),
        0 10px 24px rgba(0, 0, 0, 0.06);
    overflow: hidden;
}

.game-card .result {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}
</style>
