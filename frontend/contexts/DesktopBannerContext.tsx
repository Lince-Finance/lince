"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useBreakpointValue } from "@chakra-ui/react";

interface BannerContextType {
  showBanner: boolean;
  dismissBanner: () => void;
}

const DesktopBannerContext = createContext<BannerContextType | null>(null);

export const DesktopBannerProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const isDesktop = useBreakpointValue({ base: false, md: true });
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if (isDesktop === undefined) return;

    const bannerDismissed = localStorage.getItem("desktopBannerDismissed");
    if (isDesktop && !bannerDismissed) {
      setShowBanner(true);
    } else {
      setShowBanner(false);
    }
  }, [isDesktop]);

  const dismissBanner = () => {
    setShowBanner(false);
    localStorage.setItem("desktopBannerDismissed", "true");
  };

  return (
    <DesktopBannerContext.Provider value={{ showBanner, dismissBanner }}>
      {children}
    </DesktopBannerContext.Provider>
  );
};

export const useDesktopBanner = () => {
  const context = useContext(DesktopBannerContext);
  if (!context) {
    throw new Error(
      "useDesktopBanner must be used within a DesktopBannerProvider"
    );
  }
  return context;
};
