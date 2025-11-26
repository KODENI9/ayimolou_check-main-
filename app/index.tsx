import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  useWindowDimensions,
  Animated,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Image,
  ActivityIndicator,
  Platform,
} from "react-native";
// Assurez-vous d'avoir installé lucide-react-native et react-native-svg
// npm install lucide-react-native react-native-svg
import {
  MoveRight,
  MapPin,
  Star,
  ShieldCheck,
  ChefHat,
  CheckCircle2,
} from "lucide-react-native";

// Import de vos styles globaux (Tailwind/NativeWind)
import "./globals.css";
import { Link } from "expo-router";

/**
 * COULEURS DU THÈME (Définies via Tailwind mais voici la logique pour référence)
 * Primary: Amber-500 (#F59E0B) -> Jaune Doré (Riz, soleil)
 * Secondary: Green-600 (#16A34A) -> Vert (Nature, Feuilles)
 * Background: Slate-50 / Slate-900 (Dark)
 */

// --- DONNÉES DE L'ONBOARDING ---
// Remplacez les composants <Icon /> par vos images require('../assets/...') si nécessaire
const SLIDES = [
  {
    id: "1",
    title: "Trouvez les vendeuses près de chez vous",
    description:
      "Ayimolou affiche les vendeuses de riz autour de vous avec leur distance en temps réel.",
    icon: <MapPin size={100} color="#F59E0B" />,
  },
  {
    id: "2",
    title: "Choisissez la qualité",
    description:
      "Consultez les notes, les commentaires et l’expérience d’autres clients avant d’acheter.",
    icon: <Star size={100} color="#F59E0B" fill="#FEF3C7" />,
  },
  {
    id: "3",
    title: "Des vendeuses vérifiées",
    description:
      "Chaque vendeuse est vérifiée. Photos du stand et avis certifiés par de vrais clients.",
    icon: <ShieldCheck size={100} color="#16A34A" />,
  },
  {
    id: "4",
    title: "Vous êtes prêt ?",
    description:
      "Rejoignez la communauté Ayimolou et dégustez le meilleur riz de votre quartier.",
    icon: <ChefHat size={100} color="#F59E0B" />,
    isLast: true,
  },
];

// --- COMPOSANT: SPLASH SCREEN ---
const SplashScreen = ({ onFinish }: { onFinish: () => void }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Animation d'apparition combinée (Fade In + Scale Up)
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();

    // Simulation de chargement (2.5 secondes) avant de passer à l'écran suivant
    const timer = setTimeout(() => {
      onFinish();
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View className="flex-1 bg-amber-500 justify-center items-center">
      <StatusBar barStyle="light-content" backgroundColor="#F59E0B" />
      <Animated.View
        style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}
        className="items-center"
      >
        {/* Container du Logo */}
        <View className="bg-white p-6 rounded-full shadow-lg mb-6">
          <ChefHat size={64} color="#F59E0B" />
        </View>
        <Text className="text-4xl font-extrabold text-white tracking-widest">
          AYIMOLOU
        </Text>
        <Text className="text-white text-lg mt-2 font-medium italic">
          Le riz, tout près de vous.
        </Text>
      </Animated.View>

      <View className="absolute bottom-20">
        <ActivityIndicator size="large" color="white" />
      </View>
    </View>
  );
};

// --- COMPOSANT: ITEM DU CARROUSEL ---
const OnboardingItem = ({
  item,
  width,
}: {
  item: (typeof SLIDES)[0];
  width: number;
}) => {
  return (
    <View style={{ width }} className="justify-center items-center px-8">
      {/* Zone Illustration avec cercle de fond subtil */}
      <View className="flex-[0.6] justify-center items-center w-full">
        <View className="w-64 h-64 bg-amber-100 rounded-full justify-center items-center shadow-sm dark:bg-slate-800">
          {/* Emplacement de l'illustration principale */}
          {item.icon}
        </View>
      </View>

      {/* Zone Texte */}
      <View className="flex-[0.4] items-center">
        <Text className="text-3xl font-bold text-slate-800 text-center mb-4 dark:text-slate-100">
          {item.title}
        </Text>
        <Text className="text-base text-slate-500 text-center leading-6 dark:text-slate-400">
          {item.description}
        </Text>
      </View>
    </View>
  );
};

