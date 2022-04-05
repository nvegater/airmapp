import React, { FC, useMemo, useState } from "react";
import {
  Circle,
  GeoJSON as GeoJsonComponent,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import * as turf from "@turf/turf";
import osmtogeojson from "osmtogeojson";
import { LatLng, LocationEvent } from "leaflet";

const computeCenter = (data: any): [number, number] => {
  let centerGeoJSON = { geometry: { coordinates: [0, 0] } };
  let centerCoordinates;
  try {
    // @ts-ignore
    if (data) {
      centerGeoJSON = turf.center(data);
    }
  } catch (e) {
    console.log(e);
  }
  centerCoordinates = centerGeoJSON.geometry.coordinates;
  return data ? [centerCoordinates[1], centerCoordinates[0]] : [0, 0];
};

interface LatLngProps {
  center: [number, number];
}

const LocationMarker: FC<LatLngProps> = ({ center }) => {
  const [position, setPosition] = useState<LatLng | null>(null);
  const map = useMapEvents({
    click() {
      map.locate();
      map.flyTo(center, map.getZoom());
    },
    locationfound(e: LocationEvent) {
      setPosition(e.latlng);
    },
  });
  map.flyTo(center);

  return position === null ? null : (
    <Marker position={position}>
      <Popup>You are here</Popup>
    </Marker>
  );
};

interface OSMBoundsType {
  data: any;
}

export const Map: FC<OSMBoundsType> = ({ data }) => {
  const geoJJSONData = useMemo(
    () => (data ? osmtogeojson(data) : undefined),
    [data]
  );
  const computedCenter = useMemo(
    () => computeCenter(geoJJSONData),
    [geoJJSONData]
  );

  return (
    <MapContainer
      center={computedCenter}
      zoom={geoJJSONData ? 12 : 1}
      style={{ height: "350px", width: "100wh" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker center={computedCenter} />
      {data !== undefined && (
        <Circle
          center={computedCenter}
          radius={100}
          pathOptions={{ color: "blue" }}
        />
      )}
      {geoJJSONData !== undefined && (
        <GeoJsonComponent
          data={geoJJSONData}
          style={{
            color: "red",
          }}
          pathOptions={{ color: "red" }}
        />
      )}
    </MapContainer>
  );
};
