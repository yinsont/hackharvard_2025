import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix missing marker icons in Leaflet (important for React builds)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Component that listens for clicks
function ClickMarker({ onClick }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onClick(lat, lng); // call the callback from props
      console.log("Clicked coordinates:", lat, lng);
    },
  });
  return null; // This component renders nothing
}

const Map = () => {
  const [coords, setCoords] = useState(null);

  const handleClick = (lat, lng) => {
    setCoords([lat, lng]);
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
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Capture clicks */}
        <ClickMarker onClick={handleClick} />

        {/* Drop a marker at the clicked point */}
        {coords && <Marker position={coords} />}

        {/* 
        <Marker position={[40.7128, -74.006]}> 
            <Popup> Hello from New York! <br /> Zoom or drag the map freely. 
            </Popup> 
        </Marker> 
        */}
      </MapContainer>
    </div>
  );
};

export default Map;
