import { Alert, ImageBackground, Pressable, SafeAreaView, Text, TouchableOpacity, View, Image } from "react-native";
import { Link, useRouter } from "expo-router";
import * as AuthSession from 'expo-auth-session';
import { useAuth, useSSO } from '@clerk/clerk-expo';
import { createOrFetchUser } from "../utils/services/action";

export default function RecapSms() {
  const { startSSOFlow } = useSSO();

  const router = useRouter();
  const { isSignedIn } = useAuth();
  // ✅ Bouton Google SSO
  const onGooglePress = async () => {
    try {
        if (isSignedIn) {
    router.replace("/(tabs)/home");
    return;
  }
      // Deep link pour Expo / React Native
      
const redirectUrl = AuthSession.makeRedirectUri({
  scheme: 'ayimolou',
  path: 'sso-callback',
});

console.log("Redirect URL utilisée pour SSO:", redirectUrl);

      // Démarrer le flow OAuth avec Clerk
      const res = await startSSOFlow({
        strategy: 'oauth_google',
        redirectUrl,
      });

      const { createdSessionId, setActive } = res;

      // Activer la session Clerk
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
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
