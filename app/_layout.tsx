import { Stack } from "expo-router";
import { ClerkProvider } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import './globals.css';
export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}
                   tokenCache={tokenCache}>
                    
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ headerShown: false }}/>        
        <Stack.Screen name="login" options={{ headerShown: false }}/>        
        
      </Stack>
    </ClerkProvider>
  );
}
