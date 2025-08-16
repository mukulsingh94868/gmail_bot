import { apiRequest } from "@/api/api";
import { getAuthToken } from "@/utils/CookieData";

export const handleJobPost = async (urlData, payload) => {
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
    console.error("Error", error);
  }
};
