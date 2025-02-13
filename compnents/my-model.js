AFRAME.registerComponent("my-model", {
  schema: {},

  init: function () {
    this.el.addEventListener("model-loaded", function (evt) {
      const model = evt.detail.model;

      if (!model) {
        console.error("Model is undefined or failed to load.");
        return;
      }

      if (typeof model.traverse !== "function") {
        console.error("Model does not support traverse method.");
        return;
      }

      model.traverse((node) => {
        if (node.isMesh) {
          if (node.material instanceof THREE.MeshStandardMaterial) {
            // console.log("Material is THREE.MeshStandardMaterial");
          } else {
            // console.log("Material is not THREE.MeshStandardMaterial");
          }
        }
      });
    });
  },

  update: function () {
    // Do something when component's data is updated.
  },

  remove: function () {
    // Do something when the component or its entity is detached.
  },

  tick: function (time, timeDelta) {
    // Do something on every scene tick or frame.
  },
});
