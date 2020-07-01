import React from 'react';
import { Container } from 'react-bootstrap';

const About = () => (
  <Container>
    <h1>Coordinate Commons</h1>
    <p>Welcome to Coordinate Commons! This is a very early stage application to keep track of places you've visited.  Places can be anything that can be represented geographically, but the things that 
    I'm starting off with are:<br />
    Countries, US States, and Canadian Provices</p>
    
    <p>Next priority will be US Counties, which is the main reason I am writing this site! I've made it a life goal to visit as many different counties in the United States as I can and this site will allow me to keep track of that. Trying to visit more counties has made my personal and family vacations/trips more interesting and fun!</p>
    
    <p>But eventually I'll get other things like highways, cities, mountains, etc</p>

    <p>Coordinate Commons is a side project of <a href="https://www.coordinatecommons.com/">Brent Sowers</a>. I'm doing this partially because I really do want to build this product as I will find it useful for me, and I'm sure it will help others as well. I'm also doing it to get some good web development experience with React, node, lambdas, and AWS. I am a senior software engineering manager, and have done much web application development in my career, but do not have a lot of direct hands on coding experience with React and node, so I want to expand my skillset. What better way to do this than to build my own side project! You can see the source code for this at <a href="https://github.com/brentsowers1/coordinatecommons-frontend">https://github.com/brentsowers1/coordinatecommons-frontend</a> and <a href="https://github.com/brentsowers1/coordinatecommons-backend">https://github.com/brentsowers1/coordinatecommons-backend</a></p>

    <p>Here's a rough roadmap of features and functionality and I am planning to implement (on no specific timeline!)</p>
    <ul>
      <li>Persisting the login - ability to remember device</li>
      <li>Forgot username and/or password functionality</li>
      <li>More efficient loading of high res GeoJSON - currently this can cause the map to hang for several seconds</li>
      <li>Counties</li>
      <li>A "My Page" that lists all of your places across place types, and give you links to share with others</li>
      <li>Properly styled user interface</li>
      <li>Leaderboards</li>
      <li>Defining your own categories to classify visits</li>
      <li>Other place types like highways, cities, and mountains</li>
    </ul>
  </Container>
);

export default About;
