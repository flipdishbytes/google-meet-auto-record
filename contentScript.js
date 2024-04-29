var recording_started = false;

var divMessage = "🔴 Recording starting soon. Click here to cancel.";

function startRecording() {
    return new Promise((resolve, reject) => {
        console.log('startRecording() entered.');
        clickGoogleMaterialIconElementWithText('more_vert');
        setTimeout(() => {  
            clickElementByText('span','Manage recording');
            setTimeout(() => {  
                clickElementByText('label','Also start a transcript (English only)');
                clickElementByText('span','Start recording');
                setTimeout(() => {  
                    let isStarted = clickElementByText('span','Start');
                    if(isStarted){
                        console.log('Recording started');
                        clickElementByText('div',divMessage);
                        recording_started = true;
                        resolve(true);
                    } else {
                        reject('Failed to start recording');
                    }
                }, 1000);
            }, 600);
        }, 400);
        console.log('startRecording() exit.');
    });
}


function clickGoogleMaterialIconElementWithText(text){
    const icons = document.querySelectorAll('i.google-material-icons[aria-hidden="true"]');
    
    // Loop through the collection of icons in reverse order as the multiple buttons often exist and we generally want the last one.
    for (let i = icons.length - 1; i >= 0; i--) {
    //for (let icon of icons) {
        // Check if the text content of the icon is 'more_vert'
        const icon = icons[i];

        if (icon.textContent.trim() === text) {
            icon.click();  // Click the icon if it matches
            console.log('Clicked');
            return true;
        }
    }
    return false;
}



function clickElementByText(elementType, text) {
    const spans = document.querySelectorAll(elementType);

    // Loop through each span to find the one with the matching text content
    for (let span of spans) {
        if (span.textContent.trim() === text) {
            span.click();  // Click the span if the text matches
            console.log('Clicked div with text:', text);
            return true;
        }
    }

    // Log if the span was not found
    console.log('Div with text "' + text + '" not found');
    return false;
}



function divExists(text) {
    console.log('divExists() entered');
    const divs = document.querySelectorAll('div');

    for (let div of divs) {
        if (div.textContent.trim() === text) {            
            console.log('div exists.');
            
            if(div.style.display !== 'none'){
                console.log('div is visible.');

                console.log('divExists() exit. Returning true');    
                return true;
            }
            
        }
    }

    console.log('divExists() exit. Returning false');    
    return false;
}


function onWaitingScreen() {
    console.log('onWaitingScreen() entered');
    
    return divExists('Ready to join?');
}


/* Warning DIV setup */

function createNode() {
    let newDiv = document.createElement('div');
    newDiv.textContent = divMessage;
    newDiv.className = "special_class_name"
    newDiv.onclick = function() {
        this.style.display = "none";
    }
    return newDiv;
}
function setUpDiv() {
    const maindiv = document.getElementsByTagName("body")[0].getElementsByTagName('div')[0];
    const newNode = createNode();
    maindiv.prepend(newNode);
}
/*  */

document.addEventListener('DOMContentLoaded', setUpDiv, false)

window.addEventListener('load', () => {    
    console.log('Page loaded');
   
    
    const interval = setInterval(() => {
        console.log('recording_started = ' + recording_started);


        let record_message_exists = divExists(divMessage);
        let isOnWaitingScreen = onWaitingScreen();
        console.log('isOnWaitingScreen = ' + isOnWaitingScreen);
        console.log('record_message_exists = ' + record_message_exists);
        console.log(record_message_exists && !recording_started);

        if (record_message_exists && !recording_started && !isOnWaitingScreen) {
            startRecording().then(started => {
                console.log('Recording has started');
                clearInterval(interval);
            }).catch(error => {
                console.log('Error starting recording:', error);
            });
        }
    }, 10000);
});