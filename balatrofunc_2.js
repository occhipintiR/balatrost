//Consts element definition

const volumeSlider = document.getElementById("volume-slider");
const playPauseButton = document.getElementById("play");

const aMain = document.getElementById("aMain");
const aShop = document.getElementById("aShop");
const aTarot = document.getElementById("aTarot");
const aPlanet = document.getElementById("aPlanet");
const aBoss = document.getElementById("aBoss");

const trackList = [aMain, aShop, aTarot, aPlanet, aBoss];

var checkboxes = document.querySelectorAll("input[type=checkbox]");
var allSliders = document.querySelectorAll("div[class=slider]");
let enabledTracks = [0];
let sliderVals = [];
var firstPlay = true;
var swapOnCooldown = false;

// Variables to be used based on elements
var currentTrackID = 0;
var currentTrack = aMain;
var player = trackList[currentTrackID];
var lastCountCheckbox = 1;

// Slider vars
const defaultSliderLow = 30;
const defaultSliderHigh = 60;
const sliderMin = 4;
const sliderMax = 120;

var sTimeL = [defaultSliderLow*60000,defaultSliderLow*60000,defaultSliderLow*60000,defaultSliderLow*60000,defaultSliderLow*60000];
var sTimeH = [defaultSliderHigh*60000,defaultSliderHigh*60000,defaultSliderHigh*60000,defaultSliderHigh*60000,defaultSliderHigh*60000];
var sTime = 0;
player.volume = volumeSlider.value;
var swapEvent;


//Debug vars
const debugTimer = 60;                              // Interval that debug outputs
var debugCounter = debugTimer;                      // Tracking debug times


//Define Sliders
var sliderMain = document.getElementById('sliderMain');
noUiSlider.create(sliderMain, {
    start: [defaultSliderLow, defaultSliderHigh],
    connect: true,
    range: {
        'min': sliderMin,
        'max': sliderMax
    },
    tooltips: true,
    step: 1,
    format: {
        to: (v) => parseFloat(v).toFixed(0),
        from: (v) => parseFloat(v).toFixed(0)
    }

});

var sliderShop = document.getElementById('sliderShop');
noUiSlider.create(sliderShop, {
    start: [defaultSliderLow, defaultSliderHigh],
    connect: true,
    range: {
        'min': sliderMin,
        'max': sliderMax
    },
    tooltips: true,
    step: 1,
    format: {
        to: (v) => parseFloat(v).toFixed(0),
        from: (v) => parseFloat(v).toFixed(0)
    }
    
});

var sliderTarot = document.getElementById('sliderTarot');
noUiSlider.create(sliderTarot, {
    start: [defaultSliderLow, defaultSliderHigh],
    connect: true,
    range: {
        'min': sliderMin,
        'max': sliderMax
    },
    tooltips: true,
    step: 1,
    format: {
        to: (v) => parseFloat(v).toFixed(0),
        from: (v) => parseFloat(v).toFixed(0)
    }
    
});

var sliderPlanet = document.getElementById('sliderPlanet');
noUiSlider.create(sliderPlanet, {
    start: [defaultSliderLow, defaultSliderHigh],
    connect: true,
    range: {
        'min': sliderMin,
        'max': sliderMax
    },
    tooltips: true,
    step: 1,
    format: {
        to: (v) => parseFloat(v).toFixed(0),
        from: (v) => parseFloat(v).toFixed(0)
    }
    
});

var sliderBoss = document.getElementById('sliderBoss');
noUiSlider.create(sliderBoss, {
    start: [defaultSliderLow, defaultSliderHigh],
    connect: true,
    range: {
        'min': sliderMin,
        'max': sliderMax
    },
    tooltips: true,
    step: 1,
    format: {
        to: (v) => parseFloat(v).toFixed(0),
        from: (v) => parseFloat(v).toFixed(0)
    }
    
});

//Initilization

debugReportVar = setInterval(debugReport,debugTimer*1000);

//Element event listeners

//Play/Pause button functionality
playPauseButton.addEventListener("click", ()=>{
  if (player.paused) {                              // check if the player is paused
    if(enabledTracks.length == 0){
        alert("Please Select At Least One Track!");
        return;
    }
    aMain.volume = 0;
    aShop.volume = 0;
    aTarot.volume = 0;
    aPlanet.volume = 0;
    aBoss.volume = 0;
    aMain.play();
    aShop.play();
    aTarot.play();
    aPlanet.play();
    aBoss.play();
    if(firstPlay){
        currentTrack = trackList[enabledTracks[0]];
        firstPlay = false;
    }
    var newVolume = 0;
    doTimer(1000, 10, function()
    {
        newVolume = newVolume + volumeSlider.value/10;
        currentTrack.volume = Math.min(newVolume,volumeSlider.value);
    },
    function()
    {
        currentTrack.volume   = volumeSlider.value;
    });
    playPauseButton.textContent = "Pause";          // Update button text to "Pause"       
    if(currentTrackID != enabledTracks[0]){
        swapTracks();
    }
    if(enabledTracks.length>1){
        console.log("swapEvent Enabled");
        var tempSwapTime = getRandomTime(currentTrackID);
        console.log("With swap time = " + tempSwapTime);
        swapEvent = setTimeout(swapTracks, tempSwapTime);     // Start a swap event timer
    }
  } else {
    aMain.pause();
    aShop.pause();
    aTarot.pause();
    aPlanet.pause();
    aBoss.pause();
    playPauseButton.textContent = "Play";           // Update button text to "Play"
    console.log("swapEvent Disabled");
    clearTimeout(swapEvent);
  }
});

