/*
 * Video Popup - Styling
 * Copyright AppSeed (https://appseed.us)
 * License MIT
 */

"use strict";

// Add code HERE
if (!localStorage.getItem("videoModalView"))
  localStorage.setItem("videoModalView", "fullscreen-mode");

if (!localStorage.getItem("videoModalFlag"))
  localStorage.setItem("videoModalFlag", "false");

if (localStorage.getItem("videoModalView") == "smallscreen-mode")
  document.body.classList.add("smallscreen-mode");

if (localStorage.getItem("videoUrl"))
  document
    .getElementById("video")
    .setAttribute("src", localStorage.getItem("videoUrl") + "?enablejsapi=1");

function toggleView() {
  if (localStorage.getItem("videoModalView") == "fullscreen-mode") {
    localStorage.setItem("videoModalView", "smallscreen-mode");
    document.body.classList.add("smallscreen-mode");
  } else {
    localStorage.setItem("videoModalView", "fullscreen-mode");
    document.body.classList.remove("smallscreen-mode");
  }
}

// Set url in local storage
var videoPopupBtns = document.getElementsByClassName("video-popup-btn");
for (var i = 0; i < videoPopupBtns.length; i++) {
  var videoPopupBtn = videoPopupBtns[i];
  videoPopupBtn.onclick = function () {
    if (
      localStorage.getItem("videoUrl") != this.getAttribute("data-video-url")
    ) {
      localStorage.setItem("videoUrl", this.getAttribute("data-video-url"));
      document
        .getElementById("video")
        .setAttribute(
          "src",
          localStorage.getItem("videoUrl") + "?enablejsapi=1"
        );
      clearInterval(myVideoTimer);
      localStorage.setItem("videoModalTime", 0);
      myVideoTimer = setInterval(function () {
        localStorage.setItem("videoModalTime", player.getCurrentTime());
      }, 1000);
    }
    myModal.show(myVideoModal);
  };
}

// global variable for the player
var player;

// this function gets called when API is ready to use
function onYouTubePlayerAPIReady() {
  player = new YT.Player("video", {
    events: {
      onReady: onPlayerReady,
    },
  });
}

var myModal = new bootstrap.Modal("#video-modal");
var myVideoModal = document.getElementById("video-modal");
var myVideoTimer;

function onPlayerReady(event) {
  myVideoModal.addEventListener("shown.bs.modal", (event) => {
    localStorage.setItem("videoModalFlag", "true");
    player.playVideo();
    myVideoTimer = setInterval(function () {
      localStorage.setItem("videoModalTime", player.getCurrentTime());
    }, 1000);
  });
  myVideoModal.addEventListener("hide.bs.modal", (event) => {
    localStorage.setItem("videoModalFlag", "false");
    player.pauseVideo();
    clearInterval(myVideoTimer);
  });

  // Video Modal resume on refresh
  if (
    localStorage.getItem("videoModalView") == "smallscreen-mode" &&
    localStorage.getItem("videoModalFlag") == "true"
  ) {
    myModal.show(myVideoModal);
    player.seekTo(localStorage.getItem("videoModalTime"), true);
  }
}

// Inject YouTube API script
var tag = document.createElement("script");
tag.src = "//www.youtube.com/player_api";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
