
document.addEventListener("DOMContentLoaded", () => {
    // Get all elements with the class 'gravity-option'
    const gravityOptions = document.querySelectorAll(".gravity-option");

    gravityOptions.forEach(option => {
        // Add hover effect (mouse enter)
        option.addEventListener("mouseenter", () => {
            option.setAttribute("material", {
                color: "#FFD700", // Gold hover color
                opacity: 0.5,
                emissive: "#FFD700",
                emissiveIntensity: 0.5,
            });
        });

        // Remove hover effect (mouse leave)
        option.addEventListener("mouseleave", () => {
            option.setAttribute("material", {
                opacity: 0, // Reset to transparent
                emissive: "#000",
                emissiveIntensity: 0,
            });
        });

        // Add click event for gravity change
        option.addEventListener("click", () => {
            // Get the gravity value from the data attribute
            const gravityValue = option.getAttribute("data-gravity");

            // Update the gravity in the physics system
            const scene = document.querySelector('a-scene');
            scene.setAttribute('physics', `debug: true; gravity: ${gravityValue}; maxSubSteps: 2; fixedTimeStep: 1/60; iterations: 10;`);
        });
    });
});

