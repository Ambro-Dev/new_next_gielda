"use client";

import React, {
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
} from "react";

import { GoogleMap, DirectionsRenderer } from "@react-google-maps/api";
import { ExtendedTransport } from "@/app/(private)/user/market/page";

type LatLngLiteral = google.maps.LatLngLiteral;
type DirectionsResult = google.maps.DirectionsResult;
type MapOptions = google.maps.MapOptions;

const Map = ({
  transport,
  className,
}: {
  transport: ExtendedTransport;
  className: string;
}) => {
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
    if (!transport.directions.start || !transport.directions.finish) return;
    const fetchDirections = async (start: LatLngLiteral) => {
      if (!transport.directions.finish || !start) return;

      const service = new google.maps.DirectionsService();

      service.route(
        {
          origin: start,
          destination: transport.directions.finish,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === "OK" && result) {
            setDirections(result);
          }
        }
      );
    };
    fetchDirections(transport.directions.start);
  }, [transport.directions.start, transport.directions.finish]);

  const containerStyle = {
    width: "100%",
    height: "100%",
    borderRadius: "0.5rem",
  };
  return (
    <div className={className}>
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
    </div>
  );
};

export default Map;
