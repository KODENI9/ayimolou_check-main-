import { Redirect, Stack } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

export default function AuthRoutesLayout() {
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    // ✅ Redirige vers ta page principale (tabs ou autre)
    return <Redirect href="/(tabs)/home"  />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
