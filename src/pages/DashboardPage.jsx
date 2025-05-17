import { useState } from "react";
import "./DashboardPage.css";
import MapComponent from "../components/MapComponent";

function Dashboard({ onLogout }) {
  const [tileUrl, setTileUrl] = useState("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png");
  const [attribution, setAttribution] = useState(
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  );

  const handleBasemapChange = (type) => {
    switch (type) {
      case "streets":
        setTileUrl("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png");
        setAttribution(
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        );
        break;
      case "outdoor":
        setTileUrl("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png");
        setAttribution(
          'Map data: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> contributors'
        );
        break;
      case "satellite":
        setTileUrl(
          "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        );
        setAttribution("Tiles &copy; Esri &mdash; Source: Esri, Earthstar Geographics");
        break;
      default:
        break;
    }
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <h1>Dashboard GIS</h1>

        <div className="basemap-option" onClick={() => handleBasemapChange("streets")}>
          <img src="https://tile.openstreetmap.org/0/0/0.png" alt="Streets" />
          <div className="info">
            <span className="title">Streets</span>
            <span className="desc">Complete and legible map for navigation</span>
          </div>
        </div>

        <div className="basemap-option" onClick={() => handleBasemapChange("outdoor")}>
        <img src="https://a.tile.opentopomap.org/5/15/10.png" alt="Outdoor" />
          <div className="info">
            <span className="title">Outdoor</span>
            <span className="desc">Topographic map for sport and hiking</span>
          </div>
        </div>

        <div className="basemap-option" onClick={() => handleBasemapChange("satellite")}>
          <img
            src="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/0/0/0"
            alt="Satellite"
          />
          <div className="info">
            <span className="title">Satellite</span>
            <span className="desc">Aerial and satellite imagery</span>
          </div>
        </div>

        <button className="logout-button" onClick={onLogout}>
          Logout
        </button>
      </div>

      <div className="map-area">
        <MapComponent tileUrl={tileUrl} attribution={attribution} />
      </div>
    </div>
  );
}

export default Dashboard;
