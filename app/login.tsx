import { Alert, ImageBackground, Pressable, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { Link, useRouter } from "expo-router";
import { Image } from "react-native";
import "./globals.css";
import * as AuthSession from 'expo-auth-session';
import { useAuth, useSSO } from '@clerk/clerk-expo';
import { createOrFetchUser } from "./services/action";

export default function RecapSms() {
  const { startSSOFlow } = useSSO();
  const { getToken } = useAuth();
  const router = useRouter();

  const onGooglePress = async () => {
    try {
      const redirectUrl = AuthSession.makeRedirectUri({
        scheme: 'ayimolou',
        path: 'sso-callback',
      });

      const res = await startSSOFlow({
        strategy: 'oauth_google',
        redirectUrl,
      });

      const { createdSessionId, setActive, signUp, signIn } = res;

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
      }

      // Récupérer l'ID utilisateur Clerk
      let clerkUserId: string | undefined;
      if (signUp && (signUp as any).createdUserId) {
        clerkUserId = (signUp as any).createdUserId;
      }

      if (!clerkUserId) {
        console.log('Impossible de récupérer clerkUserId après SSO');
        return;
      }

      // Après connexion réussie
      const token = await getToken();
      if (!token) {
        Alert.alert('Erreur', 'Token non disponible');
        return;
      }

      const response =  await createOrFetchUser(token);
      console.log("Profil backend :", response);

      if (!response.profileComplete) {
        // Utiliser push au lieu de replace pour une navigation plus fluide
        router.push("/(auth)/complete-profile" as any);
      } else {
        router.replace('/(tabs)/home');
      }

    } catch (err: any) {
      console.error('startSSOFlow error:', err);
      Alert.alert('Erreur', 'Connexion Google échouée.');
    }
  };

  return (
    <SafeAreaView className="flex-1 justify-center items-center bg-primary">
      <View className="items-center bg-primary pt-6 pb-5 mt-28 mb-28">
        <View className="flex-row items-center w-full">
          <ImageBackground
            source={require("../assets/images/ayimolou_1.png")}
            className="w-full h-72"
            resizeMode="contain"
          />
        </View>

        {/* Bouton Google */}
        <TouchableOpacity
          className="flex-row items-center justify-center border border-gray-400 rounded-full py-3 px-4 mb-4"
          onPress={onGooglePress}
        >
          <Image
            source={require("../assets/images/google.png")}
            className="w-5 h-5 mr-2"
          />
          <Text className="text-black">Continuer avec Google</Text>
        </TouchableOpacity>

        {/* Lien de connexion */}
        <Link href="/(auth)/sign-in" asChild>
          <Pressable className="items-center p-3 w-64 bg-black rounded-full m-5">
            <Text className="text-xl text-white">Se connecter !</Text>
          </Pressable>
        </Link>

        <Text className="text-center px-5 text-white/80 text-base">
          Vous recevrez automatiquement un message contenant le code de
          vérification qui vous permettra de valider votre inscription.
        </Text>
      </View>
    </SafeAreaView>
  );
}