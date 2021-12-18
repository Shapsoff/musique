'use strict'

var audio = document.getElementById("audioHTML");
  

function playAudio() {
    audio.play();

    var context = new AudioContext(); // <-- cause probleme de son
    //rendre manipulable
    var src = context.createMediaElementSource(audio);
    //prendre les données du son "grave, aigu, etc"
    var analyser = context.createAnalyser();

    var canvas = document.getElementById("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    //permet de dessiner dans le canvas \/
    var ctx = canvas.getContext("2d");

    src.connect(analyser);
    analyser.connect(context.destination);

    //un nombre entier non signé qui représente la taille de la FFT (transfomation de Fourier rapide) à utiliser pour déterminer le domaine fréquentiel.
    analyser.fftSize = 256;
    //nombre de valeurs que vous aurez à manipuler pour la visualisation
    var bufferLength = analyser.frequencyBinCount;
    console.log(bufferLength);
    
    //on peut manipuler ses différents éléments grâce aux méthodes de l'objet ou grâce à la notation usuelle (avec les crochets)
    var dataArray = new Uint8Array(bufferLength);

    var WIDTH = canvas.width;
    var HEIGHT = canvas.height;

    var barWidth = (WIDTH / bufferLength) * 2.5;
    var barHeight;
    var x = 0;

    function renderFrame() {
      requestAnimationFrame(renderFrame);

      x = 0;

      analyser.getByteFrequencyData(dataArray);

      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      for (var i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i];
        
        var r = barHeight + (25 * (i/bufferLength));
        var g = 250 * (i/bufferLength);
        var b = 50;

        ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
        ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

        x += barWidth + 1;
      }
    }

    audio.play();
    renderFrame();
   }