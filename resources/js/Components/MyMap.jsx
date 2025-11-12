import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState } from "react";

export default function MyMap({ onLocationSelect }) {
    const [markerPos, setMarkerPos] = useState([6.898, 122.067]); // default position

    function LocationMarker() {
        useMapEvents({
            click(e) {
                const { lat, lng } = e.latlng;
                setMarkerPos([lat, lng]); // move marker
                onLocationSelect({ lat, lng }); // send to parent
            },
        });
        return <Marker position={markerPos} draggable />;
    }

    return (
        <MapContainer
            center={markerPos}
            zoom={13}
            style={{ height: "400px", width: "100%" }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker />
        </MapContainer>
    );
}
