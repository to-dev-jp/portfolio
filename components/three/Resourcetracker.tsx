// ResourceTracker.tsx
// Canvas内に配置する。全リソースのGPUコンパイル完了を検知して
// window の "gpu-compile-done" イベントで外部に通知する。

"use client";

import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { useGLTF, useTexture } from "@react-three/drei";

const MODEL_PATH = "/hummingbird.gltf";
const TEXTURE_PATH = "/bird.png";
const NORMAL_PATH = "/normal.png";

export function ResourceTracker() {
  const { gl, scene } = useThree();
  const notified = useRef(false);

  // ── 全リソースをここで読み込む（Suspenseで待機される）────
  useGLTF(MODEL_PATH);
  useTexture([TEXTURE_PATH, NORMAL_PATH]);

  // ── 全リソース読み込み完了後、GPUコンパイルを実行 ────────
  useEffect(() => {
    if (notified.current) return;
    notified.current = true;

    const dispatch = () => {
      window.dispatchEvent(new Event("gpu-compile-done"));
    };

    try {
      const result: unknown = gl.compile(
        scene,
        gl.xr?.getCamera?.() ?? scene.children[0],
      );

      // Promiseが返ってきた場合
      if (result && typeof (result as { then?: unknown }).then === "function") {
        (result as Promise<unknown>).then(dispatch).catch(dispatch);
      } else {
        dispatch();
      }
    } catch (e) {
      // compile自体が失敗した場合も発火
      dispatch();
    }
  }, []);

  return null;
}
