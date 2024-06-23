import axios from "axios";

export const fetchSentiments = async () => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/article/sentiments`);
    if (response.data && response.status === 200) {
      return {
        Positive: new Set(response.data.Positive),
        Negative: new Set(response.data.Negative),
        Neutral: new Set(response.data.Neutral),
      };
    } else {
      throw new Error("Failed to fetch sentiments: Invalid response data");
    }
  } catch (error) {
    console.error("Error fetching sentiment options:", error);
    throw error;
  }
};

export default fetchSentiments;
