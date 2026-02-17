import { Routes, Route } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Home } from "@/pages/Home";
import { ArtistSoftware } from "@/pages/ArtistSoftware";
import { NetworkPreview } from "@/pages/NetworkPreview";
import { RunOfShow } from "@/pages/RunOfShow";

function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/artist-software" element={<ArtistSoftware />} />
          <Route path="/network-preview" element={<NetworkPreview />} />
          <Route path="/run-of-show" element={<RunOfShow />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
