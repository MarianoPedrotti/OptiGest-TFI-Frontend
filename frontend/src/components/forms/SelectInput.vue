<template>

<div class="mb-3">

    <label
        v-if="label"
        class="form-label"
    >
        {{ label }}
    </label>

    <select
        class="form-select"
        :value="modelValue"
        @change="actualizar"
    >

        <option
            v-if="placeholder"
            disabled
            value=""
        >
            {{ placeholder }}
        </option>

        <slot/>

    </select>

</div>

</template>

<script setup lang="ts">

const props = defineProps<{

    modelValue:string | number

    label?:string

    placeholder?:string

}>();

const emit = defineEmits(["update:modelValue"]);

function actualizar(event: Event) {

    const target = event.target as HTMLSelectElement;

    const value = isNaN(Number(target.value))
        ? target.value
        : Number(target.value);

    emit("update:modelValue", value);

}

</script>

<style scoped>

.form-label{

    font-weight:600;

    margin-bottom:6px;

}

.form-select{

    border-radius:8px;

    border:1px solid var(--color-border);

}

.form-select:focus{

    border-color:var(--color-primary);

    box-shadow:0 0 0 .15rem rgba(242,183,5,.25);

}

</style>