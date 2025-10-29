import * as Location from "expo-location";

export async function getCurrentLocation() {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    alert("Permission de localisation refusée");
    return null;
  }

  let location = await Location.getCurrentPositionAsync({});
  return {
    lat: location.coords.latitude.toString(),
    long: location.coords.longitude.toString(),
  };
}


// lib/actions.ts
import Constants from "expo-constants";

const BASE_URL =
  Constants.expoConfig?.extra?.apiUrl || "http://localhost:3000/api";

export const createOrFetchUser = async (token: string) => {
  try {
    const res = await fetch(`${BASE_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // ✅ On envoie le token Clerk
      },
    });

    return await res.json();
  } catch (error) {
    console.error("Erreur lors de la création du user :", error);
    throw error;
  }
};

export const updateUserProfile = async (token: string, data: any) => {
  try {
    const res = await fetch(`${BASE_URL}/users`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    return await res.json();
  } catch (error) {
    console.error("Erreur update profil :", error);
    throw error;
  }
};
