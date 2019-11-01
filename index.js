'use strict'

//watch for user to submit form
function watchFormSubmit(){
    $('form').submit(function(event){
        event.preventDefault();
        console.clear(); //clear console

        //get values for states and max number
        let states = $('#states').val();
        let maxNum = $('#maxNumber').val();

        //run createParams function to create an object with query parameters
        createParams(states, maxNum);
    })
}

//for each state the user inputs, break string into array items and add them onto 
//params object as new stateCode:state key value pairs
function createParams(states, maxNum){
   
    //if the user sets a maxNum below 1, or leaves blank, maxNum is set to 10
    if(maxNum>=1){
        let maxNum = $('#maxNumber').val();
    }
    else{
        maxNum=10;
    };

    //my NPS API key
    let apiKey = 'eqaEmxG5EMgTEc0DLwDDj2ToagV9OefBK6XIN80y'; 
    
    //define query parameters using user-inputted states and maxNum as values
    let params = {
        limit: maxNum,
        api_key: apiKey,
    }; 
    
    //split states inputs into an array of states and add that array to params object
    let stateArr = states.split(" " || ",");
    //add stateCode query parameter to params object
    params["stateCode"]=stateArr;

    //run createQueryString function with params object as argument
    createQueryString(params);

}

//transform states and max number variables into a query string 
//that can be attached to the API URL
function createQueryString(params){
    const queryItems = Object.keys(params)  
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
    let queryString = queryItems.join('&');

    //run getResults function with queryString as parameter
    getResults(queryString);
}


//get results using fetch
function getResults(queryString){

    //base url (no query parameters) for api parks endpoint
    let baseUrl = 'https://developer.nps.gov/api/v1/parks'

    //add query parameter string to baseUrl and log to console
    let url = `${baseUrl}?${queryString}`;
    console.log(url);

    //if successful, show results
    //if unsuccessful, show error message
    fetch(url)
       .then(response => {
            if (response.ok){
                return response.json();
            }
            throw new Error(response.statusText);
       })
        .then(responseJson => showResults(responseJson))
        .catch(err=>alert(`Something went wrong! ${err.message}`));
}

//add results to .results section
function showResults(responseJson){
    console.log(responseJson); 
    $('.results').empty(); //clear any previous results

    //if there are no parks, inform user. if there are parks, display park info.
    if (responseJson.total === "0"){
        $('.results').append("<h3>Sorry, we couldn\'t find any parks in that location.</h3>");
    }
    else{
        for(let i=0;i<responseJson.data.length;i++){
            $('.results').append(`<div><h3>${responseJson.data[i].name}</h3><p>${responseJson.data[i].description}</p><p>Website here: <a href=${responseJson.data[i].name}>${responseJson.data[i].url}</a></p></div>`)
        }
    };
}

$(watchFormSubmit);