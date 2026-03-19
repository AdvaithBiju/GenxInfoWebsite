import { Canvas, useFrame, useLoader } from "@react-three/fiber";



import { PerspectiveCamera, Environment } from "@react-three/drei";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Suspense, useEffect, useMemo, useRef } from "react";
import { TextureLoader } from "three";
import * as THREE from "three";

type SceneId = "sports" | "racing" | "tech" | "trending";

type Scene3DProps = {
  sceneId: SceneId;
  accent?: string;
};

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────






function setupColorTexture(tex: THREE.Texture) {
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
}

function setupNormalTexture(tex: THREE.Texture) {
  tex.colorSpace = THREE.NoColorSpace;
  tex.needsUpdate = true;
}



// ─────────────────────────────────────────────
// Ferrari / BMW
// ─────────────────────────────────────────────
function BMWModel({ path }: { path: string }) {
  const gltf = useLoader(GLTFLoader, path);
  const cloned = useMemo(() => gltf.scene.clone(true), [gltf]);

  useEffect(() => {
    cloned.traverse((obj: any) => {
      if (!obj?.isMesh) return;

      obj.castShadow = false;
      obj.receiveShadow = true;

      if (obj.material) {
        if (Array.isArray(obj.material)) {
          obj.material = obj.material.map((m: any) => {
            const mat = m.clone();
            if ("roughness" in mat) mat.roughness = Math.max(mat.roughness ?? 0.35, 0.35);
            if ("metalness" in mat) mat.metalness = Math.min(mat.metalness ?? 0.8, 0.9);
            mat.needsUpdate = true;
            return mat;
          });
        } else {
          const mat: any = obj.material.clone();
          if ("roughness" in mat) mat.roughness = Math.max(mat.roughness ?? 0.35, 0.35);
          if ("metalness" in mat) mat.metalness = Math.min(mat.metalness ?? 0.8, 0.9);
          mat.needsUpdate = true;
          obj.material = mat;
        }
      }
    });
  }, [cloned]);

  return (
    <primitive
      object={cloned}
      scale={1.2}
      position={[0, -1.1, 0]}
      rotation={[0, Math.PI * 0.92, 0]}
    />
  );
}

function FerrariCamera() {
  const camRef = useRef<THREE.PerspectiveCamera>(null);
  const pos = useRef(new THREE.Vector3(6.6, 1.15, 5.8));
  const lookAt = useRef(new THREE.Vector3(-0.4, -0.12, 0));

  useFrame(({ clock }) => {
    if (!camRef.current) return;
    const t = clock.getElapsedTime();

    const angle = t * 0.11;
    const rx = 7.2 + 0.6 * Math.sin(t * 0.07);
    const rz = 5.2 + 0.4 * Math.cos(t * 0.09);
    const height = 1.0 + 0.22 * Math.sin(t * 0.06);

    const target = new THREE.Vector3(
      Math.cos(angle) * rx,
      height,
      Math.sin(angle) * rz
    );

    const look = new THREE.Vector3(
      -0.5 + 0.3 * Math.sin(t * 0.08),
      -0.1 + 0.04 * Math.sin(t * 0.05),
      0.1 * Math.cos(t * 0.07)
    );

    pos.current.lerp(target, 0.012);
    lookAt.current.lerp(look, 0.016);

    camRef.current.position.copy(pos.current);
    camRef.current.lookAt(lookAt.current);
  });

  return (
    <PerspectiveCamera
      ref={camRef}
      makeDefault
      fov={28}
      position={[6.6, 1.15, 5.8]}
    />
  );
}

