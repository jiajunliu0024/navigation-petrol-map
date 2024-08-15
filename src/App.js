import "./App.css";
import Home from "./Home";
import { LoadScript } from "@react-google-maps/api";

function App() {
  const libraries = ["places"];
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  return (
    <LoadScript googleMapsApiKey={apiKey} libraries={libraries}>
      <div className="App">
        <Home></Home>
      </div>
    </LoadScript>
  );
}

export default App;
