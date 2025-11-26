import { useAuth, useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { Text, TextInput, TouchableOpacity, View, SafeAreaView, Alert } from "react-native";
import React from "react";
import { createOrFetchUser } from "../../utils/services/action";

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();
  const { getToken } = useAuth();
  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");

  const onSignInPress = async () => {
    if (!isLoaded) return;
    
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
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
      } else {
        console.log(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      Alert.alert("Erreur", "Identifiants incorrects. Vérifie ton e-mail ou ton mot de passe.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gradient-to-b from-gray-50 to-white">
      <View className="flex-1 justify-center items-center px-6">
        <View className="w-full max-w-sm">
          {/* Logo/Titre avec style moderne */}
          <View className="items-center mb-10">
            <View className="w-200 h-20 rounded-full bg-gradient-to-br from-primary to-yellow-400 items-center justify-center mb-4 shadow-lg">
              <Text className="text-2xl font-bold text-gray-900">AYIMOLOU</Text>
            </View>
            <Text className="text-4xl font-bold text-gray-900 mb-2">
              Connexion
            </Text>
            <Text className="text-gray-600 text-center">
              Connectez-vous à votre compte
            </Text>
          </View>

          {/* Champ Email avec style amélioré */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2 ml-1">
              Adresse e-mail
            </Text>
            <TextInput
              autoCapitalize="none"
              value={emailAddress}
              placeholder="exemple@email.com"
              placeholderTextColor="#9CA3AF"
              onChangeText={setEmailAddress}
              className="bg-white border-2 border-gray-200 rounded-2xl p-4 text-gray-900 text-base shadow-sm focus:border-primary"
              keyboardType="email-address"
            />
          </View>

          {/* Champ Mot de passe avec style amélioré */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-2 ml-1">
              Mot de passe
            </Text>
            <TextInput
              value={password}
              placeholder="••••••••"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              onChangeText={setPassword}
              className="bg-white border-2 border-gray-200 rounded-2xl p-4 text-gray-900 text-base shadow-sm focus:border-primary"
            />
          </View>

          {/* Bouton Se connecter avec gradient */}
          <TouchableOpacity
            onPress={onSignInPress}
            className="bg-primary py-4 rounded-2xl mb-4 shadow-lg active:opacity-90"
          >
            <Text className="text-gray-900 text-center text-lg font-bold">
              Se connecter
            </Text>
          </TouchableOpacity>

          {/* Lien vers l'inscription */}
          <View className="flex-row justify-center mt-4">
            <Text className="text-gray-600">Pas encore de compte ? </Text>
            <Link href="/(auth)/sign-up">
              <Text className="text-primary font-bold">S'inscrire</Text>
            </Link>
          </View>

          {/* Mot de passe oublié */}
          <View className="flex-row justify-center mt-4">
            <Link href="/(auth)/reset-password">
              <Text className="text-gray-500 text-sm font-medium">
                Mot de passe oublié ?
              </Text>
            </Link>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
     