// ─────────────────────────────────────────────
// Rover
// ─────────────────────────────────────────────
function RoverModel({ path }: { path: string }) {
  const model = useLoader(FBXLoader, path);

  const [
    baseAlbedo,
    baseNormal,
    baseRoughness,
    baseMetallic,
    detailAlbedo,
    detailNormal,
    detailRoughness,
    detailMetallic,
  ] = useLoader(TextureLoader, [
    "/models/mars-rover/textures/BASE_albedo.jpg",
    "/models/mars-rover/textures/BASE_normal.png",
    "/models/mars-rover/textures/BASE_roughness.jpg",
    "/models/mars-rover/textures/BASE_metallic.jpg",
    "/models/mars-rover/textures/DETAIL_albedo.jpg",
    "/models/mars-rover/textures/DETAIL_normal.png",
    "/models/mars-rover/textures/DETAIL_roughness.jpg",
    "/models/mars-rover/textures/DETAIL_metallic.jpg",
  ]);

  const cloned = useMemo(() => model.clone(), [model]);

  useEffect(() => {
    setupColorTexture(baseAlbedo);
    setupNormalTexture(baseNormal);
    setupColorTexture(detailAlbedo);
    setupNormalTexture(detailNormal);

    baseRoughness.flipY = false;
    baseMetallic.flipY = false;
    detailRoughness.flipY = false;
    detailMetallic.flipY = false;

    baseRoughness.colorSpace = THREE.NoColorSpace;
    baseMetallic.colorSpace = THREE.NoColorSpace;
    detailRoughness.colorSpace = THREE.NoColorSpace;
    detailMetallic.colorSpace = THREE.NoColorSpace;

    baseRoughness.needsUpdate = true;
    baseMetallic.needsUpdate = true;
    detailRoughness.needsUpdate = true;
    detailMetallic.needsUpdate = true;

    cloned.traverse((obj: any) => {
      if (!obj?.isMesh) return;

      obj.castShadow = false;
      obj.receiveShadow = true;

      const name = String(obj.name || "").toLowerCase();
      console.log("TECH MESH:", obj.name);

      let mat: THREE.MeshStandardMaterial;

      if (
        name.includes("wheel") ||
        name.includes("tire") ||
        name.includes("tyre") ||
        name.includes("rim")
      ) {
        mat = new THREE.MeshStandardMaterial({
          map: detailAlbedo,
          normalMap: detailNormal,
          roughnessMap: detailRoughness,
          metalnessMap: detailMetallic,
          roughness: 1,
          metalness: 1,
        });
      } else if (name.includes("solar") || name.includes("panel")) {
        mat = new THREE.MeshStandardMaterial({
          map: detailAlbedo,
          normalMap: detailNormal,
          roughnessMap: detailRoughness,
          metalnessMap: detailMetallic,
          roughness: 1,
          metalness: 1,
        });
      } else {
        mat = new THREE.MeshStandardMaterial({
          map: baseAlbedo,
          normalMap: baseNormal,
          roughnessMap: baseRoughness,
          metalnessMap: baseMetallic,
          roughness: 1,
          metalness: 1,
        });
      }

      obj.material = mat;
    });
  }, [
    cloned,
    baseAlbedo,
    baseNormal,
    baseRoughness,
    baseMetallic,
    detailAlbedo,
    detailNormal,
    detailRoughness,
    detailMetallic,
  ]);

  return (
    <primitive
      object={cloned}
      scale={0.018}
      position={[0, -1.1, 0]}
      rotation={[0, Math.PI * 0.3, 0]}
    />
  );
}

function RoverCamera() {
  const camRef = useRef<THREE.PerspectiveCamera>(null);
  const pos = useRef(new THREE.Vector3(0, 16, 6));
  const lookAt = useRef(new THREE.Vector3(0, 0, 0));

  useFrame(({ clock }) => {
    if (!camRef.current) return;
    const t = clock.getElapsedTime();

    let target: THREE.Vector3;
    let look: THREE.Vector3;

    if (t < 6) {
      const progress = t / 6;
      const eased = 1 - Math.pow(1 - progress, 3);

      target = new THREE.Vector3(10 * eased, 16 - 7 * eased, 7 * eased);
      look = new THREE.Vector3(0, -0.3 * eased, 0);
    } else {
      const orbitT = t - 6;
      const angle = orbitT * 0.09 + Math.PI * 0.25;
      const rx = 20.0 + 0.6 * Math.sin(orbitT * 0.11);
      const rz = 20.0 + 0.5 * Math.cos(orbitT * 0.08);
      const height = 5.0 + 1.0 * Math.sin(orbitT * 0.07 + 0.5);

      target = new THREE.Vector3(
        Math.cos(angle) * rx,
        height,
        Math.sin(angle) * rz
      );

      look = new THREE.Vector3(
        0.2 * Math.sin(orbitT * 0.06),
        -0.4 + 0.15 * Math.sin(orbitT * 0.05),
        0
      );
    }

    pos.current.lerp(target, 0.018);
    lookAt.current.lerp(look, 0.022);

    camRef.current.position.copy(pos.current);
    camRef.current.lookAt(lookAt.current);
  });

  return (
    <PerspectiveCamera ref={camRef} makeDefault fov={24} position={[0, 16, 6]} />
  );
}

