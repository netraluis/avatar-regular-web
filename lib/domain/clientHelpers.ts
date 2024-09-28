export const getDomain = async (domain: string) => {
  try {
    const response = await fetch(`/api/domain/${domain}`, {
      method: "GET",
    });
    return await response.json();
  } catch (error) {
    console.error("Error fetching domain token:", error);
    return "";
  }
};
