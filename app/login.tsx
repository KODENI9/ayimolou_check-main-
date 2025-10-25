import { ImageBackground, Pressable, SafeAreaView, Text, View } from "react-native";
import { Link } from "expo-router";
import "./globals.css";

export default function RecapSms() {
  return (
    <SafeAreaView className="flex-1 justify-center items-center bg-primary">
      <View className="items-center bg-primary pt-6 pb-5 mt-28 mb-28">
        <View className="flex-row items-center w-full">
          <ImageBackground
            source={require("../assets/images/ayimolou_1.png")}
            className="w-full h-72"
            resizeMode="contain"
          />
        </View>

        {/* ✅ Le Link doit pointer vers le bon chemin */}
        <Link href="/(auth)/sign-in" asChild>
          <Pressable className="items-center p-3 w-64 bg-black rounded-full m-5">
            <Text className="text-xl text-white">Se connecter !</Text>
          </Pressable>
        </Link>


        <Text className="text-center px-5 text-white/80 text-base">
          Vous recevrez automatiquement un message contenant le code de
          vérification qui vous permettra de valider votre inscription.
        </Text>
      </View>
    </SafeAreaView>
  );
}
