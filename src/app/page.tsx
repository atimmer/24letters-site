import { HeadshotHeader } from "@/app/blocks/HeadshotHeader";
import SkillsBanner from "@/app/blocks/SkillsBanner";
import Bio from "@/app/blocks/Bio";
import WayOfWorking from "@/app/blocks/WayOfWorking";
import Experience from "@/app/blocks/Experience";

export default function Home() {
  return (
    <>
      <HeadshotHeader />
      <SkillsBanner />
      <Bio />
      <WayOfWorking />
      <Experience />
    </>
  );
}
