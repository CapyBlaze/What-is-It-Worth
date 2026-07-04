<script setup lang="ts">
defineProps({
    product: { type: Object, required: true },
});
</script>

<template>
    <div class="product-zone">
        <div class="product-image-wrap">
            <img :src="product.image" :alt="product.name" />
        </div>
        <div class="product-info">
            <span class="asin-tag">ASIN {{ product.asin }}</span>
            <p class="product-title">{{ product.title }}</p>

            <div class="rating-row">
                <span v-if="!product.reviews" class="no-rating-badge"> Not rated yet </span>

                <template v-else>
                    <span class="stars">
                        <svg
                            v-for="n in 5"
                            :key="n"
                            viewBox="0 0 20 20"
                            :class="n <= Math.round(product.rating) ? 'star-filled' : 'star-empty'"
                            fill="currentColor"
                        >
                            <polygon
                                points="10,1 12.6,7 19,7.6 14,12 15.5,18.5 10,15 4.5,18.5 6,12 1,7.6 7.4,7"
                            />
                        </svg>
                    </span>
                    <span>{{ product.rating.toFixed(1) }} · {{ product.reviews }} reviews</span>
                </template>
            </div>

            <div v-if="product.bought > 0" class="bought-badge">
                <b>{{ product.bought }}+</b> purchased last month
            </div>
        </div>
    </div>
</template>

<style scoped>
.product-zone {
    display: grid;
    grid-template-columns: 260px 1fr;
    border-bottom: 1px solid var(--line);
}

@media (max-width: 640px) {
    .product-zone {
        grid-template-columns: 1fr;
    }
}

.product-image-wrap {
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 28px;
    border-right: 1px solid var(--line);
    max-height: 260px;
}

@media (max-width: 640px) {
    .product-image-wrap {
        border-right: none;
        border-bottom: 1px solid var(--line);
        padding: 24px;
    }
}

.product-image-wrap img {
    max-width: 100%;
    max-height: 220px;
    object-fit: contain;
    mix-blend-mode: multiply;
}

.product-info {
    padding: 26px 28px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.asin-tag {
    font-size: 11px;
    color: var(--ink-soft);
    font-weight: 600;
    letter-spacing: 0.5px;
}

.product-title {
    font-size: 18px;
    font-weight: 600;
    line-height: 1.35;
    color: #0f1111;
    margin: 0;
}

.rating-row {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: var(--ink-soft);
}

.stars {
    display: inline-flex;
    gap: 1px;
}

.stars svg {
    width: 15px;
    height: 15px;
}

.star-filled {
    color: var(--orange);
}

.star-empty {
    color: #d5d9d9;
}

.no-rating-badge {
    font-size: 12px;
    font-weight: 600;
    color: var(--ink-soft);
    background: #f0f2f2;
    padding: 2px 8px;
    border-radius: 10px;
}

.bought-badge {
    display: inline-flex;
    width: fit-content;
    align-items: center;
    gap: 5px;
    font-size: 12.5px;
    color: var(--ink-soft);
    font-weight: 500;
}

.bought-badge b {
    color: var(--ink);
    font-weight: 700;
}
</style>