// Volume slider functionality
volumeSlider.addEventListener("input", () => {
  player.volume = volumeSlider.value;               //Set player volume to slider value (0 -> 1)
});

// Slider Functionality
sliderMain.noUiSlider.on('end', () => readSlider(sliderMain,0))    //When main slider is moved, run readSliderMain
sliderShop.noUiSlider.on('end', () => readSlider(sliderShop,1))
sliderTarot.noUiSlider.on('end', () => readSlider(sliderTarot,2))
sliderPlanet.noUiSlider.on('end', () => readSlider(sliderPlanet,3))
sliderBoss.noUiSlider.on('end', () => readSlider(sliderBoss,4))


// Checkbox functionality
checkboxes.forEach(function(checkbox) {
  checkbox.addEventListener('change', function() {
    enabledTracks = 
      Array.from(checkboxes)                            // Convert checkboxes to an array to use filter and map.
      .filter(i => i.checked)                           // Use Array.filter to remove unchecked checkboxes.
      .map(i => Number(i.value))                               // Use Array.map to extract only the checkbox values from the array of objects.
      
    console.log(enabledTracks)
    if(!player.paused && (lastCountCheckbox==1 && enabledTracks.length==2)){
        clearTimeout(swapEvent);
        var tempSwapTime = getRandomTime(currentTrackID);
        console.log("swapEvent Enabled");
        console.log("With swap time = " + tempSwapTime);
        swapEvent = setTimeout(swapTracks, tempSwapTime);
    }
    if((lastCountCheckbox==2 && enabledTracks.length==1) && currentTrackID == enabledTracks[0]){
        console.log("swapEvent Disabled");
        clearTimeout(swapEvent);
    }
    lastCountCheckbox = enabledTracks.length;
  })
});

// Swap Track Button Functionality
swapper.addEventListener("click", ()=>{
    if(!swapOnCooldown  && !player.paused && (enabledTracks.length>1 || (currentTrackID != enabledTracks[0] && enabledTracks.length != 0))){
        console.log("swapEvent Disabled");
        clearTimeout(swapEvent);
        swapTracks();
        swapOnCooldown = true;
        if(enabledTracks.length>1){
            var tempSwapTime = getRandomTime(currentTrackID);
            console.log("swapEvent Enabled");
            console.log("With swap time = " + tempSwapTime);
            swapEvent = setInterval(swapTracks, tempSwapTime);
        }
        dummy = setTimeout(function(){
            swapOnCooldown = false;
        }, 2400);
    }
    else{
        console.log("No Swap. Either on Cooldown or <=1 tracks"); 
    }
});


// Functions
// Function for handling swapping from current to new track
function swapTracks(){
    console.log("Switching");
    let selectedTrackID = 0
    if(enabledTracks.length == 1){
        console.log("One Track");
        selectedTrackID = enabledTracks[0];
    } else {
        console.log("Multiple Tracks");
        var tempIndex = enabledTracks.indexOf(currentTrackID);
        var tempTrackArray = enabledTracks.filter((_, index) => index !== tempIndex);                   
        selectedTrackID = tempTrackArray[Math.floor(Math.random() * tempTrackArray.length)];      // Select new, different track
    }
    console.log(currentTrackID);
    console.log(selectedTrackID);
    
    //FadeOut
    var setVolume = volumeSlider.value;
    var selectedTrack = trackList[selectedTrackID];
    currentTrack = trackList[currentTrackID];
    doTimer(2000, 10, function()
    {
        setVolume = Math.max(setVolume - setVolume/20,0);
        currentTrack.volume = setVolume;
    },
    function()
    {
        currentTrack.volume = 0;
    });
    
    // Fade In
    var newVolume = 0;
    doTimer(2000, 10, function()
    {
        newVolume = newVolume + volumeSlider.value/20;
        selectedTrack.volume = Math.min(newVolume,volumeSlider.value);
    },
    function()
    {
        selectedTrackID.volume = volumeSlider.value;
    });

    currentTrackID = selectedTrackID;                           // Update current track
    player = trackList[currentTrackID];
    if(enabledTracks.length>1){
        var tempSwapTime = getRandomTime(currentTrackID);
        console.log("swapEvent Enabled")
        console.log("With swap time = " + tempSwapTime);
        swapEvent = setTimeout(swapTracks, tempSwapTime);     // Start a swap event timer
    }
}


