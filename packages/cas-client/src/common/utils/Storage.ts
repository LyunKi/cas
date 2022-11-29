import AsyncStorage from '@react-native-async-storage/async-storage'
import packageMetadata from '../../../package.json'

const STORAGE_PREFIX = packageMetadata.name

const EXPIRED_TIME_PREFIX = '&expiredTime='

class Storage {
  private static createStorageKey(key: string): string {
    return `${STORAGE_PREFIX}${key}`
  }

  static async setItem<T>(
    key: string,
    value: T,
    validTime?: number
  ): Promise<void> {
    const processedKey = Storage.createStorageKey(key)
    let processedValue = JSON.stringify({ value })
    if (validTime) {
      const expiredTime = Date.now() + validTime
      processedValue += `${EXPIRED_TIME_PREFIX}${expiredTime}`
    }
    await AsyncStorage.setItem(processedKey, processedValue)
  }

  static async removeItem(key: string): Promise<void> {
    await AsyncStorage.removeItem(Storage.createStorageKey(key))
  }

  static async clear(): Promise<void> {
    await AsyncStorage.clear()
  }

  static async getItem<T>(
    key: string,
    defaultValue: T | null = null
  ): Promise<T | null> {
    try {
      const data = await AsyncStorage.getItem(Storage.createStorageKey(key))
      if (data) {
        const [dataString, expiredTIme] = data.split(EXPIRED_TIME_PREFIX)
        if (!expiredTIme || +expiredTIme > Date.now()) {
          return JSON.parse(dataString).value as T
        }
        //已经过期了,移除过期的存储
        await Storage.removeItem(key)
      }
      return defaultValue
    } catch (e) {
      return defaultValue
    }
  }

  static async getOrInsert<T>(key: string, defaultValue: T): Promise<T> {
    try {
      const data = await AsyncStorage.getItem(Storage.createStorageKey(key))
      if (data) {
        const [dataString, expiredTIme] = data.split(/&expiredTime=/)
        if (!expiredTIme || +expiredTIme > Date.now()) {
          return JSON.parse(dataString).value as T
        }
        //已经过期了,移除过期的存储
        await Storage.removeItem(key)
      }
      await Storage.setItem<T>(key, defaultValue)
      return defaultValue
    } catch (e) {
      await Storage.setItem<T>(key, defaultValue)
      return defaultValue
    }
  }
}

export default Storage
