var recording_started = false;

function startRecording() {
    return new Promise((resolve, reject) => {
        console.log('startRecording() entered.');
        clickElementWithText('more_vert');
        setTimeout(() => {  
            clickSpanByText('Manage recording');
            setTimeout(() => {  
                clickSpanByText('Start recording');
                setTimeout(() => {  
                    let isStarted = clickSpanByText('Start');
                    if(isStarted){
                        console.log('Recording started');
                        clickDivByText("Don't forget to record!");
                        recording_started = true;
                        resolve(true);
                    } else {
                        reject('Failed to start recording');
                    }
                }, 1000);
            }, 1000);
        }, 1000);
        console.log('startRecording() exit.');
    });
}


function clickElementWithText(text){
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


// Function to find and click the span with specific text content
function clickSpanByText(text) {
    // Retrieve all span elements in the document
    const spans = document.querySelectorAll('span');

    // Loop through each span to find the one with the matching text content
    for (let span of spans) {
        if (span.textContent.trim() === text) {
            span.click();  // Click the span if the text matches
            console.log('Clicked span with text:', text);
            return true;
        }
    }

    // Log if the span was not found
    console.log('Span with text "' + text + '" not found');
    return false;
}

function clickDivByText(text) {
    const spans = document.querySelectorAll('div');

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


window.addEventListener('load', () => {    
    console.log('Page loaded');

    
    const interval = setInterval(() => {
        console.log('recording_started = ' + recording_started);


        let record_message_exists = divExists("Don't forget to record!");

        console.log('record_message_exists = ' + record_message_exists);
        console.log(record_message_exists && !recording_started);

        if (record_message_exists && !recording_started) {
            startRecording().then(started => {
                console.log('Recording has started');
                clearInterval(interval);
            }).catch(error => {
                console.log('Error starting recording:', error);
            });
        }
    }, 10000);
});