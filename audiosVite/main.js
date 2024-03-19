import audio from './public/audio.mp3';


const audioPlayer = document.getElementById("audio-player");
const playButton = document.getElementById("play-button");
const stopButton = document.getElementById("stop-button");

window.onload = function () {
    audioPlayer.src = audio; // Cambiar por la URL del primer archivo
    audioPlayer.play();
};
// Función para reproducir el audio al hacer clic en el botón "Reproducir"
playButton.addEventListener("click", function () {
    audioPlayer.play();
});

// Función para detener el audio al hacer clic en el botón "Detener"
stopButton.addEventListener("click", function () {
    audioPlayer.pause();
    // audioPlayer.currentTime = 0; // Reinicia el tiempo de reproducción
});

// Función para cambiar de audio al finalizar el actual (opcional)
audioPlayer.addEventListener("ended", function () {
    audioPlayer.src = audio;
    audioPlayer.currentTime = 0;
    audioPlayer.pause();
});


var player;
function onYouTubeIframeAPIReady() {
    var ctrlq = document.getElementById("youtube-audio");
    ctrlq.innerHTML =
        '<img id="youtube-icon" src=""/><div id="youtube-player"></div>';
    ctrlq.style.cssText =
        "width:150px;margin:2em auto;cursor:pointer;cursor:hand;display:none";
    ctrlq.onclick = toggleAudio;

    player = new YT.Player("youtube-player", {
        height: "0",
        width: "0",
        videoId: ctrlq.dataset.video,
        playerVars: {
            autoplay: ctrlq.dataset.autoplay,
            loop: ctrlq.dataset.loop,
        },
        events: {
            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange,
        },
    });
}

function togglePlayButton(play) {
    document.getElementById("youtube-icon").src = play
        ? "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExMTVnbG90dXQyNWV6ZTI3Z2xjNmt1bzBpdTlrdTh0c3I1NWJxY3h3ayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xUA7b7pqJWvb4VBoLm/giphy.gif"
        : "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExdGdhY3E0d2VvMXZpZmxsbm9vM3hoNjJwZHA1bzJlbGZzYjd5ZWd4NCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7ZeLr01g0kAk4K6Q/giphy.gif";
}

function toggleAudio() {
    if (player.getPlayerState() == 1 || player.getPlayerState() == 3) {
        player.pauseVideo();
        togglePlayButton(false);
    } else {
        player.playVideo();
        togglePlayButton(true);
    }
}

function onPlayerReady(event) {
    player.setPlaybackQuality("small");
    document.getElementById("youtube-audio").style.display = "block";
    togglePlayButton(player.getPlayerState() !== 5);
}

function onPlayerStateChange(event) {
    if (event.data === 0) {
        togglePlayButton(false);
    }
}



