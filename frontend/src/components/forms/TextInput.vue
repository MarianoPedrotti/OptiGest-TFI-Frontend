<template>

<FormInput v-bind="$props" />

</template>

<script setup lang="ts">

import FormInput from "./FormInput.vue";

defineProps({

    modelValue:[String,Number],

    label:String,

    placeholder:String,

    type:String,

    disabled:Boolean,

    required:Boolean

});

</script>