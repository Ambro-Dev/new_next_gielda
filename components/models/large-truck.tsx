"use client";

import React from "react";

import { Center, Box, Cylinder } from "@react-three/drei";
import { Grid } from "./grid";

function LargeBoxy({ args, ...props }: { args: [number, number, number] }) {
  return (
    <>
      <group>
        <Center scale={[1, 1, 1]} front position={[0, 0, -2]} top {...props}>
          <Box
            args={args || [1, 2.48, 1]}
            scale={[1, 1, 1]}
            position={[0, args[1] / 2 + 0.1, 0]}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial transparent opacity={0.7} color="orange" />
          </Box>
          <Box args={[args[0], 0.1, args[2]]} position={[0, 0.05, 0]}>
            <meshStandardMaterial transparent opacity={0.7} color="blue" />
          </Box>
          <group position={[0, 0, args[2] < 6 ? 2 : 0.6]}>
            <DoubleWheel
              args={[0.5, 0.5, 0.3]}
              position={[(args[0] - 1) / 2, -0.6, (args[2] - 6.4) / 2]}
            />
            <DoubleWheel
              args={[0.5, 0.5, 0.3]}
              position={[-(args[0] - 0.3) / 2, -0.6, (args[2] - 6.4) / 2]}
            />
          </group>
          {args[2] > 13 && (
            <group position={[0, 0, -0.6]}>
              <DoubleWheel
                args={[0.5, 0.5, 0.3]}
                position={[(args[0] - 1) / 2, -0.6, (args[2] - 6.4) / 2]}
              />
              <DoubleWheel
                args={[0.5, 0.5, 0.3]}
                position={[-(args[0] - 0.3) / 2, -0.6, (args[2] - 6.4) / 2]}
              />
            </group>
          )}

          {args[2] > 8 && (
            <group position={[0, 0, 1.8]}>
              <DoubleWheel
                args={[0.5, 0.5, 0.3]}
                position={[(args[0] - 1) / 2, -0.6, (args[2] - 6.4) / 2]}
              />
              <DoubleWheel
                args={[0.5, 0.5, 0.3]}
                position={[-(args[0] - 0.3) / 2, -0.6, (args[2] - 6.4) / 2]}
              />
            </group>
          )}
        </Center>
        <Grid />
      </group>
    </>
  );
}

function LargeLow({ args, ...props }: { args: [number, number, number] }) {
  return (
    <>
      <group>
        <Center scale={[1, 1, 1]} front position={[0, 0, -2]} top {...props}>
          <Box args={[args[0], 0.1, args[2]]} position={[0, 0.05, 0]}>
            <meshStandardMaterial transparent opacity={0.7} color="blue" />
          </Box>
          <Box args={[args[0], 0.1, args[2]]} position={[0, 0.15, 0]}>
            <meshStandardMaterial transparent opacity={0.7} color="orange" />
          </Box>
          <Box
            args={[args[1], 0.1, args[2]]}
            position={[args[0] / 2 - 0.05, args[1] / 2 + 0.2, 0]}
            rotation={[0, 0, Math.PI / 2]}
          >
            <meshStandardMaterial transparent opacity={0.7} color="orange" />
          </Box>
          <Box
            args={[args[1], 0.1, args[2]]}
            position={[-args[0] / 2 + 0.05, args[1] / 2 + 0.2, 0]}
            rotation={[0, 0, Math.PI / 2]}
          >
            <meshStandardMaterial transparent opacity={0.7} color="orange" />
          </Box>
          <Box
            args={[args[1], 0.1, args[0] - 0.1]}
            position={[0, args[1] / 2 + 0.2, args[2] / 2 - 0.05]}
            rotation={[0, Math.PI / 2, Math.PI / 2]}
          >
            <meshStandardMaterial transparent opacity={0.7} color="orange" />
          </Box>
          <Box
            args={[args[1], 0.1, args[0] - 0.1]}
            position={[0, args[1] / 2 + 0.2, -args[2] / 2 + 0.05]}
            rotation={[0, Math.PI / 2, Math.PI / 2]}
          >
            <meshStandardMaterial transparent opacity={0.7} color="orange" />
          </Box>

          <group position={[0, 0, args[2] < 6 ? 2 : 0.6]}>
            <DoubleWheel
              args={[0.5, 0.5, 0.3]}
              position={[(args[0] - 1) / 2, -0.6, (args[2] - 6.4) / 2]}
            />
            <DoubleWheel
              args={[0.5, 0.5, 0.3]}
              position={[-(args[0] - 0.3) / 2, -0.6, (args[2] - 6.4) / 2]}
            />
          </group>
          {args[2] > 13 && (
            <group position={[0, 0, -0.6]}>
              <DoubleWheel
                args={[0.5, 0.5, 0.3]}
                position={[(args[0] - 1) / 2, -0.6, (args[2] - 6.4) / 2]}
              />
              <DoubleWheel
                args={[0.5, 0.5, 0.3]}
                position={[-(args[0] - 0.3) / 2, -0.6, (args[2] - 6.4) / 2]}
              />
            </group>
          )}

          {args[2] > 8 && (
            <group position={[0, 0, 1.8]}>
              <DoubleWheel
                args={[0.5, 0.5, 0.3]}
                position={[(args[0] - 1) / 2, -0.6, (args[2] - 6.4) / 2]}
              />
              <DoubleWheel
                args={[0.5, 0.5, 0.3]}
                position={[-(args[0] - 0.3) / 2, -0.6, (args[2] - 6.4) / 2]}
              />
            </group>
          )}
        </Center>
        <Grid />
      </group>
    </>
  );
}