// Function to handle setting the track swap time based on Main Track Slider
function readSlider(sliderSel, rsTrackID){
    let sliderValues = sliderSel.noUiSlider.get(true);         // Read Slider values (Stored as array)
    sTimeL[rsTrackID] = Math.floor(sliderValues[0]*60000);                  // Convert slider value to ms
    sTimeH[rsTrackID] = Math.floor(sliderValues[1]*60000);
    console.log(`Slider Read ${sliderSel.id} - Low: ${sTimeL[rsTrackID]} - High: ${sTimeH[rsTrackID]}`)
    if(currentTrackID == rsTrackID){
        console.log("swapEvent Disabled");
        clearInterval(swapEvent);                              // Stop any swap events
        // If the player is not paused and there is more than 1 track selected, start new swap event
        if(!player.paused && enabledTracks.length>1){
            console.log("song is currently playing so")
            var tempSwapTime = getRandomTime(currentTrackID);
            console.log("swapEvent Enabled");
            console.log("With swap time = " + tempSwapTime);       
            swapEvent = setInterval(swapTracks, tempSwapTime) ;
        }
    }
}




// debug reporter
function debugReport(){
    console.log("-------------------------------");
    console.log("Debug Report  : " + debugCounter);
    console.log(`Swap time     : ${sTimeL[0]}  ${sTimeL[1]}  ${sTimeL[2]}  ${sTimeL[3]}  ${sTimeL[4]}`);
    console.log("Current Volume: " + volumeSlider.value);
    console.log("-------------------------------");
    debugCounter += debugTimer;
}



function doTimer(length, resolution, oninstance, oncomplete)
{
    var steps = (length / 100) * (resolution / 10),
        speed = length / steps,
        count = 0,
        start = new Date().getTime();

    function instance()
    {
        if(count++ == steps)
        {
            oncomplete(steps, count);
        }
        else
        {
            oninstance(steps, count);

            var diff = (new Date().getTime() - start) - (count * speed);
            window.setTimeout(instance, (speed - diff));
        }
    }

    window.setTimeout(instance, speed);
}

function getRandomTime(trackID) {
    min = Math.ceil(sTimeL[trackID])/1000;
    max = (Math.floor(sTimeH[trackID]))/1000;
    return (Math.floor((Math.random() * (max - min + 1))))*1000 + min*1000;
}

// conditionals
// enabledTracks.length
// !player.paused
// !swapOnCooldown
// currentTrackID != enabledTracks[0]

mergeTooltips(sliderMain, 3, ' - ');
mergeTooltips(sliderShop, 3, ' - ');
mergeTooltips(sliderTarot, 3, ' - ');
mergeTooltips(sliderPlanet, 3, ' - ');
mergeTooltips(sliderBoss, 3, ' - ');


/**
 * @param slider HtmlElement with an initialized slider
 * @param threshold Minimum proximity (in percentages) to merge tooltips
 * @param separator String joining tooltips
 */
function mergeTooltips(slider, threshold, separator) {

    var textIsRtl = getComputedStyle(slider).direction === 'rtl';
    var isRtl = slider.noUiSlider.options.direction === 'rtl';
    var isVertical = slider.noUiSlider.options.orientation === 'vertical';
    var tooltips = slider.noUiSlider.getTooltips();
    var origins = slider.noUiSlider.getOrigins();

    // Move tooltips into the origin element. The default stylesheet handles this.
    tooltips.forEach(function (tooltip, index) {
        if (tooltip) {
            origins[index].appendChild(tooltip);
        }
    });

    slider.noUiSlider.on('update', function (values, handle, unencoded, tap, positions) {

        var pools = [[]];
        var poolPositions = [[]];
        var poolValues = [[]];
        var atPool = 0;

        // Assign the first tooltip to the first pool, if the tooltip is configured
        if (tooltips[0]) {
            pools[0][0] = 0;
            poolPositions[0][0] = positions[0];
            poolValues[0][0] = values[0];
        }

        for (var i = 1; i < positions.length; i++) {
            if (!tooltips[i] || (positions[i] - positions[i - 1]) > threshold) {
                atPool++;
                pools[atPool] = [];
                poolValues[atPool] = [];
                poolPositions[atPool] = [];
            }

            if (tooltips[i]) {
                pools[atPool].push(i);
                poolValues[atPool].push(values[i]);
                poolPositions[atPool].push(positions[i]);
            }
        }

        pools.forEach(function (pool, poolIndex) {
            var handlesInPool = pool.length;

            for (var j = 0; j < handlesInPool; j++) {
                var handleNumber = pool[j];

                if (j === handlesInPool - 1) {
                    var offset = 0;

                    poolPositions[poolIndex].forEach(function (value) {
                        offset += 1000 - value;
                    });

                    var direction = isVertical ? 'bottom' : 'right';
                    var last = isRtl ? 0 : handlesInPool - 1;
                    var lastOffset = 1000 - poolPositions[poolIndex][last];
                    offset = (textIsRtl && !isVertical ? 100 : 0) + (offset / handlesInPool) - lastOffset;

                    // Center this tooltip over the affected handles
                    tooltips[handleNumber].innerHTML = poolValues[poolIndex].join(separator);
                    tooltips[handleNumber].style.display = 'block';
                    tooltips[handleNumber].style[direction] = offset + '%';
                } else {
                    // Hide this tooltip
                    tooltips[handleNumber].style.display = 'none';
                }
            }
        });
    });
}