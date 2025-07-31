"use server";

import { apiRequest } from "@/api/api";
import { getAuthToken } from "@/utils/CookieData";
import { revalidatePath } from "next/cache";

export const fetchOptions = async (urlData) => {
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

export const fetchAppliedData = async (urlData) => {
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

export const getPositionChangeData = async (urlData) => {
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

export const positionApplied = async (urlData, payload) => {
    const token = await getAuthToken();
    try {
        const result = await apiRequest({
            url: urlData,
            method: "POST",
            body: payload,
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

export const positionApply = async (urlData, payload) => {
    const token = await getAuthToken();
    try {
        const result = await apiRequest({
            url: urlData,
            method: "POST",
            body: payload,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const res = result;
        revalidatePath('/position');
        return res;
    } catch (error) {
        console.error('Error', error);
    }
};

export const editUserPositions = async (urlData, payload) => {
    const token = await getAuthToken();
    try {
        const result = await apiRequest({
            url: urlData,
            method: "PUT",
            body: payload,
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