import { StateStorage } from 'zustand/middleware'
import { createMMKV } from 'react-native-mmkv'

export const storage = createMMKV({ id: 'maxa-storage' })

export const zustandStorage: StateStorage = {
  setItem: (name, value) => storage.set(name, value),
  getItem: (name) => storage.getString(name) ?? null,
  removeItem: (name) => storage.remove(name),
}
