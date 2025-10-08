import Header from './components/Header';
import JobsHome from './components/JobsHome';
import MostPopularVacacines from './components/MostPopularVacacines';
import HomeHowItWorks from './components/HomeHowItWorks';
export default function Home() {
  

  return (
    <div className="min-h-screen w-full ">
        <Header />
        <JobsHome />
        <MostPopularVacacines />
        < HomeHowItWorks />
    </div>
  );
}