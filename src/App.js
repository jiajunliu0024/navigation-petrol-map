import "./App.css";
import Home from "./Home";
import { LoadScript } from "@react-google-maps/api";
import { APIProvider } from "@vis.gl/react-google-maps";

function App() {
  const libraries = ["places"];
  const apiKey = "AIzaSyA6d7pIq9TszfM0M6pIosMT1flSKr5o8oM";

  return (
    <LoadScript googleMapsApiKey={apiKey} libraries={libraries}>
      <div className="App">
        <Home></Home>
      </div>
    </LoadScript>
  );
}

export default App;
