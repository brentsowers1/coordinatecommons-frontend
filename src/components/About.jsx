const About = () => (
  <div>
    <h1>Coordinate Commons</h1>
    <p>Welcome to Coordinate Commons! This is a very early stage application to keep track of places you've visited.  Places can be anything that can be represented geographically, but the things that 
    I'm starting off with are:<br />
    Countries, US States, and Canadian Provices</p>
    
    <p>Next priority will be US Counties, which is the main reason I am writing this site! I've made it a life goal to visit as many different counties in the United States as I can and this site will allow me to keep track of that. Trying to visit more counties has made my personal and family vacations/trips more interesting and fun!</p>
    
    <p>But eventually I'll get other things like highways, cities, mountains, etc</p>

    <p>Coordinate Commons is a side project of <a href="https://www.coordinatecommons.com/">Brent Sowers</a>. I'm doing this because I really do want to build this product as I will find it useful for me, and I'm sure it will help others as well. I'm also doing it to get some experience on my own project, outside of my job. You can see the source code for this at <a href="https://github.com/brentsowers1/coordinatecommons-frontend">https://github.com/brentsowers1/coordinatecommons-frontend</a> and <a href="https://github.com/brentsowers1/coordinatecommons-backend">https://github.com/brentsowers1/coordinatecommons-backend</a></p>

    <p>Here's a rough roadmap of features and functionality and I am planning to implement (on no specific timeline)</p>
    <ul>
      <li>Persisting the login - ability to remember device</li>
      <li>Forgot username and/or password functionality</li>
      <li>More efficient loading of high res GeoJSON - currently this can cause the map to hang for several seconds</li>
      <li>Counties</li>
      <li>Properly styled user interface</li>
      <li>Leaderboards</li>
      <li>Defining your own categories to classify visits</li>
      <li>Other place types like highways, cities, and mountains</li>
    </ul>
  </div>
);

export default About;
