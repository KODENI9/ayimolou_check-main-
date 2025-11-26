import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
  Image,
  Platform,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import Slider from "@react-native-community/slider";
import { Ionicons } from "@expo/vector-icons";

// Données factices pour la démo
const MOCK_DATA = [
  {
    id: 1,
    name: "Kodenia",
    category: "LUXOLIN",
    rating: 2.0,
    reviews: 1,
    distance: "1.17 km",
    cover:
      "https://images.unsplash.com/photo-1557683316-973673baf926?w=800&q=80",
    avatar: "https://api.dicebear.com/9.x/kawaii/png?seed=Kodenia",
    color: "text-orange-500",
  },
  {
    id: 2,
    name: "DevStudio",
    category: "Développement",
    rating: 4.8,
    reviews: 24,
    distance: "2.5 km",
    cover:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80",
    avatar: "https://api.dicebear.com/9.x/bottts/png?seed=Dev",
    color: "text-blue-500",
  },
];

export default function Home({ navigation }: any) {
  const [search, setSearch] = useState("");
  const [radius, setRadius] = useState(5);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-6 pt-6">
          {/* Header */}
          <View className="mb-8 mt-2">
            <Text className="text-3xl font-extrabold text-slate-800">
              Bienvenue
            </Text>
            <Text className="text-slate-500 text-base mt-1">
              Explorez les services autour de vous
            </Text>
          </View>

          {/* Filtres & Recherche */}
          <View className="bg-white rounded-3xl p-5 shadow-sm shadow-slate-200 mb-8 border border-slate-100">
            {/* Input Recherche */}
            <View className="mb-6">
              <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                Recherche
              </Text>
              <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-2xl px-4 h-14">
                <View className="mr-3 opacity-50">
                   <Ionicons 
                        name="search-outline" 
                        size={22} 
                        color="#F97316" // slate-500
                        style={{ marginRight: 12 }}
                    />
                </View>
                <TextInput
                  className="flex-1 text-slate-800 font-semibold text-base"
                  placeholder="Ex : Coiffeur, Garage..."
                  placeholderTextColor="#94A3B8"
                  value={search}
                  onChangeText={setSearch}
                />
              </View>
            </View>

            {/* Rayon */}
            <View className="mb-6">
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Rayon
                </Text>
                <View className="bg-orange-50 px-3 py-1.5 rounded-xl">
                  <Text className="text-orange-600 font-bold text-xs">
                    {radius} km
                  </Text>
                </View>
              </View>

              {/* Slider stylé */}
              <Slider
                style={{ width: "100%", height: 40 }}
                minimumValue={1}
                maximumValue={50}
                step={1}
                value={radius}
                minimumTrackTintColor="#F97316" // barre orange
                maximumTrackTintColor="#E5E7EB" // barre grise
                thumbTintColor="#F59E0B" // curseur orange
                onValueChange={(value) => setRadius(value)}
              />

              <Text className="text-xs text-slate-400 mt-2 text-right">
                Max 50 km
              </Text>
            </View>
            {/* Localisation */}
            <TouchableOpacity
              onPress={() => console.log("Action de géolocalisation")}
              className="flex-row items-center pt-6 border-t border-slate-100 mt-2 active:opacity-80"
            >
              {/* Icône de localisation professionnelle (Bleu vif) */}
              <View className="w-10 h-10 rounded-full bg-orange-50 items-center justify-center mr-4">
                <Ionicons name="locate-outline" size={20} color="#f68f3bff" />
              </View>
              <View className="flex-1">
                <Text className="text-xs text-slate-400 font-medium mb-0.5">
                  Ma position actuelle
                </Text>
                <Text
                  className="text-sm font-bold text-slate-800"
                  numberOfLines={1}
                >
                  12345678 (Lomé)
                </Text>
              </View>
              <Ionicons
                name="refresh-circle-outline"
                size={28}
                color="#94A3B8"
              />
            </TouchableOpacity>
          </View>

          {/* Section Résultats */}
          <View className="flex-row items-end justify-between mb-4 px-1">
            <Text className="text-lg font-bold text-slate-800">Résultats</Text>
            <Text className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">
              {MOCK_DATA.length} trouvés
            </Text>
          </View>

          {/* Liste des cartes */}
          <View className="gap-6">
            {MOCK_DATA.map((item) => {
              const scale = useSharedValue(1);
              const animatedStyle = useAnimatedStyle(() => ({
                transform: [{ scale: scale.value }],
              }));

              return (
                <Animated.View key={item.id} style={animatedStyle}>
                  <Pressable
                    onPressIn={() => (scale.value = withSpring(1.03))}
                    onPressOut={() => (scale.value = withSpring(1))}
                    onPress={() =>
                      navigation?.navigate("Details", { id: item.id })
                    }
                  >
                    {/* Carte */}
                    <View className="bg-white rounded-[32px] shadow-sm shadow-slate-200 border border-slate-100 overflow-hidden mb-4">
                      {/* Image couverture */}
                      <View className="h-36 relative">
                        <Image
                          source={{ uri: item.cover }}
                          className="w-full h-full absolute"
                          resizeMode="cover"
                        />
                        <LinearGradient
                          colors={["rgba(0,0,0,0.3)", "transparent"]}
                          start={{ x: 0, y: 1 }}
                          end={{ x: 0, y: 0 }}
                          className="absolute inset-0"
                        />
                      </View>

                      {/* Contenu carte */}
                      <View className="px-5 pb-5 relative">
                        {/* Header avatar & badge */}
                        <View className="flex-row justify-between items-start -mt-10 mb-3">
                          <View className="p-1.5 bg-white rounded-full shadow-sm">
                            <Image
                              source={{ uri: item.avatar }}
                              className="w-16 h-16 rounded-full bg-slate-50"
                            />
                          </View>
                          <BlurView
                            intensity={60}
                            tint="light"
                            className="mt-12 px-3 py-1.5 rounded-full border border-emerald-100 flex-row items-center"
                          >
                            <Text className="text-xs">🏃‍♂️</Text>
                            <Text className="text-xs font-bold text-emerald-700 ml-1">
                              {item.distance}
                            </Text>
                          </BlurView>
                        </View>

                        {/* Infos principales */}
                        <View className="mb-5">
                          <Text className="text-xl font-bold text-slate-900 mb-1">
                            {item.name}
                          </Text>
                          <Text className="text-sm text-slate-500 font-semibold uppercase tracking-wide">
                            {item.category}:
                          </Text>
                        </View>

                        {/* Footer: rating + bouton */}
                        <View className="flex-row items-center justify-between pt-4 border-t border-slate-50">
                          <View className="flex-row items-center gap-1">
                            <Text className="text-base">⭐</Text>
                            <Text className="text-slate-900 font-bold text-lg">
                              {item.rating}
                            </Text>
                            <Text className="text-slate-400 text-xs ml-1">
                              ({item.reviews} avis)
                            </Text>
                          </View>

                          <Pressable
                            className="bg-orange-500 rounded-2xl py-3 px-6 active:bg-orange-600"
                            style={({ pressed }) => [
                              { transform: [{ scale: pressed ? 0.97 : 1 }] },
                              Platform.OS === "android" ? { elevation: 2 } : {},
                            ]}
                            onPress={() =>
                              navigation?.navigate("Details", { id: item.id })
                            }
                          >y 
                            <Text className="text-white font-bold text-sm">
                              Voir
                            </Text>
                          </Pressable>
                        </View>
                      </View>
                    </View>
                  </Pressable>
                </Animated.View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
