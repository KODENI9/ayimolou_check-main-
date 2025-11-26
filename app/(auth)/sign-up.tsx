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
      <SafeAreaView className="flex-1 bg-gradient-to-b from-gray-50 to-white">
        <View className="flex-1 justify-center items-center px-6">
          <View className="w-full max-w-sm">
            <View className="items-center mb-8">
              <View className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-yellow-400 items-center justify-center mb-4 shadow-lg">
                <Text className="text-4xl">📩</Text>
              </View>
              <Text className="text-3xl font-bold text-gray-900 mb-2 text-center">
                Vérifiez votre e-mail
              </Text>
              <Text className="text-gray-600 text-center">
                Entrez le code reçu par e-mail
              </Text>
            </View>

            <View className="mb-6">
              <Text className="text-sm font-medium text-gray-700 mb-2 ml-1">
                Code de vérification
              </Text>
              <TextInput
                value={code}
                onChangeText={setCode}
                placeholder="123456"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                className="bg-white border-2 border-gray-200 rounded-2xl p-4 w-full text-gray-900 text-center text-2xl font-bold tracking-widest shadow-sm focus:border-primary"
                maxLength={6}
              />
            </View>

            <TouchableOpacity
              onPress={onVerifyPress}
              className="bg-primary w-full p-4 rounded-2xl shadow-lg active:opacity-90"
            >
              <Text className="text-gray-900 text-center font-bold text-lg">
                Vérifier
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // 🔹 Étape : Formulaire d'inscription
  return (
    <SafeAreaView className="flex-1 bg-gradient-to-b from-gray-50 to-white">
      <View className="flex-1 justify-center items-center px-6">
        <View className="w-full max-w-sm">
          {/* Header avec logo */}
          <View className="items-center mb-10">
            <View className="w-200 h-20 rounded-full bg-gradient-to-br from-primary to-yellow-400 items-center justify-center mb-4 shadow-lg">
              <Text className="text-2xl font-bold text-gray-900">AYIMOLOU</Text>
            </View>
            <Text className="text-4xl font-bold text-gray-900 mb-2">
              Créer un compte ✨
            </Text>
            <Text className="text-gray-600 text-center">
              Rejoignez-nous dès aujourd'hui
            </Text>
          </View>

          <View className="w-full space-y-4">
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2 ml-1">
                Adresse e-mail
              </Text>
              <TextInput
                autoCapitalize="none"
                value={emailAddress}
                onChangeText={setEmailAddress}
                placeholder="exemple@email.com"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                className="bg-white border-2 border-gray-200 rounded-2xl p-4 text-gray-900 text-base shadow-sm focus:border-primary"
              />
            </View>

            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2 ml-1">
                Mot de passe
              </Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor="#9CA3AF"
                secureTextEntry
                className="bg-white border-2 border-gray-200 rounded-2xl p-4 text-gray-900 text-base shadow-sm focus:border-primary"
              />
              <Text className="text-xs text-gray-500 mt-2 ml-1">
                Au moins 8 caractères avec majuscule, minuscule, chiffre et symbole
              </Text>
            </View>

            <TouchableOpacity
              onPress={onSignUpPress}
              className="bg-primary w-full p-4 rounded-2xl mt-6 shadow-lg active:opacity-90"
            >
              <Text className="text-gray-900 text-center text-lg font-bold">
                Continuer
              </Text>
            </TouchableOpacity>

            <View className="flex-row justify-center mt-6">
              <Text className="text-gray-600">Déjà un compte ? </Text>
              <Link href="/(auth)/sign-in" asChild>
                <TouchableOpacity>
                  <Text className="text-primary font-bold">Se connecter</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
