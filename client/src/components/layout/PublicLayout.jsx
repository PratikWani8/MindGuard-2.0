import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import AmbientBackground from "./AmbientBackground";

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <AmbientBackground />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
