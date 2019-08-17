function onLoad(){
  $(".output").hide();
  $("#mediaId").hide();
  $("#retakeBtn").hide();

  $("#conMusic").hide();
  $("#conDis").hide();
  $("#conJoke").hide();

  $("#retakeTxt").hide();
  $("#emotionOutput").html("");
}
onLoad();



(function() {
  //This if function will only load this fucntion if the body class matches the index.html. 
  if($("body").is(".pageIndex")){

    // The width and height of the captured photo. We will set the
    // width to the value defined here, but the height will be
    // calculated based on the aspect ratio of the input stream.

    var width = 500;    // We will scale the photo width to this
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
  }
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

        $("#jokeH1").html(joke || twoPart);
    });
    console.log(jokeURL);

  };


  //Declared selEMotion to make global
  let selEmotion;
  let emoVid;

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
       $("#emotionOutput").html(`You look ${selEmotion}, select either Music to continue with your vibe, or Joke to try to lighten up the mood.`);
       $("#retakeBtn").show();        
       $("#mediaId").show();

      } else if (happiness > neutral && happiness > sadness) {
        console.log("Real happy, calm down");
        console.log("Happiness: " + happiness);
        selEmotion = "happy";
        $("#emotionOutput").html(`You look ${selEmotion}, select either Music to continue with your vibe, or Joke to try to lighten up the mood.`);
        $("#retakeBtn").show();
        $("#mediaId").show();
        $("#emotionVal").html(selEmotion);

      } else if (anger > happiness && anger > sadness) {
        console.log("You MAD mad");
        console.log("Anger: " + anger);
        selEmotion = "angry";
        $("#emotionOutput").html(`You look ${selEmotion}, select either Music to continue with your vibe, or Joke to try to lighten up the mood.`);
        $("#retakeBtn").show();
        $("#mediaId").show();

      } else if (surprise > happiness && surprise > sadness) {
        console.log("You look shocked!");
        console.log("Surprise: " + surprise);
        selEmotion = "surprised";
        $("#emotionOutput").html(`You look ${selEmotion}, select either Music to continue with your vibe, or Joke to try to lighten up the mood.`);
        $("#retakeBtn").show();
        $("#mediaId").show();

      }else {
        selEmotion = "Couldn't detect emotion. Please retake photo."
        $("#emotionOutput").html(selEmotion);
        $("#retakeBtn").show();

      }
        //console.log the value of selEmotion
        //can only be console.logged in ajax for face++, otherwise, undefined
        console.log(selEmotion);

        //The following IF statements basically is the app fucntioning. (Grabbing emotion and either showing a video corresponding to emotion, or give user a joke)
        if(selEmotion === "happy"){
          emoVid = "https://www.youtube.com/embed/dTYOkcRH220"

          $("#toMusic").on("click", function(){
            $("#conIndex").hide();
            $("#conMusic").show();
            $("#musicVid").attr("src", emoVid);
          })

          $("#toDis").on("click",function(){
            $("#conIndex").hide();
            $("#conDis").show();
            $("#continueButton").on("click", function(){
              $("#conDis").hide();
              $("#conJoke").show();
              $("#jokeH1").html("");
              getJokes();
            })
          })
          
        } else if(selEmotion === "sad"){
          emoVid = "https://www.youtube.com/embed/8ofCZObsnOo"

          $("#toMusic").on("click", function(){
            $("#conIndex").hide();
            $("#conMusic").show();
            $("#musicVid").attr("src", emoVid);
          })

          $("#toDis").on("click",function(){
            $("#conIndex").hide();
            $("#conDis").show();
            $("#continueButton").on("click", function(){
              $("#conDis").hide();
              $("#conJoke").show();
              $("#jokeH1").html("");
              getJokes();
            })
          })
          
        } else if(selEmotion === "angry"){
          emoVid = "https://www.youtube.com/embed/0KSOMA3QBU0"

          $("#toMusic").on("click", function(){
            $("#conIndex").hide();
            $("#conMusic").show();
            $("#musicVid").attr("src", emoVid);
          })

          $("#toDis").on("click",function(){
            $("#conIndex").hide();
            $("#conDis").show();
            $("#continueButton").on("click", function(){
              $("#conDis").hide();
              $("#conJoke").show();
              $("#jokeH1").html("");
              getJokes();
            })
          })
          
        } else if(selEmotion === "surprised"){
          emoVid = "https://www.youtube.com/embed/9SRxBTtspYM"

          $("#toMusic").on("click", function(){
            $("#conIndex").hide();
            $("#conMusic").show();
            $("#musicVid").attr("src", emoVid);
          })

          $("#toDis").on("click",function(){
            $("#conIndex").hide();
            $("#conDis").show();
            $("#continueButton").on("click", function(){
              $("#conDis").hide();
              $("#conJoke").show();
              $("#jokeH1").html("");
              getJokes();
            })
          })
          
        }

    });
  }
  
  $(document).on("click", "#startbutton", function(){
    faceEmotion();
    $(".camera").hide();
    $(".output").show();
    $("#retakeTxt").show();
  });

  $(document).on("click", "#selfie", function(){
    $(".output").hide();
    $(".camera").show();
    $("#emotionOutput").html("");
    $("#retakeTxt").hide();
    $("#mediaId").hide();
  })

  $(document).on("click", "#startOverButton", function(){
    onLoad();
    $("#conIndex").show();
    $(".camera").show();
  })

  $(document).on("click", "#newJoke", function(){
    getJokes();
  })

  $(document).on("click", "#goBack", function(){
    $("conDis").hide();
    onLoad();
    $("#conIndex").show();
    $(".camera").show();
  })