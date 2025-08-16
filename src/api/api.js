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

  const dataUrl = `${process.env.NEXT_PUBLIC_APP}/api/${url}`;

  try {
    const response = await fetch(dataUrl, options);

    // Try to parse JSON safely
    let data;
    try {
      data = await response.json();
    } catch {
      data = { message: "Invalid JSON response" };
    }

    if (!response.ok) {
      // Always throw a structured error
      throw { status: response.status, data };
    }

    return data; // ✅ success
  } catch (error) {
    console.error("API Error:", error);

    // Normalize error so caller always gets { error: "..." }
    if (error?.data) {
      return { error: error.data?.message || "API request failed" };
    }

    return { error: error?.data?.message || "Network error" };
  }
};
