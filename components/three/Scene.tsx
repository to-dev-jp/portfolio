"use client";

import * as THREE from "three";
import { useGLTF, Preload, useTexture, useAnimations } from "@react-three/drei";
import { useEffect, useState, useRef, Suspense } from "react";
import { useFrame, Canvas } from "@react-three/fiber";
import { easing } from "maath";
import { cameraPos, mobileCameraPos, MobileSection, Section } from "../const";
import { useScrollContext } from "@/context/provider/ScrollProvider";
import { WipeEffect } from "@/components/three/WipeEffect";
import { ResourceTracker } from "./Resourcetracker";
import { VibrantGradientBackground } from "./VibrantGradientBg";
import { useWorksUrls } from "@/context/provider/WorksProvider";

const MODEL_PATH = "/hummingbird.gltf";

const size = 0.35;

function Model() {
  const { nodes, materials, animations } = useGLTF(MODEL_PATH);
  const mouseRef = useRef({ x: 0, y: 0 });
  const modelRef = useRef<THREE.Mesh>(null);
  const { actions } = useAnimations(animations, modelRef);
  const [isDesktop, setIsDesktop] = useState(true);
  const { section, scrollProgress, workIndex } = useScrollContext();
  const worksUrls = useWorksUrls();
  const { contentAreaRef } = useScrollContext();

  const isSecondHalf = section === "transition02" || section === "contact";

  const sizeRef = useRef({ width: 0, height: 0 });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const demoArea = contentAreaRef.current;

    if (!demoArea) return;

    const updateSize = () => {
      sizeRef.current.width = window.innerWidth;
      sizeRef.current.height = window.innerHeight;
      setIsDesktop(window.innerWidth >= 500);
    };
    updateSize();

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.offsetX / sizeRef.current.width - 0.5;
      mouseRef.current.y = e.offsetY / sizeRef.current.height - 0.5;
    };

    if (materials["leaf01"]) {
      materials["leaf01"].side = THREE.DoubleSide;
    }
    if (materials["leaf02"]) {
      materials["leaf02"].side = THREE.DoubleSide;
    }

    window.addEventListener("resize", updateSize);
    demoArea.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("resize", updateSize);
      demoArea.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (actions["intro"]) {
      actions["intro"].clampWhenFinished = true;
      actions["intro"].play();
      actions["intro"].paused = true;
    }
  }, []);

  const THRESHOLD = 0.01;
  const arrivedRef = useRef(false);

  useEffect(() => {
    arrivedRef.current = false;
  }, [section, isDesktop]);

  useFrame((state, delta) => {
    const { camera } = state;
    const model = modelRef.current;

    if (!actions["intro"] || !actions["works"] || !actions["fly"]) return;

    if (section === "top") {
      actions["intro"].play();
      actions["intro"].paused = true;
      actions["intro"].time = THREE.MathUtils.lerp(
        actions["intro"].time,
        0,
        0.2,
      );
      actions["works"].stop();
      actions["fly"].stop();
    } else if (section === "about") {
      actions["intro"].play();
      actions["intro"].paused = true;
      actions["intro"].time = THREE.MathUtils.lerp(
        actions["intro"].time,
        ((scrollProgress.current - 0.1) / 0.2) * 2.6,
        0.1,
      );
      actions["works"].stop();
      actions["fly"].stop();
    } else if (
      section === "works01" ||
      section === "works02" ||
      section === "transition01"
    ) {
      actions["works"].setLoop(THREE.LoopOnce, 1);
      actions["works"].clampWhenFinished = true;
      actions["works"].play();
      actions["intro"].stop();
      actions["fly"].stop();
    } else if (section === "contact") {
      actions["fly"].setLoop(THREE.LoopOnce, 1);
      actions["fly"].clampWhenFinished = true;
      actions["fly"].play();
      actions["works"].stop();
      actions["intro"].stop();
    }

    if (model) {
      if (section === "works01" || section === "works02") {
        easing.dampE(model.rotation, [0, -Math.PI / 2.5, 0], 0.4, delta);
        easing.damp3(model.position, [22, -5, 0], 0.4, delta);
      } else if (section === "about" || section === "transition01") {
        easing.dampE(model.rotation, [0.0, -Math.PI / 4.8, 0], 0.4, delta);
        easing.damp3(model.position, [0, 0, 0], 0.4, delta);
      } else if (isSecondHalf) {
        model.rotation.x = 0;
        model.rotation.y = -Math.PI / 8;
        model.rotation.z = 0;
        easing.damp3(model.position, [0, 0, 0], 0.4, delta);
      } else {
        easing.dampE(
          model.rotation,
          [-0.06, -Math.PI / 4.8 + (mouseRef.current.x * Math.PI) / 100, 0],
          0.4,
          delta,
        );
        easing.damp3(model.position, [0, 0, 0], 0.4, delta);
      }
    }

    if (arrivedRef.current) return;

    const target = isDesktop
      ? (cameraPos[section as Section] ?? cameraPos["top"])
      : (mobileCameraPos[section as MobileSection] ?? mobileCameraPos["top"]);

    if (camera) {
      easing.damp3(camera.position, [target.x, target.y, target.z], 0.4, delta);
      easing.dampE(camera.rotation, [target.rx, 0, 0], 0.4, delta);
    }

    const done =
      Math.abs(camera.position.x - target.x) < THRESHOLD &&
      Math.abs(camera.position.y - target.y) < THRESHOLD &&
      Math.abs(camera.position.z - target.z) < THRESHOLD &&
      Math.abs(camera.rotation.x - target.rx) < THRESHOLD;

    if (done) {
      // スナップして誤差を消す
      camera.position.x = target.x;
      camera.position.y = target.y;
      camera.position.z = target.z;
      camera.rotation.x = target.rx;
      arrivedRef.current = true;
    }
  });

  const Plants = (
    <group>
      <primitive object={nodes["branch02"]} />
      <primitive object={nodes["branch03"]} />
      <primitive object={nodes["branch04"]} />
      <primitive object={nodes["branch05"]} />
      <primitive object={nodes["branch06"]} />
      <primitive object={nodes["branch07"]} />
      <primitive object={nodes["branch08"]} />
      <primitive object={nodes["branch09"]} />
      <primitive object={nodes["branch010"]} />
      <primitive object={nodes["branch011"]} />
      <primitive object={nodes["branch012"]} />
      <primitive object={nodes["branch013"]} />
      <primitive object={nodes["branch014"]} />
      <primitive object={nodes["branch015"]} />
      <primitive object={nodes["leaf02"]} />
      <primitive object={nodes["leaf03"]} />
      <primitive object={nodes["leaf04"]} />
    </group>
  );

  const Hummingbird = (
    <group name="hummingbird" scale={1.8}>
      <primitive object={nodes["Rig"]} />
      <primitive object={nodes["branch01"]} />
      <primitive object={nodes["leaf01"]} />
    </group>
  );

  const imgs = useTexture(worksUrls);

  // WipeEffectの影響で、useEffectだと反映されないので毎描画ごとに適用
  imgs.forEach((tex) => {
    tex.colorSpace = THREE.SRGBColorSpace;
  });

  const Works = (
    <mesh scale={isDesktop ? 1.1 : 1.1} position={[0, -2.8, -5]}>
      <planeGeometry args={[40, 20]} />
      <meshBasicMaterial map={imgs[workIndex]} />
    </mesh>
  );

  const SceneContent = (
    <group position={[0, isDesktop ? 10.2 : 5.6, 0]}>
      <group ref={modelRef} name="models">
        {Hummingbird}
        {Plants}
      </group>
      {(section === "works01" || section === "works02") && Works}
      <VibrantGradientBackground
        width={50}
        height={50}
        vertical={isDesktop ? -45 : -45}
        depth={-100}
        scale={15}
        grid={400}
        dotSize={0.3}
        dotOpacity={0.3}
      />
    </group>
  );

  return (
    <>
      <group name="scene" scale={size}>
        {SceneContent}
      </group>
    </>
  );
}

