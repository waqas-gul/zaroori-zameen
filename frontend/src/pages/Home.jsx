import React from "react";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Properties from "../components/propertiesshow";
import Steps from "../components/Steps";
import Testimonials from "../components/testimonial";
import Blog from "../components/Blog";
import HomeFAQ from "../components/HomeFAQ";


const Home = () => {
  return (
    <>
      <Hero />
      <Features />
      <Properties />
      <Steps />
      <Testimonials />
      <HomeFAQ />
      <Blog />
    </>
  );
};

export default Home;
