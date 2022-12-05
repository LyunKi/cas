import 'dotenv/config'

const config = {
  name: 'cas-client',
  slug: 'cas-client',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/logo.jpg',
  scheme: 'cas',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './assets/images/logo.jpg',
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
      foregroundImage: './assets/images/logo.jpg',
      backgroundColor: '#ffffff',
    },
  },
  web: {
    favicon: './assets/images/favicon.jpg',
  },
  extra: {
    baseUrl: process.env.BASE_URL,
  },
}

export default config
