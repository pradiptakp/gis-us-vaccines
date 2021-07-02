/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import mapboxgl from "mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import Slider from "rc-slider";
import moment from "moment";
import { numberWithCommas } from "../utils/formatter";
import { Modal } from "../components/Modal";
import { Popover, Transition } from "@headlessui/react";

mapboxgl.accessToken =
  "pk.eyJ1IjoicHJhZGlwdGFrcCIsImEiOiJja3Bqc3liamswNjNoMnZwYmN0bzJxdjA2In0.Mjs-GkGZMsu8owYX_utitQ";

const todayDate = "2021-07-01";

type optionType = {
  title: string;
  share?: boolean;
  columnName: string;
  id:
    | "total-people-vaccinated"
    | "share-people-vaccinated"
    | "total-people-fully-vaccinated"
    | "share-people-fully-vaccinated";
};

const options: optionType[] = [
  {
    title: "Total People Vaccinated (1 Dose)",
    id: "total-people-vaccinated",
    columnName: "people_vaccinated",
  },
  {
    title: "Share People Vaccinated (1 Dose)",
    id: "share-people-vaccinated",
    columnName: "people_vaccinated_per_hundred",
    share: true,
  },
  {
    title: "Total People Fully Vaccinated",
    id: "total-people-fully-vaccinated",
    columnName: "people_fully_vaccinated",
  },
  {
    title: "Share People Fully Vaccinated",
    id: "share-people-fully-vaccinated",
    columnName: "people_fully_vaccinated_per_hundred",
    share: true,
  },
];

const legendTotal: [number, string][] = [
  [500000, "#DEEBF7"],
  [1000000, "#C6DBEF"],
  [2500000, "#9ECAE1"],
  [5000000, "#6BAED6"],
  [8000000, "#4292C6"],
  [10000000, "#2171B5"],
  [20000000, "#08519C"],
  [40000000, "#08306B"],
];

const legendShare: [number, string][] = [
  [2, "#DEEBF7"],
  [5, "#C6DBEF"],
  [10, "#9ECAE1"],
  [20, "#6BAED6"],
  [30, "#4292C6"],
  [40, "#2171B5"],
  [50, "#08519C"],
  [70, "#08306B"],
];

