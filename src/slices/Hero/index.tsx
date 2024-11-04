'use client';

import { asText, Content } from "@prismicio/client";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { View } from "@react-three/drei";

import { Bounded } from "@/components/Bounded";
import Button from "@/components/Button";
import { TextSplitter } from "@/components/TextSplitter";
import Scene from "./Scene";
import { Bubbles } from "@/components/Bubbles";
import { useStore } from "@/hooks/useStore";
import { useMediaQuery } from "@/hooks/useMediaQuery";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Props for `Hero`.
 */
export type HeroProps = SliceComponentProps<Content.HeroSlice>;

/**
 * Component for "Hero" Slices.
 */
const Hero = ({ slice }: HeroProps): JSX.Element => {
  const ready = useStore((state) => state.ready);
  // We only want to render our Veiw component containing the Scene and Bubbles is if isDesktop equals true.
  const isDesktop = useMediaQuery("(min-width: 768px)", true);

  useGSAP(() => {
    if(!ready && isDesktop) return;

    const introTl = gsap.timeline();
    introTl
    .set(".hero", {
      opacity:1
    })
    .from(".hero-header-word", {
      scale: 3,
      opacity: 0,
      ease: "power4.in",
      delay: 0.3,
      stagger: 1,
    })
    .from(
      ".hero-subheading", {
        opacity: 0,
        y: 30,
      }, 
      "+=.8",
    )
    .from(".hero-body",{
      opacity: 0,
      y: 10,
    })
    .from(".hero-button",{
      opacity: 0,
      y: 10,
      duration: .6,
    });

    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top', /** first value in the string relates to the trigger and second for the scroller/ viewport is default, markers for visualisation */
        end: 'bottom bottom',
        scrub: 1.5, /** lengthen time to catch up, back & forth */
      }
    });
  
    scrollTl
      .fromTo("body", {
        backgroundColor: '#FEF08A',

      }, {
        backgroundColor:'#D9F99D',
        overwrite: "auto",
      },
      1,
      /**creating an array using css*/
    ).from(".text-side-heading .split-char", {
      scale: 1.3,
      y: 40,
      rotate: -25,
      opacity: 0,
      stagger: .1,
      ease: "back-out(3)",
      duration: .5,
    }) 
    .from("text-side-body", {
      y: 20,
      opacity: 0,
    })

  },{dependencies: [ready, isDesktop]});
// Add ready to dependencies so that useGSAP reruns when the value changes.

  return (
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="hero opacity-0"
    >
      {isDesktop && (
        <View className="hero-scene pointer-events-none sticky top-0 z-50 -mt-[100vh] hidden h-screen w-screen md:block">
          <Scene />
          <Bubbles />
        </View>
      )}

      <div className="grid">
        <div className="grid h-screen place-items-center">
          <div className="grid auto-rows-min place-items-center text-center">
            <h1 className="hero-header lg:text-[13rem] text-7xl font-black uppercase leading-[.8] text-lime-500 md:text-[13rem]">
              <TextSplitter text={asText(slice.primary.heading)} wordDisplayStyle="block" className="hero-header-word"
              />
            </h1>
            <div className="hero-subheading mt-12 text-5xl font-semibold text-sky-300 lg:text-7xl">
              <PrismicRichText field={slice.primary.subheading} />
            </div>
            <div className="hero-body text-2xl font-normal text-sky-950">
              <PrismicRichText field={slice.primary.body} />
            </div>
            <Button buttonLink={slice.primary.button_link}
            buttonText={slice.primary.button_text}
            className="hero-button mt-12" />
          </div>
        </div>

        <div className="grid text-side relative z-[80] h-screen items-center gap-4 md:grid-cols-2"> 
          <PrismicNextImage 
            className="w-full md:hidden " 
            field={slice.primary.cans_image} 
          />
          <div>
            <h2 className="text-side-heading text-balance text-6xl font-black uppercase text-sky-950 lg:text-8xl">
              <TextSplitter text={asText(slice.primary.second_heading)} />
            </h2>
            <div className="text-side-body mt-4 max-w-xl text-balance text-xl font-normal text-sky-950">
              <PrismicRichText field={slice.primary.second_body} />
            </div>
          </div>
        </div>

      </div>

    </Bounded>
  );
};

export default Hero;