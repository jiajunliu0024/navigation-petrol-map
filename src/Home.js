"use client";
import PetrolMap from "./components/PetrolMap";
import { useState } from "react";
import Header from "./components/Header";

function Home() {
  const [petrol, setPetrol] = useState("U91");
  const [cur, setCur] = useState({ lat: -31.95224, lng: 115.8614 });
  const [brand, setBrand] = useState(["SHELL", "BP"]);
  const [src, setSrc] = useState("");
  const [des, setDes] = useState("");
  const handleCurrentPositionUpdate = (position) => {
    setCur(position);
  };

  return (
    <div className="w-full h-screen  flex items-center justify-center">
      <div className="w-full h-full flex flex-col">
        <Header
          brand={brand}
          setBrand={setBrand}
          petrol={petrol}
          cur={cur}
          setCur={setCur}
          setPetrol={setPetrol}
          src={src}
          setDes={setDes}
          setSrc={setSrc}
          des={des}
          updatePosition={handleCurrentPositionUpdate}
        ></Header>
        <PetrolMap
          brand={brand}
          petrolType={petrol}
          src={src}
          des={des}
          cur={cur}
        ></PetrolMap>
      </div>
    </div>
  );
}

export default Home;