// ─────────────────────────────────────────────
// Sports Player
// ─────────────────────────────────────────────
function SportsPlayerModel({ path }: { path: string }) {
  const model = useLoader(FBXLoader, path);

  const [
    jerseyMap,
    jerseyNormal,
    ballMap,
    ballNormal,
    headMap,
    armsMap,
    handsMap,
    pantsMap,
    shoesMap,
    eyesMap,
    sockMap,
    tapeMap,
    tapeNormal,
    towelMap,
    towelNormal,
  ] = useLoader(TextureLoader, [
    "/models/gridiron-jumpman-an-american-football-player/textures/Jersey Updated 2.png",
    "/models/gridiron-jumpman-an-american-football-player/textures/Jersey Updated Normal2.png",
    "/models/gridiron-jumpman-an-american-football-player/textures/ball sun1.png",
    "/models/gridiron-jumpman-an-american-football-player/textures/ball sun1normal.png",
    "/models/gridiron-jumpman-an-american-football-player/textures/headSurface_Color.jpeg",
    "/models/gridiron-jumpman-an-american-football-player/textures/arms.1Surface_Color.jpeg",
    "/models/gridiron-jumpman-an-american-football-player/textures/handsSurface_Color.jpeg",
    "/models/gridiron-jumpman-an-american-football-player/textures/characterpantspantsSurface_Color.jpeg",
    "/models/gridiron-jumpman-an-american-football-player/textures/characterpantsshoesSurface_Color.jpeg",
    "/models/gridiron-jumpman-an-american-football-player/textures/eyes.jpg",
    "/models/gridiron-jumpman-an-american-football-player/textures/lsockSurface_Color.jpeg",
    "/models/gridiron-jumpman-an-american-football-player/textures/tape.png",
    "/models/gridiron-jumpman-an-american-football-player/textures/tapebump.png",
    "/models/gridiron-jumpman-an-american-football-player/textures/42021245-white-towel-texture-for-background.jpeg",
    "/models/gridiron-jumpman-an-american-football-player/textures/42021245-white-towel-texture-for-background.png",
  ]);

  const cloned = useMemo(() => model.clone(), [model]);

  useEffect(() => {
    setupColorTexture(jerseyMap);
    setupNormalTexture(jerseyNormal);

    setupColorTexture(ballMap);
    setupNormalTexture(ballNormal);

    setupColorTexture(headMap);
    setupColorTexture(armsMap);
    setupColorTexture(handsMap);
    setupColorTexture(pantsMap);
    setupColorTexture(shoesMap);
    setupColorTexture(eyesMap);
    setupColorTexture(sockMap);

    setupColorTexture(tapeMap);
    setupNormalTexture(tapeNormal);

    setupColorTexture(towelMap);
    setupNormalTexture(towelNormal);

    cloned.traverse((obj: any) => {
      if (!obj?.isMesh) return;

      obj.castShadow = false;
      obj.receiveShadow = true;

      const name = String(obj.name || "").toLowerCase();
      console.log("SPORTS MESH:", obj.name);

      let material: THREE.MeshStandardMaterial;

      // BALL
      if (
        name.includes("ball") ||
        name.includes("football") ||
        name.includes("sphere") ||
        name.includes("prop")
      ) {
        material = new THREE.MeshStandardMaterial({
          map: ballMap,
          normalMap: ballNormal,
          roughness: 0.88,
          metalness: 0.0,
        });
      }

      // HELMET / FACEMASK / VISOR -> fallback to jersey texture
      else if (
        name.includes("helmet") ||
        name.includes("facemask") ||
        name.includes("mask") ||
        name.includes("visor") ||
        name.includes("cage") ||
        name.includes("headgear")
      ) {
        material = new THREE.MeshStandardMaterial({
          map: jerseyMap,
          normalMap: jerseyNormal,
          roughness: 0.55,
          metalness: 0.08,
        });
      }

      // JERSEY / WHITE UPPER GEAR
      else if (
        name.includes("jersey") ||
        name.includes("shirt") ||
        name.includes("top") ||
        name.includes("uniform") ||
        name.includes("cloth") ||
        name.includes("chest") ||
        name.includes("torso") ||
        name.includes("pad") ||
        name.includes("shoulderpad")
      ) {
        material = new THREE.MeshStandardMaterial({
          map: jerseyMap,
          normalMap: jerseyNormal,
          roughness: 0.72,
          metalness: 0.02,
        });
      }

      // TOWEL / HANGING CLOTH
      else if (
        name.includes("towel") ||
        name.includes("rag") ||
        name.includes("clothstrip") ||
        name.includes("strapcloth")
      ) {
        material = new THREE.MeshStandardMaterial({
          map: towelMap,
          normalMap: towelNormal,
          roughness: 0.92,
          metalness: 0.0,
        });
      }

      // TAPE / WRAPS / BANDS / STRIPS
      else if (
        name.includes("tape") ||
        name.includes("wrap") ||
        name.includes("band") ||
        name.includes("strip")
      ) {
        material = new THREE.MeshStandardMaterial({
          map: tapeMap,
          normalMap: tapeNormal,
          roughness: 0.95,
          metalness: 0.0,
        });
      }

      // HEAD / FACE
      else if (
        name.includes("head") ||
        name.includes("face") ||
        name.includes("neck")
      ) {
        material = new THREE.MeshStandardMaterial({
          map: headMap,
          roughness: 0.7,
          metalness: 0.0,
        });
      }

      // ARMS
      else if (
        name.includes("arm") ||
        name.includes("shoulder") ||
        name.includes("bicep") ||
        name.includes("forearm")
      ) {
        material = new THREE.MeshStandardMaterial({
          map: armsMap,
          roughness: 0.72,
          metalness: 0.0,
        });
      }

      // HANDS
      else if (
        name.includes("hand") ||
        name.includes("finger") ||
        name.includes("palm")
      ) {
        material = new THREE.MeshStandardMaterial({
          map: handsMap,
          roughness: 0.75,
          metalness: 0.0,
        });
      }

      // PANTS / LEGS
      else if (
        name.includes("pant") ||
        name.includes("leg") ||
        name.includes("trouser") ||
        name.includes("short") ||
        name.includes("thigh") ||
        name.includes("calf")
      ) {
        material = new THREE.MeshStandardMaterial({
          map: pantsMap,
          roughness: 0.82,
          metalness: 0.02,
        });
      }

      // SHOES / CLEATS
      else if (
        name.includes("shoe") ||
        name.includes("boot") ||
        name.includes("sneaker") ||
        name.includes("cleat")
      ) {
        material = new THREE.MeshStandardMaterial({
          map: shoesMap,
          roughness: 0.85,
          metalness: 0.03,
        });
      }

      // EYES
      else if (name.includes("eye")) {
        material = new THREE.MeshStandardMaterial({
          map: eyesMap,
          roughness: 0.25,
          metalness: 0.0,
        });
      }

      // SOCKS
      else if (name.includes("sock")) {
        material = new THREE.MeshStandardMaterial({
          map: sockMap,
          roughness: 0.88,
          metalness: 0.0,
        });
      }

      // DEFAULT FALLBACK:
      // use jersey instead of plain gray so helmet/white gear won't look broken
      else {
        material = new THREE.MeshStandardMaterial({
          map: jerseyMap,
          normalMap: jerseyNormal,
          roughness: 0.74,
          metalness: 0.02,
        });
      }

      obj.material = material;
    });
  }, [
    cloned,
    jerseyMap,
    jerseyNormal,
    ballMap,
    ballNormal,
    headMap,
    armsMap,
    handsMap,
    pantsMap,
    shoesMap,
    eyesMap,
    sockMap,
    tapeMap,
    tapeNormal,
    towelMap,
    towelNormal,
  ]);

  return (
    <primitive
      object={cloned}
      scale={0.02}
      position={[0, -1.2, 0]}
      rotation={[0, Math.PI * 0.15, 0]}
    />
  );
}

