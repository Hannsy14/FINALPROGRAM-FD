
// 






// document.addEventListener("DOMContentLoaded", () => {
//     // Get all elements with the class 'shape-option'
//     const gravityOptions = document.querySelectorAll(".shape-option");

//     // Variable to manage delay for spawning
//     let canSpawn = true;
//     const spawnDelay = 500; // Delay in milliseconds

//     gravityOptions.forEach(option => {
//         // Add hover effect (mouse enter)
//         option.addEventListener("mouseenter", () => {
//             option.setAttribute("material", {
//                 color: "#FFD700", // Gold hover color
//                 opacity: 0.5,
//                 emissive: "#FFD700",
//                 emissiveIntensity: 0.5,
//             });
//         });

//         // Remove hover effect (mouse leave)
//         option.addEventListener("mouseleave", () => {
//             option.setAttribute("material", {
//                 opacity: 0, // Reset to transparent
//                 emissive: "#000",
//                 emissiveIntensity: 0,
//             });
//         });

//         // Add click event to spawn shapes
//         option.addEventListener("click", (event) => {
//             if (!canSpawn) return; // Prevent spawning if delay is active
//             canSpawn = false;

//             // Get the shape type from the clicked element's data attribute
//             const shape = event.target.getAttribute("data-shape");

//             // Create a new <a-entity> for the shape
//             const shapeEntity = document.createElement("a-entity");
//             shapeEntity.setAttribute("position", "1 2 3.6");
//             shapeEntity.setAttribute("scale", "0.5 0.5 0.5");
//             shapeEntity.setAttribute("my-model");
//             shapeEntity.setAttribute("geometry", { primitive: shape });
//             shapeEntity.setAttribute("material", {
//                 color: "#FF6347", // Example color (tomato)
//                 opacity: 0.9,
//             });
//             shapeEntity.setAttribute("hoverable", "");   // Enables hover interaction
//             shapeEntity.setAttribute("grabbable", "");   // Enables grabbing
//             shapeEntity.setAttribute("stretchable", ""); // Enables stretching
//             shapeEntity.setAttribute("draggable", "");   // Enables dragging
//             shapeEntity.setAttribute("droppable", "");   // Enables dropping

//             // Create the <a-box> inside the shape entity
//             const boxEntity = document.createElement("a-box");
//             boxEntity.setAttribute("position", "0 0 0"); // Position it inside the shape
//             boxEntity.setAttribute("scale", "0.5 0.5 0.5");
//             boxEntity.setAttribute("id", "infoshape");
//             boxEntity.setAttribute("color", "#00FF00"); // Example color for the box
//             boxEntity.setAttribute("my-model",'0'); 
//             boxEntity.setAttribute("material","opacity: 0; transparent: true");

        

//             // Append the box inside the shape
//             shapeEntity.appendChild(boxEntity);

//             // Assign a random mass between 0.4 and 5
//             const randomMass = (Math.random() * (5 - 0.4) + 0.4).toFixed(2); // Random value with 2 decimal places
//             shapeEntity.setAttribute("dynamic-body", { mass: randomMass });

//             // Add the shape to the scene
//             const scene = document.querySelector("a-scene");
//             scene.appendChild(shapeEntity);

//             // Reset the spawn flag after the delay
//             setTimeout(() => {
//                 canSpawn = true;
//             }, spawnDelay);
//         });
//     });
// });


// document.addEventListener("DOMContentLoaded", () => {
//     // Get all elements with the class 'shape-option'
//     const gravityOptions = document.querySelectorAll(".shape-option");
  
//     // Variable to manage delay for spawning
//     let canSpawn = true;
//     const spawnDelay = 500; // Delay in milliseconds
  
//     // Function to generate a random hex color
//     const getRandomColor = () => {
//       const letters = "0123456789ABCDEF";
//       let color = "#";
//       for (let i = 0; i < 6; i++) {
//         color += letters[Math.floor(Math.random() * 16)];
//       }
//       return color;
//     };
  
//     gravityOptions.forEach((option) => {
//       // Add hover effect (mouse enter)
//       option.addEventListener("mouseenter", () => {
//         option.setAttribute("material", {
//           color: "#FFD700", // Gold hover color
//           opacity: 0.5,
//           emissive: "#FFD700",
//           emissiveIntensity: 0.5,
//         });
//       });
  
//       // Remove hover effect (mouse leave)
//       option.addEventListener("mouseleave", () => {
//         option.setAttribute("material", {
//           opacity: 0, // Reset to transparent
//           emissive: "#000",
//           emissiveIntensity: 0,
//         });
//       });
  
//       // Add click event to spawn shapes
//       option.addEventListener("click", (event) => {
//         if (!canSpawn) return; // Prevent spawning if delay is active
//         canSpawn = false;
  
//         // Get the shape type from the clicked element's data attribute
//         const shapeType = event.target.getAttribute("data-shape");
  
//         // Create the specific shape element
//         const shapeElement = document.createElement("a-entity");
//         shapeElement.setAttribute("geometry", {
//           primitive: shapeType, // Set the geometry primitive dynamically
//         });
//         shapeElement.setAttribute("position", "1 2 3.6");
//         shapeElement.setAttribute("scale", "0.5 0.5 0.5");
//         shapeElement.setAttribute("material", {
//           color: getRandomColor(), // Set random color
//           opacity: 0.7, // Semi-transparent for text visibility
//         });
//         shapeElement.setAttribute("hoverable", ""); // Enables hover interaction
//         shapeElement.setAttribute("grabbable", ""); // Enables grabbing
//         shapeElement.setAttribute("stretchable", ""); // Enables stretching
//         shapeElement.setAttribute("draggable", ""); // Enables dragging
//         shapeElement.setAttribute("droppable", ""); // Enables dropping
  
