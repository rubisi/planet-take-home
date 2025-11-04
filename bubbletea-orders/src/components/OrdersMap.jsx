import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

// Default map center and zoom level (set from the data)
const DEFAULT_CENTER = [52.5127761, 13.3391605];
const DEFAULT_ZOOM = 15;

export default function OrdersMap({ orders }) {
  return (
    <div style={{ height: "90vh", width: "100vw" }}> {/* Full viewport size */}
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {orders.map((o, idx) => (
          <Marker key={idx} position={[o.lat, o.lon]}>
            {/* Show popup when a marker is clicked */}
            <Popup>
              <div>
                <div><b>Customer:</b> {o.customerId}</div>
                <div><b>Time:</b> {o.timestamp}</div>
                <div><b>Lat:</b> {o.lat.toFixed(6)}, <b>Lon:</b> {o.lon.toFixed(6)}</div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
