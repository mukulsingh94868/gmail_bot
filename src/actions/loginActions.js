// "use server";

// import { apiRequest } from "@/api/api";

// export const registerLoginAction = async (urlData, payload) => {
//     try {
//         const result = await apiRequest({
//             url: urlData,
//             method: "POST",
//             body: payload,
//         });
//         const res = result;
//         return res;
//     } catch (error) {
//         console.error('Error', error);
//     }
// };

"use server";

import { apiRequest } from "@/api/api";

export const registerLoginAction = async (urlData, payload) => {
  try {
    const result = await apiRequest({
      url: urlData,
      method: "POST",
      body: payload,
    });

    return result;
  } catch (error) {
    console.error("Error in registerLoginAction:", error);

    if (error.response?.data) {
      return error.response.data;
    }

    // Default fallback
    return { error: "Network error" };
  }
};
