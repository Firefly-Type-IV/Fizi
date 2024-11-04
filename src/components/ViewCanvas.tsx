"use client";

import { Canvas } from "@react-three/fiber";
import { View } from "@react-three/drei";
import { Suspense } from "react";
import dynamic from "next/dynamic";

const Loader = dynamic(
  () => import("@react-three/drei") .then((mod) => mod.Loader), {ssr: false},
);
// Local machine is cached, so the loader will not appear unless sent out into the world.

type Props = {}

export default function ViewCanvas({}: Props) {
  return (
    <>
      <Canvas
        style={{
          position: "fixed",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          overflow: "hidden",
          pointerEvents: "none",
          zIndex: 30,
          /** dash for css doesn't work in javaScript so use capitalised */
        }}
        shadows
        dpr={[1, 1.5]}
        gl={{antialias: true}}
        camera={{
          fov: 30,
        }}
      >
        <Suspense fallback={null}>
          <View.Port />
        </Suspense>
      </Canvas>
      <Loader />
    </>
    /** mesh is a 3d object made up of 'geometry' and 'material' equal to html and css  */
    /** rotation in three js is in radians Math.PI * 2 2Pi */
    /** origin for three js is in the center unlike css where [0, 0] is in top left*/
  )
}