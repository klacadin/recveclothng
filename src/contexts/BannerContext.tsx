import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

const BANNER_DISMISS_KEY = "win-singlet-banner-dismissed";
const BANNER_DISMISS_DAYS = 1;

const getInitialVisible = () => {
  try {
    const raw = localStorage.getItem(BANNER_DISMISS_KEY);
    if (!raw) return true;
    const ts = parseInt(raw, 10);
    return Date.now() - ts >= BANNER_DISMISS_DAYS * 24 * 60 * 60 * 1000;
  } catch {
    return true;
  }
};

type BannerContextValue = {
  bannerVisible: boolean;
  setBannerVisible: (visible: boolean) => void;
};

const BannerContext = createContext<BannerContextValue | null>(null);

export const BannerProvider = ({ children }: { children: ReactNode }) => {
  const [bannerVisible, setBannerVisible] = useState(getInitialVisible);

  const setVisible = useCallback((visible: boolean) => {
    setBannerVisible(visible);
  }, []);

  return (
    <BannerContext.Provider value={{ bannerVisible, setBannerVisible: setVisible }}>
      {children}
    </BannerContext.Provider>
  );
};

export const useBanner = () => {
  const ctx = useContext(BannerContext);
  return ctx ?? { bannerVisible: false, setBannerVisible: () => {} };
};
