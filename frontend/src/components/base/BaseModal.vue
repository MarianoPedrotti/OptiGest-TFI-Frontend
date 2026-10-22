<template>

<div
    v-if="show"
    class="modal-backdrop"
    @click.self="$emit('close')"
>

    <div class="modal-card">

        <div class="modal-header">

            <h4>{{ title }}</h4>

            <button
                class="btn-close"
                @click="$emit('close')"
            >

                <i class="bi bi-x-lg"></i>

            </button>

        </div>

        <div class="modal-body">

            <slot/>

        </div>

    </div>

</div>

</template>
<script setup lang="ts">

defineProps<{

    show:boolean

    title:string

}>();

defineEmits(["close"]);

</script>
<style scoped>

.modal-backdrop{

    position:fixed;

    inset:0;

    background:rgba(0,0,0,.45);

    display:flex;

    justify-content:center;

    align-items:center;

    padding:16px;

    z-index:9999;

    animation:fade .18s ease;

}

.modal-card{

    width:700px;

    max-width:95%;

    max-height:calc(100dvh - 32px);

    background:white;

    border-radius:12px;

    overflow:hidden;

    display:flex;

    flex-direction:column;

    box-shadow:0 10px 40px rgba(0,0,0,.25);

    animation:scale .2s ease;

}

.modal-header{

    padding:18px 25px;

    border-bottom:1px solid #ececec;

    display:flex;

    justify-content:space-between;

    align-items:center;

}

.modal-header h4{

    margin:0;

    color:#7A1E24;

    font-weight:600;

}

.modal-body{

    padding:25px;

    overflow-y:auto;

}

.btn-close{

    border:none;

    background:none;

    font-size:20px;

    cursor:pointer;

    color:#666;

}

.btn-close:hover{

    color:#7A1E24;

}

@keyframes fade{

    from{

        opacity:0;

    }

    to{

        opacity:1;

    }

}

@keyframes scale{

    from{

        transform:scale(.95);

        opacity:0;

    }

    to{

        transform:scale(1);

        opacity:1;

    }

}

@media (max-width: 575.98px){

    .modal-backdrop{

        align-items:flex-start;

        padding:12px;

    }

    .modal-card{

        width:100%;

        max-width:100%;

        max-height:calc(100dvh - 24px);

    }

    .modal-header{

        padding:14px 16px;

        gap:12px;

    }

    .modal-body{

        padding:16px;

    }

}

</style>
