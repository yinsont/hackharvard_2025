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

function ClickHandler({ onClick }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onClick(lat, lng);
    },
  });
  return null;
}

const Map = () => {
  const [coords, setCoords] = useState(null);
  const [country, setCountry] = useState(null);

  const handleClick = async (lat, lng) => {
    setCoords([lat, lng]);

    console.log(`Clicked coordinates: ${lat}, ${lng}`);

    // 🌍 Fetch location info from OpenStreetMap (Nominatim)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
    );
    const data = await response.json();

    const countryName = data.address?.country || "Unknown";
    console.log("Country:", countryName);
    setCountry(countryName);
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
        <ClickHandler onClick={handleClick} />
        {coords && <Marker position={coords} />}
      </MapContainer>

      {/* Display selected country */}
      {country && (
        <div
          style={{
            position: "absolute",
            bottom: 10,
            left: 10,
            background: "rgba(0,0,0,0.6)",
            color: "#fff",
            padding: "8px 12px",
            borderRadius: "6px",
            fontSize: "14px",
          }}
        >
          Country: {country}
        </div>
      )}
    </div>
  );
};

export default Map;
