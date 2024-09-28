import { $host } from "./index";
import {AuthType} from "@/types/users";
import {AxiosError} from "axios";

export const register = async (email: string, password: string): Promise<AuthType | string> => {
    try {
        const { data } = await $host.post('api/Auth/register', { email, password });
        return data;
    } catch (e: unknown) {
        if (e instanceof AxiosError) {
            return e.response ? e.response.data.error : 'An unknown error occurred';
        } else {
            return 'An unknown error occurred';
        }
    }
}

export const login = async (email: string, password: string): Promise<AuthType | string> => {
    try {
        const { data } = await $host.post('api/Auth/login', { email, password });
        return data;
    } catch (e: unknown) {
        if (e instanceof AxiosError) {
            return e.response ? e.response.data.error : 'An unknown error occurred';
        } else {
            return 'An unknown error occurred';
        }
    }
};
