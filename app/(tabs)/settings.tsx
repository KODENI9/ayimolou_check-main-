import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { Ionicons } from "@expo/vector-icons";
import {
  View,
  Text,
  TextInput,
  Switch,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Platform,
  ToastAndroid,
  Modal,
  ScrollView,
  ActivityIndicator,
  StatusBar
} from "react-native";

type SettingsState = {
  displayName: string;
  notificationsEnabled: boolean;
  darkMode: boolean;
  language: "fr" | "en" | "es";
};

const STORAGE_KEY = "@app_settings_v1";

const SettingRow = ({ 
  label, 
  icon, 
  color = "#4B5563", 
  children, 
  isLast = false, 
  darkMode = false 
}: any) => (
  <View className={`flex-row items-center justify-between p-4 ${!isLast ? 'border-b border-gray-100' : ''} ${darkMode ? 'border-gray-700' : ''}`}>
    <View className="flex-row items-center flex-1">
      <View className={`w-10 h-10 rounded-xl items-center justify-center mr-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text className={`text-base font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
        {label}
      </Text>
    </View>
    {children}
  </View>
);

export default function SettingsScreen(): React.ReactElement {
  const { signOut } = useAuth();
  const router = useRouter();

  const [settings, setSettings] = useState<SettingsState>({
    displayName: "",
    notificationsEnabled: true,
    darkMode: false,
    language: "fr",
  });

  const [loading, setLoading] = useState(true);
  const [langModalVisible, setLangModalVisible] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setSettings(JSON.parse(raw));
      } catch (e) {
        console.warn("Erreur chargement settings", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const saveSettings = async (newSettings?: Partial<SettingsState>) => {
    const next = { ...settings, ...newSettings };
    setSettings(next);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      if (Platform.OS === "android" && newSettings) {
        ToastAndroid.show("Enregistré", ToastAndroid.SHORT);
      }
    } catch (e) {
      Alert.alert("Erreur", "Sauvegarde impossible");
    }
  };

  const resetSettings = async () => {
    const defaults: SettingsState = {
      displayName: "",
      notificationsEnabled: true,
      darkMode: false,
      language: "fr",
    };
    setSettings(defaults);
    await AsyncStorage.removeItem(STORAGE_KEY);
    Alert.alert("Succès", "Paramètres réinitialisés par défaut.");
  };

  const handleLogout = async () => {
    Alert.alert("Déconnexion", "Voulez-vous vraiment vous déconnecter ?", [
      { text: "Annuler", style: "cancel" },
      { 
        text: "Se déconnecter", 
        style: "destructive", 
        onPress: async () => {
          await signOut();
          router.replace("/(auth)/sign-in");
        }
      }
    ]);
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#EAB308" />
      </View>
    );
  }

  const theme = {
    bg: settings.darkMode ? 'bg-gray-900' : 'bg-gray-50',
    card: settings.darkMode ? 'bg-gray-800' : 'bg-white',
    text: settings.darkMode ? 'text-white' : 'text-gray-900',
    subtext: settings.darkMode ? 'text-gray-400' : 'text-gray-500',
  };

  const languages = [
    { key: "fr", label: "Français", emoji: "🇫🇷" },
    { key: "en", label: "English", emoji: "🇬🇧" },
    { key: "es", label: "Español", emoji: "🇪🇸" },
  ];

  return (
    <SafeAreaView className={`flex-1 ${theme.bg}`}>
      <StatusBar barStyle={settings.darkMode ? "light-content" : "dark-content"} />

      <View className="px-6 py-4">
        <Text className={`text-3xl font-bold ${theme.text}`}>Paramètres</Text>
      </View>

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>

        {/* Compte */}
        <Text className={`text-xs font-bold uppercase tracking-widest mb-2 mt-4 ${theme.subtext}`}>
          Mon Compte
        </Text>
        <View className={`rounded-2xl overflow-hidden shadow-md mb-6 ${theme.card}`}>
          <SettingRow label="Nom affiché" icon="person" color="#3B82F6" isLast darkMode={settings.darkMode}>
            <TextInput
              className={`text-right text-base font-medium min-w-[150px] ${settings.darkMode ? 'text-gray-300' : 'text-gray-600'}`}
              placeholder="Votre nom"
              placeholderTextColor="#9CA3AF"
              value={settings.displayName}
              onChangeText={(t) => setSettings({ ...settings, displayName: t })}
              onEndEditing={() => saveSettings()}
            />
          </SettingRow>
        </View>

        {/* Préférences */}
        <Text className={`text-xs font-bold uppercase tracking-widest mb-2 ${theme.subtext}`}>
          Préférences
        </Text>
        <View className={`rounded-2xl overflow-hidden shadow-md mb-6 ${theme.card}`}>
          <SettingRow label="Notifications" icon="notifications" color="#F59E0B" darkMode={settings.darkMode}>
            <Switch
              value={settings.notificationsEnabled}
              onValueChange={(val) => saveSettings({ notificationsEnabled: val })}
              trackColor={{ false: '#E5E7EB', true: '#FDE047' }}
              thumbColor={settings.notificationsEnabled ? '#CA8A04' : '#F3F4F6'}
            />
          </SettingRow>

          <SettingRow label="Mode Sombre" icon="moon" color="#6366F1" darkMode={settings.darkMode}>
            <Switch
              value={settings.darkMode}
              onValueChange={(val) => saveSettings({ darkMode: val })}
              trackColor={{ false: '#E5E7EB', true: '#FDE047' }}
              thumbColor={settings.darkMode ? '#CA8A04' : '#F3F4F6'}
            />
          </SettingRow>

          <TouchableOpacity onPress={() => setLangModalVisible(true)}>
            <SettingRow label="Langue" icon="language" color="#10B981" isLast darkMode={settings.darkMode}>
              <View className="flex-row items-center">
                <Text className={`text-sm mr-2 ${theme.subtext}`}>
                  {languages.find((l) => l.key === settings.language)?.label}
                </Text>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </View>
            </SettingRow>
          </TouchableOpacity>
        </View>

        {/* Système */}
        <Text className={`text-xs font-bold uppercase tracking-widest mb-2 ${theme.subtext}`}>
          Système
        </Text>
        <View className={`rounded-2xl overflow-hidden shadow-md mb-8 ${theme.card}`}>
          <TouchableOpacity onPress={() => Alert.alert("Reset", "Confirmer ?", [{text:"Non"}, {text:"Oui", onPress: resetSettings}])}>
            <SettingRow label="Réinitialiser tout" icon="refresh-circle" color="#EF4444" darkMode={settings.darkMode}>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </SettingRow>
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <TouchableOpacity
          onPress={handleLogout}
          className="flex-row items-center justify-center bg-red-50 p-4 rounded-2xl mb-10 border border-red-100 active:bg-red-100"
        >
          <Ionicons name="log-out-outline" size={24} color="#EF4444" style={{marginRight: 8}} />
          <Text className="text-red-500 font-bold text-lg">Se déconnecter</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal Langue */}
      <Modal visible={langModalVisible} animationType="fade" transparent>
        <View className="flex-1 bg-black/60 justify-center items-center px-4">
          <View className={`w-full max-w-sm rounded-3xl p-6 shadow-2xl ${theme.card}`}>
            <Text className={`text-xl font-bold mb-4 text-center ${theme.text}`}>Choisir la langue</Text>
            {languages.map((item) => (
              <TouchableOpacity
                key={item.key}
                className={`flex-row items-center p-4 mb-2 rounded-xl ${settings.language === item.key ? (settings.darkMode ? 'bg-gray-700' : 'bg-gray-100') : 'bg-transparent'}`}
                onPress={() => { saveSettings({ language: item.key as any }); setLangModalVisible(false); }}
              >
                <Text className="text-2xl mr-4">{item.emoji}</Text>
                <Text className={`text-lg font-medium flex-1 ${theme.text}`}>{item.label}</Text>
                {settings.language === item.key && <Ionicons name="checkmark-circle" size={24} color="#EAB308" />}
              </TouchableOpacity>
            ))}
            <TouchableOpacity className="mt-4 py-3 bg-gray-100 rounded-xl items-center" onPress={() => setLangModalVisible(false)}>
              <Text className="text-gray-900 font-bold">Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