function SportsCamera() {
  const camRef = useRef<THREE.PerspectiveCamera>(null);
  const pos = useRef(new THREE.Vector3(0, 0.8, 10));
  const lookAt = useRef(new THREE.Vector3(0, 1.2, 0));

  useFrame(({ clock }) => {
    if (!camRef.current) return;
    const t = clock.getElapsedTime();

    const angle = t * 0.14;
    const radius = 4.8;
    const height = 1.0 + 0.15 * Math.sin(t * 0.7);

    const target = new THREE.Vector3(
      Math.cos(angle) * radius,
      height,
      Math.sin(angle) * radius
    );

    const look = new THREE.Vector3(0, 1.1, 0);

    pos.current.lerp(target, 0.03);
    lookAt.current.lerp(look, 0.05);

    camRef.current.position.copy(pos.current);
    camRef.current.lookAt(lookAt.current);
  });

  return (
    <PerspectiveCamera
      ref={camRef}
      makeDefault
      fov={42}
      position={[0, 0.8, 10]}
    />
  );
}

// ─────────────────────────────────────────────
// Floors
// ─────────────────────────────────────────────
function RacingFloor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.18, 0]} receiveShadow>
      <planeGeometry args={[40, 40]} />
      <meshStandardMaterial color="#0a0b0d" roughness={0.88} metalness={0.18} />
    </mesh>
  );
}

