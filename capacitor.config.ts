import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.266261dd631b419abd036b68eb042e3f',
  appName: 'SheBloom',
  webDir: 'dist',
  server: {
    url: "https://266261dd-631b-419a-bd03-6b68eb042e3f.lovableproject.com?forceHideBadge=true",
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#F9F0F1",
      showSpinner: false
    }
  }
};

export default config;