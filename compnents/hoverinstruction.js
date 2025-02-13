AFRAME.registerComponent('hover-info-1', {
    init: function () {
      // Create a plane for the pop-up
      const infoPlane = document.createElement('a-plane');
      infoPlane.setAttribute('color', '#FFF');
      infoPlane.setAttribute('follow-camera-instruction','');
      infoPlane.setAttribute('width', '2');
      infoPlane.setAttribute('height', '1');
      infoPlane.setAttribute('scale','1.550 0.510 0.740')
      infoPlane.setAttribute('position', '0 0.728 0');
      infoPlane.setAttribute('visible', 'false');
      infoPlane.setAttribute('text', {
        value: 'Hello Eystien! I\'m here to assist you with Newton\'s Laws of Motion. To get started, you can watch this video to learn about the basic principles of Newton\'s laws. 😊',
        align: 'center',
        color: '#000'
      });

      // Append plane to the box
      this.el.appendChild(infoPlane);

      // Show the plane on mouseenter
      this.el.addEventListener('mouseenter', () => {
        infoPlane.setAttribute('visible', 'true');
      });

      // Hide the plane on mouseleave
      this.el.addEventListener('mouseleave', () => {
        infoPlane.setAttribute('visible', 'false');
      });
    }
  });
AFRAME.registerComponent('hover-info-2', {
    init: function () {
      // Create a plane for the pop-up
      const infoPlane = document.createElement('a-plane');
      infoPlane.setAttribute('color', '#FFF');
      infoPlane.setAttribute('follow-camera-instruction','');
      infoPlane.setAttribute('width', '2');
      infoPlane.setAttribute('height', '1');
      infoPlane.setAttribute('scale','1.550 0.510 0.740')
      infoPlane.setAttribute('position', '0 0.728 0');
      infoPlane.setAttribute('visible', 'false');
      infoPlane.setAttribute('text', {
        value: 'Hello Eystien! I\'m here to assist you with Collision: Demonstrate the conservation of momentum by colliding two balls of different masses on a track. Measure their velocities before and after the collision to show that the total momentum is conserved.',
        align: 'center',
        color: '#000'
      });

      // Append plane to the box
      this.el.appendChild(infoPlane);

      // Show the plane on mouseenter
      this.el.addEventListener('mouseenter', () => {
        infoPlane.setAttribute('visible', 'true');
      });

      // Hide the plane on mouseleave
      this.el.addEventListener('mouseleave', () => {
        infoPlane.setAttribute('visible', 'false');
      });
    }
  });
AFRAME.registerComponent('hover-info-3', {
    init: function () {
      // Create a plane for the pop-up
      const infoPlane = document.createElement('a-plane');
      infoPlane.setAttribute('color', '#FFF');
      infoPlane.setAttribute('follow-camera-instruction','');
      infoPlane.setAttribute('width', '2');
      infoPlane.setAttribute('height', '1');
      infoPlane.setAttribute('scale','1.550 0.510 0.740')
      infoPlane.setAttribute('position', '0 0.728 0');
      infoPlane.setAttribute('visible', 'false');
      infoPlane.setAttribute('text', { value: 'Hello Eystien! I\'m here to assist you with Newton\'s Laws of Motion. To get started, you can watch this video to learn about the basic principles of Newton\'s laws. 😊', align: 'center',color: '#000'});

      // Append plane to the box
      this.el.appendChild(infoPlane);

      // Show the plane on mouseenter
      this.el.addEventListener('mouseenter', () => {
        infoPlane.setAttribute('visible', 'true');
      });

      // Hide the plane on mouseleave
      this.el.addEventListener('mouseleave', () => {
        infoPlane.setAttribute('visible', 'false');
      });
    }
  });
AFRAME.registerComponent('hover-info-4', {
    init: function () {
      // Create a plane for the pop-up
      const infoPlane = document.createElement('a-plane');
      infoPlane.setAttribute('color', '#FFF');
      infoPlane.setAttribute('follow-camera-instruction','');
      infoPlane.setAttribute('width', '2');
      infoPlane.setAttribute('height', '1');
      infoPlane.setAttribute('scale','1.550 0.510 0.740')
      infoPlane.setAttribute('position', '0 0.728 0');
      infoPlane.setAttribute('visible', 'false');
      infoPlane.setAttribute('text', {
        value: 'Hello Eystien! I\'m here to assist you with Newton\'s Laws of Motion. To get started, you can watch this video to learn about the basic principles of Newton\'s laws. 😊',
        align: 'center',
        color: '#000'
      });

      // Append plane to the box
      this.el.appendChild(infoPlane);

      // Show the plane on mouseenter
      this.el.addEventListener('mouseenter', () => {
        infoPlane.setAttribute('visible', 'true');
      });

      // Hide the plane on mouseleave
      this.el.addEventListener('mouseleave', () => {
        infoPlane.setAttribute('visible', 'false');
      });
    }
  });
AFRAME.registerComponent('hover-info-5', {
    init: function () {
      // Create a plane for the pop-up
      const infoPlane = document.createElement('a-plane');
      infoPlane.setAttribute('color', '#FFF');
      infoPlane.setAttribute('follow-camera-instruction','');
      infoPlane.setAttribute('width', '2');
      infoPlane.setAttribute('height', '1');
      infoPlane.setAttribute('scale','1.550 0.510 0.740')
      infoPlane.setAttribute('position', '0 0.728 0');
      infoPlane.setAttribute('visible', 'false');
      infoPlane.setAttribute('text', {
        value: 'Hello Eystien! I\'m here to assist you with Newton\'s Laws of Motion. To get started, you can watch this video to learn about the basic principles of Newton\'s laws. 😊',
        align: 'center',
        color: '#000'
      });

      // Append plane to the box
      this.el.appendChild(infoPlane);

      // Show the plane on mouseenter
      this.el.addEventListener('mouseenter', () => {
        infoPlane.setAttribute('visible', 'true');
      });

      // Hide the plane on mouseleave
      this.el.addEventListener('mouseleave', () => {
        infoPlane.setAttribute('visible', 'false');
      });
    }
  });




  AFRAME.registerComponent("follow-camera-instruction", {
    tick: function () {
      const camera = document.querySelector("#camera");
      const plane = this.el;
  
      // Get the camera's world position
      const cameraWorldPos = new THREE.Vector3();
      camera.object3D.getWorldPosition(cameraWorldPos);
  
      // Get the plane's world position
      const planeWorldPos = new THREE.Vector3();
      plane.object3D.getWorldPosition(planeWorldPos);
  
      // Calculate the direction vector from plane to camera
      const direction = cameraWorldPos.clone().sub(planeWorldPos).normalize();
  
      // Set the rotation to face the camera
      plane.object3D.lookAt(cameraWorldPos);
    },
  });