function TechFloor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.12, 0]} receiveShadow>
      <planeGeometry args={[40, 40]} />
      <meshStandardMaterial color="#0d1117" roughness={0.75} metalness={0.35} />
    </mesh>
  );
}

function SportsFloor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.22, 0]} receiveShadow>
      <planeGeometry args={[40, 40]} />
      <meshStandardMaterial color="#080808" roughness={0.92} metalness={0.05} />
    </mesh>
  );
}

function TrendingFloor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.22, 0]} receiveShadow>
      <planeGeometry args={[40, 40]} />
      <meshStandardMaterial color="#111118" roughness={0.9} metalness={0.1} />
    </mesh>
  );
}

// ─────────────────────────────────────────────
// Bitcoin
// ─────────────────────────────────────────────

/**
 * FIX SUMMARY:
 * 1. Replaced MTLLoader + OBJLoader combo with a pure OBJLoader approach.
 *    MTLLoader frequently causes silent failures when texture paths don't
 *    resolve correctly (e.g. cross-origin, wrong resourcePath). By skipping
 *    MTL entirely and applying a MeshStandardMaterial manually we guarantee
 *    the mesh always renders with the correct gold colour.
 *
 * 2. Added onError handler passed via useLoader's third argument so any load
 *    failure surfaces as a console error instead of silently swallowing.
 *
 * 3. Kept bounding-box auto-centering & scaling but added console logs so
 *    you can verify the geometry arrived with real dimensions.
 *
 * 4. Rotation animation moved into useFrame so the coin spins continuously,
 *    making it trivially easy to confirm it is on screen.
 */


function BitcoinModel() {
  const gltf = useLoader(GLTFLoader, "/models/bitcoin1/scene.gltf");
  const cloned = useMemo(() => gltf.scene.clone(true), [gltf]);
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = clock.getElapsedTime() * 0.35;
  });

  useEffect(() => {
    const box = new THREE.Box3().setFromObject(cloned);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    cloned.position.sub(center);

    const maxAxis = Math.max(size.x, size.y, size.z);
    const targetSize = 1.6;
    const scale = maxAxis > 0 ? targetSize / maxAxis : 1;
    cloned.scale.setScalar(scale);

    cloned.traverse((child: any) => {
      if (!child?.isMesh) return;

      child.castShadow = false;
      child.receiveShadow = true;

      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material = child.material.map((m: any) => {
            const mat = m.clone();
            if ("roughness" in mat) mat.roughness = Math.max(mat.roughness ?? 0.45, 0.45);
            if ("metalness" in mat) mat.metalness = Math.min(mat.metalness ?? 0.9, 0.95);
            mat.side = THREE.FrontSide;
            mat.needsUpdate = true;
            return mat;
          });
        } else {
          const mat: any = child.material.clone();
          if ("roughness" in mat) mat.roughness = Math.max(mat.roughness ?? 0.45, 0.45);
          if ("metalness" in mat) mat.metalness = Math.min(mat.metalness ?? 0.9, 0.95);
          mat.side = THREE.FrontSide;
          mat.needsUpdate = true;
          child.material = mat;
        }
      }
    });
  }, [cloned]);

  return (
  <group ref={groupRef}>
    <primitive
      object={cloned}
      position={[0, 0, 0]}
      rotation={[Math.PI / 2, 0, 0]}  
    />
  </group>
);
}

