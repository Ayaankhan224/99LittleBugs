import React, { createContext, useContext, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const TransitionContext = createContext(null);

export const useTransition = () => {
  const context = useContext(TransitionContext);
  if (!context) {
    throw new Error("useTransition must be used within a TransitionProvider");
  }
  return context;
};

export const TransitionLink = ({ to, children, className, ...props }) => {
  const { transitionTo } = useTransition();

  const handleClick = (e) => {
    e.preventDefault();
    transitionTo(to);
  };

  return (
    <a href={to} onClick={handleClick} className={className} {...props}>
      {children}
    </a>
  );
};

const Loading = ({ children }) => {
  const navigate = useNavigate();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const pageRef = useRef(null);
  const loaderRef = useRef(null);

  const transitionTo = (path) => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    gsap.set(loaderRef.current, { display: "flex" });

    const tl = gsap.timeline({
      onComplete: () => {
        navigate(path);

        setTimeout(() => {
          gsap.set(pageRef.current, { scale: 1.15 });

          const revealTl = gsap.timeline({
            onComplete: () => {
              gsap.set(loaderRef.current, { display: "none" });
              setIsTransitioning(false);
            },
          });

          revealTl.to(".stair", {
            yPercent: 100,
            duration: 0.8,
            ease: "power3.inOut",
            stagger: {
              amount: 0.3,
            },
          });

          revealTl.to(
            pageRef.current,
            {
              scale: 1,
              duration: 1.2,
              ease: "power3.out",
            },
            "-=0.6"
          );
        }, 50);
      },
    });

    tl.set(".stair", { yPercent: 100 });
    tl.to(".stair", {
      yPercent: 0,
      duration: 0.8,
      ease: "power3.inOut",
      stagger: {
        amount: 0.3,
      },
    });
  };

  useGSAP(() => {
    gsap.set(loaderRef.current, { display: "flex" });
    gsap.set(".stair", { yPercent: 0 });
    gsap.set(pageRef.current, { scale: 1.15 });

    const entryTl = gsap.timeline({
      onComplete: () => {
        gsap.set(loaderRef.current, { display: "none" });
      },
    });

    entryTl.to(".stair", {
      yPercent: 100,
      duration: 0.8,
      ease: "power3.inOut",
      stagger: {
        amount: 0.3,
      },
    });

    entryTl.to(
      pageRef.current,
      {
        scale: 1,
        duration: 1.2,
        ease: "power3.out",
      },
      "-=0.6"
    );
  }, []);

  return (
    <TransitionContext.Provider value={{ transitionTo, isTransitioning }}>
      <div className="overflow-hidden min-h-screen relative w-full">
        <div
          ref={loaderRef}
          className="flex h-screen w-full fixed inset-0 z-50 pointer-events-none"
          style={{ display: "none" }}
        >
          <div className="stair h-screen w-1/5 bg-[#111]"></div>
          <div className="stair h-screen w-1/5 bg-[#111]"></div>
          <div className="stair h-screen w-1/5 bg-[#111]"></div>
          <div className="stair h-screen w-1/5 bg-[#111]"></div>
          <div className="stair h-screen w-1/5 bg-[#111]"></div>
        </div>

        <div ref={pageRef} className="w-full min-h-screen origin-center">
          {children}
        </div>
      </div>
    </TransitionContext.Provider>
  );
};

export default Loading;
