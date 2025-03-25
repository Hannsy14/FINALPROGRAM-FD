document.addEventListener("DOMContentLoaded", () => {
  // Array of video and clickable box IDs
  const videoBoxPairs = [
    { videoId: "#video1", boxId: "#clickable1" },
    { videoId: "#video2", boxId: "#clickable2" },
    { videoId: "#video3", boxId: "#clickable3" },
    { videoId: "#video4", boxId: "#clickable4" },
    { videoId: "#video5", boxId: "#clickable5" },
  ];

  videoBoxPairs.forEach((pair) => {
    const videoElement = document.querySelector(pair.videoId);
    const clickableBox = document.querySelector(pair.boxId);
    const videoPlane = document.querySelector("#video-plane");

    if (videoElement && clickableBox && videoPlane) {
      clickableBox.addEventListener("click", () => {
        // Update the video plane's material
        videoPlane.setAttribute("material", "src", pair.videoId);

        if (videoElement.paused) {
          videoElement.play();
        } else {
          videoElement.pause();
        }
      });
    } else {
      console.error(`Missing elements for: ${pair.videoId}, ${pair.boxId}`);
    }
  });
});