const Scene = () => {
  const [isDesktop, setIsDesktop] = useState(true);
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 500);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { effectScrollProgress } = useScrollContext();

  return (
    <>
      <Canvas
        style={{
          width: "100%",
          height: "100svh",
          position: "fixed",
          pointerEvents: "none",
        }}
        gl={{
          antialias: false,
          precision: "mediump",
          depth: true,
          alpha: false,
          stencil: false,
          toneMapping: THREE.NoToneMapping,
          toneMappingExposure: 1,
          outputColorSpace: THREE.LinearSRGBColorSpace,
          powerPreference: "high-performance",
        }}
        camera={{
          fov: 56,
          near: 1,
          far: 100,
          position: [0, isDesktop ? 2 : 0.2, isDesktop ? 34 : 19],
        }}
        dpr={[1, 1]}
        performance={{
          min: 0.1,
          debounce: 500,
        }}
        resize={{ scroll: false }}
        shadows
      >
        <Suspense fallback={null}>
          <ResourceTracker />
          <Model />
          <ambientLight intensity={1.2} />
          <directionalLight
            position={[0.5, 1, 0.5]}
            castShadow
            intensity={2}
            shadow-mapSize={[64, 64]}
          />
          <Preload all />
        </Suspense>
        <WipeEffect
          scrollProgress={effectScrollProgress}
          chromStrength={20} // 最大色収差強度
          exposure={1.0} // 露出
        />
      </Canvas>
    </>
  );
};

export default Scene;
