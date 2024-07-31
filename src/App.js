import "./App.css";
import Home from "./page";
import { LoadScript } from "@react-google-maps/api";

function App() {
  const libraries = ["places"];
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  return (
    <LoadScript googleMapsApiKey={apiKey} libraries={libraries}>
      <div className="App">
        <Home></Home>
      </div>
    </LoadScript>
  );
}

export default App;
