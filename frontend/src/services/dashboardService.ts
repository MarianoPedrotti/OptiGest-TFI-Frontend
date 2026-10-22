import api from "./api";

export default {

    async obtener() {

        const response =
            await api.get("/Dashboard");

        return response.data;

    }

}