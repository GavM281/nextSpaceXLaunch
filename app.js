const getLaunchInfo = async() =>{
    try{
        // const res = await axios.get('https://api.spacexdata.com/v5/launches/next')
        const response = await axios.get('https://lldev.thespacedevs.com/2.2.0/launch/upcoming?limit=2')
        console.log(response.data)
        const res = response.data.results[0];
        console.log(res)
        displayLaunchInfo(res) // display info, pass in retrieved data
        console.log("Mission Info")

        countDown(res.window_start); // Countdown to next launch


        const rocketInfo = await getRocketInfo(res.rocket.configuration.id) // pass in rocket id
        console.log("Rocket Info")
        console.log(rocketInfo)
        displayRocketInfo(rocketInfo)
        console.log()

        displayPadInfo(res.pad);

    }catch(e){
        console.log("error: " + e)
    }
}
getLaunchInfo();


function displayLaunchInfo(data){
    const flightNum = document.getElementById("number");
    flightNum.innerHTML = data.agency_launch_attempt_count + " (" + data.agency_launch_attempt_count_year + " this year)";

    const mission = document.getElementById("mission-name");
    mission.innerHTML = data.name;

    const date = document.getElementById("date");
    date.innerHTML = data.window_start.substring(0,10); // Get date of launch

    const time = document.getElementById("time");
        time.innerHTML = data.window_start.substring(11,19) + ' - ' + data.window_end.substring(11,19); // Show launch window times

    // If there's a youtube stream available show it on page
    const youtubeLink = document.getElementById("webcast");

    if(data.webcast_live === true) {
        console.log(data.webcast)
        const webcast = data.webcast;
        youtubeLink.innerHTML = `
        <a href="${webcast}" class="btn btn-circle ms-1" role="button" style="background: rgb(255,0,0);">
        <h5><i class="fab fa-youtube text-white">   Watch it live </i></h5></a>`
    }else{
        console.log("No link available yet")
    }

    const missionDetails = document.getElementById("missionDetails");
    const details = data.mission.description;

    document.getElementById("missionStatus").innerHTML = `<b>${data.status.description}</b>`;

    if(details) {
        missionDetails.innerHTML = `<blockquote><p>${details}</p></blockquote><br>`
    }else{
        console.log("No details for this mission")
    }

    getServiceProviderInfo(data.launch_service_provider.id).then(serviceProvider => {
        console.log("serviceProvider: " + serviceProvider);
        // document.getElementById("launchProvider").innerText = data.launch_service_provider.name;
        // document.getElementById("launchType").innerText = data.launch_service_provider.type;
        // document.getElementById("providerFoundingYear").innerText= serviceProvider.founding_year;
        document.getElementById("providerDesc").innerText= serviceProvider.description;
        document.getElementById("providerLogo").src = serviceProvider.logo_url;
        document.getElementById("providerLogoButton").src = serviceProvider.logo_url;
        document.getElementById("launchProviderWiki").setAttribute('href', serviceProvider.wiki_url);
        document.getElementById("launchProviderWebsite").setAttribute('href', serviceProvider.info_url);
    });
    // patch.src = data.image;
}

// Pass in rocket id, return data on it
const getServiceProviderInfo = async(id) =>{
    try{
        // const res = await axios.get('https://api.spacexdata.com/v4/rockets/' + id)
        const res = await axios.get('https://lldev.thespacedevs.com/2.2.0/agencies/' + id)
        console.log(res)
        return (res.data) // Return data
    }catch(e){
        console.log("error: " + e)
    }
}

// Pass in rocket id, return data on it
const getRocketInfo = async(id) =>{
    try{
        // const res = await axios.get('https://api.spacexdata.com/v4/rockets/' + id)
        const res = await axios.get('https://lldev.thespacedevs.com/2.2.0/config/launcher/' + id)
        return (res.data) // Return data
    }catch(e){
        console.log("error: " + e)
    }
}

