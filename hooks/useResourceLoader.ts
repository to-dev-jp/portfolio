"use client";

import { useEffect, useState, useRef } from "react";
import { useGLTF } from "@react-three/drei";

interface ResourceConfig {
  models?: string[];
  adobeFontKitId?: string;
}

interface LoadingState {
  isLoading: boolean;
  progress: number;
  total: number;
  loaded: number;
  error: string | null;
  currentItem: string;
}

export function useResourceLoader(config: ResourceConfig) {
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: true,
    progress: 0,
    total: 0,
    loaded: 0,
    error: null,
    currentItem: "Now Loading...",
  });

  const loadingAttempted = useRef(false);
  const mounted = useRef(true);

  useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (loadingAttempted.current) return;
    loadingAttempted.current = true;

    const loadResources = async () => {
      try {
        // GLTFモデル数 + テクスチャ(bird.png) + GPUコンパイル
        const TEXTURE_COUNT = 1;
        const GPU_COMPILE = 1;
        const modelCount = config.models?.length || 0;
        const total = modelCount + TEXTURE_COUNT + GPU_COMPILE;

        if (!mounted.current) return;
        setLoadingState((prev) => ({ ...prev, total }));

        let loaded = 0;

        // ── GLTFモデルの読み込み ──────────────────────────────
        if (config.models && config.models.length > 0) {
          for (const model of config.models) {
            if (!mounted.current) return;
            setLoadingState((prev) => ({
              ...prev,
              currentItem: model.split("/").pop() || model,
            }));
            try {
              await useGLTF.preload(model);
            } catch (e) {
              console.error(`Failed to load model: ${model}`, e);
            }
            loaded++;
            setLoadingState((prev) => ({
              ...prev,
              loaded,
              progress: Math.floor((loaded / total) * 100),
            }));
          }
        }

        // ── テクスチャ類の先読み ──────────────────────────────
        const textures = [
          { path: "/bird.png", label: "bird.png", type: "image" },
        ];

        for (const { path, label, type } of textures) {
          if (!mounted.current) return;
          setLoadingState((prev) => ({ ...prev, currentItem: label }));
          try {
            await new Promise<void>((resolve, reject) => {
              const img = new window.Image();
              img.onload = () => resolve();
              img.onerror = () => reject();
              img.src = path;
            });
          } catch (e) {
            console.error(`Failed to preload: ${path}`, e);
          }
          if (!mounted.current) return;
          loaded++;
          setLoadingState((prev) => ({
            ...prev,
            loaded,
            progress: Math.floor((loaded / total) * 100),
          }));
        }

        // ── GPUコンパイル待ち（Canvas側から通知を受け取るまで待機）──
        // ResourceTracker が window イベントで通知してくる
        setLoadingState((prev) => ({
          ...prev,
          currentItem: "GPU compiling...",
        }));
        await new Promise<void>((resolve) => {
          const handler = () => {
            window.removeEventListener("gpu-compile-done", handler);
            resolve();
          };
          window.addEventListener("gpu-compile-done", handler);
          // タイムアウト保険（10秒）
          setTimeout(() => {
            resolve();
          }, 10000);
        });

        loaded++;
        if (!mounted.current) return;
        setLoadingState((prev) => ({
          ...prev,
          loaded,
          progress: 100,
          isLoading: false,
          currentItem: "Complete!",
        }));
      } catch (error) {
        console.error("Resource loading error:", error);
        if (mounted.current) {
          setLoadingState((prev) => ({
            ...prev,
            error: "リソース読み込みエラーが発生しました",
            isLoading: false,
          }));
        }
      }
    };

    loadResources();
  }, []);

  return loadingState;
}
