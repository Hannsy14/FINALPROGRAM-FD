AFRAME.registerComponent('grabbable', {
    init: function () {
      var el = this.el;
      el.addEventListener('mousedown', function () {
        el.setAttribute('color', '#EF2D5E'); // Change color on grab
      });
      el.addEventListener('mouseup', function () {
        el.setAttribute('color', '#4CC3D9'); // Revert color on release
      });
    }
  });