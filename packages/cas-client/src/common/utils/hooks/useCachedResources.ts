import * as SplashScreen from 'expo-splash-screen'
import { useEffect, useState } from 'react'
import I18n, { formatLocale } from '../../../i18n'
import { Schema } from '..'

export default function useCachedResources() {
  const [isLoadingComplete, setLoadingComplete] = useState(false)

  // Load any resources or data that we need prior to rendering the app
  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHideAsync()

        // init settings;
        await I18n.init()

        // init by params
        const params = new URLSearchParams(window.location.search)
        const locale = params.get('locale');
        if (locale) {
          await I18n.updateLocale(formatLocale(locale))
        }

        await Schema.init()
      } catch (e) {
      } finally {
        setLoadingComplete(true)
      }
    }

    loadResourcesAndDataAsync()
  }, [])

  return isLoadingComplete
}
