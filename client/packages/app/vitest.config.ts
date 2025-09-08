import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults, type UserConfig } from 'vitest/config'
import viteConfigFn from './vite.config'

export default defineConfig(async (configEnv): Promise<UserConfig> => {
  const viteConfig = await viteConfigFn(configEnv)
  return mergeConfig(viteConfig, {
    test: {
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/**'],
      root: fileURLToPath(new URL('./', import.meta.url)),
    },
  })
})
