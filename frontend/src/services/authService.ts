import type { LoginRequest, LoginResponse } from '../types/auth';
import { guardarSesion, borrarSesion, obtenerSesion } from '../utils/auth';
import api from '../services/api';
import {ENDPOINTS}  from '../services/endpoints';

class AuthService {
  async login(dto: LoginRequest) {
    const response = await api.post<LoginResponse>(
      `${ENDPOINTS.auth}/login`,
      dto
    );

    const session = response.data;
    guardarSesion(session);
    return session;
  }

  logout() {
    borrarSesion();
  }

  getSession(): LoginResponse | null {
    return obtenerSesion();
  }

  getToken() {
    return this.getSession()?.token;
  }

  estaLogueado() {
    return this.getSession() !== null;
  }
}

export default new AuthService();