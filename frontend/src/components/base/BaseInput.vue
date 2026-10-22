<template>

<div class="mb-3">

    <label
        v-if="label"
        class="form-label"
    >
        {{ label }}
    </label>

    <input
        class="form-control"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :value="modelValue"
        @input="actualizarValor"
    />

</div>

</template>

<script setup lang="ts">

const props = withDefaults(defineProps<{

    modelValue: string | number;

    label?: string;

    placeholder?: string;

    type?: string;

    disabled?: boolean;

    required?: boolean;

}>(),{

    type:"text",

    placeholder:"",

    disabled:false,

    required:false

});

const emit = defineEmits<{

    (e:"update:modelValue", value:string | number):void;

}>();

function actualizarValor(event: Event){

    const target = event.target as HTMLInputElement;

    emit("update:modelValue", target.value);

}

</script>

<style scoped>

.form-label{

    font-weight:600;

    color:var(--color-text);

    margin-bottom:6px;

}

.form-control{

    border-radius:8px;

    border:1px solid var(--color-border);

    transition:var(--transition);

}

.form-control:focus{

    border-color:var(--color-primary);

    box-shadow:0 0 0 .15rem rgba(242,183,5,.25);

}

</style>