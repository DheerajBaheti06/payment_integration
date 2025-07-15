import axios from "axios";

export const getSubscriptionStatus = async () => {
  try {
    const response = await axios.get("/api/subscription");
    return response.data.subscription;
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return null;
  }
};

export const updateSubscription = async (planId) => {
  try {
    const response = await axios.post("/api/subscription", { planId });
    return response.data.subscription;
  } catch (error) {
    console.error("Error updating subscription:", error);
    throw error;
  }
};
