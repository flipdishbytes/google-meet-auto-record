var shouldRecordNow = true;

var divMessage = `
<span class="pulsate-container">
    <span class="pulsate">🔴</span>
</span>&nbsp; Recording starting soon.&nbsp;&nbsp;&nbsp;
<input type="button" class="contained-button" id="remind_button" value="Remind me in a few minutes" />
&nbsp;
<input type="button" class="text-button" id="cancel_button" value="Don't record this call" />    
<span class="gmar_feedback"><a target="blank" href="https://docs.google.com/forms/d/e/1FAIpQLSeP-tkkIEhBZLgbB6zqE5saXULplaXin_uWR6XKR7YvIMzuvA/viewform">Feedback</a></span>
`;

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
                        hideMessageDiv();
                        
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

function spanExists(text) {
    console.log('spanExists() entered');
    const spans = document.querySelectorAll('span');

    for (let span of spans) {
        if (span.textContent.trim() === text) {            
            console.log('span exists.');
            
            if(span.style.display !== 'none'){
                console.log('span is visible.');

                console.log('spanExists() exit. Returning true');    
                return true;
            }
            
        }
    }

    console.log('spanExists() exit. Returning false');    
    return false;
}


function onWaitingScreen() {
    console.log('onWaitingScreen() entered');
    
    return spanExists('Join now');
}


/* Warning DIV setup */

function createNode() {
    let newDiv = document.createElement('div');
    newDiv.textContent = divMessage;

    newDiv.innerHTML = divMessage;

    newDiv.className = "message_div material-paper"
    newDiv.id = "message_div";
    return newDiv;
}


function isRecording(){
    console.log('isRecording() entered');
    const divs = document.querySelectorAll('div');

    for (let div of divs) {
        if (div.getAttribute('aria-label') === 'This meeting is being recorded'
                && div.style.display !== 'none') {            
                    console.log('isRecording() exit. Returning true');                     
                return true;                    
        }
    }

    console.log('isRecording() exit. Returning false');    
    return false;
}


function setUpDiv() {
    const maindiv = document.getElementsByTagName("body")[0].getElementsByTagName('div')[0];
    const newNode = createNode();
    maindiv.prepend(newNode);

   // document.getElementById('cancel_button').addEventListener('click', cancel_button_clicked);
    document.getElementById('cancel_button').addEventListener('click', cancel_button_clicked);
    document.getElementById('remind_button').addEventListener('click', remind_button_clicked);
}

function hideMessageDiv() {
    console.log('hideMessageDiv() entered');
    document.getElementById('message_div').style.display = 'none';
}
function cancel_button_clicked() {
    console.log('Cancel button clicked');
    hideMessageDiv();
    shouldRecordNow = false;
    
}
function remind_button_clicked() {
    console.log('Remind button clicked');
    hideMessageDiv();
    shouldRecordNow = false;
    setTimeout(() => {  
        console.log('Maybe Re-showing div');
        if(!isRecording()){
            console.log('Re-showing div');
            document.getElementById('message_div').style.display = 'flex';
            shouldRecordNow = true;            
        }        
        
    }, 1000 * 180);
}


/*  */

document.addEventListener('DOMContentLoaded', setUpDiv, false)

window.addEventListener('load', () => {    
    console.log('Page loaded');
   
    
    const interval = setInterval(() => {
        var recording_started = isRecording();
        console.log('recording_started = ' + recording_started);

        if(recording_started){

            hideMessageDiv();
            clearInterval(interval);
            return;
        }

       
        let isOnWaitingScreen = onWaitingScreen();
        console.log('isOnWaitingScreen = ' + isOnWaitingScreen);
        console.log('shouldRecordNow = ' + shouldRecordNow);
        console.log(shouldRecordNow && !recording_started);

        if (shouldRecordNow && !recording_started && !isOnWaitingScreen) {
            startRecording().then(started => {
                console.log('Recording has started');                
                clearInterval(interval);
            }).catch(error => {
                console.log('Error starting recording:', error);
            });
        }
    }, 8 * 1000);
});