function displayRocketInfo(data){
    const rocket = document.getElementById("rocket");
    rocket.innerText = data.name;
    console.log(data);

    document.getElementById("height").innerText = data.length;
    // document.getElementById("height").innerText = data.height.meters;
    // document.getElementById("heightFt").innerText = data.height.feet;

    // document.getElementById("diameter").innerText = data.diameter.meters;
    document.getElementById("diameter").innerText = data.diameter;
    // document.getElementById("diameterFt").innerText = data.diameter.feet;

    // document.getElementById("mass").innerText = data.mass.kg;
    document.getElementById("mass").innerText = data.launch_mass;
    // document.getElementById("massLb").innerText = data.mass.lb;

    // const engines = document.getElementById("engines");
    // engines.innerText = data.first_stage.engines;

    const details = document.getElementById("rocketDescription");
    details.innerHTML = data.description;

    document.getElementById("rocketSuccessLaunches").innerText = data.successful_launches;
    const rocketWikiLink = document.getElementById("rocketWikiLink")
    // rocketWikiLink.innerHTML = `<a href="${data.wiki_url}" className="btn btn-circle ms-1" role="button" style="background: rgb(255,255,255);">
    //     <i className="fab fa-wikipedia-w text-black"></i>
    // </a>`
    if(data.wiki_url !== "" || data.wiki_url !== null) {
        rocketWikiLink.setAttribute('href', data.wiki_url);
    } else {
        rocketWikiLink.innerHTML = ``;
    }
    const rocketPic = document.getElementById("rocketPic");
    rocketPic.src = data.image_url;

    // createTable(data.flights);
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
    console.log("displayPadInfo: " + data.data)
    console.log("displayPadInfo: " + data)

    const name = document.getElementById("name");
    name.innerText = data.name;

    const launches = document.getElementById("launches");
    launches.innerText = data.total_launch_count;

    const region = document.getElementById("region");
    region.innerText = data.location.name;

    const wikiLink = document.getElementById("padWikiLink");
    // console.log(data.wiki_url);
    // wikiLink.setAttribute('href', data.wiki_url);


    if(data.wiki_url !== "" || data.wiki_url !== null) {
        wikiLink.setAttribute('href', data.wiki_url);
    } else {
        wikiLink.innerHTML = ``;
    }
    // wikiLink.innerHTML = `<a href="${data.wiki_url}" className="btn btn-circle ms-1" role="button" style="background: rgb(255,0,0);"><i
    //     className="fab fa-youtube text-white"></i></a>`

    // Get latitude and longitude from data

    console.log("data.latitude = " + data.latitude)
    console.log("data.longitude = " + data.longitude)

    const lat = parseFloat(data.latitude);
    const long = parseFloat(data.longitude);

    new google.maps.Map(document.getElementById("map"), {
        center: { lat: lat, lng: long }, // Set map to focus on latitude and longitude
        zoom: 15, // Level of zoom, lower is zoomed out further
        mapTypeId: google.maps.MapTypeId.HYBRID, // Hybrid is satellite image with labels
    });
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
        // const past = await axios.get('https://api.spacexdata.com/v5/launches/' + id); // Get info on core
        const past = await axios.get('https://lldev.thespacedevs.com/2.2.0/spacecraft/flight/' + id); // Get info on core
        console.log("Past Launch Info")
        console.log(past.data)
        // console.log(past.data.date_utc)

        return(past.data)
    }catch(e){
        console.log("error: " + e)
    }
}

// Table used to show past launches from core used in next launch
// async function createTable(core) {
// async function createTable(flights) {
//     const rows = document.getElementById("rows"); // Get table body to be able to add rows
//
//
//     // If a core hasn't flown before it may give an error
//     // try {
//         numLaunches = flights.length; // Number of launches for this core
//     // }catch (e) {
//     //     numLaunches = 0; // If there's an error core likely never flew before, set launches as 0
//     //     console.log("error: " + e)
//     // }
//
//
//
//     console.log()
//     console.log("NUMBER OF LAUNCHES IS " + flights.length)
//     console.log()
//
//     let table = '';
//
//     if(numLaunches > 0){ // If the core has flown before
//         // Loop for each previous launch, starting with most recent
//         for (let i = numLaunches-1; i >=0; i--) {
//             // getPastLaunch(core.launches[i]).then(pastLaunch => {
//             getPastLaunch(flights[i].id).then(pastLaunch => {
//                 console.log("### PRINTING PAST LAUNCH DATA IN FOR LOOP###")
//                 console.log(pastLaunch)
//
//                 // const flight = pastLaunch.flight_number;
//                 const flight = "123";
//                 const date = pastLaunch.mission_end.substring(0, 10); // substring to cut out time
//                 // const name = pastLaunch.name;
//                 const name = "pastLaunch.name";
//                 // const webcast = pastLaunch.links.webcast;
//                 const webcast = "pastLaunch.links.webcast";
//                 // const wiki = pastLaunch.links.wikipedia;
//                 const wiki = "pastLaunch.links.wikipedia";
//
//                 // Create row with data
//                 table +=
//                 `<tr>
//                     <td>${flight}</td>
//                     <td>${date}</td>
//                     <td>${name}</td>
//                     <td><a href="${wiki}" class="btn btn-light btn-circle"><i class="fab fa-wikipedia-w text-dark"></i></a></td>
//                     <td><a href="${webcast}" class="btn btn-circle ms-1" role="button" style="background: rgb(255,0,0);"><i class="fab fa-youtube text-white"></i></a><br></td>
//                 </tr>`
//
//                 rows.innerHTML = table; // Add row
//             })
//         }
//     }else{ // This core has never flown before
//         const history = document.getElementById("history") // Get div with table
//         // Replace table with message
//         history.innerHTML = '<br><h2 class="hr"> This is the first launch for this rocket!</h3>'
//     }
// }



// Based on https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_countdown
// Countdown to the launch time
const countDown = (windowStart) => {
    // multiply by 1000 to get milliseconds since Unix Epoch
    let countDownDate = new Date(windowStart).getTime();

    // Get today's date and time
    let now = new Date().getTime();

    // Find the distance between now and the count down date
    let distance = countDownDate - now;

    let seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if(seconds > 0) { // If launch is in the future
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
    } else { // Showing last launch
        document.getElementById('warning').innerHTML =
            `<div class="alert alert-danger roundCorners" role="alert">
                No data for next launch found. Showing previous launch.
            </div>`;

        // Set timer to be 00
        document.getElementById('days').innerHTML = "00";
        document.getElementById('minutes').innerHTML = "00";
        document.getElementById('hours').innerHTML = "00";
        document.getElementById('seconds').innerHTML = "00";
    }
};


