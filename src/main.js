import "./style.scss";
import * as THREE from "three";
import { OrbitControls } from "./utils/OrbitControls.js";
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

let touchHappened = false;
document.querySelectorAll(".modal-exit-button").forEach((button) => {
  button.addEventListener(
    "touchend", 
    (e) => {
    touchHappened = true;
    e.preventDefault();
    const modal = e.target.closest(".modal");
    hideModal(modal);
  },
  {passive: false}
);

  button.addEventListener(
    "click", 
    (e) => {
      if (touchHappened) return;
      e.preventDefault();
    const modal = e.target.closest(".modal");
    hideModal(modal);
  },
  {passive: false}
);
});

let isModalOpen = false;

const showModal = (modal) => {
  modal.style.display = "block";
  isModalOpen = true;
  controls.enabled = false;

  if (currentHoveredObject) {
    playHoverAnimation(currentHoveredObject, false);
    currentHoveredObject = null;
  }
  document.body.style.cursor = "default";
  currentIntersects = [];
  
  gsap.set(modal, {opacity: 0 });

  gsap.to(modal, {
    opacity: 1,
    duration: 0.5,
  });
};

const hideModal = (modal) => {
  isModalOpen = false;
  controls.enabled = true;

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
let currentHoveredObject = null;

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
  touchHappened = false
	pointer.x = ( e.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
});

window.addEventListener(
  "touchstart", 
  (e)=>{
    if(isModalOpen) return;
    e.preventDefault()
	  pointer.x = ( e.touches[0].clientX / window.innerWidth ) * 2 - 1;
	  pointer.y = - ( e.touches[0].clientY / window.innerHeight ) * 2 + 1;
 },
 { passive: false }
);

window.addEventListener(
  "touchend", 
  (e)=>{
    if(isModalOpen) return;
    e.preventDefault()
	  handleRaycasterInteraction()
 },
 { passive: false }
);

function handleRaycasterInteraction(){
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
}


window.addEventListener("click", handleRaycasterInteraction);
  

let stick1,
stick2,
mywrk,
abt,
cntct,
gthub,
tch,
ytbe,
sndcld;

