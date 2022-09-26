export default {
  name: 'Thermo',
  slug: 'thermo',
  version: '1.0.0',
  privacy: 'unlisted',
  platforms: [
    'ios',
  ],
  orientation: 'portrait',
  icon: './assets/icon.png',
  ios: {
    supportsTablet: false,
    bundleIdentifier: 'net.j0k3r.thermo',
    splash: {
      image: './assets/splash.png',
      backgroundColor: '#ffffff',
      dark: {
        image: './assets/splash-dark.png',
        backgroundColor: '#3d3d3d',
      }
    },
  },
  assetBundlePatterns: [
    '**/*',
  ],
  description: 'Thermo app to list available Sense Thermo Peanut',
  githubUrl: 'https://github.com/j0k3r/thermo',
  userInterfaceStyle: 'automatic',
}
