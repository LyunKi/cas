import { StatusBar } from 'expo-status-bar'
import AppLoading from 'expo-app-loading'
import { useColorScheme } from 'react-native'
import React from 'react'
import { GlobalProvider } from '@cloud-design/components'
import useCachedResources from './common/utils/hooks/useCachedResources'
import Navigation from './navigation'

export default function App() {
  const isLoadingComplete = useCachedResources()
  const colorScheme = useColorScheme() ?? 'light'
  if (!isLoadingComplete) {
    return <AppLoading />
  }
  return (
    <GlobalProvider themeMode={colorScheme}>
      <StatusBar />
      <Navigation colorScheme={colorScheme} />
    </GlobalProvider>
  )
}