loader.load("/models/MYROOM_PORTFOLIO_v6-v1-v1.glb", (glb) => {

  glb.scene.traverse(child=>{
    if(child.isMesh){

      Object.keys(textureMap).forEach(key=>{
        if(child.name.includes(key)){
          if(child.name.includes("raycaster")){
            raycasterObjects.push(child);
          }

          if(child.name.includes("hover")){
            child.userData.intialScale = new THREE.Vector3().copy(child.scale)
            child.userData.intialPosition = new THREE.Vector3().copy(
              child.position
            );
            child.userData.intialRotation = new THREE.Euler().copy(child.rotation);
            //child.userData.isAnimating = false;
          }

          if (child.name.includes("stick_1")){
            stick1 = child;
            child.scale.set(0,1,0);
          }
          if (child.name.includes("stick_2")){
            stick2 = child;
            child.scale.set(0,0,0);
          }
          if (child.name.includes("mywork")){
            mywrk = child;
            child.scale.set(0,0,0);
          }
          if (child.name.includes("about")){
            abt = child;
            child.scale.set(0,0,0);
          }
          if (child.name.includes("contact")){
            cntct = child;
            child.scale.set(0,0,0);
          }
          if (child.name.includes("github")){
            gthub = child;
            child.scale.set(0,0,0);
          }
          if (child.name.includes("itch")){
            tch = child;
            child.scale.set(0,0,0);
          }
          if (child.name.includes("youtube")){
            ytbe = child;
            child.scale.set(0,0,0);
          }
          if (child.name.includes("soundcloud")){
            sndcld = child;
            child.scale.set(0,0,0);
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
  playIntroAnimation()
});

function playIntroAnimation() {
  const t1 = gsap.timeline({
    defaults:{
      duration: 0.8,
      ease: "back.out(1.8)",
    },
  });

 t1.to(stick1.scale, {
    z: 1,
    x: 1,
  })
  .to(stick2.scale,{
    z: 1,
    y: 1,
    x: 1,
 },"-=0.6")
 .to(mywrk.scale,{
  z: 1,
  y: 1,
  x: 1,
},"-=0.6")
.to(abt.scale,{
  z: 1,
  y: 1,
  x: 1,
},"-=0.6")
.to(cntct.scale,{
  z: 1,
  y: 1,
  x: 1,
},"-=0.6")

const t2 = gsap.timeline({
  defaults:{
    duration: 0.8,
    ease: "back.out(1.8)",
  },
});

t2.to(ytbe.scale, {
  z: 1,
  y: 1,
  x: 1,
})
.to(sndcld.scale,{
  z: 1,
  y: 1,
  x: 1,
},"-=0.6")
.to(gthub.scale,{
z: 1,
y: 1,
x: 1,
},"-=0.6")
.to(tch.scale,{
z: 1,
y: 1,
x: 1,
},"-=0.6");

}




const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 
  45, 
  sizes.width / sizes.height, 
  0.1, 
  1000 
);
camera.position.set(

  12.165380668129075,
 
  5.4066929001309845,
  
  10.620359020108442,
  
)

const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const controls = new OrbitControls(camera, renderer.domElement);
controls.minDistance = 10;
controls.maxDistance = 25;
controls.minPolarAngle = Math.PI / 2.3;
controls.maxPolarAngle = Math.PI / 2;
controls.minAzimuthAngle = 0;
controls.maxAzimuthAngle = Math.PI / 2;


controls.enableDamping = true; 
controls.dampingFactor = 0.05;

controls.update();
controls.target.set(
  
  -0.5205233755762245,
  
  1.3980113405921277,
   
  -0.16051917792765572,
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

function playHoverAnimation (object, isHovering) {
  if (object.userData.isAnimating) return;

 gsap.killTweensOf(object.scale);
 gsap.killTweensOf(object.rotation);

  if(isHovering) {
    gsap.to(object.scale, {
      x: object.userData.intialScale.x * 1.2,
      y: object.userData.intialScale.y * 1.2,
      z: object.userData.intialScale.z * 1.2,
      duration: 0.5,
      ease: "bounce.out(1.8)",
    });
    gsap.to(object.rotation, {
      x: object.userData.intialRotation.x, //+ Math.PI / 32,
      duration: 0.5,
      ease: "bounce.out(1.8)",
    });
  }else{
    gsap.to(object.scale, {
      x: object.userData.intialScale.x,
      y: object.userData.intialScale.y,
      z: object.userData.intialScale.z,
      duration: 0.3,
      ease: "bounce.out(1.8)",
    });
    gsap.to(object.rotation, {
      x: object.userData.intialRotation.x,
      duration: 0.3,
      ease: "bounce.out(1.8)",
    });
  }
}

const render = () => {
  controls.update();

  console.log(camera.position);
  console.log("0");
  console.log(controls.target);
 
  renderer.render( scene, camera );

  // Raycaster
  if(!isModalOpen){
  raycaster.setFromCamera( pointer, camera );

	// calculate objects intersecting the picking ray
	currentIntersects = raycaster.intersectObjects(raycasterObjects);

	for ( let i = 0; i < currentIntersects.length; i ++ ) {}

  if(currentIntersects.length>0){
    const currentIntersectsObject = currentIntersects[0].object

    if(currentIntersectsObject.name.includes("hover")){
      if(currentIntersectsObject !== currentHoveredObject){

        if(currentHoveredObject){
          playHoverAnimation(currentHoveredObject, false);
        }

        playHoverAnimation(currentIntersectsObject, true);
        currentHoveredObject = currentIntersectsObject;
      }
    }

    if(currentIntersectsObject.name.includes("pointer")){

        document.body.style.cursor = "pointer";
      } else {
        document.body.style.cursor = "default";
      }
    } else {
      if (currentHoveredObject) {
        playHoverAnimation(currentHoveredObject,false);
        currentHoveredObject = null;
      }
      document.body.style.cursor = "default";
    }
    
  }
  renderer.render(scene, camera);
  window.requestAnimationFrame(render);
};

render();
