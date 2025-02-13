AFRAME.registerComponent("my-model", {
    init: function () {
      // Create a plane for the pop-up
      const infoShape = document.createElement('a-plane');
      infoShape.setAttribute('color', '#FFF');
      infoShape.setAttribute('follow-camera-instruction', '');
      infoShape.setAttribute('width', '2');
      infoShape.setAttribute('height', '2');
      infoShape.setAttribute('scale', '1 1 1'); // Fixed scale
      infoShape.setAttribute('position', '0 0.728 0');
      infoShape.setAttribute('visible', 'false');
      infoShape.setAttribute('text', {
        value: 'Hello Eystien! I\'m here to assist you with Newton\'s Laws of Motion. To get started, you can watch this video to learn about the basic principles of Newton\'s laws. 😊',
        align: 'center',
        color: '#000'
      });
  
      // Append plane to the entity
      this.el.appendChild(infoShape);
  
      // Show the plane on mouseenter
      this.el.addEventListener('mouseenter', () => {
        infoShape.setAttribute('visible', 'true');
      });
  
      // Hide the plane on mouseleave
      this.el.addEventListener('mouseleave', () => {
        infoShape.setAttribute('visible', 'false');
      });
    }
  });
  