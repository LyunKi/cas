import { StatusBar } from 'expo-status-bar'
import AppLoading from 'expo-app-loading'
import { useColorScheme } from 'react-native'
import React from 'react'
import { extendTheme, GlobalProvider } from '@cloud-design/components'
import useCachedResources from './common/utils/hooks/useCachedResources'
import Navigation from './navigation'
import { THEME_PACK } from './theme'

export default function App() {
  const isLoadingComplete = useCachedResources()
  const colorScheme = useColorScheme() ?? 'light'
  if (!isLoadingComplete) {
    return <AppLoading />
  }
  return (
    <GlobalProvider themeMode={colorScheme} themePack={extendTheme(THEME_PACK)}>
      <StatusBar />
      <Navigation colorScheme={colorScheme} />
    </GlobalProvider>
  )
}
