'use client'

import { Content } from "@prismicio/client"
import { Cloud, Clouds, Environment, Text } from "@react-three/drei"
import { useRef } from "react"
import * as THREE from 'three'
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import FloatingCan from "@/components/FloatingCan"
import { useMediaQuery } from "@/hooks/useMediaQuery"
import { distance } from "three/webgpu";
import { get } from "http";

gsap.registerPlugin(useGSAP, ScrollTrigger)

type SkyDiveProps = {
  sentence: string | null;
  flavour: Content.SkyDiveSliceDefaultPrimary["flavour"]
};

/* Scene should be inside a canvas, remember to import View from drei. HOOKS CAN ONLY BE USED WITHIN THE CANVAS COMPONENT*/
export default function Scene({sentence, flavour}: SkyDiveProps) {
  const groupRef = useRef<THREE.Group>(null)
  const canRef = useRef<THREE.Group>(null)
  const shroud1Ref = useRef<THREE.Group>(null)
  const shroud2Ref = useRef<THREE.Group>(null)
  const shroudGroupRef = useRef<THREE.Group>(null)
  const wordsRef = useRef<THREE.Group>(null)

  const ANGLE = 75 * (Math.PI / 180) /* 1degree in radians multiplied * by 75 to get an angle of 75degrees */

  const getXPosition = (distance: number) => distance * Math.cos (ANGLE)
  const getYPosition = (distance: number) => distance * Math.sin (ANGLE)

  const getXYPositions = (distance: number) => ({
    x: getXPosition(distance),
    y: getYPosition(-1 * distance)
  });

  // Build 3D scene
  useGSAP(()=>{
    if(
      !shroudGroupRef.current ||
      !canRef.current ||
      !wordsRef.current ||
      !shroud2Ref.current ||
      !shroud1Ref.current 
    ) return;
    // Set initial positions
    gsap.set(shroudGroupRef.current.position, { z: 10 });
    gsap.set(canRef.current.position, {
      ...getXYPositions(-4),
    });

    gsap.set
      (wordsRef.current.children.map((word)=> word.position), 
      { ...getXYPositions(7), z: 2},
    );
    // Spinning Can
    gsap.to(canRef.current.rotation, {
      y: Math.PI*2,
      duration: 1.7,
      repeat: -1, /* Infinite */
      ease: "none", /* Appear as constant */
    })

    // Infinite cloud movement
    const DIST = 15;
    const DURA = 6

    gsap.set([shroud2Ref.current.position, shroud1Ref.current.position],
      {
        // Spread operator allows us to copy all of an existing array/ object into another arry/ object.
        ...getXYPositions(DIST)
      }
    );

    gsap.to(shroud1Ref.current.position, {
      y: `+=${getYPosition(DIST * 2)}`,
      x: `+=${getXPosition(DIST * -2)}`,
      ease: "none",
      repeat: -1,
      duration: DURA,
    });

    gsap.to(shroud2Ref.current.position, {
      y: `+=${getYPosition(DIST * 2)}`,
      x: `+=${getXPosition(DIST * -2)}`,
      ease: "none",
      repeat: -1,
      delay: DURA / 2,
      duration: DURA,
    });

    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".skydive",
        pin: true,
        start: "top top",
        end: "+=2000",
        scrub: 1.5,
      }
    });

    scrollTl.to("body", {
        backgroundColor: '#C0F0F5',
        overwrite: "auto",
        duration: 0.1,
      })
      // Animation to move clouds and can into view.
    .to(shroudGroupRef.current.position, {z: 0, duration: 0.3 }, 0)
    .to(canRef.current.position, {
      x: 0,
      y: 0, 
      duration: 0.3, 
      ease: "back.out(1.7)",
    })
    .to(wordsRef.current.children.map((word)=> word.position),
      {
        keyframes: [ // Vars object inside this keyframe.
          {x: 0, y: 0, z: -1},
          {...getXYPositions(-7), Z: -7}
        ],
        stagger: 0.3,
      },
      0, // Position parameter of 0 so that everything starts at the begining.
    )
    .to(canRef.current.position, {
      ...getXYPositions(4),
      duration: 0.5,
      ease: "back.in(1.7)",
    })
    .to(shroudGroupRef.current.position, {
      z: 7,
      duration: 0.5
    }) // For the animation to play after everything else has run, we don't require a position parameter. 

  });

  return (
    <group ref={groupRef}>
        {/* Can */}
        <group rotation={[0, 0, 0.5]}>
            {/* Rotation is placed on the container of the floating can rather than simply on the can. */}
            <FloatingCan ref={canRef} flavor={flavour}
            rotationIntensity={0}
            floatIntensity={3}
            floatSpeed={3}
            >
              <pointLight intensity={30} color="#f2fa05" decay={0.6} />
            </FloatingCan>
        </group>

        {/* Clouds */}
        <Clouds ref={shroudGroupRef} >
          <Cloud ref={shroud1Ref} bounds={[10, 10, 2]} />
          <Cloud ref={shroud2Ref} bounds={[10, 10, 2]}  />
        </Clouds>

        {/* Text */}
        <group ref={wordsRef}>
          {sentence && <ThreeText sentence={sentence} color="#F97315" />}
        </group>

        
        {/* Lights */}
        <ambientLight intensity={2} color="#9ddefa" />
        <Environment files="hdr/field.hdr" environmentIntensity={1.5} />
    </group>
  )
}

function ThreeText({
  sentence, 
  color = "white",
}:{
  sentence: string;
  color?: string
}){
  {/* Create a words array. */}
  const words = sentence.toUpperCase().split(" ");

  const material = new THREE.MeshLambertMaterial();
  const isDesktop = useMediaQuery("(min-width: 950px)", true);

  return words.map((word: string, wordIndex: number) => (/* Parentheses for implicit return */
    <Text key={`${wordIndex}-${word}`}
    scale={isDesktop ? 1 : 5}
    color={color}
    material={material}
    font="/fonts/Alpino-Variable.woff"
    fontWeight={900}
    anchorX={"center"}
    anchorY={"middle"}
    characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ!,.?'"
    
    
    
    >{word}</Text>
  ));
}