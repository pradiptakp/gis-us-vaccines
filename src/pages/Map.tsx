import React from "react";
import mapboxgl from "mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import Slider from "rc-slider";
import moment from "moment";

mapboxgl.accessToken =
  "pk.eyJ1IjoicHJhZGlwdGFrcCIsImEiOiJja3Bqc3liamswNjNoMnZwYmN0bzJxdjA2In0.Mjs-GkGZMsu8owYX_utitQ";
export const MapPage = () => {
  const map = React.useRef<mapboxgl.Map>();
  const mapContainer = React.useRef<HTMLDivElement>(null);
  const [currentDate, setCurrentDate] = React.useState(
    moment("2021-06-10").format("YYYY-MM-DD")
  );
  const [diffDate] = React.useState(
    moment("2021-01-13").diff(moment(), "days")
  );

  const [lng, setLng] = React.useState(-100);
  const [lat, setLat] = React.useState(35);
  const [zoom, setZoom] = React.useState(4);
  const [state, setState] =
    React.useState<{ name: string; totalVaccination: number }>();

  const [mapLoaded, setMapLoaded] = React.useState(false);

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
  });

  React.useEffect(() => {
    if (currentDate && map.current && mapLoaded) {
      //@ts-ignore
      (map.current.getSource("state") as any).setData(
        `http://127.0.0.1:5000/vaccine-state-per-day/${currentDate}`
      );
    }
  }, [currentDate]);

  React.useEffect(() => {
    if (!map.current) {
      return;
    } // wait for map to initialize

    map.current.on("load", () => {
      if (map.current && map.current.isStyleLoaded()) {
        map.current.addSource("state", {
          type: "geojson",
          data: `http://127.0.0.1:5000/vaccine-state-per-day/${currentDate}`,
        });

        // Add a new layer to visualize the polygon.
        map.current.addLayer({
          id: "state",
          type: "fill",
          source: "state", // reference the data source
          layout: {},
          paint: {
            "fill-color": {
              property: "daily_vaccinations",
              stops: [
                [5000, "#0080ff"],
                [10000, "#1b69d0"],
                [20000, "#2154a2"],
                [50000, "#213f77"],
                [1000000, "#1c2b4f"],
              ],
            },
            "fill-opacity": 0.5,
          },
        });

        map.current.on("mousemove", "state", function (e) {
          // Change the cursor style as a UI indicator.
          if (map.current) {
            var states = map.current.queryRenderedFeatures(e.point, {
              layers: ["state"],
            });
            map.current.getCanvas().style.cursor = "pointer";
            if (states.length > 0) {
              setState({
                name: (e as any).features[0].properties.STATE_NAME,
                totalVaccination: (e as any).features[0].properties
                  .daily_vaccinations,
              });
            }
          }
        });

        map.current.on("mouseleave", "state", function () {
          setState(undefined);
          if (map.current) {
            map.current.getCanvas().style.cursor = "";
          }
        });

        setMapLoaded(true);

        map.current.on("click", "state", function (e) {
          if (map.current) {
            alert(JSON.stringify(e.features ?? ""));
          }
        });
      }
    });

    if (mapLoaded) {
      const source = map.current.getSource("state") as mapboxgl.GeoJSONSource;
      source.setData(
        `http://127.0.0.1:5000/vaccine-state-per-day/${currentDate}`
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDate]);

  return (
    <div className="w-screen h-screen flex flex-col">
      {state ? (
        <div className="p-4 pl-6 rounded bg-white shadow absolute top-4 right-4 z-50 w-60 h-36">
          <span className="font-bold uppercase tracking-widest text-xs text-gray-400">
            State Name
          </span>
          <div className="text-lg font-bold flex-1 mb-2">{state?.name}</div>
          <span className="font-bold uppercase tracking-widest text-xs text-gray-400">
            Daily Vaccination
          </span>
          <div className="text-lg font-bold flex-1">
            {state?.totalVaccination}
          </div>
        </div>
      ) : null}

      <div ref={mapContainer} className="w-full flex-1" />
      <div className="p-6 bg-white shadow flex space-x-6">
        <div className="flex-1">
          <Slider
            step={1}
            defaultValue={0}
            min={diffDate}
            max={0}
            onChange={(v) =>
              setCurrentDate(moment().add(v, "days").format("YYYY-MM-DD"))
            }
          />
        </div>
        <div className="w-32 flex items-center justify-center">
          {moment(currentDate).format("DD MMMM YYYY")}
        </div>
      </div>
    </div>
  );
};

export default MapPage;
