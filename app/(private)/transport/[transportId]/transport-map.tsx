"use client";

import React, {
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
} from "react";

import { GoogleMap, DirectionsRenderer } from "@react-google-maps/api";
import { Transport } from "./page";
import { LatLng } from "@prisma/client";

type LatLngLiteral = google.maps.LatLngLiteral;
type DirectionsResult = google.maps.DirectionsResult;
type MapOptions = google.maps.MapOptions;

const TransportMap = ({ start, finish }: { start: LatLng; finish: LatLng }) => {
  const mapRef = useRef<GoogleMap>();

  const [directionsLeg, setDirectionsLeg] =
    useState<google.maps.DirectionsLeg>();

  const onLoad = useCallback((map: any) => (mapRef.current = map), []);

  const [directions, setDirections] = useState<DirectionsResult>();

  const options = useMemo<MapOptions>(
    () => ({
      streetViewControl: false,
      mapTypeControl: false,
    }),
    []
  );

  useEffect(() => {
    if (!start || !finish) return;
    fetchDirections(start);
  }, [start, finish]);

  const fetchDirections = async (start: LatLngLiteral) => {
    if (!finish || !start) return;

    const service = new google.maps.DirectionsService();

    service.route(
      {
        origin: start,
        destination: finish,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK" && result) {
          setDirections(result);
          setDirectionsLeg(result.routes[0].legs[0]);
        }
      }
    );
  };

  const containerStyle = {
    width: "100%",
    height: "300px",
    borderRadius: "0.5rem",
  };
  return (
    <GoogleMap
      zoom={11}
      mapContainerClassName="map-container"
      options={options}
      onLoad={onLoad}
      mapContainerStyle={containerStyle}
    >
      {directions && (
        <DirectionsRenderer
          directions={directions}
          options={{
            polylineOptions: {
              strokeColor: "#1976D2",
              strokeWeight: 5,
              clickable: false,
            },
            markerOptions: {
              zIndex: 100,
              cursor: "default",
            },
          }}
        />
      )}
    </GoogleMap>
  );
};

export default TransportMap;
