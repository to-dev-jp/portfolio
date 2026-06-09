import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// ─────────────────────────────────────────────────────────────
// シェーダ定義
// ─────────────────────────────────────────────────────────────

const fullVert = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// ── 最終合成（ワイプ + 色収差 + トーンマッピング）──────────
const compositeFrag = /* glsl */ `
  uniform sampler2D tScene;
  uniform float uProgress;
  uniform float uChromStrength;
  uniform float uExposure;
  uniform float uTime;
  uniform vec2  uTexel;
  varying vec2 vUv;

  vec3 ACESFilmicToneMapping(vec3 color) {
    color *= uExposure;
    color  = (color * (2.51 * color + 0.03)) / (color * (2.43 * color + 0.59) + 0.14);
    return clamp(color, 0.0, 1.0);
  }
  vec3 linearToSRGB(vec3 color) {
    return mix(
      color * 12.92,
      1.055 * pow(clamp(color, 0.0, 1.0), vec3(1.0 / 2.4)) - 0.055,
      step(0.0031308, color)
    );
  }

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1,0)), u.x),
      mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), u.x),
      u.y
    );
  }

  void main() {
    // 0→0.5: phase 0→1（ワイプ上昇）
    // 0.5→1: phase 1→0（ワイプ下降）
    float phase = uProgress < 0.5
      ? uProgress * 2.0
      : (1.0 - uProgress) * 2.0;

    // ── 色収差（phaseに比例して強くなる）──────────────────
    vec2  dir    = vUv - vec2(0.5);
    float ca     = uChromStrength * uTexel.x * phase;
    float r      = texture2D(tScene, vUv + dir * ca).r;
    float g      = texture2D(tScene, vUv           ).g;
    float b      = texture2D(tScene, vUv - dir * ca).b;
    vec3  sceneCol = vec3(r, g, b);

    // ── ワイプ（下から上・ノイズで端をゆらぎ）────────────
    float n        = noise(vec2(vUv.x * 5.0 + uTime * 0.3, uTime * 0.2)) * 0.04;
    float wipeEdge = mix(-0.1, 1.0 + 0.1, phase) + n;

    // ほんのりライム色の白
    vec3  wipeColor = vec3(0.92, 1.0, 0.88);

    // vUv.y=0が下, 1が上 → wipeEdge以下をワイプ色で塗る
    float inWipe = smoothstep(wipeEdge + 0.04, wipeEdge - 0.01, vUv.y);

    // エッジの緑がかったグロー
    float edgeGlow = smoothstep(wipeEdge + 0.06, wipeEdge,        vUv.y)
                   * (1.0 - smoothstep(wipeEdge,        wipeEdge - 0.04, vUv.y));
    vec3  glowColor = vec3(0.75, 1.0, 0.6) * edgeGlow * 1.2;

    vec3 col = mix(sceneCol, wipeColor, inWipe);
    col     += glowColor * (1.0 - inWipe);

    // ── トーンマッピング + 色空間変換（1回のみ）──────────
    col = ACESFilmicToneMapping(col);
    col = linearToSRGB(col);

    gl_FragColor = vec4(col, 1.0);
  }
`;

// ─────────────────────────────────────────────────────────────
// ヘルパー
// ─────────────────────────────────────────────────────────────
function makeQuad(uniforms: Record<string, { value: any }>, frag: string) {
  const geo = new THREE.PlaneGeometry(2, 2);
  const mat = new THREE.ShaderMaterial({
    vertexShader: fullVert,
    fragmentShader: frag,
    uniforms,
    depthWrite: false,
    depthTest: false,
  });
  return new THREE.Mesh(geo, mat);
}

// ─────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────
interface WipeEffectProps {
  scrollProgress: React.RefObject<number>;
  /** 最大色収差強度（デフォルト: 20） */
  chromStrength?: number;
  /** 露出（デフォルト: 1.0） */
  exposure?: number;
}

