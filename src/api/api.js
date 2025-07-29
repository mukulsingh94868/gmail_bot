

export const apiRequest = async ({
  url,
  method = "GET",
  body = null,
}) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";
  // const token = getAuthToken();

  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const options = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP}/${url}`, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || "API request failed");
    }

    return data;
  } catch (error) {
    console.error("API Error:", error.message);
    throw error;
  }
};
