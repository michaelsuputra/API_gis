import { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./MapComponent.css";
import L from "leaflet";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Set default icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function MapComponent({
  tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  attribution = '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
}) {
  const [markers, setMarkers] = useState([]);
  const [formValues, setFormValues] = useState({ name: "", desc: "" });
  const [activeMarkerIndex, setActiveMarkerIndex] = useState(null);

  const handleDeleteMarker = (indexToDelete) => {
    setMarkers((prevMarkers) =>
      prevMarkers.filter((_, index) => index !== indexToDelete)
    );
    setActiveMarkerIndex(null);
  };

  const handleFormChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const addMarkerToApi = async (marker, index) => {
    const payload = {
      location_name: formValues.name,
      description: formValues.desc,
      latitude: parseFloat(marker.lat),
      longitude: parseFloat(marker.lng),
    };

    try {
      const response = await fetch("http://localhost:2256/api/locations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Gagal menambahkan lokasi ke server");
      }

      alert("Lokasi berhasil ditambahkan!");
      handleDeleteMarker(index); // remove from local state
      setFormValues({ name: "", desc: "" });
    } catch (error) {
      console.error("Gagal kirim ke server:", error);
      alert("Terjadi kesalahan saat mengirim data ke server");
    }
  };

  function MapClickHandler() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        const newMarker = {
          lat,
          lng,
          text: `Marker di lokasi: (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
        };
        setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
        setActiveMarkerIndex(markers.length); // aktifkan popup form di marker terbaru
      },
    });
    return null;
  }

  return (
    <div className="map-container">
      <MapContainer
        center={[-6.2, 106.816]}
        zoom={10}
        className="map"
        style={{ height: "100vh", width: "100%" }}
      >
        <TileLayer url={tileUrl} attribution={attribution} />
        <MapClickHandler />

        {markers.map((marker, index) => (
          <Marker key={index} position={[marker.lat, marker.lng]}>
            <Popup>
              {activeMarkerIndex === index ? (
                <div>
                  <strong>Tambah Lokasi</strong>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      addMarkerToApi(marker, index);
                    }}
                  >
                    <input
                      type="text"
                      name="name"
                      placeholder="Location Name"
                      value={formValues.name}
                      onChange={handleFormChange}
                      required
                      style={{ display: "block", margin: "6px 0", width: "100%" }}
                    />
                    <textarea
                      name="desc"
                      placeholder="Description"
                      value={formValues.desc}
                      onChange={handleFormChange}
                      required
                      rows="2"
                      style={{ display: "block", marginBottom: "6px", width: "100%" }}
                    ></textarea>
                    <button
                      type="submit"
                      style={{
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        padding: "6px 12px",
                        cursor: "pointer",
                      }}
                    >
                      Simpan
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteMarker(index)}
                      style={{
                        marginLeft: "8px",
                        backgroundColor: "red",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        padding: "6px 12px",
                        cursor: "pointer",
                      }}
                    >
                      Batal
                    </button>
                  </form>
                </div>
              ) : (
                <div>
                  <p>{marker.text}</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteMarker(index);
                    }}
                    style={{
                      padding: "4px 8px",
                      fontSize: "0.8rem",
                      marginTop: "4px",
                      background: "red",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Hapus
                  </button>
                </div>
              )}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default MapComponent;