//         // Assign a random mass between 0.4 and 5
//         const randomMass = (Math.random() * (5 - 0.4) + 0.4).toFixed(2); // Random value with 2 decimal places
//         shapeElement.setAttribute("dynamic-body", { mass: randomMass });
  
//         // Create an <a-text> element to display the mass
//         const textElement = document.createElement("a-text");
//         textElement.setAttribute("value", `${randomMass} kg`); // Display mass in kg format
//         textElement.setAttribute("align", "center");
//         textElement.setAttribute("color", "#000"); // Black text for visibility
//         textElement.setAttribute("position", "0 0 0.1"); // Slightly in front of the shape
//         textElement.setAttribute("scale", "1.5 1.5 1.5"); // Larger text size
//         textElement.setAttribute("rotation", "0 -180 0");
//         // Append the text element to the shape
//         shapeElement.appendChild(textElement);
  
//         // Add the shape to the scene
//         const scene = document.querySelector("a-scene");
//         scene.appendChild(shapeElement);
  
//         // Reset the spawn flag after the delay
//         setTimeout(() => {
//           canSpawn = true;
//         }, spawnDelay);
//       });
//     });
//   });
  
  

document.addEventListener("DOMContentLoaded", () => {
    const gravityOptions = document.querySelectorAll(".shape-option");

    let canSpawn = true;
    const spawnDelay = 500;

    const getRandomColor = () => {
        const letters = "0123456789ABCDEF";
        let color = "#";
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    gravityOptions.forEach((option) => {
        option.addEventListener("mouseenter", () => {
            option.setAttribute("material", {
                color: "#FFD700",
                opacity: 0.5,
                emissive: "#FFD700",
                emissiveIntensity: 0.5,
            });
        });

        option.addEventListener("mouseleave", () => {
            option.setAttribute("material", {
                opacity: 0,
                emissive: "#000",
                emissiveIntensity: 0,
            });
        });

        option.addEventListener("click", (event) => {
            if (!canSpawn) return;
            canSpawn = false;

            const shapeType = event.target.getAttribute("data-shape");
            let shapeElement;

            if (shapeType === "box") {
                shapeElement = document.createElement("a-box");
            } else if (shapeType === "sphere") {
                shapeElement = document.createElement("a-sphere");
            } else if (shapeType === "cylinder") {
                shapeElement = document.createElement("a-cylinder");
            } else if (shapeType === "cone") {
                shapeElement = document.createElement("a-cone");
            }

            shapeElement.setAttribute("position", "1 2 3.6");
            shapeElement.setAttribute("scale", "0.5 0.5 0.5");
            shapeElement.setAttribute("material", {
                color: getRandomColor(),
                opacity: 0.7,
            });
            shapeElement.setAttribute("hoverable", "");
            shapeElement.setAttribute("grabbable", "");
            shapeElement.setAttribute("stretchable", "");
            shapeElement.setAttribute("draggable", "");
            shapeElement.setAttribute("droppable", "");
            shapeElement.setAttribute("track-velocity", ""); 
            shapeElement.setAttribute("id", `${shapeType.toUpperCase()}`); 

            const randomMass = (Math.random() * (10 - 0.4) + 0.4).toFixed(2);

            // Set proper dynamic-body shape for different types
            if (shapeType === "sphere") {
                shapeElement.setAttribute("dynamic-body", {
                    mass: randomMass,
                    shape: "sphere",
                });
            } else if (shapeType === "cylinder") {
                shapeElement.setAttribute("dynamic-body", {
                    mass: randomMass,
                    shape: "cylinder",
                });
            } else if (shapeType === "cone") {
                shapeElement.setAttribute("dynamic-body", {
                    mass: randomMass,
                    shape: "cylinder", // Cone approximation
                });
            } else {
                shapeElement.setAttribute("dynamic-body", {
                    mass: randomMass,
                    shape: "box",
                });
            }

            const textElement = document.createElement("a-text");
            textElement.setAttribute("value", `${shapeType.toUpperCase()}\n${randomMass} kg`);  
            textElement.setAttribute("align", "center");
            textElement.setAttribute("color", "#000");
            textElement.setAttribute("position", "0 0 0");
            textElement.setAttribute("scale", "0.5 0.5 0.5");
            textElement.setAttribute("follow-camera-instruction", "");
            shapeElement.appendChild(textElement);

            const scene = document.querySelector("a-scene");
            scene.appendChild(shapeElement);

            setTimeout(() => {
                canSpawn = true;
            }, spawnDelay);
        });
    });
});

// Updated track-velocity component
AFRAME.registerComponent("track-velocity", {
    init: function () {
        const el = this.el;
        const textElement = el.querySelector("a-text");

        // Check if the text element exists
        if (!textElement) {
            console.error("Text element not found in the shape.");
            return;
        }

        // Listen for the 'tick' event to update velocity in real-time
        this.el.sceneEl.addEventListener("tick", () => {
            if (el.body && textElement) {
                const velocity = el.body.velocity; // Get the velocity of the entity
                const velocityText = `Velocity: x=${velocity.x.toFixed(2)}, y=${velocity.y.toFixed(2)}, z=${velocity.z.toFixed(2)}`;

                // Update the text element with the live velocity values
                textElement.setAttribute("value", `${el.id}\n${velocityText}`);
            }
        });
    }
});


