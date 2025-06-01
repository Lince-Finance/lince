// pages/_app.tsx
import { useEffect } from "react";
import type { AppProps } from "next/app";
import Head from "next/head";

import { cacheInviteFromUrl } from "@/utils/inviteCookie";
import { ensureCsrfToken, invalidateCsrfToken } from "@/utils/csrf";
import { SignupCredsProvider } from "@/contexts/SignupCredsContext";

import { CustomChakraProvider } from "@/components/ui/chakra-provider";
import { Provider } from "@/components/ui/provider";
import "@/styles/global.css";
import FavIcon from "@/assets/lince-favicon.png";
import { AuthProvider } from "@/contexts/AuthContext";
import {
  DesktopBannerProvider,
  useDesktopBanner,
} from "@/contexts/DesktopBannerContext";
import DesktopBanner from "@/components/reusable/desktop-banner";
import { Box } from "@chakra-ui/react";
import { StrategyProvider } from "@/contexts/StrategyContext";

// BannerWrapper component ✅
function BannerWrapper({ children }: { children: React.ReactNode }) {
  const { showBanner, dismissBanner } = useDesktopBanner();

  return (
    <>
      {showBanner && <DesktopBanner onContinue={dismissBanner} />}
      {children}
    </>
  );
}

export default function MyApp({ Component, pageProps }: AppProps) {
  useEffect(cacheInviteFromUrl, []);

  useEffect(() => {
    invalidateCsrfToken();
    ensureCsrfToken().catch(console.error);
  }, []);

  return (
    <>
      <Head>
        <link rel="icon" href={FavIcon.src} />
      </Head>

      <SignupCredsProvider>
        <AuthProvider initialUser={pageProps.user ?? null}>
          <Provider>
            <CustomChakraProvider>
              <DesktopBannerProvider>
                <BannerWrapper>
                  <StrategyProvider>
                    <Component {...pageProps} />
                  </StrategyProvider>
                </BannerWrapper>
              </DesktopBannerProvider>
            </CustomChakraProvider>
          </Provider>
        </AuthProvider>
      </SignupCredsProvider>
    </>
  );
}
