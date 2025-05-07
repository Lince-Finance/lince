import { useEffect } from "react";
import { cacheInviteFromUrl } from "../utils/inviteCookie";
import { setInitialCsrfToken } from "../utils/csrf";
import { CustomChakraProvider } from "../components/ui/chakra-provider";
import { Provider } from "../components/ui/provider";
import "../styles/global.css";

export function reportWebVitals() {}

export default function MyApp({ Component, pageProps }) {
  useEffect(cacheInviteFromUrl, []);

  useEffect(() => {
    if (pageProps?.csrfToken) setInitialCsrfToken(pageProps.csrfToken);
  }, [pageProps?.csrfToken]);
  return (
    <Provider>
      <CustomChakraProvider>
        <Component {...pageProps} />
      </CustomChakraProvider>
    </Provider>
  );
}
