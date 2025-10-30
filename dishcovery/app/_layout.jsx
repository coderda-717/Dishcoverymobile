import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Splash from "./splash";
import { useEffect, useState } from "react";


export default function RootLayout() {
   const [showSplash , setShowSplash] = useState(true)
     useEffect(()=>{

    setTimeout(()=>{

      setShowSplash(false)

    }, 300)

  })


  if(showSplash){
    return <Splash/>
  }


  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
           <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="recipe/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
