import { Suspense, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Experience } from "./components/Experience";
import { Gltf, Scroll, ScrollControls, useScroll } from "@react-three/drei";
import { getProject, val } from "@theatre/core";

import {
  SheetProvider,
  PerspectiveCamera,
  useCurrentSheet,
} from "@theatre/r3f";

import { Interface } from "./components/Interface";
export default function App() {
  const [section, setSection] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const [started, setStarted] = useState(false);
  const [menuOpened, setMenuOpened] = useState(false);
  const [studioOpened, setStudioOpened] = useState(false);
  const [interviewOpened, setInterviewOpened] = useState(false);

  // const sheet = getProject("ProjectName").sheet("Scene");
  const sheet = getProject("ProjectName", {state: gbStudioState}).sheet("Scene");
  return (
    <Canvas gl={{ preserveDrawingBuffer: true }}>
      <ScrollControls pages={5}>
        {/* Canvas contents in here will *not* scroll, but receive useScroll! */}
        
        {/* <SomeModel /> */}
        <SheetProvider sheet={sheet}>
          <Scene />
        </SheetProvider>
        <Scroll html>
          {/* DOM contents in here will scroll along */}

          <Interface setSection={setSection} />
        </Scroll>
        
      </ScrollControls>
    </Canvas>
  );
}

function Scene() {
  const sheet = useCurrentSheet();
  const scroll = useScroll();

  // our callback will run on every animation frame
  useFrame(() => {
    // the length of our sequence
    const sequenceLength = val(sheet.sequence.pointer.length);
    // update the "position" of the playhead in the sequence, as a fraction of its whole length
    sheet.sequence.position = scroll.offset * sequenceLength;
  });

  const bgColor = "#3772b8";

  return (
    <>
      <color attach="background" args={[bgColor]} />
      <fog attach="fog" color={bgColor} near={-4} far={15} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[-5, 5, -5]} intensity={1.5} />
      <Gltf src="/Model.glb" castShadow receiveShadow />
      <PerspectiveCamera
        theatreKey="Camera"
        makeDefault
        position={[0, 0, 0]}
        fov={90}
        near={0.1}
        far={70}
      />
    </>
  );
}
