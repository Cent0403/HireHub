import JobsHome from './components/JobsHome';
import MostPopularVacacines from './components/MostPopularVacacines';
import HomeHowItWorks from './components/HomeHowItWorks';
import Resources from './components/Resources';

export default function Home() {
  return (
    <>
      <JobsHome />
      <MostPopularVacacines />
      <HomeHowItWorks />
      <Resources />
    </>
  );
}