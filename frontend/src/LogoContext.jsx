import { createContext, useEffect, useState } from "react";
import AnythingLLM from "./media/logo/tuxibot-logo.png";
import AnythingLLMDark from "./media/logo/tuxibot-logo.png";
import DefaultLoginLogoLight from "./media/illustrations/just-tuxi.png";
import DefaultLoginLogoDark from "./media/illustrations/just-tuxi.png";
import System from "./models/system";

export const REFETCH_LOGO_EVENT = "refetch-logo";
export const LogoContext = createContext();

export function LogoProvider({ children }) {
  const [logo, setLogo] = useState("");
  const [loginLogo, setLoginLogo] = useState("");
  const [isCustomLogo, setIsCustomLogo] = useState(false);
  const DefaultLoginLogo =
    localStorage.getItem("theme") !== "default"
      ? DefaultLoginLogoDark
      : DefaultLoginLogoLight;

  async function fetchInstanceLogo() {
    try {
      const { isCustomLogo, logoURL } = await System.fetchLogo();
      if (logoURL) {
        setLogo(logoURL);
        setLoginLogo(DefaultLoginLogo); // custom logo baked into login page
        setIsCustomLogo(isCustomLogo);
      } else {
        localStorage.getItem("theme") !== "default"
          ? setLogo(AnythingLLMDark)
          : setLogo(AnythingLLM);
        setLoginLogo(DefaultLoginLogo);
        setIsCustomLogo(false);
      }
    } catch (err) {
      localStorage.getItem("theme") !== "default"
        ? setLogo(AnythingLLMDark)
        : setLogo(AnythingLLM);
      setLoginLogo(DefaultLoginLogo);
      setIsCustomLogo(false);
      console.error("Failed to fetch logo:", err);
    }
  }

  useEffect(() => {
    fetchInstanceLogo();
    window.addEventListener(REFETCH_LOGO_EVENT, fetchInstanceLogo);
    return () => {
      window.removeEventListener(REFETCH_LOGO_EVENT, fetchInstanceLogo);
    };
  }, []);

  return (
    <LogoContext.Provider value={{ logo, setLogo, loginLogo, isCustomLogo }}>
      {children}
    </LogoContext.Provider>
  );
}
