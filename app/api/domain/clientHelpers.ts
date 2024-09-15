export const getDomain = async (domain: string) => {
  try {
    const response = await fetch(`/api/domain/${domain}`, {
      method: "GET",
    });
    const domainData = await response.json();
    return domainData;
  } catch (error) {
    console.error("Error fetching domain token:", error);
    return "";
  }
};
