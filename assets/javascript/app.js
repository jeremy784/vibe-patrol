//API that pulls jokes and prints them on screen.
function getJokes(){
    let jokeURL = "https://sv443.net/jokeapi/category/dark"

    $.ajax({
        url: jokeURL,
        method: "GET",
    }).then(function(response){
        console.log(JSON.stringify(response));
        let joke = response.joke;
        let twoPart = 
        `Setup: ${response.setup} <br>
        Delivery: ${response.delivery}`;
    
        //We need to create a 'div' with an ID of 'joke'
        $("#joke").html(joke || twoPart);
    });
    console.log(jokeURL);

};
