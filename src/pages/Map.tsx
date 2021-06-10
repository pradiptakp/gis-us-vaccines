import React from "react";
import mapboxgl from "mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax

mapboxgl.accessToken =
  "pk.eyJ1IjoicHJhZGlwdGFrcCIsImEiOiJja3Bqc3liamswNjNoMnZwYmN0bzJxdjA2In0.Mjs-GkGZMsu8owYX_utitQ";
export const MapPage = () => {
  const map = React.useRef<mapboxgl.Map>();
  const mapContainer = React.useRef<HTMLDivElement>(null);

  const [lng, setLng] = React.useState(-100);
  const [lat, setLat] = React.useState(35);
  const [zoom, setZoom] = React.useState(4);

  React.useEffect(() => {
    if (map.current) return; // initialize map only once

    if (mapContainer.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/light-v10",
        center: [lng, lat],
        zoom: zoom,
      });
    }
  });

  React.useEffect(() => {
    if (!map.current) {
      return;
    } // wait for map to initialize

    map.current.on("move", () => {
      if (map.current) {
        setLng(map.current.getCenter().lng);
        setLat(map.current.getCenter().lat);
        setZoom(map.current.getZoom());
      }
    });

    map.current.on("load", () => {
      if (map.current && map.current.isStyleLoaded()) {
        map.current.addSource("state", {
          type: "geojson",
          data: "https://docs.mapbox.com/mapbox-gl-js/assets/us_states.geojson",
        });

        // Add a new layer to visualize the polygon.
        map.current.addLayer({
          id: "state",
          type: "fill",
          source: "state", // reference the data source
          layout: {},
          paint: {
            "fill-color": "#0080ff", // blue color fill
            "fill-opacity": 0.2,
          },
        });
      }
    });
  });

  return (
    <div className="">
      <div ref={mapContainer} className="w-screen h-screen" />
    </div>
  );
};

export default MapPage;
