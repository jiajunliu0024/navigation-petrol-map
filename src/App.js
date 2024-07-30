import "./App.css";
import Home from "./page";
import { LoadScript } from "@react-google-maps/api";

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
