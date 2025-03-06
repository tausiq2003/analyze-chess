import Analysis from "./components/analysis";
import Footer from "./components/footer";
import Main from "./components/main-page";
import NavBar from "./components/nav-bar";

export default function Home() {
    return (
        <>
            <NavBar />
            <Main />
            <Analysis />
            <Footer />
        </>
    );
}
