import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    View,
    Text,
TextInput,
Switch,
TouchableOpacity,
StyleSheet,
SafeAreaView,
Alert,
Platform,
ToastAndroid,
Modal,
FlatList,
} from 'react-native';

type SettingsState = {
displayName: string;
notificationsEnabled: boolean;
darkMode: boolean;
language: 'fr' | 'en' | 'es';
};

const STORAGE_KEY = '@app_settings_v1';

export default function SettingsScreen(): React.ReactElement {
const [settings, setSettings] = useState<SettingsState>({
    displayName: '',
    notificationsEnabled: true,
    darkMode: false,
    language: 'fr',
});

const [loading, setLoading] = useState(true);
const [langModalVisible, setLangModalVisible] = useState(false);

useEffect(() => {
    (async () => {
        try {
            const raw = await AsyncStorage.getItem(STORAGE_KEY);
            if (raw) {
                setSettings(JSON.parse(raw));
            }
        } catch (e) {
            console.warn('Impossible de charger les réglages', e);
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
        if (Platform.OS === 'android') {
            ToastAndroid.show('Réglages enregistrés', ToastAndroid.SHORT);
        } else {
            Alert.alert('Réglages', 'Réglages enregistrés');
        }
    } catch (e) {
        Alert.alert('Erreur', "Impossible d'enregistrer les réglages");
    }
};

const resetSettings = async () => {
    const defaults: SettingsState = {
        displayName: '',
        notificationsEnabled: true,
        darkMode: false,
        language: 'fr',
    };
    setSettings(defaults);
    try {
        await AsyncStorage.removeItem(STORAGE_KEY);
        if (Platform.OS === 'android') {
            ToastAndroid.show('Réglages réinitialisés', ToastAndroid.SHORT);
        } else {
            Alert.alert('Réglages', 'Réglages réinitialisés');
        }
    } catch {
        Alert.alert('Erreur', "Impossible de réinitialiser");
    }
};

if (loading) {
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.heading}>Chargement...</Text>
        </SafeAreaView>
    );
}

const languages = [
    { key: 'fr', label: 'Français' },
    { key: 'en', label: 'English' },
    { key: 'es', label: 'Español' },
];

return (
    <SafeAreaView style={[styles.container, settings.darkMode && styles.containerDark]}>
        <Text style={[styles.heading, settings.darkMode && styles.textDark]}>Paramètres</Text>

        <View style={styles.section}>
            <Text style={[styles.label, settings.darkMode && styles.textDark]}>Nom affiché</Text>
            <TextInput
                style={[styles.input, settings.darkMode && styles.inputDark]}
                placeholder="Votre nom"
                placeholderTextColor={settings.darkMode ? '#aaa' : '#666'}
                value={settings.displayName}
                onChangeText={(text) => setSettings({ ...settings, displayName: text })}
                onEndEditing={() => saveSettings()}
                accessibilityLabel="Nom affiché"
            />
        </View>

        <View style={styles.row}>
            <Text style={[styles.label, settings.darkMode && styles.textDark]}>Notifications</Text>
            <Switch
                value={settings.notificationsEnabled}
                onValueChange={(val) => saveSettings({ notificationsEnabled: val })}
            />
        </View>

        <View style={styles.row}>
            <Text style={[styles.label, settings.darkMode && styles.textDark]}>Thème sombre</Text>
            <Switch
                value={settings.darkMode}
                onValueChange={(val) => saveSettings({ darkMode: val })}
            />
        </View>

        <TouchableOpacity
            style={styles.section}
            onPress={() => setLangModalVisible(true)}
            accessible
            accessibilityLabel="Sélection de la langue"
        >
            <Text style={[styles.label, settings.darkMode && styles.textDark]}>Langue</Text>
            <Text style={[styles.value, settings.darkMode && styles.textDark]}>
                {languages.find((l) => l.key === settings.language)?.label}
            </Text>
        </TouchableOpacity>

        <View style={styles.actions}>
            <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={() => saveSettings()}
            >
                <Text style={styles.buttonText}>Enregistrer</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.button, styles.resetButton]}
                onPress={() =>
                    Alert.alert('Confirmation', 'Réinitialiser les réglages ?', [
                        { text: 'Annuler', style: 'cancel' },
                        { text: 'Réinitialiser', style: 'destructive', onPress: resetSettings },
                    ])
                }
            >
                <Text style={styles.buttonText}>Réinitialiser</Text>
            </TouchableOpacity>
        </View>

        <Modal visible={langModalVisible} animationType="slide" transparent>
            <View style={styles.modalOverlay}>
                <View style={[styles.modalContent, settings.darkMode && styles.modalContentDark]}>
                    <Text style={[styles.modalTitle, settings.darkMode && styles.textDark]}>Choisir la langue</Text>
                    <FlatList
                        data={languages}
                        keyExtractor={(i) => i.key}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.langItem}
                                onPress={() => {
                                    saveSettings({ language: item.key as SettingsState['language'] });
                                    setLangModalVisible(false);
                                }}
                            >
                                <Text style={[styles.langLabel, settings.darkMode && styles.textDark]}>
                                    {item.label}
                                </Text>
                            </TouchableOpacity>
                        )}
                    />
                    <TouchableOpacity style={styles.modalClose} onPress={() => setLangModalVisible(false)}>
                        <Text style={styles.modalCloseText}>Fermer</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    </SafeAreaView>
);
}

const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
},
containerDark: {
    backgroundColor: '#0f1720',
},
heading: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 16,
    color: '#111827',
},
textDark: {
    color: '#e6eef8',
},
section: {
    marginBottom: 16,
},
label: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 6,
},
input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 10,
    color: '#111827',
    backgroundColor: '#fff',
},
inputDark: {
    borderColor: '#23303b',
    backgroundColor: '#0b1116',
    color: '#e6eef8',
},
row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
},
value: {
    fontSize: 16,
    color: '#374151',
},
actions: {
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
},
button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 6,
},
saveButton: {
    backgroundColor: '#2563eb',
},
resetButton: {
    backgroundColor: '#ef4444',
},
buttonText: {
    color: '#fff',
    fontWeight: '600',
},
modalOverlay: {
    flex: 1,
    backgroundColor: '#00000066',
    justifyContent: 'center',
    padding: 16,
},
modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    maxHeight: '80%',
},
modalContentDark: {
    backgroundColor: '#071018',
},
modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#111827',
},
langItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
},
langLabel: {
    fontSize: 16,
    color: '#111827',
},
modalClose: {
    marginTop: 12,
    alignSelf: 'flex-end',
},
modalCloseText: {
    color: '#2563eb',
    fontWeight: '600',
},
});