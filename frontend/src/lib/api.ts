import axios from 'axios';
export const api = axios.create({ baseURL: '/backend', withCredentials: true, headers: { 'Content-Type': 'application/json' } });
export function apiMessage(error: unknown, fallback = 'Não foi possível concluir a operação.') { return axios.isAxiosError(error) ? error.response?.data?.error ?? fallback : fallback; }
let unauthorizedHandler: (() => void) | undefined;
export function setUnauthorizedHandler(handler: (() => void) | undefined) { unauthorizedHandler = handler; }
let authChangedHandler: (() => void) | undefined;
export function setAuthChangedHandler(handler: (() => void) | undefined) { authChangedHandler = handler; }
api.interceptors.response.use((response) => { if (response.config.url?.includes('/api/auth/sign-in') || response.config.url?.includes('/api/auth/sign-up')) authChangedHandler?.(); return response; }, (error: unknown) => { if (axios.isAxiosError(error) && error.response?.status === 401) unauthorizedHandler?.(); return Promise.reject(error); });
