const getLaunchInfo = async() =>{
    try{
        const res = await axios.get('https://api.spacexdata.com/v4/launches/next')
        displayLaunchInfo(res.data) // display info, pass in retrieved data
        console.log("Mission Info")
        console.log(res.data)

        countDown(res.data.date_unix); // Countdown to next launch

        const rocketInfo = await getRocketInfo(res.data.rocket) // pass in rocket id
        displayRocketInfo(rocketInfo)
        console.log("Rocket Info")
        console.log(rocketInfo)
        console.log()

        const padInfo = await getPadInfo(res.data.launchpad) // Pass in launchpad id
        displayPadInfo(padInfo)
        console.log("Pad Info")
        console.log(padInfo)
        console.log()

        let coreInfo =""

        // Need to do try catch, if core is new may not have any id and gives error
        try {
            coreInfo = await getCoreInfo(res.data.cores[0].core) // Gets core id from launch data
        }catch (e) {
            console.log("error: " + e)
        }
        console.log("Core Info")
        console.log(coreInfo)
        console.log()
        createTable(coreInfo)

    }catch(e){
        console.log("error: " + e)
    }
}
getLaunchInfo();


function displayLaunchInfo(data){
    const flightNum = document.getElementById("number");
    flightNum.innerHTML = data.flight_number;

    const mission = document.getElementById("mission-name");
    mission.innerHTML = data.name;

    const date = document.getElementById("date");
    date.innerHTML = data.date_local.substring(0,10);

    const time = document.getElementById("time");
    time.innerHTML = data.date_local.substring(11);

    // If there's a youtube stream available show it on page
    const youtubeLink = document.getElementById("link");
    const webcast = data.links.webcast;
    if(webcast) {
        youtubeLink.innerHTML = `
        <a href="${webcast}" className="btn btn-circle ms-1" role="button" style="background: rgb(255,0,0);">
        <h5><i className="fab fa-youtube text-white"></i> Watch it live </h5></a>`

    }else{
        console.log("No link available yet")
    }

    const details = document.getElementById("details");
    details.innerHTML = data.details;

    const patch = document.getElementById("patch");
    patch.src = data.links.patch.small;
}


// Pass in rocket id, return data on it
const getRocketInfo = async(id) =>{
    try{
        const res = await axios.get('https://api.spacexdata.com/v4/rockets/' + id)
        return (res.data) // Return data
    }catch(e){
        console.log("error: " + e)
    }
}

function displayRocketInfo(data){
    const rocket = document.getElementById("rocket");
    rocket.innerText = data.name;

    const height = document.getElementById("height");
    height.innerText = data.height.meters;

    const diameter = document.getElementById("diameter");
    diameter.innerText = data.diameter.meters;

    const mass = document.getElementById("mass");
    mass.innerText = data.mass.kg;

    const engines = document.getElementById("engines");
    engines.innerText = data.first_stage.engines;


    const rocketPic = document.getElementById("rocketPic");
    rocketPic.src = data.flickr_images[0];
}

// Pass in launchpad id, return info on it
const getPadInfo = async(id) =>{
    try{
        const res = await axios.get('https://api.spacexdata.com/v4/launchpads/' + id)

        return (res.data) // Return data
    }catch(e){
        console.log("error: " + e)
    }
}

function displayPadInfo(data){
    const name = document.getElementById("name");
    name.innerText = data.full_name;

    const launches = document.getElementById("launches");
    launches.innerText = data.launch_attempts;

    const region = document.getElementById("region");
    region.innerText = data.region;


    // Get latitude and longitude from data
    // const lat = data.latitude;
    // const long = data.longitude;
    //
    // let map = new google.maps.Map(document.getElementById("map"), {
    //     center: { lat: lat, lng: long }, // Set map to focus on latitude and longitude
    //     zoom: 15, // Level of zoom, lower is zoomed out further
    //     mapTypeId: google.maps.MapTypeId.HYBRID, // Hybrid is satellite image with labels
    //
    // });
}

// Pass in core id, return data on the core
const getCoreInfo = async(id) =>{
    try{
        const core = await axios.get('https://api.spacexdata.com/v4/cores/' + id); // Get info on core
        console.log()
        console.log("core id inside get core info  " +core.id)
        console.log()
        return(core.data)
    }catch(e){
        console.log("error " + e)
    }
}


// Pass in launch id, return data on launch
const getPastLaunch = async(id) =>{
    try{
        console.log("IN THE GETTING PAST LAUNCH INFO PART")
        console.log("GETTING ID " + id)
        const past = await axios.get('https://api.spacexdata.com/v5/launches/' + id); // Get info on core
        console.log("Past Launch Info")
        console.log(past.data)
        console.log(past.data.date_utc)

        return(past.data)
    }catch(e){
        console.log("error: " + e)
    }
}

// Table used to show past launches from core used in next launch
async function createTable(core) {
    const rows = document.getElementById("rows"); // Get table body to be able to add rows

    let numLaunches = ""

    // If a core hasn't flown before it may give an error
    try {
        numLaunches = core.launches.length; // Number of launches for this core
    }catch (e) {
        numLaunches = 0; // If there's an error core likely never flew before, set launches as 0
        console.log("error: " + e)
    }



    console.log()
    console.log("NUMBER OF LAUNCHES IS " + numLaunches)
    console.log()

    let table = '';

    if(numLaunches > 0){ // If the core has flown before
        // Loop for each previous launch, starting with most recent
        for (let i = numLaunches-1; i >=0; i--) {
            getPastLaunch(core.launches[i]).then(pastLaunch => {
                console.log("### PRINTING PAST LAUNCH DATA IN FOR LOOP###")
                console.log(pastLaunch)

                const flight = pastLaunch.flight_number;
                const date = pastLaunch.date_utc.substring(0, 10); // substring to cut out time
                const name = pastLaunch.name;
                const webcast = pastLaunch.links.webcast;
                const wiki = pastLaunch.links.wikipedia;

                // Create row with data
                table +=
                `<tr>
                    <td>${flight}</td>
                    <td>${date}</td>
                    <td>${name}</td>
                    <td><a href="${wiki}" class="btn btn-light btn-circle"><i class="fab fa-wikipedia-w text-dark"></i></a></td>
                    <td><a href="${webcast}" class="btn btn-circle ms-1" role="button" style="background: rgb(255,0,0);"><i class="fab fa-youtube text-white"></i></a><br></td>
                </tr>`

                rows.innerHTML = table; // Add row
            })
        }
    }else{ // This core has never flown before
        const history = document.getElementById("history") // Get div with table
        // Replace table with message
        history.innerHTML = '<br><h2 class="hr"> This is the first launch for this rocket!</h3>'
    }
}



// Based on https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_countdown
// Countdown to the launch time
const countDown = (launchDateUnix) => {
    // multiply by 1000 to get milliseconds since Unix Epoch
    let countDownDate = launchDateUnix * 1000;

    setInterval(() => {
        // Get today's date and time
        let now = new Date().getTime();

        // Find the distance between now and the count down date
        let distance = countDownDate - now;

        // Time calculations for days, hours, minutes and seconds
        let days = Math.floor(distance / (1000 * 60 * 60 * 24));
        let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Set values of countdown
        document.getElementById('days').innerHTML = days;
        document.getElementById('minutes').innerHTML = minutes;
        document.getElementById('hours').innerHTML = hours;
        document.getElementById('seconds').innerHTML = seconds;
    }, 1000); // Update every second
};


