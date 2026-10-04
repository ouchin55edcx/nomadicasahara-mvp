"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const MARRAKECH: [number, number] = [-7.9811, 31.6295];

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
      center: MARRAKECH,
      zoom: 12,
    });
    map.addControl(
      new mapboxgl.NavigationControl({ showCompass: false }),
      "top-right",
    );

    const marker = new mapboxgl.Marker({ color: "#C62828" })
      .setLngLat(MARRAKECH)
      .setPopup(new mapboxgl.Popup({ offset: 12 }).setText("Marrakech"))
      .addTo(map);

    return () => {
      marker.remove();
      map.remove();
    };
  }, []);

  return (
    <div
      ref={container}
      className={`h-[300px] w-full md:h-[340px] ${className}`}
      aria-label="Mapa de Marrakech"
    />
  );
}
