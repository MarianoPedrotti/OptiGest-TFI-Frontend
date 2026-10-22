<template>

<div class="card">

    <slot/>

</div>

</template>

<style scoped>

.card{

    background:white;

    border-radius:15px;

    padding:25px;

    box-shadow:0 5px 15px rgba(0,0,0,.08);

}

@media (max-width: 575.98px){

    .card{

        padding:16px;

        border-radius:12px;

    }

}

</style>