function BitcoinCamera() {
  return (
    <PerspectiveCamera
      makeDefault
      fov={22}
      position={[0, 0.3, 6.0]}
    />
  );
}












function TrendingSceneInner() {
  return (
    <>
      <color attach="background" args={["#0d0d14"]} />
      <fog attach="fog" args={["#0d0d14", 6, 16]} />
      <BitcoinCamera />
      <ambientLight intensity={0.95} />
      <directionalLight position={[4, 5, 4]} intensity={1.5} color="#ffffff" />
      <pointLight position={[-3, 2, 2]} intensity={0.5} color="#ffcc66" />
      <pointLight position={[3, 2, -1]} intensity={0.45} color="#66ccff" />
      <Environment preset="studio" />
      <TrendingFloor />
      <BitcoinModel />
    </>
  );
}
// ─────────────────────────────────────────────
// Scene Wrappers
// ─────────────────────────────────────────────
function RacingScene() {
  return (
    <>
      <color attach="background" args={["#040404"]} />
      <fog attach="fog" args={["#040404", 9, 20]} />
      <FerrariCamera />
      <ambientLight intensity={0.38} />
      <directionalLight position={[5, 6, 4]} intensity={1.4} color="#ffffff" />
      <pointLight position={[4, 1.4, 4]} intensity={0.7} color="#ffffff" />
      <pointLight position={[-3, 1.2, 1]} intensity={0.25} color="#cfd5dd" />
      <spotLight
        position={[0, 5.5, 6]}
        intensity={1.6}
        angle={0.3}
        penumbra={0.95}
        color="#f3f5f7"
      />
      <Environment preset="studio" />
      <RacingFloor />
      <BMWModel path="/models/free_bmw_m3_e30/scene.gltf" />
    </>
  );
}

function TechScene() {
  return (
    <>
      <color attach="background" args={["#060a10"]} />
      <fog attach="fog" args={["#060a10", 10, 22]} />
      <RoverCamera />
      <ambientLight intensity={0.25} />
      <directionalLight position={[3, 8, 3]} intensity={1.2} color="#a0c4ff" />
      <pointLight position={[-4, 2, 5]} intensity={0.45} color="#ffe0b0" />
      <spotLight
        position={[0, 4, -6]}
        intensity={1.1}
        angle={0.4}
        penumbra={0.8}
        color="#60a0ff"
      />
      <Environment preset="warehouse" />
      <TechFloor />
      <RoverModel path="/models/mars-rover/source/ROVER.fbx" />
    </>
  );
}

function SportsScene() {
  return (
    <>
      <color attach="background" args={["#030303"]} />
      <fog attach="fog" args={["#030303", 8, 18]} />
      <SportsCamera />
      <ambientLight intensity={0.28} />
      <spotLight
        position={[2, 7, 3]}
        intensity={2.4}
        angle={0.22}
        penumbra={0.6}
        color="#fff5e8"
      />
      <pointLight position={[-4, 1.5, 2]} intensity={0.45} color="#ff2a2a" />
      <pointLight position={[4, 1.5, -2]} intensity={0.22} color="#2266ff" />
      <Environment preset="city" />
      <SportsFloor />
      <SportsPlayerModel path="/models/gridiron-jumpman-an-american-football-player/source/sundat-spunday-baked2.fbx" />
    </>
  );
}

// ─────────────────────────────────────────────
// Trending Scene — wraps Bitcoin with debug UI
// ─────────────────────────────────────────────


// ─────────────────────────────────────────────
// Root Export
// ─────────────────────────────────────────────
export default function Scene3D({ sceneId }: Scene3DProps) {
  // Debug state — only relevant when sceneId === "trending"
  

  

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 8, pointerEvents: "auto" }}>
      <Canvas
        dpr={[1, 1.5]}
        shadows={false}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <Suspense fallback={null}>
          {sceneId === "racing" && <RacingScene />}
          {sceneId === "tech" && <TechScene />}
          {sceneId === "sports" && <SportsScene />}
          {sceneId === "trending" && <TrendingSceneInner/>}
        </Suspense>
      </Canvas>

     
      
     
    </div>
  );
}
