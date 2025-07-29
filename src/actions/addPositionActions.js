import { apiRequest } from "@/api/api";

export const fetchOptions = async (urlData) => {
    try {
        const result = await apiRequest({
            url: urlData,
            method: "GET",
        });
        const res = result;
        console.log('result', result);
        return res;
    } catch (error) {
        console.error('Error', error);
    }
}