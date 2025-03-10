"use client";

import React from "react";

import { Center, Box, Cylinder } from "@react-three/drei";
import { Grid } from "./grid";

function CarTrailerLow({ args, ...props }: { args: [number, number, number] }) {
  return (
    <>
      <group>
        <Center scale={[1, 1, 1]} position={[0, 0, -3]} front top {...props}>
          <group position={[0, -0.57, 0]}>
            <Box
              args={[args[0] - 0.02, 0.03, args[2]]}
              position={[0, -0.01, 0]}
            >
              <meshStandardMaterial transparent opacity={0.7} color="orange" />
            </Box>
            <Box
              args={[args[1], 0.03, args[2]]}
              position={[args[0] / 2 - 0.02, args[1] / 2, 0]}
              rotation={[0, 0, Math.PI / 2]}
            >
              <meshStandardMaterial transparent opacity={0.7} color="orange" />
            </Box>
            <Box
              args={[args[1], 0.03, args[2]]}
              position={[-args[0] / 2 + 0.02, args[1] / 2, 0]}
              rotation={[0, 0, Math.PI / 2]}
            >
              <meshStandardMaterial transparent opacity={0.7} color="orange" />
            </Box>
            <Box
              args={[args[1], 0.03, args[0] - 0.03]}
              position={[0, args[1] / 2, args[2] / 2 - 0.02]}
              rotation={[0, Math.PI / 2, Math.PI / 2]}
            >
              <meshStandardMaterial transparent opacity={0.7} color="orange" />
            </Box>
            <Box
              args={[args[1], 0.03, args[0] - 0.03]}
              position={[0, args[1] / 2, -args[2] / 2 + 0.02]}
              rotation={[0, Math.PI / 2, Math.PI / 2]}
            >
              <meshStandardMaterial transparent opacity={0.7} color="orange" />
            </Box>
          </group>
          <Hitch position={[0, -0.65, -args[2] / 2 - 0.9]} width={1.8} />

          <Box args={[args[0], 0.1, args[2]]} position={[0, -0.65, 0]}>
            <meshStandardMaterial transparent opacity={0.7} color="blue" />
          </Box>
          <group position={[0, 0, (-args[2] / 1.5 + 6) / 2]}>
            <DoubleWheel
              side="left"
              args={[0.4, 0.4, 0.3]}
              position={[(args[0] + 0.2) / 2, -0.7, (args[2] - 6.4) / 2]}
            />
            <DoubleWheel
              side="right"
              args={[0.4, 0.4, 0.3]}
              position={[-(args[0] + 0.4) / 2, -0.7, (args[2] - 6.4) / 2]}
            />
          </group>
          {args[2] > 5 && (
            <group position={[0, 0, (-args[2] / 1.5 + 4) / 2]}>
              <DoubleWheel
                side="left"
                args={[0.4, 0.4, 0.3]}
                position={[(args[0] + 0.2) / 2, -0.7, (args[2] - 6.4) / 2]}
              />
              <DoubleWheel
                side="right"
                args={[0.4, 0.4, 0.3]}
                position={[-(args[0] + 0.4) / 2, -0.7, (args[2] - 6.4) / 2]}
              />
            </group>
          )}
        </Center>
        <Grid />
      </group>
    </>
  );
}

