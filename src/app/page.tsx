import Hero from "./components/sections/Hero";
import About from "./components/sections/About";
import Projects from "./components/sections/Projects";
import SisterCompanies from "./components/SisterCompanies/SisterCompanies";
import FacilitiesExperience from "./components/FacilitiesExperience/FacilitiesExperience";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <FacilitiesExperience />
      <Projects />
      <SisterCompanies />
    </>
  );
}
