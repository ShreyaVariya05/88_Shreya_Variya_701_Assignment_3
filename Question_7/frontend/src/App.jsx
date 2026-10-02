import { useState } from "react";

import Admin from "./Admin";
import User from "./User";

function App() {
  const [site, setSite] = useState("user");

  if (site === "admin") {
    return <Admin setSite={setSite} />;
  }

  return <User setSite={setSite} />;
}

export default App;
