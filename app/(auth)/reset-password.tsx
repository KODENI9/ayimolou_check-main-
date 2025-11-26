import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";

type Props = {
navigation?: any;
route?: {
    params?: {
        token?: string; // token venant d'un email (optionnel)
    };
};
};

export default function ResetPasswordScreen({ route, navigation }: Props) {
const token = route?.params?.token ?? "";

const [password, setPassword] = useState<string>("");
const [confirmPassword, setConfirmPassword] = useState<string>("");
const [showPassword, setShowPassword] = useState<boolean>(false);
const [loading, setLoading] = useState<boolean>(false);
const [message, setMessage] = useState<string | null>(null);
const [error, setError] = useState<string | null>(null);

function validate() {
    if (!password || !confirmPassword) {
        setError("Remplissez tous les champs.");
        return false;
    }
    if (password.length < 6) {
        setError("Le mot de passe doit contenir au moins 6 caractères.");
        return false;
    }
    if (password !== confirmPassword) {
        setError("Les mots de passe ne correspondent pas.");
        return false;
    }
    return true;
}

async function handleSubmit() {
    setError(null);
    setMessage(null);
    if (!validate()) return;

    setLoading(true);
    try {
        // Remplacez l'URL par celle de votre backend
        const response = await fetch("https://votre-backend.example.com/api/auth/reset-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                token, // si votre endpoint nécessite un token
                password,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data?.message || "Échec de la réinitialisation.");
        }

        setMessage("Mot de passe mis à jour avec succès.");
        // Optionnel : rediriger vers la page de connexion après un délai
        setTimeout(() => navigation?.navigate?.("Login"), 1200);
    } catch (err: any) {
        setError(err.message || "Une erreur est survenue.");
    } finally {
        setLoading(false);
    }
}

return (
    <KeyboardAvoidingView
        className="flex-1 bg-gradient-to-b from-gray-50 to-white"
        behavior={Platform.select({ ios: "padding", android: undefined })}
    >
        <ScrollView 
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }} 
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
        >
            <View className="w-full max-w-sm mx-auto">
                <View className="items-center mb-8">
                    <View className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-yellow-400 items-center justify-center mb-4 shadow-lg">
                        <Text className="text-3xl">🔒</Text>
                    </View>
                    <Text className="text-3xl font-bold text-gray-900 mb-2 text-center">
                        Réinitialiser le mot de passe
                    </Text>
                    <Text className="text-gray-600 text-center">
                        Créez un nouveau mot de passe sécurisé
                    </Text>
                </View>

                {error ? (
                    <View className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 mb-4">
                        <Text className="text-red-700 text-center font-medium">{error}</Text>
                    </View>
                ) : null}
                {message ? (
                    <View className="bg-green-50 border-2 border-green-200 rounded-2xl p-4 mb-4">
                        <Text className="text-green-700 text-center font-medium">{message}</Text>
                    </View>
                ) : null}

                <View className="mb-4">
                    <Text className="text-sm font-medium text-gray-700 mb-2 ml-1">Nouveau mot de passe</Text>
                    <View className="flex-row items-center">
                        <TextInput
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                            placeholder="••••••••"
                            placeholderTextColor="#9CA3AF"
                            className="flex-1 bg-white border-2 border-gray-200 rounded-2xl p-4 text-gray-900 text-base shadow-sm"
                            autoCapitalize="none"
                            textContentType="newPassword"
                        />
                        <TouchableOpacity 
                            onPress={() => setShowPassword((s) => !s)} 
                            className="ml-3 px-4 py-2"
                        >
                            <Text className="text-primary font-semibold">{showPassword ? "Cacher" : "Voir"}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View className="mb-6">
                    <Text className="text-sm font-medium text-gray-700 mb-2 ml-1">Confirmer le mot de passe</Text>
                    <TextInput
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry={!showPassword}
                        placeholder="••••••••"
                        placeholderTextColor="#9CA3AF"
                        className="bg-white border-2 border-gray-200 rounded-2xl p-4 text-gray-900 text-base shadow-sm"
                        autoCapitalize="none"
                        textContentType="password"
                    />
                </View>

                <TouchableOpacity 
                    className="bg-primary rounded-2xl py-4 mb-4 shadow-lg active:opacity-90" 
                    onPress={handleSubmit} 
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#111827" />
                    ) : (
                        <Text className="text-gray-900 text-center text-lg font-bold">Valider</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity 
                    className="items-center py-3" 
                    onPress={() => navigation?.goBack?.()}
                >
                    <Text className="text-gray-600 font-medium">Annuler / Retour</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    </KeyboardAvoidingView>
);
}
