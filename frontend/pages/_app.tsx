import { useEffect } from "react";
import { cacheInviteFromUrl } from "../utils/inviteCookie";
import { setInitialCsrfToken } from "../utils/csrf";
import { CustomChakraProvider } from "../components/ui/chakra-provider";
import { Provider } from "../components/ui/provider";
import "../styles/global.css";
import Head from "next/head";

import FavIcon from "@/assets/lince-favicon.png";

export function reportWebVitals() {}

export default function MyApp({ Component, pageProps }) {
  useEffect(cacheInviteFromUrl, []);

  useEffect(() => {
    if (pageProps?.csrfToken) setInitialCsrfToken(pageProps.csrfToken);
  }, [pageProps?.csrfToken]);
  return (
    <>
      <Head>
        <link rel="icon" href={FavIcon.src} />
      </Head>

      <Provider>
        <CustomChakraProvider>
          <Component {...pageProps} />
        </CustomChakraProvider>
      </Provider>
    </>
  );
}
