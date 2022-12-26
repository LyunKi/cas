import { StatusBar } from 'expo-status-bar'
import AppLoading from 'expo-app-loading'
import { useColorScheme } from 'react-native'
import React from 'react'
import { extendTheme, GlobalProvider } from '@cloud-design/components'
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import Constants from 'expo-constants'
import useCachedResources from './common/utils/hooks/useCachedResources'
import { THEME_PACK } from './theme'
import Auth from './pages/Auth'

const client = new ApolloClient({
  uri: Constants.manifest?.extra?.baseUrl,
  cache: new InMemoryCache(),
})

export default function App() {
  const isLoadingComplete = useCachedResources()
  const colorScheme = useColorScheme() ?? 'light'
  if (!isLoadingComplete) {
    return <AppLoading />
  }
  const params = new URLSearchParams(window.location.search)
  return (
    <GlobalProvider themeMode={'light'} themePack={extendTheme(THEME_PACK)}>
      <ApolloProvider client={client}>
        <StatusBar />
        <Auth
          service={params.get('service')}
          redirectUrl={params.get('redirectUrl')}
        />
      </ApolloProvider>
    </GlobalProvider>
  )
}
