import React from 'react';

import { Box } from '@mui/material';
import { Header } from '../components1/header';
import { Homepage } from '../components1/Homepage';
import { AboutSection } from '../components1/About';
import { ClubsSection } from '../components1/clubs';
import { Communities } from '../components1/communitiesnew';
import { FrequentQuestions } from '../components1/FrequentQuestions';
import { Footer } from '../components1/Footer';
import { ServiceFeatures } from '../components1/Service';

const Nxthome=()=> {
  return (
    <Box>
    <div>
      <Header />

      <div id="home">
        <Homepage />
      </div>

      <div id="about">
        <AboutSection />
      </div>

      <div id="clubs">
        <ClubsSection />
      </div>

      <ServiceFeatures/>

      <div id="communities">
        <Communities />
      </div>

      <FrequentQuestions />

       <div id="contact">
        <Footer />
      </div> 

    </div>
    </Box>
  );
}

export default Nxthome;