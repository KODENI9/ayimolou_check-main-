import React, { useState } from "react";
import { View, Text, TextInput, Switch, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { updateUserProfile } from "../services/action";

export default function CompleteProfile() {
  const router = useRouter();
  const { getToken } = useAuth();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    location: "",
    bio: "",
    role: "client", // Par défaut
    vendor: {
      shopName: "",
      description: "",
      workingHours: "",
    },
  });

  const [isVendor, setIsVendor] = useState(false);

  const handleSubmit = async () => {
    if (!form.firstName || !form.lastName || !form.phoneNumber) {
      return Alert.alert("Champs manquants", "Veuillez remplir tous les champs obligatoires.");
    }

    try {
      const token = await getToken();
      if (!token) {
        Alert.alert("Erreur d'authentification", "Impossible d'obtenir le token utilisateur.");
        return;
      }
      const res = await updateUserProfile(token, {
        ...form,
        role: isVendor ? "vendeuse" : "client",
      });

      if (res.success) {
        Alert.alert("Profil mis à jour", "Votre profil est maintenant complet !");
        router.replace("/home");
      } else {
        Alert.alert("Erreur", "Impossible de sauvegarder votre profil.");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Erreur", "Une erreur s'est produite.");
    }
  };

  return (
    <ScrollView className="flex-1 bg-white p-6">
      <Text className="text-2xl font-bold mb-4 text-center">
        Compléter votre profil
      </Text>

      {/* Nom & Prénom */}
      <TextInput
        placeholder="Prénom"
        value={form.firstName}
        onChangeText={(t) => setForm({ ...form, firstName: t })}
        className="border border-gray-300 rounded-lg p-3 mb-3"
      />
      <TextInput
        placeholder="Nom"
        value={form.lastName}
        onChangeText={(t) => setForm({ ...form, lastName: t })}
        className="border border-gray-300 rounded-lg p-3 mb-3"
      />

      {/* Téléphone */}
      <TextInput
        placeholder="Numéro de téléphone"
        keyboardType="phone-pad"
        value={form.phoneNumber}
        onChangeText={(t) => setForm({ ...form, phoneNumber: t })}
        className="border border-gray-300 rounded-lg p-3 mb-3"
      />

      {/* Localisation */}
      <TextInput
        placeholder="Ville / Adresse"
        value={form.location}
        onChangeText={(t) => setForm({ ...form, location: t })}
        className="border border-gray-300 rounded-lg p-3 mb-3"
      />

      {/* Bio */}
      <TextInput
        placeholder="Bio (parlez un peu de vous)"
        value={form.bio}
        onChangeText={(t) => setForm({ ...form, bio: t })}
        multiline
        numberOfLines={3}
        className="border border-gray-300 rounded-lg p-3 mb-3"
      />

      {/* Switch entre Client / Vendeuse */}
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-lg font-medium">Je suis une vendeuse</Text>
        <Switch
          value={isVendor}
          onValueChange={(val) => {
            setIsVendor(val);
            setForm({
              ...form,
              role: val ? "vendeuse" : "client",
            });
          }}
        />
      </View>

      {/* Champs vendeuse */}
      {isVendor && (
        <View className="mb-4">
          <TextInput
            placeholder="Nom de la boutique"
            value={form.vendor.shopName}
            onChangeText={(t) =>
              setForm({
                ...form,
                vendor: { ...form.vendor, shopName: t },
              })
            }
            className="border border-gray-300 rounded-lg p-3 mb-3"
          />
          <TextInput
            placeholder="Description de la boutique"
            value={form.vendor.description}
            onChangeText={(t) =>
              setForm({
                ...form,
                vendor: { ...form.vendor, description: t },
              })
            }
            multiline
            className="border border-gray-300 rounded-lg p-3 mb-3"
          />
          <TextInput
            placeholder="Heures de travail (ex: 8h-18h)"
            value={form.vendor.workingHours}
            onChangeText={(t) =>
              setForm({
                ...form,
                vendor: { ...form.vendor, workingHours: t },
              })
            }
            className="border border-gray-300 rounded-lg p-3 mb-3"
          />
        </View>
      )}

      {/* Bouton */}
      <TouchableOpacity
        onPress={handleSubmit}
        className="bg-blue-600 rounded-xl py-3 mt-2"
      >
        <Text className="text-center text-white font-semibold text-lg">
          Enregistrer
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
