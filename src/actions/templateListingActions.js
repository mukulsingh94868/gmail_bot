"use server";

import { apiRequest } from "@/api/api";
import { getAuthToken } from "@/utils/CookieData";
import { revalidatePath } from "next/cache";

export const fetchTemplates = async (urlData) => {
    const token = await getAuthToken();
    try {
        const result = await apiRequest({
            url: urlData,
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const res = result;
        return res;
    } catch (error) {
        console.error('Error', error);
    }
};

export const getUserPositionsById = async (urlData) => {
    const token = await getAuthToken();
    try {
        const result = await apiRequest({
            url: urlData,
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const res = result;
        return res;
    } catch (error) {
        console.error('Error', error);
    }
};

export const deleteUserPositions = async (urlData) => {
    const token = await getAuthToken();
    try {
        const result = await apiRequest({
            url: urlData,
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const res = result;
        revalidatePath('/template-listing');
        return res;
    } catch (error) {
        console.error('Error', error);
    }
};