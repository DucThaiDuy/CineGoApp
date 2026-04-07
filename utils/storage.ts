import AsyncStorage from "@react-native-async-storage/async-storage";

const TICKETS_KEY = "@cinego_offline_tickets";

export const saveTicketsOffline = async (tickets: any[]) => {
  try {
    const jsonValue = JSON.stringify(tickets);
    await AsyncStorage.setItem(TICKETS_KEY, jsonValue);
  } catch (e) {
    console.error("Error saving tickets offline:", e);
  }
};

export const getOfflineTickets = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(TICKETS_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error("Error getting offline tickets:", e);
    return [];
  }
};
