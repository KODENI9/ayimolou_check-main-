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

import Constants from "expo-constants";

const BASE_URL =
  Constants.expoConfig?.extra?.apiUrl || " http://10.253.16.218:3000/api";

export const createOrFetchUser = async (token: string) => {
  try {
    console.log("Création ou récupération du user avec le token :", token);
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

export const updateUserProfile = async (token: string, data: any , id: string) => {
  try {
    console.log("Mise à jour du profil avec les données :", data);
    console.log("Mise à jour du profil pour l'utilisateur ID :", id);
    const res = await fetch(`${BASE_URL}/users/${id}`, {
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

export const fetchUserProfile = async (token: string, id: string) => {
  try {
    const res = await fetch(`${BASE_URL}/users/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return await res.json();
  } catch (error) {
    console.error("Erreur fetch profil :", error);
    throw error;
  }
}