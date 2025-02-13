  // Component to handle clicks and spawn entities
  AFRAME.registerComponent('click-handler', {
    schema: {
      spawn: { type: 'string' }, // Specify the entity type to spawn
      delay: { type: 'number', default: 1000 } // Delay in milliseconds (1 second)
    },
    init: function () {
      let isClickable = true;  // Flag to track if it's okay to click
      
      this.el.addEventListener('click', () => {
        if (isClickable) {
          isClickable = false; // Disable further clicks
          const spawner = document.querySelector('#entity-spawner');
          
          // Handle spawning the specified entity
          if (this.data.spawn === 'car') {
            const carEntity = document.createElement('a-box');
            carEntity.setAttribute('position', '0 0 0');
            carEntity.setAttribute('scale', '1 1 0.940');
            carEntity.setAttribute('dynamic-body', '');
            carEntity.setAttribute('hoverable', '');
            carEntity.setAttribute('grabbable', '');
            carEntity.setAttribute('stretchable', '');
            carEntity.setAttribute('draggable', '');
            carEntity.setAttribute('droppable', '');
            carEntity.setAttribute('geometry', 'depth: 0.61; height: 0.57; width: 1.1');
            carEntity.setAttribute('material', 'opacity: 0; transparent: true');

            // Add the car GLTF model
            const carModel = document.createElement('a-entity');
            carModel.setAttribute('id', 'car');
            carModel.setAttribute('gltf-model', 'assets/models/car.glb');
            carModel.setAttribute('scale', '0.002 0.002 0.002');
            carModel.setAttribute('position', '0 -0.240 0');
            carModel.setAttribute('animation-mixer', 'clip: Car engine; clampWhenFinished: true');

            carEntity.appendChild(carModel);
            spawner.appendChild(carEntity);
          }

          // Re-enable clicking after the delay
          setTimeout(() => {
            isClickable = true;
          }, this.data.delay);
        }
      });
    }
  });