// ─────────────────────────────────────────────────────────────
// コンポーネント
// ─────────────────────────────────────────────────────────────
export function WipeEffect({
  scrollProgress,
  chromStrength = 20,
  exposure = 1.0,
}: WipeEffectProps) {
  const { gl, scene, camera, size } = useThree();

  // ── レンダーターゲット ──────────────────────────────────
  const rtMain = useMemo(
    () =>
      new THREE.WebGLRenderTarget(size.width, size.height, {
        format: THREE.RGBAFormat,
        type: THREE.HalfFloatType,
        samples: 4,
      }),
    [size.width, size.height],
  );

  // ── ユニフォーム ────────────────────────────────────────
  const compositeUniforms = useMemo(
    () => ({
      tScene: { value: rtMain.texture },
      uProgress: { value: 0 },
      uChromStrength: { value: chromStrength },
      uExposure: { value: exposure },
      uTime: { value: 0 },
      uTexel: { value: new THREE.Vector2(1 / size.width, 1 / size.height) },
    }),
    [rtMain],
  );

  // ── ポストプロセス用シーン・カメラ ─────────────────────
  const postScene = useMemo(() => new THREE.Scene(), []);
  const postCamera = useMemo(
    () => new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1),
    [],
  );

  const compositeQuadRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    compositeQuadRef.current = makeQuad(compositeUniforms, compositeFrag);
    return () => {
      if (compositeQuadRef.current) {
        compositeQuadRef.current.geometry.dispose();
        (compositeQuadRef.current.material as THREE.ShaderMaterial).dispose();
      }
    };
    // quadは初回のみ生成し、以降はuniformを差し替えて使い回す
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // リサイズでrtMainが作り直されたら、quadが参照するテクスチャを差し替える
  useEffect(() => {
    if (!compositeQuadRef.current) return;
    const u = (compositeQuadRef.current.material as THREE.ShaderMaterial)
      .uniforms;
    u.tScene.value = rtMain.texture;
  }, [rtMain]);

  // rtMainのライフサイクルに紐づけてdisposeし、リサイズ時の古いRTを破棄する
  useEffect(() => {
    return () => {
      rtMain.dispose();
    };
  }, [rtMain]);

  // リサイズに追従して色収差計算用のテクセルサイズを更新する
  useEffect(() => {
    if (!compositeQuadRef.current) return;
    const u = (compositeQuadRef.current.material as THREE.ShaderMaterial)
      .uniforms;
    u.uTexel.value.set(1 / size.width, 1 / size.height);
  }, [size.width, size.height]);

  // props変化時にユニフォームを同期
  useEffect(() => {
    if (!compositeQuadRef.current) return;
    const u = (compositeQuadRef.current.material as THREE.ShaderMaterial)
      .uniforms;
    u.uChromStrength.value = chromStrength;
    u.uExposure.value = exposure;
  }, [chromStrength, exposure]);

  useFrame(({ clock }) => {
    const composite = compositeQuadRef.current;
    if (!composite) return;

    // Step1: メインシーンをLinearでキャプチャ
    gl.toneMapping = THREE.NoToneMapping;
    gl.outputColorSpace = THREE.LinearSRGBColorSpace;
    gl.setRenderTarget(rtMain);
    gl.clear();
    gl.render(scene, camera);

    // Step2: ワイプ + 色収差 + トーンマッピング → スクリーンへ
    const u = (composite.material as THREE.ShaderMaterial).uniforms;
    u.uProgress.value = scrollProgress.current;
    u.uTime.value = clock.elapsedTime;

    postScene.add(composite);
    gl.setRenderTarget(null);
    gl.autoClear = false;
    gl.clearDepth();
    gl.render(postScene, postCamera);
    gl.autoClear = true;
    postScene.remove(composite);

    // Step3: gl設定を復元
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.outputColorSpace = THREE.SRGBColorSpace;
  }, 1);

  return null;
}
