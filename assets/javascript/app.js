$(".output").hide();
$("#mediaId").hide();
$("#retakeBtn").hide();


(function() {
    // The width and height of the captured photo. We will set the
    // width to the value defined here, but the height will be
    // calculated based on the aspect ratio of the input stream.

    var width = 320;    // We will scale the photo width to this
    var height = 0;     // This will be computed based on the input stream

    // |streaming| indicates whether or not we're currently streaming
    // video from the camera. Obviously, we start at false.

    var streaming = false;

    // The various HTML elements we need to configure or control. These
    // will be set by the startup() function.

    var video = null;
    var canvas = null;
    var photo = null;
    var startbutton = null;

    function startup() {
      video = document.getElementById('video');
      canvas = document.getElementById('canvas');
      photo = document.getElementById('selfie');
      startbutton = document.getElementById('startbutton');

      navigator.mediaDevices.getUserMedia({video: true, audio: false})
      .then(function(stream) {
        video.srcObject = stream;
        video.play();
      })
      .catch(function(err) {
        console.log("An error occurred: " + err);
      });

      video.addEventListener('canplay', function(ev){
        if (!streaming) {
          height = video.videoHeight / (video.videoWidth/width);

          // Firefox currently has a bug where the height can't be read from
          // the video, so we will make assumptions if this happens.

          if (isNaN(height)) {
            height = width / (4/3);
          }

          video.setAttribute('width', width);
          video.setAttribute('height', height);
          canvas.setAttribute('width', width);
          canvas.setAttribute('height', height);
          streaming = true;
        }
      }, false);

      startbutton.addEventListener('click', function(ev){
        takepicture();
        ev.preventDefault();
      }, false);

      clearphoto();
    }

    // Fill the photo with an indication that none has been
    // captured.

    function clearphoto() {
      var context = canvas.getContext('2d');
      context.fillStyle = "#AAA";
      context.fillRect(0, 0, canvas.width, canvas.height);

      var data = canvas.toDataURL('image/png');
      photo.setAttribute('src', data);
    }

    // Capture a photo by fetching the current contents of the video
    // and drawing it into a canvas, then converting that to a PNG
    // format data URL. By drawing it on an offscreen canvas and then
    // drawing that to the screen, we can change its size and/or apply
    // other changes before drawing it.

    function takepicture() {
      var context = canvas.getContext('2d');
      if (width && height) {
        canvas.width = width;
        canvas.height = height;
        context.drawImage(video, 0, 0, width, height);

        var data = canvas.toDataURL('image/png');
        photo.setAttribute('src', data);
        console.log(photo)
      } else {
        clearphoto();
      }
    }

    // Set up our event listener to run the startup process
    // once loading is complete.
    window.addEventListener('load', startup, false);
  })();

  //API to get a joke
  function getJokes(){
    let jokeURL = "https://sv443.net/jokeapi/category/programming"

    $.ajax({
        url: jokeURL,
        method: "GET",
    }).then(function(response){
        console.log(JSON.stringify(response));
        let joke = response.joke;
        let twoPart =
        `Setup: ${response.setup} <br>
        Delivery: ${response.delivery}`;

        $("#joke").html(joke || twoPart);
    });
    console.log(jokeURL);

  };

  // API that pulls music

