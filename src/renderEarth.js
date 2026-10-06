



import * as THREE from "three";

export function renderEarth(container) {
  const textureUrl = new URL(
    import.meta.env.BASE_URL + "textures/earth.jpg",
    document.baseURI
  ).href;

  const backupUrl =
    "https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg";

  container.style.backgroundImage = `url("${textureUrl}")`;
  container.style.backgroundSize = "cover";
  container.style.backgroundColor = "#145b9b";

  let renderer;

  try {
    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "low-power",
    });
  } catch (error) {
    console.warn("Earth WebGL unavailable:", error);
    return () => {};
  }

  renderer.setPixelRatio(
    Math.min(window.devicePixelRatio || 1, 2)
  );
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.domElement.setAttribute("aria-hidden", "true");
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);

  camera.position.z = 3.9;

  const globe = new THREE.Group();
  globe.rotation.y = -Math.PI / 2;
  globe.rotation.z = 0.12;
  scene.add(globe);

  const geometry = new THREE.SphereGeometry(1, 96, 64);
  const material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    shininess: 12,
    specular: 0x153951,
  });

  const earth = new THREE.Mesh(geometry, material);
  earth.visible = false;
  globe.add(earth);

  const sunlight = new THREE.DirectionalLight(0xfff3df, 2.5);
  sunlight.position.set(-3, 2, 4);
  scene.add(sunlight);
  scene.add(new THREE.AmbientLight(0x92bce8, 0.65));

  const atmosphereGeometry = new THREE.SphereGeometry(
    1.045,
    64,
    48
  );

  const atmosphereMaterial = new THREE.ShaderMaterial({
    transparent: true,
    side: THREE.BackSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending,

    uniforms: {
      glowColor: { value: new THREE.Color(0x479ce8) },
    },

    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vView;

      void main() {
        vec4 p = modelViewMatrix * vec4(position, 1.0);
        vNormal = normalize(normalMatrix * normal);
        vView = normalize(-p.xyz);
        gl_Position = projectionMatrix * p;
      }
    `,

    fragmentShader: `
      uniform vec3 glowColor;
      varying vec3 vNormal;
      varying vec3 vView;

      void main() {
        float rim = pow(
          1.0 - abs(dot(normalize(vNormal), normalize(vView))),
          3.0
        );

        gl_FragColor = vec4(glowColor, rim * 0.58);
      }
    `,
  });

  globe.add(
    new THREE.Mesh(atmosphereGeometry, atmosphereMaterial)
  );

  let disposed = false;
  let texture = null;
  let frame = 0;
  let previous = 0;

  const loader = new THREE.TextureLoader();

  function loadTexture(url, allowBackup) {
    loader.load(
      url,
      (loadedTexture) => {
        if (disposed) {
          loadedTexture.dispose();
          return;
        }

        texture = loadedTexture;
        texture.colorSpace = THREE.SRGBColorSpace;
        material.map = texture;
        material.needsUpdate = true;

        earth.visible = true;
        container.style.backgroundImage = "none";
        container.style.backgroundColor = "transparent";
      },
      undefined,
      (error) => {
        if (disposed) return;

        if (allowBackup) {
          console.warn(
            "Local Earth image failed. Trying online backup:",
            url
          );

          container.style.backgroundImage =
            `url("${backupUrl}")`;

          loadTexture(backupUrl, false);
        } else {
          console.error(
            "Earth texture failed. Check public/textures/earth.jpg",
            error
          );
        }
      }
    );
  }

  loadTexture(textureUrl, true);

  function resize() {
    const size = container.clientWidth || 340;

    renderer.setSize(size, size, false);
    camera.aspect = 1;
    camera.updateProjectionMatrix();
  }

  resize();

  const observer = new ResizeObserver(resize);
  observer.observe(container);

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  function draw(now) {
    if (disposed) return;

    const dt = previous
      ? Math.min((now - previous) / 1000, 0.05)
      : 0;

    previous = now;

    if (
      !reduceMotion &&
      container.classList.contains("on") &&
      !container.classList.contains("zoom")
    ) {
      globe.rotation.y += dt * 0.065;
    }

    renderer.render(scene, camera);
    frame = requestAnimationFrame(draw);
  }

  frame = requestAnimationFrame(draw);

  return () => {
    disposed = true;

    cancelAnimationFrame(frame);
    observer.disconnect();

    texture?.dispose();
    geometry.dispose();
    material.dispose();
    atmosphereGeometry.dispose();
    atmosphereMaterial.dispose();

    renderer.dispose();
    renderer.domElement.remove();
  };
}