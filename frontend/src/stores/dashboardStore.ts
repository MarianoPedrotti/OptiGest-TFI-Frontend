import { defineStore } from "pinia";
import { ref } from "vue";

import dashboardService from "../services/dashboardService";

import type { Dashboard } from "../types/Dashboard";

export const useDashboardStore = defineStore("dashboard", () => {

    const dashboard = ref<Dashboard | null>(null);

    async function cargar() {

        dashboard.value =
            await dashboardService.obtener();

    }

    return {

        dashboard,

        cargar

    };

});