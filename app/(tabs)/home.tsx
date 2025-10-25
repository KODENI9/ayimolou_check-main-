import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, Pressable } from 'react-native';

type Props = {
    navigation?: any;
};

export default function Home({ navigation }: Props) {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Bienvenue</Text>
                <Text style={styles.subtitle}>Page d'accueil de base</Text>
            </View>

            <View style={styles.card}>
                <View style={styles.logoPlaceholder}>
                    <Text style={styles.logoText}>APP</Text>
                </View>

                <Text style={styles.cardTitle}>Votre application</Text>
                <Text style={styles.cardText}>
                    Ceci est une application de base avec une navigation par onglets.
                </Text>

                <Pressable
                    style={({ pressed }) => [
                        styles.button,
                        pressed ? styles.buttonPressed : undefined,
                    ]}
                    onPress={() => navigation?.navigate?.('Details')}
                >
                    <Text style={styles.buttonText}>Commencer</Text>
                </Pressable>
            </View>

            <Text style={styles.footer}>© {new Date().getFullYear()}</Text>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f8fa',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
    },
    header: {
        marginTop: 10,
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#111',
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    card: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 4,
        alignItems: 'center',
    },
    logoPlaceholder: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: '#e6eefc',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    logoText: {
        color: '#2563eb',
        fontWeight: '700',
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 6,
    },
    cardText: {
        color: '#666',
        textAlign: 'center',
        marginBottom: 12,
    },
    button: {
        backgroundColor: '#2563eb',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    buttonPressed: {
        opacity: 0.85,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
    },
    footer: {
        color: '#999',
        fontSize: 12,
        marginBottom: 6,
    },
});