function CarTrailerBox({ args, ...props }: { args: [number, number, number] }) {
  return (
    <>
      <group>
        <Center scale={[1, 1, 1]} front top position={[0, 0, -3]} {...props}>
          <Box
            args={[args[0] - 0.02, args[1], args[2]] || [1, 2.48, 1]}
            scale={[1, 1, 1]}
            position={[0, args[1] / 2 - 0.6, 0]}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial transparent opacity={0.7} color="orange" />
          </Box>
          <Hitch position={[0, -0.65, -args[2] / 2 - 0.9]} width={1.8} />

          <Box args={[args[0], 0.1, args[2]]} position={[0, -0.65, 0]}>
            <meshStandardMaterial transparent opacity={0.7} color="blue" />
          </Box>

          <group position={[0, 0, (-args[2] / 1.5 + 6) / 2]}>
            <DoubleWheel
              side="left"
              args={[0.4, 0.4, 0.3]}
              position={[(args[0] + 0.2) / 2, -0.7, (args[2] - 6.4) / 2]}
            />
            <DoubleWheel
              side="right"
              args={[0.4, 0.4, 0.3]}
              position={[-(args[0] + 0.4) / 2, -0.7, (args[2] - 6.4) / 2]}
            />
          </group>
          {args[2] > 5 && (
            <group position={[0, 0, (-args[2] / 1.5 + 4) / 2]}>
              <DoubleWheel
                side="left"
                args={[0.4, 0.4, 0.3]}
                position={[(args[0] + 0.2) / 2, -0.7, (args[2] - 6.4) / 2]}
              />
              <DoubleWheel
                side="right"
                args={[0.4, 0.4, 0.3]}
                position={[-(args[0] + 0.4) / 2, -0.7, (args[2] - 6.4) / 2]}
              />
            </group>
          )}
        </Center>
        <Grid />
      </group>
    </>
  );
}

function WhhelArch({
  position,
  ...props
}: {
  position?: [number, number, number];
}) {
  return (
    <Cylinder
      args={[0.5, 0.5, 0.3, 3, 1, false, 0, 3.15]}
      scale={[1, 1, 1]}
      position={position || [0, 0, 0]}
      rotation={[0, 0, Math.PI / 2]}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial opacity={0.8} color="blue" />
    </Cylinder>
  );
}

function Wheel({
  args,
  position,
  ...props
}: {
  args?: [number, number, number];
  position?: [number, number, number];
}) {
  return (
    <Cylinder
      args={args || [1, 1, 1]}
      scale={[1, 1, 1]}
      position={position || [0, 0, 0]}
      rotation={[Math.PI / 2, 0, Math.PI / 2]}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial opacity={1} color="black" />
    </Cylinder>
  );
}

function Hitch({
  position,
  width,
  ...props
}: {
  position: [number, number, number];
  width: number;
}) {
  return (
    <group>
      <Cylinder
        args={[0.04, 0.04, width]}
        position={position || [0, 0, 0]}
        rotation={[0, Math.PI / 2, Math.PI / 2]}
      >
        <meshStandardMaterial color="gray" transparent opacity={0.7} />
      </Cylinder>
      <Box
        args={[0.05, 0.05, width / 1.5]}
        position={[
          position[0] / 2 + 0.35,
          position[1],
          position[2] + width / 2 - 0.45,
        ]}
        rotation={[0, Math.PI / 5, 0]}
      >
        <meshStandardMaterial color="gray" transparent opacity={0.7} />
      </Box>
      <Box
        args={[0.05, 0.05, width / 1.5]}
        position={[
          position[0] / 2 - 0.35,
          position[1],
          position[2] + width / 2 - 0.45,
        ]}
        rotation={[0, -Math.PI / 5, 0]}
      >
        <meshStandardMaterial color="gray" transparent opacity={0.7} />
      </Box>
      <Box
        args={[0.1, 0.1, 0.2]}
        position={[position[0], position[1], position[2] - width / 2]}
        rotation={[0, 0, 0]}
      >
        <meshStandardMaterial color="gray" transparent opacity={0.7} />
      </Box>
    </group>
  );
}

function DoubleWheel({
  args,
  position,
  side,
  ...props
}: {
  args?: [number, number, number];
  position: [number, number, number];
  side: "left" | "right";
}) {
  return (
    <group>
      <Wheel
        args={args}
        position={
          side === "right"
            ? [position[0] + 0.04, position[1], position[2]]
            : [position[0] + 0.06, position[1], position[2]]
        }
      />
      <WhhelArch position={[position[0] + 0.05, position[1], position[2]]} />
    </group>
  );
}

export { CarTrailerLow, CarTrailerBox };
