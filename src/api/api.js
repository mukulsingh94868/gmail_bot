export const apiRequest = async ({
  url,
  method = "GET",
  body = null,
  headers = {},
}) => {
  const finalHeaders = {
    "Content-Type": "application/json",
    ...headers,
  };

  const options = {
    method,
    headers: finalHeaders,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP}/api/${url}`, options);
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
