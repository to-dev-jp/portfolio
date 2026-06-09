import { useRef } from "react";
import { ShaderMaterial, Vector2 } from "three";

const vertShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragShader = /* glsl */ `
  precision highp float;

  uniform float u_glow;        // 発光の強さ（0〜1）
  uniform float u_spread;      // グラデーションの広がり
  uniform vec2  u_scaleXY;     // 発光の縦横スケール（x:横 y:縦）
  uniform vec2  u_origin;      // 発光の中心（UV座標、デフォルト右下）
  uniform float u_grid;        // グリッドの細かさ
  uniform float u_dotSize;     // ドットサイズ（0〜1）
  uniform float u_dotOpacity;  // ドットの不透明度（0〜1）
  uniform vec2  u_aspect;      // アスペクト比

  varying vec2 vUv;

  // ─── sRGB → Linear（WipeEffect対応）──────────────────────
  vec3 sRGBToLinear(vec3 color) {
    return mix(
      color / 12.92,
      pow((color + 0.055) / 1.055, vec3(2.4)),
      step(0.04045, color)
    );
  }

  void main() {
    vec2 uv = vUv;

    // ─── 斜め放射グラデーション ───────────────────────────
    // 発光の中心からの距離をアスペクト補正して計算
    // u_scaleXY で楕円状に歪める（x大=横に広く / y大=縦に狭く）
    vec2 p = (uv - u_origin) * vec2(u_aspect.x, 1.0) * u_scaleXY;
    float dist = length(p);

    // 中心ほど明るく、外側ほど暗く（発光表現）
    float glow = 1.0 - smoothstep(0.0, u_spread, dist);
    glow = pow(glow, 2.8) * u_glow;

    // ─── 色: 暗い緑 → 鮮やかな緑 ─────────────────────────
    vec3 darkColor   = vec3(0.07, 0.09, 0.06);  // 緑がかった黒
    vec3 midColor    = vec3(0.72,  0.96,  0.75);   // 深い緑
    vec3 brightColor = vec3(0.92,  1.0,  0.88);   // 鮮やかな発光グリーン

    // 2段階の補間で発光のコアと裾野を表現
    vec3 col = mix(darkColor, midColor, smoothstep(0.0, 0.55, glow));
    col = mix(col, brightColor, smoothstep(0.55, 1.0, glow));

    // ─── 四角ドットグリッド ───────────────────────────────
    vec2  aspectUv = vec2(uv.x * u_aspect.x, uv.y);
    vec2  cell     = fract(aspectUv * u_grid);
    float margin   = (1.0 - u_dotSize) * 0.5;
    float dotMask  = step(margin, cell.x) * step(cell.x, 1.0 - margin)
                   * step(margin, cell.y) * step(cell.y, 1.0 - margin);

    // ドット色: 発光部は明るい緑、暗部はうっすら緑がかったグレー
    vec3 dotCol = mix(
      vec3(0.18, 0.30, 0.20),  // 暗部のドット
      vec3(0.70, 1.00, 0.65),  // 発光部のドット
      glow
    );
    // 発光が強い領域ほどドットを目立たせる
    float dotVis = u_dotOpacity * (0.4 + glow * 0.6);
    col = mix(col, dotCol, dotMask * dotVis);

    col = clamp(col, 0.0, 1.0);

    // WipeEffectがLinear空間でキャプチャするためsRGB→Linear変換
    col = sRGBToLinear(col);

    gl_FragColor = vec4(col, 1.0);
  }
`;

interface VibrantGradientBackgroundProps {
  width?: number;
  height?: number;
  depth?: number;
  scale: number;
  vertical: number;
  /** 発光の強さ 0〜1（デフォルト: 1.0） */
  glow?: number;
  /** グラデーションの広がり（デフォルト: 0.7） */
  spread?: number;
  /** 発光の横方向スケール（小さいほど横に広がる、デフォルト: 0.65） */
  scaleX?: number;
  /** 発光の縦方向スケール（大きいほど縦に狭まる、デフォルト: 1.6） */
  scaleY?: number;
  /** 発光の中心 UV座標（デフォルト: 右下 [0.78, 0.32]） */
  originX?: number;
  originY?: number;
  /** グリッドの細かさ（デフォルト: 40） */
  grid?: number;
  /** ドットサイズ 0〜1（デフォルト: 0.22） */
  dotSize?: number;
  /** ドットの不透明度 0〜1（デフォルト: 0.10） */
  dotOpacity?: number;
}

export function VibrantGradientBackground({
  width = 300,
  height = 200,
  depth = -80,
  vertical = 0,
  scale = 15,
  glow = 1.0,
  spread = 0.7,
  scaleX = 0.8,
  scaleY = 0.4,
  originX = 0.75,
  originY = 0.53,
  grid = 40,
  dotSize = 0.22,
  dotOpacity = 0.1,
}: VibrantGradientBackgroundProps) {
  const matRef = useRef<ShaderMaterial>(null!);

  return (
    <mesh
      scale={scale / 2}
      position={[0, vertical, depth]}
      rotation={[0, 0, -Math.PI / 2]}
      renderOrder={-1}
    >
      <planeGeometry args={[width, height]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertShader}
        fragmentShader={fragShader}
        uniforms={{
          u_glow: { value: glow },
          u_spread: { value: spread },
          u_scaleXY: { value: new Vector2(scaleX, scaleY) },
          u_origin: { value: new Vector2(originX, originY) },
          u_grid: { value: grid },
          u_dotSize: { value: dotSize },
          u_dotOpacity: { value: dotOpacity },
          u_aspect: { value: new Vector2(width / height, 1.0) },
        }}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}
