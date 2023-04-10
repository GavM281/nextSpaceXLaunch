# Next Rocket Launch
> *Previously nextSpaceXLaunch. Migrated to the [Launch Library 2 API](https://thespacedevs.com/llapi) after [r/spaceX API](https://github.com/r-spacex/SpaceX-API) was [discontinued](https://github.com/r-spacex/SpaceX-API/issues/1243).
Site now shows next launch from all companies.*

This is a website to display info on the next Rocket launch.
## The site is split into 3 parts.
  * ### Mission Info
    * Mission name
    * Flight number
    * Launch date
    * Launch window
    * Mission description
    * Countdown to launch window opening
    * Status of launch
    * Details on the company behind the launch with a link to their wikipedia page and company page
    * Link to YouTube stream of the launch when available
    ![image](https://user-images.githubusercontent.com/25159545/230992675-29f00204-996b-442a-92b4-6c11521d8d53.png)

    
  * ### Rocket Info
    * Rocket name
    * Link to Rockets wikipedia page
    * Rocket stats for: 
      * Height
      * Diameter
      * Mass
      * Number of successful launches
    * Description of rocket
    * Picture of the rocket
    ![image](https://user-images.githubusercontent.com/25159545/230992790-55fceb62-c3a8-486c-9597-d368bc2529bd.png)

    
  * ### Launchpad Info
    * Name of the launchpad
    * Link to Launchpad wikipedia
    * Number of launches there
    * Region 
    * Satellite view of the launchpad through Google Maps
    ![image](https://user-images.githubusercontent.com/25159545/230992877-4ac869d1-1e76-422a-9ea4-32191356c690.png)


___

### Technologies used
* HTML
* CSS
* Javascript
* [Launch Library 2 API](https://thespacedevs.com/llapi)
* Bootstrap
* Bootstrap Studio
* Axios
* Google Maps API
* Font Awesome
* ~~[r/spaceX API](https://github.com/r-spacex/SpaceX-API)~~ *Migrated away after it was discontinued*

### Differences from nextSpaceXLaunch
* Site now shows next launch from any company
* Mission status added
* Mission patch has been removed and replaced with information on launch provider E.G. SpaceX, Arianespace
* Wikipedia links for rocket and launchpad added
* Removal of table displaying past launches completed by a reused first stage
  * New API doesn't have this info
