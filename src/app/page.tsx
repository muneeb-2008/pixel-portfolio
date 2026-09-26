import { GameLoader } from "@/components/game/GameLoader";
import { PortfolioIndex } from "@/components/PortfolioIndex";

export default function Home() {
  return (
    <>
      {/* Server-rendered text version of everything in the world — for crawlers,
          screen readers and no-JS visitors. The canvas game layers on top. */}
      <PortfolioIndex />
      <GameLoader />
    </>
  );
}
