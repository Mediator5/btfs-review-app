import { Outlet } from "react-router-dom";
import HHeader from "./HHeader";
import HHero from "./HHero";
import SiteReviewCard from "./SiteReviewCard";

export default function Home() {
    return (
        <div className="Home">

            <HHeader />
            <HHero />
            <SiteReviewCard />
            <Outlet />

        </div>
    );
}
