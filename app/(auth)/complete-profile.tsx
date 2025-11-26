import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Switch,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  LayoutAnimation,
  UIManager
} from "react-native";
import { useAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { updateUserProfile } from "../../utils/services/action";

// Activation de l'animation de layout pour Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Composant réutilisable pour les champs de saisie (plus propre)
const InputField = ({ label, icon, value, onChangeText, placeholder, multiline = false, keyboardType = "default" }) => (
  <View className="mb-5">
    <Text className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">
      {label}
    </Text>
    <View className={`flex-row items-start bg-gray-50 border border-gray-200 rounded-xl px-4 ${multiline ? 'py-3' : 'h-14 items-center'}`}>
      <Ionicons name={icon} size={20} color="#6B7280" style={{ marginRight: 10, marginTop: multiline ? 2 : 0 }} />
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        multiline={multiline}
        textAlignVertical={multiline ? "top" : "center"}
        className={`flex-1 text-gray-900 text-base font-medium ${multiline ? 'h-24' : ''}`}
      />
    </View>
  </View>
);

export default function CompleteProfile() {
  const router = useRouter();
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    location: "",
    bio: "",
    role: "client",
    vendor: {
      shopName: "",
      description: "",
      workingHours: "",
    },
  });

  const [isVendor, setIsVendor] = useState(false);

  const toggleVendor = (val) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsVendor(val);
    setForm({ ...form, role: val ? "vendeuse" : "client" });
  };
  const { userId } = useAuth();
  const handleSubmit = async () => {
    if (!form.firstName || !form.lastName || !form.phoneNumber) {
      return Alert.alert("Oups !", "Merci de remplir les champs obligatoires (Nom, Prénom, Tél).");
    }

    setLoading(true);
    try {
      const token = await getToken();
      if (!token) throw new Error("Authentification requise");

      const res = await updateUserProfile(token, {
        ...form,
        role: isVendor ? "vendeuse" : "client",
      }, userId as string);

      if (res.success) {
        Alert.alert("Succès 🎉", "Votre profil a été mis à jour avec succès !");
        router.replace("/(tabs)/home");
      } else {
        Alert.alert("Erreur", "Impossible de sauvegarder votre profil.");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Erreur", "Une erreur technique est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Header Section */}
        <View className="pt-12 pb-8 px-6 bg-white">
          <View className="flex-row items-center mb-2">
             <TouchableOpacity onPress={() => router.back()} className="mr-4 p-2 bg-gray-100 rounded-full">
                <Ionicons name="arrow-back" size={24} color="black" />
             </TouchableOpacity>
             <Text className="text-3xl font-bold text-slate-900">Mon Profil</Text>
          </View>
          <Text className="text-gray-500 text-base mt-1 leading-6">
            Complétez vos informations pour accéder à toutes les fonctionnalités.
          </Text>
        </View>

        {/* Formulaire */}
        <View className="px-6">
          
          {/* Infos Personnelles */}
          <View className="mb-6">
            <Text className="text-lg font-bold text-slate-800 mb-4">Informations personnelles</Text>
            
            <View className="flex-row gap-3">
              <View className="flex-1">
                <InputField 
                  label="Prénom *" 
                  icon="person-outline" 
                  placeholder="Jean" 
                  value={form.firstName} 
                  onChangeText={(t) => setForm({ ...form, firstName: t })} 
                />
              </View>
              <View className="flex-1">
                <InputField 
                  label="Nom *" 
                  icon="person-outline" 
                  placeholder="Dupont" 
                  value={form.lastName} 
                  onChangeText={(t) => setForm({ ...form, lastName: t })} 
                />
              </View>
            </View>

            <InputField 
              label="Téléphone *" 
              icon="call-outline" 
              placeholder="+33 6 12 34 56 78" 
              keyboardType="phone-pad"
              value={form.phoneNumber} 
              onChangeText={(t) => setForm({ ...form, phoneNumber: t })} 
            />

            <InputField 
              label="Localisation" 
              icon="location-outline" 
              placeholder="Paris, France" 
              value={form.location} 
              onChangeText={(t) => setForm({ ...form, location: t })} 
            />

            <InputField 
              label="Bio" 
              icon="information-circle-outline" 
              placeholder="Dites-nous en plus sur vous..." 
              multiline
              value={form.bio} 
              onChangeText={(t) => setForm({ ...form, bio: t })} 
            />
          </View>

          {/* Section Vendeuse Switch */}
          <View className="bg-slate-50 rounded-2xl p-5 mb-6 border border-slate-100">
            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center flex-1 mr-4">
                <View className="bg-white p-2 rounded-lg shadow-sm mr-3">
                  <Ionicons name="storefront" size={24} color="#EAB308" />
                </View>
                <View>
                  <Text className="text-base font-bold text-slate-900">Mode Vendeuse</Text>
                  <Text className="text-xs text-gray-500 mt-0.5">Activez pour créer votre boutique</Text>
                </View>
              </View>
              <Switch
                value={isVendor}
                onValueChange={toggleVendor}
                trackColor={{ false: '#E2E8F0', true: '#FDE047' }}
                thumbColor={isVendor ? '#FFFFFF' : '#FFFFFF'}
                ios_backgroundColor="#E2E8F0"
              />
            </View>

            {/* Champs Conditionnels Vendeuse */}
            {isVendor && (
              <View className="mt-6 pt-6 border-t border-slate-200">
                <InputField 
                  label="Nom de la boutique" 
                  icon="business-outline" 
                  placeholder="Ma Super Boutique" 
                  value={form.vendor.shopName} 
                  onChangeText={(t) => setForm({ ...form, vendor: { ...form.vendor, shopName: t } })} 
                />
                <InputField 
                  label="Description de la boutique" 
                  icon="document-text-outline" 
                  placeholder="Que vendez-vous ?" 
                  multiline
                  value={form.vendor.description} 
                  onChangeText={(t) => setForm({ ...form, vendor: { ...form.vendor, description: t } })} 
                />
                <InputField 
                  label="Horaires d'ouverture" 
                  icon="time-outline" 
                  placeholder="Lun-Ven: 9h - 18h" 
                  value={form.vendor.workingHours} 
                  onChangeText={(t) => setForm({ ...form, vendor: { ...form.vendor, workingHours: t } })} 
                />
              </View>
            )}
          </View>

          {/* Bouton d'action */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading}
            className={`rounded-xl py-4 shadow-sm flex-row justify-center items-center ${loading ? 'bg-primary/70' : 'bg-primary'}`}
            // Note: Assurez-vous que 'bg-primary' est défini dans votre tailwind.config.js
            // Sinon remplacez par 'bg-yellow-400'
            style={{ backgroundColor: '#FACC15', elevation: 4, shadowColor: '#FACC15', shadowOpacity: 0.3, shadowOffset: {width: 0, height: 4} }}
          >
            {loading ? (
              <ActivityIndicator color="#1F2937" />
            ) : (
              <>
                <Text className="text-slate-900 font-bold text-lg mr-2">Enregistrer le profil</Text>
                <Ionicons name="checkmark-circle" size={24} color="#1F2937" />
              </>
            )}
          </TouchableOpacity>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}