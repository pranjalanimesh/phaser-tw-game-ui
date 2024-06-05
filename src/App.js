// src/App.js
import React from "react";
import PhaserGame from "./PhaserGame";
import { useEffect, useState } from "react";
import "./App.css";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

import { Blue, Red, Lime, White, Pink, Orange, Cyan, Green } from "./images";

const App = () => {
  const [init, setInit] = useState(false);

  // this should be run only once per application lifetime
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
      // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
      // starting from v2 you can add only the features you need reducing the bundle size
      //await loadAll(engine);
      //await loadFull(engine);
      await loadSlim(engine);
      //await loadBasic(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = (container) => {
    console.log(container);
  };

  const [options, setOptions] = useState({
    fullScreen: {
      enable: true,
      zIndex: -1,
    },
    fpsLimit: 120,
    particles: {
      groups: {
        z5000: {
          number: {
            value: 70,
          },
          zIndex: {
            value: 50,
          },
        },
        z7500: {
          number: {
            value: 30,
          },
          zIndex: {
            value: 75,
          },
        },
        z2500: {
          number: {
            value: 50,
          },
          zIndex: {
            value: 25,
          },
        },
        z1000: {
          number: {
            value: 40,
          },
          zIndex: {
            value: 10,
          },
        },
      },
      number: {
        value: 200,
        density: {
          enable: false,
          value_area: 800,
        },
      },
      color: {
        value: "#fff",
        animation: {
          enable: false,
          speed: 20,
          sync: true,
        },
      },
      shape: {
        type: "circle",
      },
      opacity: {
        value: 1,
        random: false,
        animation: {
          enable: false,
          speed: 3,
          minimumValue: 0.1,
          sync: false,
        },
      },
      size: {
        value: 3,
      },
      links: {
        enable: false,
        distance: 100,
        color: "#ffffff",
        opacity: 0.4,
        width: 1,
      },
      move: {
        angle: {
          value: 10,
          offset: 0,
        },
        enable: true,
        speed: 5,
        direction: "right",
        random: false,
        straight: false,
        outModes: {
          default: "out",
        },
        attract: {
          enable: false,
          rotateX: 600,
          rotateY: 1200,
        },
      },
      zIndex: {
        value: 5,
        opacityRate: 0.5,
      },
    },
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: "repulse",
        },
        onClick: {
          enable: false,
          mode: "push",
        },
        resize: true,
      },
      modes: {
        grab: {
          distance: 400,
          links: {
            opacity: 1,
          },
        },
        bubble: {
          distance: 400,
          size: 40,
          duration: 2,
          opacity: 0.8,
        },
        repulse: {
          distance: 50,
        },
        push: {
          quantity: 4,
          groups: ["z5000", "z7500", "z2500", "z1000"],
        },
        remove: {
          quantity: 2,
        },
      },
    },
    detectRetina: true,
    background: {
      color: "#000000",
      image: "",
      position: "50% 50%",
      repeat: "no-repeat",
      size: "cover",
    },
    emitters: {
      position: {
        y: 55,
        x: -5,
      },
      rate: {
        delay: 7,
        quantity: 1,
      },
      size: {
        width: 0,
        height: 0,
      },
      particles: {
        shape: {
          type: "images",
          options: {
            images: [
              {
                src: Blue,
                width: 205,
                height: 267,
              },
              {
                src: Cyan,
                width: 207,
                height: 265,
              },
              {
                src: Green,
                width: 204,
                height: 266,
              },
              {
                src: Lime,
                width: 206,
                height: 267,
              },
              {
                src: Orange,
                width: 205,
                height: 265,
              },
              {
                src: Pink,
                width: 205,
                height: 265,
              },
              {
                src: Red,
                width: 204,
                height: 267,
              },
              {
                src: White,
                width: 205,
                height: 267,
              },
            ],
          },
        },
        size: {
          value: 40,
        },
        move: {
          speed: 10,
          outModes: {
            default: "none",
            right: "destroy",
          },
          straight: true,
        },
        zIndex: {
          value: 0,
        },
        rotate: {
          value: {
            min: 0,
            max: 360,
          },
          animation: {
            enable: true,
            speed: 10,
            sync: true,
          },
        },
      },
    },
  });

  if (init) {
    return (
      <div className="App">
        <h1>Townsfolks vs Werewolves</h1>
        <div className="PhaserGame">
          <PhaserGame />
        </div>

        <div id="particles">
          <Particles
            id="tsparticles"
            particlesLoaded={particlesLoaded}
            options={options}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <h1>Townsfolks vs Werewolves</h1>
      <div className="PhaserGame"><PhaserGame /></div>
    </div>
  );
};

export default App;
