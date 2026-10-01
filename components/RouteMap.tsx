"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const ESSAOUIRA: [number, number] = [-9.7749, 31.5085];
const MARRAKECH: [number, number] = [-7.9811, 31.6295];

const STRAIGHT_ROUTE: [number, number][] = [ESSAOUIRA, MARRAKECH];

export default function RouteMap({ className = "" }: { className?: string }) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) return;
    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container: container.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-8.88, 31.56],
      zoom: 7.4,
    });
    map.addControl(
      new mapboxgl.NavigationControl({ showCompass: false }),
      "top-right",
    );

    let disposed = false;

    const markers = [
      new mapboxgl.Marker({ color: "#C62828" })
        .setLngLat(MARRAKECH)
        .setPopup(new mapboxgl.Popup({ offset: 12 }).setText("Marrakech"))
        .addTo(map),
      new mapboxgl.Marker({ color: "#2E7D32" })
        .setLngLat(ESSAOUIRA)
        .setPopup(new mapboxgl.Popup({ offset: 12 }).setText("Essaouira"))
        .addTo(map),
    ];

    const addRoute = (coordinates: [number, number][]) => {
      if (disposed) return;
      if (map.getSource("tour-route")) return;
      map.addSource("tour-route", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: { type: "LineString", coordinates },
        },
      });
      map.addLayer({
        id: "tour-route-casing",
        type: "line",
        source: "tour-route",
        layout: { "line-cap": "round", "line-join": "round" },
        paint: { "line-color": "#ffffff", "line-width": 8 },
      });
      map.addLayer({
        id: "tour-route-line",
        type: "line",
        source: "tour-route",
        layout: { "line-cap": "round", "line-join": "round" },
        paint: { "line-color": "#66B600", "line-width": 4 },
      });
    };

    // Driving route from the Directions API; fall back to a straight line.
    const url =
      `https://api.mapbox.com/directions/v5/mapbox/driving/` +
      `${ESSAOUIRA[0]},${ESSAOUIRA[1]};${MARRAKECH[0]},${MARRAKECH[1]}` +
      `?geometries=geojson&overview=full&access_token=${token}`;
    fetch(url)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("no route"))))
      .then((json) => {
        const coords = json?.routes?.[0]?.geometry?.coordinates;
        addRoute(Array.isArray(coords) && coords.length > 1 ? coords : STRAIGHT_ROUTE);
      })
      .catch(() => addRoute(STRAIGHT_ROUTE));

    return () => {
      disposed = true;
      markers.forEach((m) => m.remove());
      map.remove();
    };
  }, []);

  return (
    <div
      ref={container}
      className={`h-[300px] w-full md:h-[340px] ${className}`}
      aria-label="Mapa de la ruta Essaouira - Marrakech"
    />
  );
}
