import React from "react";
import { View, Text, Image, StatusBar, TouchableOpacity } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { fetchUserProfile } from "@/utils/services/action";

const HEADER_MAX = 170;
const HEADER_MIN = 90;
const AVATAR_MAX = 80;
const AVATAR_MIN = 40;

export default function Profile() {
  const router = useRouter();
  const { getToken } = useAuth();
  const [user, setUser] = React.useState(null);
  const { userId } = useAuth();

  React.useEffect(() => {
    const load = async () => {
      const token = await getToken();
      if (!token) return;
      const data = await fetchUserProfile(token, userId as string);
      console.log("Données utilisateur récupérées :", data);
      setUser(data.user);
    };
    load();
  }, []);

  const scrollY = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollY.value = e.contentOffset.y;
    },
  });

  const animatedHeader = useAnimatedStyle(() => ({
    height: interpolate(
      scrollY.value,
      [0, 120],
      [HEADER_MAX, HEADER_MIN],
      Extrapolate.CLAMP
    ),
  }));

  const animatedAvatar = useAnimatedStyle(() => {
    const size = interpolate(
      scrollY.value,
      [0, 120],
      [AVATAR_MAX, AVATAR_MIN],
      Extrapolate.CLAMP
    );
    return { width: size, height: size };
  });

  const animatedName = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [0, 120], [1, 0.4], Extrapolate.CLAMP),
    transform: [
      {
        translateY: interpolate(
          scrollY.value,
          [0, 120],
          [0, -12],
          Extrapolate.CLAMP
        ),
      },
    ],
  }));

  return (
    <View className="flex-1 bg-slate-50">
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      {/* HEADER ANIMÉ */}
      <Animated.View
        style={animatedHeader}
        className="bg-white px-6 pt-12 rounded-b-[35px] shadow-sm justify-end absolute w-full z-50"
      >
        <View className="flex-row items-center pb-3">
          {/* <Animated.View
            style={animatedAvatar}
            className="rounded-full bg-slate-200 overflow-hidden mr-4 justify-center items-center"
          >
            {user?.profileImage ? (
              <Image source={{ uri: user.profileImage }} className="w-full h-full" />
            ) : (
              <Text className="text-2xl font-bold text-slate-500">
                {user?.firstName?.charAt(0) ?? 'U'}
              </Text>
            )}
            {/* Badge Edit (optionnel) */}
          {/* <View className="absolute bottom-0 right-0 bg-blue-500 p-1.5 rounded-full border-2 border-white">
                            <Ionicons name="pencil" size={12} color="white" />
                        </View>
          </Animated.View> */}
          
          <View className="p-1 bg-white rounded-full shadow-sm mr-5 border border-slate-100">
                        <View className="w-20 h-20 rounded-full bg-slate-100 items-center justify-center overflow-hidden">
                            {user?.profileImage ? (
                                <Image 
                                    source={{ uri: user.profileImage }} 
                                    className="w-full h-full"
                                />
                            ) : (
                                <Text className="text-3xl font-bold text-slate-400">
                                    {user?.firstName?.[0] || 'U'}
                                </Text>
                            )}
                        </View>
                        {/* Badge Edit (optionnel) */}
                        <View className="absolute bottom-0 right-0 bg-blue-500 p-1.5 rounded-full border-2 border-white">
                            <Ionicons name="pencil" size={12} color="white" />
                        </View>
          </View>
          <Animated.View style={animatedName} className="flex-1">
            <Text
              className="text-xl font-bold text-slate-900"
              numberOfLines={1}
            >
              {user?.firstName ?? "Utilisateur"}
            </Text>
            <Text className="text-sm text-slate-500" numberOfLines={1}>
              {user?.email ?? "email@example.com"}
            </Text>
          </Animated.View>
        </View>
      </Animated.View>

      {/* CONTENU */}
      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        className="pt-[190px]" // espace pour laisser le header visible
      >
        <View className="space-y-4 px-5 pb-20">
          {/* Biographie */}
          <View className="bg-white rounded-2xl p-5 shadow-sm">
            <View className="flex-row items-center mb-1">
              <Ionicons name="book-outline" size={20} color="#64748B" />
              <Text className="ml-3 text-slate-800 font-medium">
                Biographie
              </Text>
            </View>
            <Text className="text-slate-600">
              {user?.bio && user.bio.length > 0
                ? user.bio
                : "Aucune biographie pour le moment"}
            </Text>
          </View>

          {/* Téléphone */}
          <View className="bg-white rounded-2xl p-5 shadow-sm mt-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Ionicons name="call-outline" size={20} color="#64748B" />
                <Text className="ml-3 text-slate-800 font-medium">
                  Téléphone
                </Text>
              </View>
              <Text className="text-slate-600">
                {user?.phoneNumber?.length > 0
                  ? user.phoneNumber
                  : "Non défini"}
              </Text>
            </View>
          </View>

          {/* Localisation */}
          <View className="bg-white rounded-2xl p-5 shadow-sm mt-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Ionicons name="location-outline" size={20} color="#64748B" />
                <Text className="ml-3 text-slate-800 font-medium">
                  Localisation
                </Text>
              </View>
              <Text className="text-slate-600">
                {user?.location?.length > 0 ? user.location : "Non indiqué"}
              </Text>
            </View>
          </View>

          {/* Rôle */}
          <View className="bg-white rounded-2xl p-5 shadow-sm mt-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Ionicons
                  name="person-circle-outline"
                  size={20}
                  color="#64748B"
                />
                <Text className="ml-3 text-slate-800 font-medium">Rôle</Text>
              </View>
              <Text className="text-slate-600 capitalize">
                {user?.role ?? "—"}
              </Text>
            </View>
          </View>

          {/* Exemple d'item */}
          <TouchableOpacity
            onPress={() => router.push("/settings")}
            className="bg-white rounded-2xl p-5 shadow-sm mt-4"
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Ionicons name="settings-outline" size={20} color="#64748B" />
                <Text className="ml-3 text-slate-800 font-medium">
                  Paramètres
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
            </View>
          </TouchableOpacity>
        </View>
      </Animated.ScrollView>
    </View>
  );
}