function musicURL(){
  letmusicURL = "SpotifyPublicAPIdimasV1.p.rapidapi.com"

  $.ajax({
  url: musicURL,
  method: "GET",
  }).then(function(response){
  console.log(JSON.stringify(response));
  let music = response.music;

  //We need to create a 'div' with an ID of 'music'

  $("#music").html(music);
  });
  console.log(musicURL);
  }

  // function readImage() {
  
  //   let filesSelected = document.getElementById("selfie").files;
  //   if (filesSelected.length > 0) {
  //     let fileToLoad = filesSelected[0];
  
  //     let fileReader = new FileReader();
  
  //     fileReader.onload = function(fileLoadedEvent) {
  //       srcData = fileLoadedEvent.target.result; // <--- data: base64
  
  //       let newImage = document.createElement('img');
  //       newImage.src = srcData;
  
  //       document.getElementById("imgDisplay").innerHTML = newImage.outerHTML;
  //     }
  //     fileReader.readAsDataURL(fileToLoad);
  //   }
  // }


  //Declared selEMotion to make global
  let selEmotion;

  function faceEmotion() {
    let selfieImg = $("#selfie").attr("src");

    console.log(selfieImg);
  
    $.ajax({
      url: "https://api-us.faceplusplus.com/facepp/v3/detect",
      method: "POST",
      data: {api_key: "pieTMPdJke7_Im-gUG0sIetqrMESk7Jl", api_secret: "52wvsEmp0s22NTWTP7hxgJbTIdwu7p1I", image_base64: selfieImg, return_attributes: "emotion,gender,age"},
      dataType: "json",
      error: faceEmotion
    }).then(function(response) {
  
      let json = JSON.stringify(response);
      let resultObject = JSON.parse(json);
      console.log(resultObject);
  
      let sadness = resultObject.faces[0].attributes.emotion.sadness;
      let neutral = resultObject.faces[0].attributes.emotion.neutral;
      let disgust = resultObject.faces[0].attributes.emotion.disgust;
      let anger = resultObject.faces[0].attributes.emotion.anger;
      let surprise = resultObject.faces[0].attributes.emotion.surprise;
      let fear = resultObject.faces[0].attributes.emotion.fear;
      let happiness = resultObject.faces[0].attributes.emotion.happiness;

    //   let gender = resultObject.faces[0].attributes.gender.value;
    //   let age = resultObject.faces[0].attributes.age.value;
  
      console.log("Sadness: " + sadness);
      console.log("Neutral: " + neutral);
      console.log("Disgust: " + disgust);
      console.log("Anger: " + anger);
      console.log("Surprise: " + surprise);
      console.log("Fear: " + fear);
      console.log("Happiness: " + happiness);
      
      //selEmotion was change to the corresponding emotion recieved from API
      if (sadness > neutral && sadness > happiness) {
       console.log("sad life, cheer up");
       console.log("Sadness: " + sadness);
       selEmotion = "sad";
       $("#emotionOutput").html(`You look ${selEmotion}, select either music or joke for good vibes.`);
       $("#retakeBtn").show();        $("#mediaId").show();

      } else if (happiness > neutral && happiness > sadness) {
        console.log("Real happy, calm down");
        console.log("Happiness: " + happiness);
        selEmotion = "happy";
        $("#emotionOutput").html(`You look ${selEmotion}, select either music or joke for good vibes.`);
        $("#retakeBtn").show();
        $("#mediaId").show();

      } else if (anger > happiness && anger > sadness) {
        console.log("You MAD mad");
        console.log("Anger: " + anger);
        selEmotion = "angry";
        $("#emotionOutput").html(`You look ${selEmotion}, select either music or joke for good vibes.`);
        $("#retakeBtn").show();
        $("#mediaId").show();

      }else {
        selEmotion = "Couldn't detect emotion. Please retake image."
        $("#emotionOutput").html(selEmotion);
        $("#retakeBtn").show();

      }
    

        //console.log the value of selEmotion
        //can only be console.logged in ajax for face++, otherwise, undefined
        console.log(selEmotion);


        //Linked up SpotifyAPI, now need to learn how to searhc for a playlist with selEmotion in the search bar
        let spotURL = "https://api.spotify.com/v1/browse/new-releases"// + selEmotion;
        //need to save accessToken with all of Jon's keys
        let accessToken = "BQBYGRCKaJZ0fCQYEeCn7N3qBetAJcvwIaRVWHfBtHYy6op91W31avbT_N6Oo3oV0RVci4lmMyyq2GpHonP7-lV07hnRzKJMuUJcOXkMUDSNS2iyg3Rr_8u1S_E_Ip8IAduKuNMxlL2G";

        $.ajax({
          url: spotURL,
          type: "GET",
          headers: {
            'Authorization' : 'Bearer ' + accessToken
          },
          success: function(data){
            console.log(data);
          }


        })


    });
  
  }

  //This was used to gain the proper authorization needed to use SpofityAPI services. Successful.
  function getAuth(){
    $.ajax({
      url: "https://accounts.spotify.com/authorize?client_id=75cc2213842443acb57ea69bf27edbc8&redirect_uri=https://jeremy784.github.io/vibe-patrol/&response_type=token&state=1442",
      method: "GET"
    })
  }

  getAuth();

  
  $(document).on("click", "#startbutton", function(){
    faceEmotion();
    $(".camera").hide();
    $(".output").show();
    $("#retakeButton").show();


  });

  $(document).on("click", "#retakeBtn", function(){

    $(".output").hide();
    $(".camera").show();
    $("#emotionOutput").html("");
    $("#retakeBtn").hide();
    $("#mediaId").hide();


  })

//https://jeremy784.github.io/vibe-patrol/#access_token=BQBYGRCKaJZ0fCQYEeCn7N3qBetAJcvwIaRVWHfBtHYy6op91W31avbT_N6Oo3oV0RVci4lmMyyq2GpHonP7-lV07hnRzKJMuUJcOXkMUDSNS2iyg3Rr_8u1S_E_Ip8IAduKuNMxlL2G&token_type=Bearer&expires_in=3600&state=1442