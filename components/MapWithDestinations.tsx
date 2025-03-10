"use client";

import React, {
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
} from "react";

import { GoogleMap, Marker, DirectionsRenderer } from "@react-google-maps/api";

type LatLngLiteral = google.maps.LatLngLiteral;
type DirectionsResult = google.maps.DirectionsResult;
type MapOptions = google.maps.MapOptions;

type Props = {
  start: LatLngLiteral | null | undefined;
  finish: LatLngLiteral | null | undefined;
};

const MapWithDirections = ({ start, finish }: Props) => {
  const mapRef = useRef<GoogleMap>();

  const onLoad = useCallback((map: any) => (mapRef.current = map), []);

  const [directions, setDirections] = useState<DirectionsResult>();

  const options = useMemo<MapOptions>(
    () => ({
      disableDefaultUI: true,
      clickableIcons: false,
      zoomControl: false,
      fullscreenControl: false,
      streetViewControl: false,
      mapTypeControl: false,
      disableDoubleClickZoom: true,
      scrollwheel: false,
      gestureHandling: "none",
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
        }
      }
    );
  };

  const localization = navigator.geolocation;
  const [currentPosition, setCurrentPosition] = useState<LatLngLiteral>();

  useEffect(() => {
    if (!localization) return;

    localization.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentPosition({ lat: latitude, lng: longitude });
      },
      (error) => {
        console.error(error);
      }
    );
  }, [localization]);

  const containerStyle = {
    width: "100%",
    height: "300px",
    borderRadius: "0.5rem",
  };

  return (
    <GoogleMap
      zoom={9}
      mapContainerClassName="map-container"
      options={options}
      onLoad={onLoad}
      center={
        currentPosition ||
        start || {
          lat: 52.229676,
          lng: 21.012229,
        }
      }
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

      {!directions && (
        <>
          {start && (
            <Marker
              position={start}
              icon={{
                url: "https://img.icons8.com/stickers/100/marker-a.png",
                scaledSize: new google.maps.Size(30, 30),
              }}
            />
          )}
          {finish && (
            <Marker
              position={finish}
              icon={{
                url: "https://img.icons8.com/stickers/100/marker-b.png",
                scaledSize: new google.maps.Size(24, 24),
              }}
            />
          )}
        </>
      )}
    </GoogleMap>
  );
};

export default MapWithDirections;
