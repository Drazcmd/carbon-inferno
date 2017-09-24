import React from 'react';

import { Footer, Header } from '../../components';

const Contribute = () => (
  <div>
    <div className="page-background">
      <Header />
      <div className="team-header">Contribute</div>
      <div className="text-page">
        <h2>Give A Fuck in 5 Seconds</h2>
        <p>Give us a star on Github <br />
          <a className="github-button" href="https://github.com/giving-a-fuck-about-climate-change/carbondoomsday" data-icon="octicon-star" aria-label="Star giving-a-fuck-about-climate-change/carbondoomsday on GitHub">Star</a>
        </p>
        <h2>Give A Fuck in 10 minutes</h2>
        <ul>
          <li>Help us get to #1 on Google. Raise our Google rank for "climate change chart"- use your blog or website to backlink our project from your website.</li>
          <li>Help Establish Scientific Credibility: Want to be a science advisor for the project, or know a scientist who should be connected?</li>
          <li>Submit a New Idea: How can we apply climate data in new ways?</li>
          <li>Art Exhibits: Artist and Designer Purin Phanichphant says that "climate change must be felt not understood". How might the Carbon Doomsday API power work like Purin's "Feel The Warming" and "Connect Our Efforts"?</li>
          <li>Gaming: How might up-to-date carbon dioxide data enrich a VR game?</li>
          <li>And how can we stimulate the creation of more "Open Climate" APIs, beyond what carbon dioxide featured on Carbon Doomsday?</li>
        </ul>
        <h2>Submit An Idea</h2>
        <p>If you have an idea or a potential solution that would use the Carbon Doomsday API and want to share it with us <a href="https://docs.google.com/forms/d/e/1FAIpQLScWObxJHjnV8uMW9ywqZRo2kgFYNZKmE7aGfhrsTxS-yWXGhw/viewform">click here</a>.</p>
        <p>We have collated all the great ideas we've seen for using the Carbon Doomsday API <a href="https://docs.google.com/spreadsheets/d/1K2vnUnuCoTadRY-8XpUz9sH4JrzAX9odLnniiOa1780/edit">here</a>.</p>
      </div>
    </div>
    <Footer />
  </div>
);

export default Contribute;
