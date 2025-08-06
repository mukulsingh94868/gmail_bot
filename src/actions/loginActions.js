"use server";

import { apiRequest } from "@/api/api";

export const registerLoginAction = async (urlData, payload) => {
    try {
        const result = await apiRequest({
            url: urlData,
            method: "POST",
            body: payload,
        });
        const res = result;
        return res;
    } catch (error) {
        console.error('Error', error);
    }
};