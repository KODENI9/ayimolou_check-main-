import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { View, ActivityIndicator, Text, Alert } from "react-native";
import { useAuth } from "@clerk/clerk-expo";
import { createOrFetchUser } from "../utils/services/action"; // adapt path si besoin

export default function SSOCallback() {
  const router = useRouter();
  const { isSignedIn, getToken } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const finishSSO = async () => {
      try {
        // attendre la connexion Clerk
        if (!isSignedIn) return;

        // récupérer token pour le backend
        const token = await getToken({ template: "backend" });
        if (!token) {
          Alert.alert("Erreur", "Token non disponible.");
          return;
        }

        // appel API backend
        const response = await createOrFetchUser(token);
        console.log("Profil backend:", response);

        if (response.profileComplete === false) {
          router.replace("/(auth)/complete-profile"); // rediriger vers la complétion du profil
        } else {
          router.replace("/(tabs)/home"); // rediriger vers la page principale
        }
      } catch (err) {
        console.log("Erreur dans SSOCallback:", err);
        Alert.alert("Erreur", "Impossible de finaliser la connexion.");
        router.replace("/(auth)/sign-in");
      } finally {
        setLoading(false);
      }
    };

    finishSSO();
  }, [isSignedIn]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
      <Text className="text-lg" style={{ marginTop: 10 }}>
        Vérification du compte…
      </Text>
    </View>
  );
}
