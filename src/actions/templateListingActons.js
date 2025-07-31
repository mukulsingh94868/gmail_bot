import { apiRequest } from "@/api/api";
import { getAuthToken } from "@/utils/CookieData";

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