export const MapPage = () => {
  const map = React.useRef<mapboxgl.Map>();
  const mapContainer = React.useRef<HTMLDivElement>(null);
  const [currentDate, setCurrentDate] = React.useState(
    moment(todayDate).format("YYYY-MM-DD")
  );
  const [diffDate] = React.useState(
    moment("2021-01-13").diff(moment(todayDate), "days")
  );

  const [modalContent, setModalContent] =
    React.useState<{ stateName: string; stateId: string }>();

  const [lng, setLng] = React.useState(-100);
  const [lat, setLat] = React.useState(35);
  const [zoom, setZoom] = React.useState(4);
  const [selectedOptions, setSelectedOption] = React.useState<optionType>({
    title: "Total People Vaccinated (1 Dose)",
    id: "total-people-vaccinated",
    columnName: "people_vaccinated",
  });

  const selectedOptionsRef = React.useRef<optionType>();

  selectedOptionsRef.current = selectedOptions;
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
        `http://127.0.0.1:5000/${selectedOptions.id}/${currentDate}`
      );
    }
  }, [currentDate, selectedOptions]);

  React.useEffect(() => {
    if (!map.current) {
      return;
    } // wait for map to initialize

    if (mapLoaded) {
      map.current.setPaintProperty("state", "fill-color", {
        property: selectedOptionsRef.current?.columnName,
        stops: selectedOptionsRef.current?.share ? legendShare : legendTotal,
      });
    }

    map.current.on("load", () => {
      if (map.current && map.current.isStyleLoaded()) {
        map.current.addSource("state", {
          type: "geojson",
          data: `http://127.0.0.1:5000/${selectedOptionsRef.current?.id}/${currentDate}`,
        });

        // Add a new layer to visualize the polygon.
        map.current.addLayer({
          id: "state",
          type: "fill",
          source: "state", // reference the data source
          layout: {},
          paint: {
            "fill-color": {
              property: selectedOptionsRef.current?.columnName,
              stops: selectedOptionsRef.current?.share
                ? legendShare
                : legendTotal,
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
                totalVaccination: (e as any).features[0].properties[
                  selectedOptionsRef.current?.columnName ?? ""
                ],
              });
            }
          }
        });

        map.current.on("mouseleave", "state", function () {
          setState(undefined);
        });

        setMapLoaded(true);

        map.current.on("click", "state", function (e) {
          if (map.current) {
            console.log(selectedOptionsRef.current);
            setModalContent({
              stateName: (e as any).features[0].properties.STATE_NAME as string,
              stateId: (e as any).features[0].properties[
                selectedOptionsRef.current?.columnName ?? ""
              ],
            });
          }
        });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDate, selectedOptions]);

  return (
    <div className="w-screen h-screen flex flex-col">
      <Modal
        open={modalContent ? true : false}
        title={modalContent?.stateName ?? ""}
        content={<div>{modalContent?.stateId}</div>}
        buttons={[{ text: "OK" }]}
        onClose={() => {
          setModalContent(undefined);
        }}
      />
      <div className="absolute top-4 right-4 z-10">
        <div
          className={`p-4 pl-6 rounded bg-white shadow  w-60 transition mb-4`}
        >
          <span className="font-bold uppercase tracking-widest text-xs text-blue-600">
            Legend
          </span>

          {(selectedOptions.share ? legendShare : legendTotal).map((v) => {
            return (
              <div className="flex mt-2 items-center">
                <div
                  className="h-4 w-6 rounded overflow-hidden mr-2"
                  style={{ backgroundColor: "#F4F4F2" }}
                >
                  {" "}
                  <div
                    className="h-full w-full"
                    style={{ backgroundColor: v[1], opacity: 0.5 }}
                  />
                </div>

                <div>
                  ≥ {numberWithCommas(v[0].toString())}{" "}
                  {selectedOptions.share ? "%" : null}
                </div>
              </div>
            );
          })}
        </div>

        <div
          className={`p-4 pl-6 rounded bg-white shadow  w-60 transition ${
            !state ? "opacity-0" : "opacity-100"
          }`}
        >
          <span className="font-bold uppercase tracking-widest text-xs text-gray-400">
            State Name
          </span>
          <div className="text-lg font-bold flex-1 mb-2">{state?.name}</div>
          <div className="font-bold uppercase tracking-widest text-xs text-gray-400">
            {selectedOptions.title}
          </div>
          <div className="font-medium mt-px uppercase text-xs text-gray-400">
            Per {moment(currentDate).format("DD MMMM YYYY")}
          </div>
          <div className="text-lg font-bold flex-1">
            {!selectedOptions.share
              ? numberWithCommas(state?.totalVaccination?.toString() ?? "")
              : `${state?.totalVaccination}%`}
          </div>
        </div>
      </div>

      <div ref={mapContainer} className="w-full flex-1" />
      <div className="bg-white shadow flex h-20">
        <div className="flex-1 py-6 pl-6 pr-2 flex items-center">
          <Slider
            step={1}
            defaultValue={0}
            min={diffDate}
            max={0}
            onChange={(v) => {
              setCurrentDate(
                moment(todayDate).add(v, "days").format("YYYY-MM-DD")
              );
            }}
          />
        </div>
        <div className="w-32 flex items-center justify-center py-6 ">
          {moment(currentDate).format("DD MMMM YYYY")}
        </div>
        <div className="w-px bg-gray-200" />
        <Popover className="relative">
          {(open) => (
            <>
              <Popover.Button className="focus:outline-none h-full">
                <div className="h-full">
                  <div className="w-72 flex flex-col justify-center items-start font-bold text-blue-600 py-4 pl-4 pr-2 h-full hover:bg-blueGray-100 transition cursor-pointer">
                    <div className="flex items-center">
                      {selectedOptions.title}
                      <i
                        className={`fas fa-chevron-down text-xs transition duration-200 transform ml-4 ${
                          open ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                    {selectedOptions.share ? (
                      <div className="text-xs text-gray-400">Per 100</div>
                    ) : null}
                  </div>
                </div>
              </Popover.Button>
              <Popover.Overlay
                className={`${
                  open ? "opacity-30 fixed inset-0" : "opacity-0 "
                } bg-black z-40`}
              />
              <Transition
                as={React.Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <Popover.Panel className="absolute z-50 w-80 px-4 mb-2 transform bottom-16 right-2 sm:px-0 lg:max-w-3xl">
                  <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white ">
                    {options.map((v) => (
                      <div
                        onClick={() => setSelectedOption(v)}
                        className="flex flex-col items-start w-full cursor-pointer p-4 transition duration-150 ease-in-out rounded-md hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                      >
                        <Popover.Button className="focus:outline-none">
                          <span className="flex flex-col justify-center items-start">
                            <div className="text-sm font-medium text-gray-900">
                              {v.title}
                            </div>
                            {v.share ? (
                              <div className="text-xs text-gray-400">
                                Per 100
                              </div>
                            ) : null}
                          </span>
                        </Popover.Button>
                      </div>
                    ))}
                  </div>
                </Popover.Panel>
              </Transition>
            </>
          )}
        </Popover>
      </div>
    </div>
  );
};

export default MapPage;
