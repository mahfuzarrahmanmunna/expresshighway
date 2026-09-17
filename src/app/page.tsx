import Hero from "./components/sections/Hero";
import About from "./components/sections/About";
import Projects from "./components/sections/Projects";
import SisterCompanies from "./components/SisterCompanies/SisterCompanies";
import FacilitiesExperience from "./components/FacilitiesExperience/FacilitiesExperience";
import Amenities from "./components/Amenities/Amenities";
import AboutLocation from "./components/About/About";
import Ventures from "./components/Ventures/Ventures";
import ClubLoungeTeaser from "./components/ClubLoungeTeaser/ClubLoungeTeaser";
import GalleryTeaser from "./components/GalleryTeaser/GalleryTeaser";
import EndorsementBar from "./components/EndorsementBar/EndorsementBar";
import Affiliations from "./components/Affiliations/Affiliations";
import ContactTrust from "./components/ContactTrust/ContactTrust";

export default function Home() {
  return (
    <>
      <Hero />
      <Amenities/>
      <AboutLocation/>
      <Ventures/>
      <ClubLoungeTeaser/>
      <GalleryTeaser/>
      <EndorsementBar/>
      <Affiliations/>
      <ContactTrust/>
      <About />
      {/* <FacilitiesExperience /> */}
      {/* <Projects /> */}
      {/* <SisterCompanies /> */}
    </>
  );
}
