AFRAME.registerComponent("error-handler", {
  init: function () {
    this.el.addEventListener("componentinitialized", function (evt) {
      console.log("Component " + evt.detail.name + " initialized");
    });

    this.el.addEventListener("componentremoved", function (evt) {
      console.log("Component " + evt.detail.name + " removed");
    });
  },
});
