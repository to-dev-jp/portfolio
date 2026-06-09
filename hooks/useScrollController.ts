import { useEffect, useRef } from "react";

export const useScrollController = (
  setScrollProgress: (scrollPos: number, scrollHeight: number) => void,
) => {
  const contentAreaRef = useRef<HTMLDivElement | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);

  const scrollToRatio = (ratio: number) => {
    const contentArea = contentAreaRef.current;
    const scrollArea = scrollAreaRef.current;
    if (!contentArea || !scrollArea) return;
    const scrollHeight = contentArea.offsetHeight - window.innerHeight;
    setScrollProgress(ratio * scrollHeight, scrollHeight);
    scrollArea.scrollTop = ratio * scrollHeight;
  };

  useEffect(() => {
    const updateScroll = (
      contentArea: HTMLElement,
      scrollArea: HTMLElement,
    ) => {
      const height = window.innerHeight;
      const scrollHeight = contentArea.offsetHeight - height;
      const scrollPos = scrollArea.scrollTop;
      setScrollProgress(scrollPos, scrollHeight);
    };
    const contentArea = contentAreaRef.current;
    const scrollArea = scrollAreaRef.current;
    if (!scrollArea || !contentArea) return;
    const update = () => {
      updateScroll(contentArea, scrollArea);
    };

    scrollArea.addEventListener("scroll", update);
    window.addEventListener("resize", update);

    return () => {
      scrollArea.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [setScrollProgress]);

  return { contentAreaRef, scrollAreaRef, scrollToRatio };
};
