<script setup lang="ts">
defineProps({
    category: { type: String, required: true },
});
</script>

<template>
    <section class="hero">
        <h1 v-if="category === 'all'">All the categories</h1>
        <h1 v-else-if="category === 'electronics'">Electronics</h1>
        <h1 v-else-if="category === 'home'">Home</h1>
        <h1 v-else-if="category === 'smart-home'">Smart home</h1>
        <h1 v-else-if="category === 'tools'">DIY</h1>
        <h1 v-else-if="category === 'sports'">Sports</h1>
        <h1 v-else-if="category === 'pets'">Pets</h1>
        <h1 v-else-if="category === 'travel'">Travel</h1>
        <h1 v-else-if="category === 'toys'">Toys</h1>
        <h1 v-else>Category: {{ category }}</h1>
    </section>
</template>

<style scoped>
.hero {
    padding-top: 80px;
    text-align: center;
}

.hero h1 {
    font-family: var(--font-display);
    font-weight: 800;
    font-size: clamp(28px, 5vw, 44px);
    margin: 0 0 8px;
    letter-spacing: 0.5px;
    color: var(--orange);
}
</style>
