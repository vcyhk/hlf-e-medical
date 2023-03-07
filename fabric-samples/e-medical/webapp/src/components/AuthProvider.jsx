import { useEffect, useState } from "react";
import AppContext from "../context";

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [settings, setSettings] = useState({});

    useEffect(() => {
        const userStr = localStorage.getItem("user");
        if (userStr) {
            setUser(JSON.parse(userStr));
        }
        const settingsStr = localStorage.getItem("settings");
        if (settingsStr) {
            setSettings(JSON.parse(settingsStr));
        } else {
            setSettings({
                zoom: 1,
                theme: "light",
            });
        }
    }, []);

    const value = {
      user,
      setUser,
      settings,
      setSettings,
    };
  
    return (
      <AppContext.Provider value={value}>
        {children}
      </AppContext.Provider>
    );
  };

  export default AuthProvider;