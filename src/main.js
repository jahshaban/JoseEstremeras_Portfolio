import "./style.scss";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const canvas = document.querySelector("#experience-canvas");
const sizes ={
  width: window.innerWidth,
  height: window.innerHeight
};

// Loaders
const textureLoader = new THREE.TextureLoader();

// Model Loader
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/");

const loader = new GLTFLoader();
loader.setDRACOLoader(dracoLoader);

const enviornmntMap = new THREE.CubeTextureLoader()
  .setPath('textures/skybox/')
  .load( [
    'px.webp',
    'nx.webp',
    'py.webp',
    'ny.webp',
    'pz.webp',
    'nz.webp',
  ]);

const textureMap = {
  room_one: {
    day: "/textures/room/day/TextureSetOne.webp",
  },
  piano_stand_2_two: {
    day: "/textures/room/day/TextureSetTwo.webp",
  },
  objects_three: {
    day: "/textures/room/day/TextureSetThree.webp",
  },
  piano_stand_four: {
    day: "/textures/room/day/TextureSetFour.webp",
  },
  shelf_books_pictures_four: {
    day: "/textures/room/day/TextureSetFour.webp",
  },
  Fith: {
    day: "/textures/room/day/TextureSetFive.webp",
  },
  desk_holder_notepad_six: {
    day: "/textures/room/day/TextureSetSix.webp",
  },
  headphones_holder_six: {
    day: "/textures/room/day/TextureSetSix.webp",
  },
  pencil: {
    day: "/textures/room/day/TextureSetSix.webp",
  },
  pencil_holder: {
    day: "/textures/room/day/TextureSetSix.webp",
  },
  speakers: {
    day: "/textures/room/day/TextureSetSix.webp",
  },
  computer_seven: {
    day: "/textures/room/day/TextureSetSeven.webp",
  },
  desk_seven: {
    day: "/textures/room/day/TextureSetSeven.webp",
  },
  mouse_keyboard_mic_seven: {
    day: "/textures/room/day/TextureSetSeven.webp",
  },
  sticky_notes_seven: {
    day: "/textures/room/day/TextureSetSeven.webp",
  },
  chair_bottom_eight: {
    day: "/textures/room/day/TextureSetEight.webp",
  },
  computer_eight: {
    day: "/textures/room/day/TextureSetEight.webp",
  },
  computer_glass_eight: {
    day: "/textures/room/day/TextureSetEight.webp",
  },
  rug_nine: {
    day: "/textures/room/day/TextureSetNine.webp",
  },
  lamp_ten: {
    day: "/textures/room/day/TextureSetTen.webp",
  },
  picture_ten: {
    day: "/textures/room/day/TextureSetTen.webp",
  },
  Eleventh: {
    day: "/textures/room/day/TextureSetEleven.webp",
  },
  white_background: {
    day: "/textures/room/day/TextureSetTwelve.webp",
  },
  cord_thirteen: {
    day: "/textures/room/day/TextureSetThirteen.webp",
  },
};

const loadedTextures = {
  day: {},
};

Object.entries(textureMap).forEach(([key, paths]) => {
  const daytexture = textureLoader.load(paths.day);
  daytexture.flipY = false;
  daytexture.colorSpace = THREE.SRGBColorSpace;
  loadedTextures.day[key] = daytexture;
});

loader.load("/models/MYROOM_PORTFOLIO_v2.glb", (glb) => {

  glb.scene.traverse(child=>{
    if(child.isMesh){
      Object.keys(textureMap).forEach(key=>{
        if(child.name.includes(key)){
          const material = new THREE.MeshBasicMaterial({
            map: loadedTextures.day[key],
          });

          child.material = material

          if (child.material.map) {
            child.material.map.minFilter = THREE.inearFilter;
          }
        }

        if (child.name.includes("glass")) {
          child.material = new THREE.MeshPhysicalMaterial({
            transmission: 1,
            opacity: 1,
            metalness: 0,
            roughness: 0,
            ior: 1.5,
            thickness: 0.01,
            specularColor: 0xffffff,
            envMap: enviornmntMap,
            envMapIntensity: 1,
            lightIntensity: 1,
            exposure: 1,
          });
        }
      });
    }
  });
  scene.add(glb.scene);
});

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 
  45, 
  sizes.width / sizes.height, 
  0.1, 
  1000 
);
camera.position.set(
  9.102679414624376,
  12.07289669989865,
  9.149143254035927
)

const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; 
controls.dampingFactor = 0.05;
controls.update();
controls.target.set(
-0.5205233755762245,
1.3980113405921277,
-0.16051917792765572
)

// Event Listeners
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update Camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update Renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

});

const render = () => {
  controls.update();

  console.log(camera.position);
  console.log("0");
  console.log(controls.target);
 
  renderer.render( scene, camera );

  window.requestAnimationFrame(render);
};

render();