function LargeFlat({ args, ...props }: { args: [number, number, number] }) {
  return (
    <>
      <group>
        <Center scale={[1, 1, 1]} front top position={[0, 0, -2]} {...props}>
          <Box args={[args[0], 0.1, args[2]]} position={[0, 0.05, 0]}>
            <meshStandardMaterial transparent opacity={0.7} color="blue" />
          </Box>
          <Box args={[args[0], 0.1, args[2]]} position={[0, 0.15, 0]}>
            <meshStandardMaterial transparent opacity={0.7} color="orange" />
          </Box>

          <group position={[0, 0, args[2] < 6 ? 2 : 0.6]}>
            <DoubleWheel
              args={[0.5, 0.5, 0.3]}
              position={[(args[0] - 1) / 2, -0.6, (args[2] - 6.4) / 2]}
            />
            <DoubleWheel
              args={[0.5, 0.5, 0.3]}
              position={[-(args[0] - 0.3) / 2, -0.6, (args[2] - 6.4) / 2]}
            />
          </group>
          {args[2] > 13 && (
            <group position={[0, 0, -0.6]}>
              <DoubleWheel
                args={[0.5, 0.5, 0.3]}
                position={[(args[0] - 1) / 2, -0.6, (args[2] - 6.4) / 2]}
              />
              <DoubleWheel
                args={[0.5, 0.5, 0.3]}
                position={[-(args[0] - 0.3) / 2, -0.6, (args[2] - 6.4) / 2]}
              />
            </group>
          )}

          {args[2] > 8 && (
            <group position={[0, 0, 1.8]}>
              <DoubleWheel
                args={[0.5, 0.5, 0.3]}
                position={[(args[0] - 1) / 2, -0.6, (args[2] - 6.4) / 2]}
              />
              <DoubleWheel
                args={[0.5, 0.5, 0.3]}
                position={[-(args[0] - 0.3) / 2, -0.6, (args[2] - 6.4) / 2]}
              />
            </group>
          )}
        </Center>
        <Grid />
      </group>
    </>
  );
}

function LargeTanker({ args, ...props }: { args: [number, number, number] }) {
  return (
    <>
      <group>
        <Center scale={[1, 1, 1]} front top position={[0, 0, -2]} {...props}>
          <Cylinder
            args={[args[1], args[1], args[0]] || [1, 1, 1]}
            scale={[1, 1, 1]}
            position={[0, args[1] + 0.2, 0]}
            rotation={[Math.PI / 2, 0, 0]}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial transparent opacity={0.7} color="orange" />
          </Cylinder>
          <Box args={[args[1] + 1.5, 0.2, args[0]]} position={[0, 0, 0]}>
            <meshStandardMaterial transparent opacity={0.7} color="blue" />
          </Box>
          {args[0] > 13 && (
            <group position={[0, 0, -0.6]}>
              <DoubleWheel
                args={[0.5, 0.5, 0.3]}
                position={[(args[1] + 0.5) / 2, -0.6, (args[0] - 6.4) / 2]}
              />
              <DoubleWheel
                args={[0.5, 0.5, 0.3]}
                position={[-(args[1] + 1.2) / 2, -0.6, (args[0] - 6.4) / 2]}
              />
            </group>
          )}

          <group position={[0, 0, args[0] < 6 ? 2 : 0.6]}>
            <DoubleWheel
              args={[0.5, 0.5, 0.3]}
              position={[(args[1] + 0.5) / 2, -0.6, (args[0] - 6.4) / 2]}
            />
            <DoubleWheel
              args={[0.5, 0.5, 0.3]}
              position={[-(args[1] + 1.2) / 2, -0.6, (args[0] - 6.4) / 2]}
            />
          </group>

          {args[0] > 8 && (
            <group position={[0, 0, 1.8]}>
              <DoubleWheel
                args={[0.5, 0.5, 0.3]}
                position={[(args[1] + 0.5) / 2, -0.6, (args[0] - 6.4) / 2]}
              />
              <DoubleWheel
                args={[0.5, 0.5, 0.3]}
                position={[-(args[1] + 1.2) / 2, -0.6, (args[0] - 6.4) / 2]}
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
      args={[0.6, 0.6, 0.7, 8, 1, true, 0, 3.05]}
      scale={[1, 1, 1]}
      position={position || [0, 0, 0]}
      rotation={[0, 0, Math.PI / 2]}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial transparent opacity={0.7} color="gray" />
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
      <meshStandardMaterial transparent opacity={0.9} color="black" />
    </Cylinder>
  );
}

function DoubleWheel({
  args,
  position,
  ...props
}: {
  args?: [number, number, number];
  position: [number, number, number];
}) {
  return (
    <group>
      <Wheel args={args} position={position} />
      <Wheel
        args={args}
        position={[position[0] + 0.36, position[1], position[2]]}
      />
      <WhhelArch position={[position[0] + 0.18, position[1], position[2]]} />
    </group>
  );
}

export { LargeBoxy, LargeLow, LargeFlat, LargeTanker };
