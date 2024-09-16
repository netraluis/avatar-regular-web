export const getDomain = async (domain: string) => {
  try {
    // const response = await fetch(`/api/domain/${domain}`, {
    //   method: "GET",
    // });
    // const domainData = await response.json();
    // console.log("Domain data:", domainData);
    const domainData = {
      domain: {
        assistantId: "asst_lwr5WIVDFjoV8pL0CHic2BFd",
        assistantName: "AI Andorra UE",
        createdAt: "2024-09-15T07:40:15.585Z",
        customDomain: "null",
        id: "fm11ujxfx0000137h7qmc5f73",
        logo: "https://sjgdbtgjgkkmztduxohh.supabase.co/storage/v1/object/public/images/logos/fm11ujxfx0000137h7qmc5f73.png",

        menufooter: "Fet amb 🖤  a Andorra i per andorra",
        name: "andorra UE",
        subDomain: "andorraue",
        welcome: "Benvingut a Andorra UE",
      },
      status: 200,
    };
    return domainData;
  } catch (error) {
    console.error("Error fetching domain token:", error);
    return "";
  }
};
