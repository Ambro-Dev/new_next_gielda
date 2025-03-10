"use client";

import React, { use, useEffect } from "react";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Environment,
  Lightformer,
  OrbitControls,
  AccumulativeShadows,
  RandomizedLight,
  PerspectiveCamera,
} from "@react-three/drei";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

type Props = {
  className?: string;
  vehicleType: string;
  vehicleSize: [number, number, number];
  VehicleModel: ({
    args,
    ...props
  }: {
    args: [number, number, number];
  }) => React.JSX.Element;
};

export const VehicleVizualization = ({
  className,
  vehicleSize,
  VehicleModel,
  vehicleType,
}: Props) => {
  const [autoRotate, setAutoRotate] = React.useState(false);
  const [shadow, setShadow] = React.useState("#fff");
  const [position, setPosition] = React.useState<[number, number, number]>([
    0, 0, 0,
  ]);
  const [zoom, setZoom] = React.useState(4);

  const takeScreenshot = () => {
    // Save the canvas as a *.png
    const link = document.createElement("a");
    link.setAttribute("download", "canvas.png");
    // @ts-ignore
    link.setAttribute(
      "href",
      // @ts-ignore
      document
        .querySelector("canvas")
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream")
    );
    link.click();
  };

  useEffect(() => {
    setPosition(
      vehicleType.includes("large")
        ? [0, 0, -5]
        : vehicleType.includes("medium")
        ? [0, 0, -2]
        : vehicleType.includes("small")
        ? [0, 0, 0]
        : [0, 0, 0]
    );
    setZoom(
      vehicleType.includes("large")
        ? 2.8
        : vehicleType.includes("medium")
        ? 3.5
        : vehicleType.includes("small")
        ? 4
        : 4
    );
  }, [vehicleType]);

  const ZoomControl = () => {
    return (
      <div className="absolute top-2 flex flex-col right-2 gap-2 z-10">
        <Button
          className="rounded-md"
          size="icon"
          onClick={() => setZoom((prev) => prev + 0.1)}
        >
          <Plus />
        </Button>
        <Button
          className="rounded-md"
          size="icon"
          onClick={() => setZoom((prev) => prev - 0.1)}
        >
          <Minus />
        </Button>
      </div>
    );
  };

  return (
    <div className={cn(className, "w-full h-full rounded-md relative")}>
      <ZoomControl />
      <Canvas
        shadows
        orthographic
        gl={{ preserveDrawingBuffer: true }}
        className="w-full h-full rounded-md"
      >
        <color attach="background" args={["#f3f4f6"]} />
        <mesh position={position}>
          <VehicleModel args={vehicleSize} />
        </mesh>

        <OrbitControls
          autoRotate={true}
          autoRotateSpeed={-0.2}
          zoomSpeed={0.25}
          minZoom={10}
          maxZoom={200}
          enablePan={false}
          dampingFactor={0.05}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2}
        />
        <PerspectiveCamera
          makeDefault
          position={[10, 20, 20]}
          fov={60}
          zoom={zoom}
        />
        {/** The environment is just a bunch of shapes emitting light. This is needed for the clear-coat */}
        <Environment resolution={32}>
          <group rotation={[-Math.PI / 4, -0.3, 0]}>
            <Lightformer
              intensity={20}
              rotation-x={Math.PI / 2}
              position={[0, 5, -9]}
              scale={[10, 10, 1]}
            />
            <Lightformer
              intensity={2}
              rotation-y={Math.PI / 2}
              position={[-5, 1, -1]}
              scale={[10, 2, 1]}
            />
            <Lightformer
              intensity={2}
              rotation-y={Math.PI / 2}
              position={[-5, -1, -1]}
              scale={[10, 2, 1]}
            />
            <Lightformer
              intensity={2}
              rotation-y={-Math.PI / 2}
              position={[10, 1, 0]}
              scale={[20, 2, 1]}
            />
            <Lightformer
              type="ring"
              intensity={2}
              rotation-y={Math.PI / 2}
              position={[-0.1, 0, -5]}
              scale={10}
            />
          </group>
        </Environment>
        <AccumulativeShadows
          frames={100}
          color={shadow}
          colorBlend={5}
          toneMapped={true}
          alphaTest={0.9}
          opacity={0.4}
          scale={30}
          position={[0, 0.01, 0]}
        >
          <RandomizedLight
            amount={4}
            radius={10}
            ambient={0.5}
            intensity={1}
            position={[0, 10, -10]}
            size={15}
            mapSize={1024}
            bias={0.0001}
          />
        </AccumulativeShadows>
      </Canvas>
    </div>
  );
};
