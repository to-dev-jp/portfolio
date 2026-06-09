import { EFFECT_RANGES, SECTION_RANGES } from "@/components/const";
import { useRef, useState } from "react";

export const useScroll = () => {
  const scrollProgress = useRef(0);
  const effectScrollProgress = useRef(0);
  const [section, setSection] = useState("top");
  const [workIndex, setWorkIndex] = useState(0);
  const currentSection = useRef("top");
  const currentWorkIndex = useRef(0);
  const setScrollProgress = (scrollPos: number, scrollHeight: number) => {
    scrollProgress.current = scrollPos / scrollHeight;
    const scroll = scrollProgress.current;
    const nextSection =
      SECTION_RANGES.find((r) => scroll < r.threshold)?.name ?? "contact";

    if (currentSection.current !== nextSection) {
      currentSection.current = nextSection;
      setSection(nextSection);
    }

    const workRange = (name: string) => {
      return (
        SECTION_RANGES.find((r) => r.name === name)?.threshold ??
        SECTION_RANGES[0].threshold
      );
    };

    const { worksStart, worksEnd } = {
      worksStart: workRange("transition01"),
      worksEnd: workRange("works02"),
    };

    const workSpan = (worksEnd - worksStart) / 3;
    const worksRange1 = scroll < worksStart + workSpan;
    const worksRange2 = scroll < worksStart + workSpan * 2;

    let work = 0;
    if (worksRange1) work = 0;
    else if (worksRange2) work = 1;
    else work = 2;

    if (currentWorkIndex.current !== work) {
      currentWorkIndex.current = work;
      setWorkIndex(work);
    }

    const effectRange = (name: string) => {
      return (
        EFFECT_RANGES.find((r) => r.name === name)?.threshold ??
        EFFECT_RANGES[0].threshold
      );
    };

    const {
      firstHalf,
      transition01,
      secondHalf01,
      transition02,
      secondHalf02,
    } = {
      firstHalf: scroll < effectRange("firstHalf"),
      transition01: scroll < effectRange("transition01"),
      secondHalf01: scroll < effectRange("secondHalf01"),
      transition02: scroll < effectRange("transition02"),
      secondHalf02: scroll < effectRange("secondHalf02"),
    };

    if (firstHalf) {
      effectScrollProgress.current = 0;
    } else if (transition01) {
      effectScrollProgress.current =
        (scroll - effectRange("firstHalf")) /
        (effectRange("transition01") - effectRange("firstHalf"));
    } else if (secondHalf01) {
      effectScrollProgress.current = 0;
    } else if (transition02) {
      effectScrollProgress.current =
        (scroll - effectRange("secondHalf01")) /
        (effectRange("transition02") - effectRange("secondHalf01"));
    } else if (secondHalf02) {
      effectScrollProgress.current = 1;
    }
  };

  return {
    scrollProgress,
    setScrollProgress,
    effectScrollProgress,
    section,
    workIndex,
  };
};
