import "./style.scss";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import gsap from "gsap"

const canvas = document.querySelector("#experience-canvas");
const sizes ={
  width: window.innerWidth,
  height: window.innerHeight
};

const modals = {
  work: document.querySelector(".modal.work"),
  about: document.querySelector(".modal.about"),
  contact: document.querySelector(".modal.contact"),
};

document.querySelectorAll(".modal-exit-button").forEach((button) => {
  button.addEventListener("click", (e) => {
    const modal = e.target.closest(".modal");
    hideModal(modal);
  });
});

const showModal = (modal) => {
  modal.style.display = "block";
  
  gsap.set(modal, {opacity: 0 });

  gsap.to(modal, {
    opacity: 1,
    duration: 0.5,
  });
};

const hideModal = (modal) => {
  gsap.to(modal, {
    opacity: 0,
    duration: 0.5,
    onComplete: ()=>{
      modal.style.display = "none";

    },
  });
};

const raycasterObjects = [];
let currentIntersects = [];

const socialLinks = {
  "github": "https://github.com/jahshaban",
  "youtube": "https://www.youtube.com/@Jose_Estremera",
  "itch": "https://jahshaban.itch.io/",
  "soundcloud": "https://soundcloud.com/discover"
}

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

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
    day: "/textures/room/day/TextureSetOne_v5.webp",
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
  onepiece_poster: {
    day: "/images/s-l1200.webp",
  },
  mariogalxy_poster: {
    day: "/images/81D3LS7eGKL.webp",
  },
  Object_24: {
    day: "/images/minecraft.webp",
  },
  fl_studio: {
    day: "/images/flstudio.webp",
  },
  //====RAYCASTER (TARGET)======
  about_eleven_raycaster: {
    day: "/textures/room/day/TextureSetEleven.webp",
  },
  chair_top_eight_raycaster: {
    day: "/textures/room/day/TextureSetEight.webp",
  },
  contact_eleven_raycaster: {
    day: "/textures/room/day/TextureSetEleven.webp",
  },
  github_five_raycaster: {
    day: "/textures/room/day/TextureSetFive.webp",
  },
  itch_five_raycaster: {
    day: "/textures/room/day/TextureSetFive.webp",
  },
  mywork_eleven_raycaster: {
    day: "/textures/room/day/TextureSetEleven.webp",
  },
  nametag_three_raycaster: {
    day: "/textures/room/day/TextureSetThree.webp",
  },
  piano_2_four_raycaster: {
    day: "/textures/room/day/TextureSetFour.webp",
  },
  piano_3_two_raycaster: {
    day: "/textures/room/day/TextureSetTwo.webp",
  },
  piano_4_two_raycaster: {
    day: "/textures/room/day/TextureSetTwo.webp",
  },
  piano_four_raycaster: {
    day: "/textures/room/day/TextureSetFour.webp",
  },
  soundcloud_five_raycaster: {
    day: "/textures/room/day/TextureSetFive.webp",
  },
  stick_1_eleven_raycaster: {
    day: "/textures/room/day/TextureSetEleven.webp",
  },
  stick_2_eleven_raycaster: {
    day: "/textures/room/day/TextureSetEleven.webp",
  },
  youtube_five_raycaster: {
    day: "/textures/room/day/TextureSetFive.webp",
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

window.addEventListener("mousemove", (e)=>{
	pointer.x = ( e.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
});
window.addEventListener("click", (e)=>{
  if (currentIntersects.length> 0) {
    const object = currentIntersects[0].object

    Object.entries(socialLinks).forEach(([key, url]) => {
  if(object.name.includes(key)){
    const newWindow = window.open();
    newWindow.opener = null;
    newWindow.location = url;
    newWindow.target = "_blank";
    newWindow.rel = "noopener noreferrer"; 
  }
});

    if(object.name.includes("mywork_eleven_raycaster_pointer")){
      showModal(modals.work);
    }else if (object.name.includes("about_eleven_raycaster_pointer")){
      showModal(modals.about);

    }else if (object.name.includes("contact_eleven_raycaster_pointer")){
      showModal(modals.contact);

    }
  }
});

loader.load("/models/MYROOM_PORTFOLIO_v5-v7-v2.glb", (glb) => {

  glb.scene.traverse(child=>{
    if(child.isMesh){
      Object.keys(textureMap).forEach(key=>{
        if(child.name.includes(key)){
          if(child.name.includes("raycaster")){
            raycasterObjects.push(child);
          }
          const material = new THREE.MeshBasicMaterial({
            map: loadedTextures.day[key],
          });

          child.material = material

          if (child.material.map) {
            child.material.map.minFilter = THREE.LinearFilter;
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

 // console.log(camera.position);
 // console.log("0");
 // console.log(controls.target);
 
  renderer.render( scene, camera );

  // Raycaster
  raycaster.setFromCamera( pointer, camera );

	// calculate objects intersecting the picking ray
	currentIntersects = raycaster.intersectObjects(raycasterObjects);

	//for ( let i = 0; i < currentIntersects.length; i ++ ) {
		//currentIntersects[ i ].object.material.color.set( 0xff0000 );
	//}

  if(currentIntersects.length>0){
    const currentIntersectsObject = currentIntersects[0].object

    if(currentIntersectsObject.name.includes("pointer")){

          document.body.style.cursor = "pointer";
    }else{
    document.body.style.cursor = "default";
    }
    }else{
    document.body.style.cursor = "default";
    
  }



  window.requestAnimationFrame(render);
};

render();
