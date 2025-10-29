import React, { useState } from "react";
import {

View,
Text,
TextInput,
TouchableOpacity,
StyleSheet,
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
        style={styles.container}
        behavior={Platform.select({ ios: "padding", android: undefined })}
    >
        <ScrollView contentContainerStyle={styles.inner} keyboardShouldPersistTaps="handled">
            <Text style={styles.title}>Réinitialiser le mot de passe</Text>

            {error ? <Text style={styles.error}>{error}</Text> : null}
            {message ? <Text style={styles.success}>{message}</Text> : null}

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Nouveau mot de passe</Text>
                <View style={styles.row}>
                    <TextInput
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                        placeholder="Entrez votre nouveau mot de passe"
                        style={styles.input}
                        autoCapitalize="none"
                        textContentType="newPassword"
                    />
                    <TouchableOpacity onPress={() => setShowPassword((s) => !s)} style={styles.toggle}>
                        <Text style={styles.toggleText}>{showPassword ? "Cacher" : "Voir"}</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Confirmer le mot de passe</Text>
                <TextInput
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showPassword}
                    placeholder="Confirmez le mot de passe"
                    style={styles.input}
                    autoCapitalize="none"
                    textContentType="password"
                />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Valider</Text>}
            </TouchableOpacity>

            <TouchableOpacity style={styles.link} onPress={() => navigation?.goBack?.()}>
                <Text style={styles.linkText}>Annuler / Retour</Text>
            </TouchableOpacity>
        </ScrollView>
    </KeyboardAvoidingView>
);
}

const styles = StyleSheet.create({
container: { flex: 1, backgroundColor: "#fff" },
inner: { padding: 24, justifyContent: "center", flexGrow: 1 },
title: { fontSize: 22, fontWeight: "700", marginBottom: 20, textAlign: "center" },
inputGroup: { marginBottom: 16 },
label: { marginBottom: 6, color: "#333" },
input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: "#fafafa",
},
row: { flexDirection: "row", alignItems: "center" },
toggle: { marginLeft: 8, padding: 8 },
toggleText: { color: "#007AFF" },
button: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
},
buttonText: { color: "#fff", fontWeight: "600" },
link: { marginTop: 12, alignItems: "center" },
linkText: { color: "#007AFF" },
error: { color: "#b00020", marginBottom: 12, textAlign: "center" },
success: { color: "#006400", marginBottom: 12, textAlign: "center" },
});