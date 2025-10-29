import { useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { Text, TextInput, TouchableOpacity, View, SafeAreaView, Alert } from "react-native";
import React from "react";

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

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
        router.replace("/(tabs)/home");
      } else {
        console.log(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      Alert.alert("Erreur", "Identifiants incorrects. Vérifie ton e-mail ou ton mot de passe.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white justify-center items-center px-6">
      <View className="w-full max-w-sm">
        {/* ✅ Titre */}
        <Text className="text-3xl font-bold text-center text-black mb-8">
          Connexion
        </Text>

        {/* ✅ Champ Email */}
        <TextInput
          autoCapitalize="none"
          value={emailAddress}
          placeholder="Adresse e-mail"
          placeholderTextColor="#888"
          onChangeText={setEmailAddress}
          className="border border-gray-300 rounded-xl p-4 mb-4 text-black"
          keyboardType="email-address"
        />

        {/* ✅ Champ Mot de passe */}
        <TextInput
          value={password}
          placeholder="Mot de passe"
          placeholderTextColor="#888"
          secureTextEntry
          onChangeText={setPassword}
          className="border border-gray-300 rounded-xl p-4 mb-6 text-black"
        />

        {/* ✅ Bouton Se connecter */}
        <TouchableOpacity
          onPress={onSignInPress}
          className="bg-black py-4 rounded-xl mb-4"
        >
          <Text className="text-white text-center text-lg font-semibold">
            Se connecter
          </Text>
        </TouchableOpacity>

        {/* ✅ Lien vers l'inscription */}
        <View className="flex-row justify-center mt-2">
          <Text className="text-gray-600">Pas encore de compte ? </Text>
          <Link href="/(auth)/sign-up">
            <Text className="text-blue-600 font-medium">S'inscrire</Text>
          </Link>
        </View>

        {/* ✅ Mot de passe oublié */}
        <View className="flex-row justify-center mt-3">
          <Link href="/(auth)/reset-password">
            <Text className="text-gray-500 text-sm">Mot de passe oublié ?</Text>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}