// --- COMPOSANT: PAGINATOR (LES POINTS) ---
const Paginator = ({
  data,
  scrollX,
  width,
}: {
  data: any[];
  scrollX: Animated.Value;
  width: number;
}) => {
  return (
    <View className="flex-row h-16 justify-center items-center">
      {data.map((_, i) => {
        const inputRange = [(i - 1) * width, i * width, (i + 1) * width];

        // Animation de la largeur du point (s'étire quand actif)
        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [10, 30, 10], // Le point actif devient large (30)
          extrapolate: "clamp",
        });

        // Animation de la couleur/opacité
        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.3, 1, 0.3],
          extrapolate: "clamp",
        });

        return (
          <Animated.View
            key={i.toString()}
            style={{ width: dotWidth, opacity }}
            className="h-2.5 rounded-full bg-green-600 mx-1.5"
          />
        );
      })}
    </View>
  );
};

// --- COMPOSANT PRINCIPAL ---
export default function AyimolouApp() {
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"onboarding" | "login">("onboarding");
  const [currentIndex, setCurrentIndex] = useState(0);

  const { width, height } = useWindowDimensions();
  const slidesRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  // Gestion du scroll pour mettre à jour l'index courant
  const viewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems && viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  // Configuration pour que le slide "colle" à 50% de visibilité
  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollToNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      slidesRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      // Si on est à la fin, on passe au login
      setView("login");
    }
  };

  const skipToLogin = () => {
    setView("login");
  };

  // 1. ÉCRAN DE SPLASH (Affiché au chargement)
  if (loading) {
    return <SplashScreen onFinish={() => setLoading(false)} />;
  }

  // 2. ÉCRAN LOGIN (Simulé pour la démo)
  if (view === "login") {
    return (
      <View className="flex-1 bg-white justify-center items-center p-6 dark:bg-slate-900">
        <View className="w-24 h-24 bg-amber-100 rounded-full justify-center items-center mb-8">
          <CheckCircle2 size={48} color="#16A34A" />
        </View>
        <Text className="text-3xl font-bold text-slate-800 mb-2 dark:text-white">
          Connexion
        </Text>
        <Text className="text-slate-500 text-center mb-10 dark:text-slate-400">
          L'aventure Ayimolou commence ici. Connectez-vous pour trouver votre
          riz préféré.
        </Text>

        {/* Bouton simulation login */}
        <Link href={"/login"}
          className="w-full bg-amber-500 py-4 rounded-xl items-center shadow-md active:bg-amber-600"
        >
          <Text className="text-white font-bold text-lg">Se connecter</Text>
        </Link>


        <TouchableOpacity
          className="mt-4"
          onPress={() => setView("onboarding")} // Pour tester à nouveau l'onboarding
        >
          <Text className="text-green-600 font-semibold">Revoir l'intro</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 3. ÉCRAN ONBOARDING PRINCIPAL
  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-900">
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />

      {/* HEADER: Bouton Passer (visible sauf sur la dernière slide) */}
      <View className="h-16 justify-center px-6 items-end mt-2">
        {currentIndex < SLIDES.length - 1 && (
          <TouchableOpacity
            onPress={skipToLogin}
            className="py-2 px-4 bg-slate-200 rounded-full dark:bg-slate-800"
          >
            <Text className="text-slate-600 font-bold dark:text-slate-300">
              Passer
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* BODY: Carrousel */}
      <View className="flex-3" style={{ height: height * 0.65 }}>
        <FlatList
          data={SLIDES}
          renderItem={({ item }) => (
            <OnboardingItem item={item} width={width} />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          bounces={false}
          keyExtractor={(item) => item.id}
          // Lier l'événement de scroll à la valeur animée scrollX
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            {
              useNativeDriver: false,
            }
          )}
          onViewableItemsChanged={viewableItemsChanged}
          viewabilityConfig={viewConfig}
          ref={slidesRef}
        />
      </View>

      {/* FOOTER: Pagination & Action Button */}
      <View className="flex-1 justify-between items-center pb-10 px-8">
        {/* Pagination Dots */}
        <Paginator data={SLIDES} scrollX={scrollX} width={width} />

        {/* Bouton Principal (Change de couleur et de texte à la fin) */}
        <TouchableOpacity
          onPress={scrollToNext}
          className={`flex-row items-center justify-center py-4 px-10 rounded-full shadow-lg w-full transition-all 
            ${
              currentIndex === SLIDES.length - 1
                ? "bg-green-600"
                : "bg-amber-500"
            }`}
          activeOpacity={0.8}
        >
          <Text className="text-white text-xl font-bold mr-2">
            {currentIndex === SLIDES.length - 1 ? "Commencer" : "Suivant"}
          </Text>
          {currentIndex !== SLIDES.length - 1 && (
            <MoveRight size={24} color="white" />
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
