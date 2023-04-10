# Next Rocket Launch
> *Previously nextSpaceXLaunch. Migrated to the [Launch Library 2 API](https://thespacedevs.com/llapi) after [r/spaceX API](https://github.com/r-spacex/SpaceX-API) was discontinued.
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
    * Link to Youtube stream of the launch when available
    
  * ### Rocket Info
    * Rocket name
    * Link to Rockets wikipedia page
    * Rocket stats for: 
      * height
      * diameter
      * mass
      * number of successful launches
    * Description of rocket
    * Picture of the rocket
    
  * ### Launchpad Info
    * Name of the launchpad
    * Link to Launchpad wikipedia
    * Number of launches there
    * Region 
    * Satellite view of the launchpad through Google Maps

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