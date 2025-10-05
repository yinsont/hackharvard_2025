import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function ClickHandler({ onClick, gameMode }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onClick(lat, lng, gameMode);
    },
  });
  return null;
}

const Map = () => {
  const [coords, setCoords] = useState(null);
  const [country, setCountry] = useState(null);
  const [gameMode, setGameMode] = useState(false); // Game mode toggle
  const [isCorrect, setIsCorrect] = useState(null); // Check if answer is correct

  const handleClick = async (lat, lng, gameMode) => {
    if (!gameMode) {
      // Explore Mode: just get the coordinates and country
      setCoords([lat, lng]);

      console.log(`Explore Mode - Clicked coordinates: ${lat}, ${lng}`);

      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      const countryName = data.address?.country || "Unknown";
      setCountry(countryName);
      console.log("Explore Mode - Country:", countryName);
    } else {
      // Game Mode: we can keep this empty for now, just for structure
      console.log("Game Mode clicked");
    }
  };

  const toggleGameMode = () => {
    setGameMode(!gameMode);
    setIsCorrect(null); // Reset the game state when toggling
  };

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <MapContainer
        center={[0, 0]}
        zoom={2}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://cartodb.com/">CartoDB</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        <ClickHandler onClick={handleClick} gameMode={gameMode} />
        {coords && !gameMode && <Marker position={coords} />}
      </MapContainer>

      {/* Toggle button outside of MapContainer */}
      <button
        onClick={toggleGameMode}
        style={{
          position: "fixed", // Changed to fixed positioning
          top: 10,
          left: 10,
          padding: "10px 20px",
          background: "rgba(0, 0, 0, 0.6)",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          zIndex: 1000, // Make sure it's on top of other elements
        }}
      >
        {gameMode ? "Exit Game Mode" : "Start Game Mode"}
      </button>

      {/* Explore Mode UI */}
      {!gameMode && country && (
        <div
          style={{
            position: "fixed",
            bottom: 50,
            left: 10,
            background: "rgba(0, 0, 0, 0.6)",
            color: "#fff",
            padding: "8px 12px",
            borderRadius: "6px",
            fontSize: "14px",
          }}
        >
          Coordinates: {coords[0]}, {coords[1]} <br />
          Country: {country}
        </div>
      )}

      {/* Result after guess (currently disabled since gameMode is empty) */}
      {isCorrect !== null && (
        <div
          style={{
            position: "fixed",
            bottom: 10,
            left: 10,
            background: "rgba(0, 0, 0, 0.6)",
            color: "#fff",
            padding: "8px 12px",
            borderRadius: "6px",
            fontSize: "14px",
          }}
        >
          {isCorrect ? "Correct!" : "Oops, try again!"}
        </div>
      )}
    </div>
  );
};

export default Map;