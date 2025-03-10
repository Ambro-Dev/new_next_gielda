"use client";

import React, { useMemo, useCallback, useRef } from "react";

import { GoogleMap, Marker } from "@react-google-maps/api";
import { LatLng } from "@prisma/client";

type MapOptions = google.maps.MapOptions;

interface Props {
  point: LatLng;
}

function VehicleMap({ point }: Props) {
  const mapRef = useRef<GoogleMap>();

  const onLoad = useCallback((map: any) => (mapRef.current = map), []);

  const options = useMemo<MapOptions>(
    () => ({
      streetViewControl: false,
      mapTypeControl: false,
    }),
    []
  );

  const containerStyle = {
    width: "100%",
    height: "100%",
    minHeight: "300px",
    borderRadius: "0.5rem",
  };
  return (
    <GoogleMap
      zoom={7}
      mapContainerClassName="map-container"
      options={options}
      onLoad={onLoad}
      mapContainerStyle={containerStyle}
      center={point}
    >
      <Marker position={point} />
    </GoogleMap>
  );
}

export default VehicleMap;
