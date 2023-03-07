import { useContext } from "react";
import {

  useRoutes
} from "react-router-dom";

import AppContext from "./context";

import routes from "./routes";

const App = () => {
  const { user, settings } = useContext(AppContext);
  const routing = useRoutes(routes(!!user));

 

  return (
    <div className="app" data-theme={settings.theme} style={{zoom: settings.zoom}}>
      {routing}
    </div>
  );
}

export default App;
