const getLaunchInfo = async() =>{
    try{
        // const res = await axios.get('https://api.spacexdata.com/v5/launches/next')
        // const response = await axios.get('https://lldev.thespacedevs.com/2.2.0/launch/upcoming?limit=1')
        const response = await axios.get('https://ll.thespacedevs.com/2.2.0/launch/upcoming?hide_recent_previous=true&limit=1')
        console.log(response.data)
        const res = response.data.results[0];
        console.log("Next Launch:")
        console.log(res)
        displayLaunchInfo(res) // display info, pass in retrieved data
        console.log("Mission Info")
        // const apiDateString = "2024-04-17T18:30:00Z";
        // const localDate = new Date(res);
        //
        // console.log("Local Time:", localDate);
        // console.log("Local Time:", localDate.toLocaleString());
        // console.log("Time:", localDate.toLocaleTimeString());
        // console.log("Time:", localDate.toLocaleDateString());
        // console.log("Time with possible zone abbreviation:", localDate.toString());

        countDown(res.net); // Countdown to next launch

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

    if(data.agency_launch_attempt_count !== null) document.getElementById("number").innerHTML =
        data.agency_launch_attempt_count + " (" + data.agency_launch_attempt_count_year + " this year)";

    if(data.name !== null) document.getElementById("mission-name").innerHTML = data.name.split("|")[1];

    if(data.net!==null)
    {
        const localDate = new Date(data.net);
        document.getElementById("date").innerHTML = localDate.toLocaleDateString();
        document.getElementById("time").innerHTML = localDate.toLocaleTimeString();
    } // Get date of launch
    //
    // const time = document.getElementById("time");
    // if(data.window_start === data.window_end){ // Has exact launch time
    //     time.innerHTML = data.window_start.substring(11,19) + " UTC"; // Only show exact time
    //     document.getElementById("LaunchWindowText").innerText = "Launch Time"; // Change Launch Window text to Launch time
    // }else{
    //     time.innerHTML = data.window_start.substring(11,19) + ' - ' + data.window_end.substring(11,19) + " UTC"; // Show launch window times
    // }
    // time.innerHTML = data.net.substring(11,19) + " UTC";

    // If there's a YouTube stream available show it on page
    if(data.webcast_live === true) {
        console.log(data.webcast)
        const webcast = data.webcast;
        // const webcast = "https://www.youtube.com/watch?v=Iz6qdzVCN9g"

        // Get video id from link
        let videoId = webcast.split('v=')[1];
        const ampersandPosition = videoId.indexOf('&');
        if (ampersandPosition !== -1) {
            videoId = videoId.substring(0, ampersandPosition);
        }

        const liveStream = document.getElementById("youtubeLiveStream");
        liveStream.innerHTML =`
            <div class="card roundCorners">
                <div class="card-body roundCorners" id="youtubeStreamContainer">
                    <iframe width=560 height=315 id="StreamFrame" class="roundCorners" src="https://www.youtube-nocookie.com/embed/${videoId}" title="YouTube video player"
                            frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope;
                            picture-in-picture; web-share" allowfullscreen>
                    </iframe>
                </div>
            </div>`
    } else {
        console.log("No livestream link available yet")
    }

    document.getElementById("missionStatus").innerHTML = `<i><h6>${data.net_precision.description}</h6></i>`;

    if (data.mission !== null ) document.getElementById("missionDetails").innerHTML = `
            <blockquote><p>${data.mission.description}</p></blockquote><br>`


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
        // const res = await axios.get('https://lldev.thespacedevs.com/2.2.0/agencies/' + id)
        const res = await axios.get('https://lldev.thespacedevs.com/2.2.0/agencies/' + id)
        console.log("Service Provider: ")
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
        // const res = await axios.get('https://ll.thespacedevs.com/2.2.0/config/launcher/' + id)
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
    document.getElementById("diameter").innerText = data.diameter;
    document.getElementById("mass").innerText = data.launch_mass;

    document.getElementById("rocketDescription").innerHTML = data.description;

    document.getElementById("rocketSuccessLaunches").innerText = data.successful_launches;

    const rocketWikiLink = document.getElementById("rocketWikiLink")
    if(data.wiki_url !== "" || data.wiki_url !== null) {
        rocketWikiLink.setAttribute('href', data.wiki_url);
    } else {
        rocketWikiLink.innerHTML = ``;
    }

    document.getElementById("rocketPic").src = data.image_url;
}

function displayPadInfo(data){
    console.log("displayPadInfo: " + data.data)
    console.log("displayPadInfo: " + data)

    document.getElementById("name").innerText = data.name;
    document.getElementById("launches").innerText = data.total_launch_count;
    document.getElementById("region").innerText = data.location.name;

    const wikiLink = document.getElementById("padWikiLink");
    if(!data.wiki_url) {
        wikiLink.remove();
    } else {
        wikiLink.setAttribute('href', data.wiki_url);
    }

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

// Based on https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_countdown
// Countdown to the launch time
const countDown = (windowStart) => {
    // Convert to local time
    const localDate = new Date(windowStart);

    // Get the time since Unix epoch in milliseconds
    const timeSinceEpoch = localDate.getTime();

    setInterval(() => {
        // Get today's date and time
        let now = new Date().getTime();

        // Find the distance between now and the count down date
        let distance = timeSinceEpoch - now;

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


