"use client";

import React, { useMemo, useCallback, useRef } from "react";

import { GoogleMap, Marker } from "@react-google-maps/api";

type MapOptions = google.maps.MapOptions;

interface DataTableProps<TData> {
  data: TData[];
}

function TransportMap<TData>({ data }: DataTableProps<TData>) {
  const mapRef = useRef<GoogleMap>();

  const onLoad = useCallback((map: any) => (mapRef.current = map), []);

  const options = useMemo<MapOptions>(
    () => ({
      streetViewControl: false,
      mapTypeControl: false,
    }),
    []
  );

  const centerOfPoland = {
    lat: 52.069167,
    lng: 19.480556,
  };

  const containerStyle = {
    width: "100%",
    height: "100%",
    minHeight: "300px",
    borderRadius: "0.5rem",
  };
  return (
    <GoogleMap
      zoom={5}
      mapContainerClassName="map-container"
      options={options}
      onLoad={onLoad}
      mapContainerStyle={containerStyle}
      center={centerOfPoland}
    >
      {data.map((item: any) => (
        <Marker
          key={item.id}
          position={{
            lat: item.place_lat,
            lng: item.place_lng,
          }}
        />
      ))}
    </GoogleMap>
  );
}

export default TransportMap;
