import * as React from "react";
import { Text, TextInput, TouchableOpacity, View, Alert, SafeAreaView } from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");

  // ✅ Validation e-mail
  const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  // ✅ Validation mot de passe
  const isStrongPassword = (password: string) =>
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password) &&
    /[^A-Za-z0-9]/.test(password);

  // 🔹 Étape 1 : Création du compte
  const onSignUpPress = async () => {
    if (!isLoaded) return;

    if (!isValidEmail(emailAddress)) {
      Alert.alert("Erreur", "Veuillez entrer une adresse e-mail valide.");
      return;
    }
    if (!isStrongPassword(password)) {
      Alert.alert(
        "Mot de passe faible",
        "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un symbole."
      );
      return;
    }

    try {
      await signUp.create({ emailAddress, password });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      const messages = err.errors?.map((e: any) => e.longMessage).join("\n");
      Alert.alert("Erreur d’inscription", messages || "Une erreur est survenue.");
    }
  };

  // 🔹 Étape 2 : Vérification du code
  const onVerifyPress = async () => {
    if (!isLoaded) return;

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({ code });

      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        Alert.alert("Succès", "Compte vérifié !");
        router.replace("/");
      } else {
        Alert.alert("Erreur", "Vérification incomplète, réessayez.");
      }
    } catch (err: any) {
      Alert.alert("Erreur", "Code invalide ou expiré.");
    }
  };

  // 🔹 Étape : Vérification du code
  if (pendingVerification) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white px-6">
        <Text className="text-2xl font-bold text-gray-900 mb-6">
          Vérifiez votre e-mail 📩
        </Text>
        <TextInput
          value={code}
          onChangeText={setCode}
          placeholder="Entrez le code reçu"
          keyboardType="numeric"
          className="border border-gray-300 rounded-xl p-4 w-full text-gray-800 mb-4"
        />
        <TouchableOpacity
          onPress={onVerifyPress}
          className="bg-black w-full p-4 rounded-xl"
        >
          <Text className="text-white text-center font-semibold text-lg">
            Vérifier
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // 🔹 Étape : Formulaire d'inscription
  return (
    <SafeAreaView className="flex-1 justify-center items-center bg-white px-6">
      <Text className="text-3xl font-bold text-gray-900 mb-8">Créer un compte ✨</Text>

      <View className="w-full space-y-4">
        <TextInput
          autoCapitalize="none"
          value={emailAddress}
          onChangeText={setEmailAddress}
          placeholder="Adresse e-mail"
          keyboardType="email-address"
          className="border border-gray-300 rounded-xl p-4 text-gray-800"
        />

        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Mot de passe"
          secureTextEntry
          className="border border-gray-300 rounded-xl p-4 text-gray-800"
        />

        <TouchableOpacity
          onPress={onSignUpPress}
          className="bg-black w-full p-4 rounded-xl mt-4"
        >
          <Text className="text-white text-center text-lg font-semibold">
            Continuer
          </Text>
        </TouchableOpacity>

        <View className="flex-row justify-center mt-4">
          <Text className="text-gray-700">Déjà un compte ? </Text>
          <Link href="/sign-in" asChild>
            <TouchableOpacity>
              <Text className="text-blue-600 font-semibold">Se connecter</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}
