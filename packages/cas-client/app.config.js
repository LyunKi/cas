import 'dotenv/config'

const config = {
  name: 'cas-client',
  slug: 'cas-client',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/logo.png',
  scheme: 'cas',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './assets/images/logo.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/images/logo.png',
      backgroundColor: '#ffffff',
    },
  },
  web: {
    favicon: './assets/images/favicon.png',
  },
  extra: {
    baseUrl: process.env.BASE_URL,
  },
}

export default config
