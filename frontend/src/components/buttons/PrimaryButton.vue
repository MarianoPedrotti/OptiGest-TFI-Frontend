<template>

<button
    class="primary-button"
>

    <slot/>

</button>

</template>

<style scoped>

.primary-button{

    background:var(--color-primary);

    color:black;

    border:none;

    border-radius:10px;

    padding:12px 20px;

    font-weight:700;

    display:inline-flex;

    align-items:center;

    justify-content:center;

    min-height:44px;

    max-width:100%;

    transition:.25s;

}

.primary-button:hover{

    background:var(--color-primary-hover);

}

@media (max-width: 575.98px){

    .primary-button{

        width:100%;

    }

}

</style>
