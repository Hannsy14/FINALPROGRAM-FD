// // Function to pause all videos except the currently interacted one
// function pauseOtherVideos(currentVideoId) {
//   const videos = document.querySelectorAll("video");
//   videos.forEach((video) => {
//     if (video.id !== currentVideoId && !video.paused) {
//       video.pause();
//       console.log(`Paused ${video.id}`);
//     }
//   });
// }

// // Generic function to handle video clicks
// function handleVideoClick(videoId, clickableClass) {
//   const clickableElement = document.querySelector(clickableClass);
//   const videoElement = document.querySelector(videoId);

//   if (!clickableElement || !videoElement) {
//     console.error(`Error: Missing clickable element or video element for ${videoId}`);
//     return;
//   }

//   clickableElement.addEventListener("click", () => {
//     console.log(`${videoId} interactive box clicked!`);

//     // Check if the video is paused
//     if (videoElement.paused) {
//       // Pause other videos first
//       pauseOtherVideos(videoId.replace("#", ""));

//       // Play the current video
//       videoElement
//         .play()
//         .then(() => {
//           console.log(`${videoId} is now playing.`);
//         })
//         .catch((error) => {
//           console.error(`${videoId} play failed:`, error);
//         });
//     } else {
//       // Pause the current video
//       videoElement.pause();
//       console.log(`${videoId} is paused.`);
//     }
//   });
// }

// // Apply the generic handler to all videos
// handleVideoClick("#video1", ".clickable");
// handleVideoClick("#video2", ".clickable2");
// handleVideoClick("#video3", ".clickable3");
// handleVideoClick("#video4", ".clickable4");

document.addEventListener("DOMContentLoaded", () => {
    // Array of video and clickable box IDs
    const videoBoxPairs = [
      { videoId: "#video1", boxId: "#clickable1" },
      { videoId: "#video2", boxId: "#clickable2" },
      { videoId: "#video3", boxId: "#clickable3" },
      { videoId: "#video4", boxId: "#clickable4" },
      { videoId: "#video5", boxId: "#clickable5" },
    ];
  
    // Loop through each pair and set up event listeners
    videoBoxPairs.forEach(pair => {
      const videoElement = document.querySelector(pair.videoId);
      const clickableBox = document.querySelector(pair.boxId);
  
      if (videoElement && clickableBox) {
        clickableBox.addEventListener("click", () => {
          if (videoElement.paused) {
            videoElement.play(); // Play the video
          } else {
            videoElement.pause(); // Pause the video if it's already playing
          }
        });
      } else {
        console.error(`Missing video or clickable box for IDs: ${pair.videoId}, ${pair.boxId}`);
      }
    });
  });
   

