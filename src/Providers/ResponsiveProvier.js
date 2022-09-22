import { createContext, useContext, useEffect, useState } from "react";

const DEVICES = {
  MOBILE: "mobile",
  DESKTOP: "desktop",
};

const ResponsiveContext = createContext({});

const ResponsiveProvider = ({children}) => {
  // const
  const [device, setDevice] = useState(DEVICES.MOBILE);
  const [isMobile, setMobile] = useState(true);
  const [isDesktop, setDesktop] = useState(false);

  const resizeFn = () => {
    let device = "";
    let isMobile = false;
    let isDesktop = false;
    if (window.innerWidth > 1024) {
      device = DEVICES.DESKTOP;
      isDesktop = true;
    } else {
      device = DEVICES.MOBILE;
      isMobile = true;
    }

    setMobile(isMobile);
    setDesktop(isDesktop);
    setDevice(device);
  };

  const contextValue = {
    device,
    isMobile,
    isDesktop,
  };

  useEffect(() => {
    resizeFn();
    window.addEventListener("resize", resizeFn);
    return () => window.removeEventListener("resize", resizeFn);
  }, []);

  return (
    <ResponsiveContext.Provider value={contextValue}>
      {children}
    </ResponsiveContext.Provider>
  );
};

export const useResponsive = () => useContext(ResponsiveContext);
export default ResponsiveProvider;
