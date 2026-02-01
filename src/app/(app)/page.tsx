import { HeadshotHeader } from "@/app/(app)/blocks/HeadshotHeader";
import SkillsBanner from "@/app/(app)/blocks/SkillsBanner";
import Bio from "@/app/(app)/blocks/Bio";
import WayOfWorking from "@/app/(app)/blocks/Services";
import Experience from "@/app/(app)/blocks/Experience";
import Testimonials from "@/app/(app)/blocks/Testimonials";

export default function Home() {
  return (
    <>
      <HeadshotHeader />
      <SkillsBanner />
      <Bio />
      <WayOfWorking />
      <Experience />
      <Testimonials />
      <div className="mt-10"></div>
    </>
  );
}
