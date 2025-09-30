import { useRef, useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { FaSpotify } from "react-icons/fa6";

import Player from "./components/Player";
import Lyrics from "./components/Lyrics";
import NowPlaying from "./components/NowPlaying";
import ArtistPage from "./components/ArtistPage";
import FavoritesPage from "./components/FavoritesPage";

import { songs } from "./data/songs";
import { saveLastTrack, getLastTrack } from "./utils/lastTrack";

export default function App() {
  // ── Player state
  const [currentIndex, setCurrentIndex] = useState<number>(() => {
    try {
      const lastId = getLastTrack();
      if (!lastId) return 0;
      const idx = songs.findIndex(s => s.id === lastId);
      return idx >= 0 ? idx : 0;
    } catch {
      return 0;
    }
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  const [showNow, setShowNow] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const song = songs[currentIndex];

  // ── Layout sizes
  const minWidthSidebar = 75;
  const stepWidthSidebar = 200;
  const maxPercentSidebar = 0.3;

  const minWidthNow = 280;
  const maxPercentNow = 0.26;

  const [sidebarWidth, setSidebarWidth] = useState(minWidthSidebar);
  const [lockedSidebar, setLockedSidebar] = useState(true);
  const [nowWidth, setNowWidth] = useState(minWidthNow);
  const [lockedNow, setLockedNow] = useState(true);

  const isResizing = useRef<"sidebar" | "now" | false>(false);
  const navigate = useNavigate();

  // ── Restore last played track
  useEffect(() => {
    const lastId = getLastTrack();
    if (lastId) {
      const idx = songs.findIndex(s => s.id === lastId);
      if (idx >= 0) setCurrentIndex(idx);
    }
  }, []);

  // Save current track to localStorage
  useEffect(() => {
    const id = songs[currentIndex]?.id;
    if (id) saveLastTrack(id);
  }, [currentIndex]);

  // ── Resize handlers
  const startResize = (type: "sidebar" | "now") => {
    isResizing.current = type;
    document.body.style.cursor = "grabbing";
  };

  const stopResize = () => {
    isResizing.current = false;
    document.body.style.cursor = "default";
  };

  const ArtistRouteWrapper = () => (
    <div className="flex-1 overflow-y-auto">
      <ArtistPage
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        audioRef={audioRef}
      />
    </div>
  );

  const handleResize = (e: MouseEvent) => {
    if (!isResizing.current) return;
    const windowWidth = window.innerWidth;

    if (isResizing.current === "sidebar") {
      const maxWidth = windowWidth * maxPercentSidebar;
      let newWidth = e.clientX;
      if (newWidth < minWidthSidebar) newWidth = minWidthSidebar;
      if (newWidth > maxWidth) newWidth = maxWidth;

      if (lockedSidebar) {
        if (newWidth >= stepWidthSidebar) {
          setSidebarWidth(stepWidthSidebar);
          setLockedSidebar(false);
        } else setSidebarWidth(minWidthSidebar);
      } else {
        setSidebarWidth(newWidth);
        if (newWidth < stepWidthSidebar) setLockedSidebar(true);
      }
    }

    if (isResizing.current === "now") {
      const maxWidth = windowWidth * maxPercentNow;
      let newWidth = windowWidth - e.clientX;
      if (newWidth < minWidthNow) newWidth = minWidthNow;
      if (newWidth > maxWidth) newWidth = maxWidth;

      if (lockedNow) {
        if (newWidth > minWidthNow) {
          setNowWidth(newWidth);
          setLockedNow(false);
        }
      } else {
        setNowWidth(newWidth);
        if (newWidth < minWidthNow) setLockedNow(true);
      }
    }
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleResize);
    window.addEventListener("mouseup", stopResize);
    return () => {
      window.removeEventListener("mousemove", handleResize);
      window.removeEventListener("mouseup", stopResize);
    };
  }, [lockedSidebar, lockedNow]);

  // ── Render
  return (
    <main className="bg-[#000] text-white h-screen">
      {/* Верхняя панель с логотипом */}
      <nav>
        <div className="w-[90px] h-[70px] flex items-center justify-center">
          <FaSpotify size={35} />
        </div>
      </nav>

      <section className="flex gap-1 mx-2">
        {/* Левая навигация */}
        <nav
          className="bg-[#151515] rounded-lg flex flex-col p-2"
          style={{ width: `${sidebarWidth}px`, height: `calc(100vh - 154px)` }}
        >
          <button
            onClick={() => navigate("/favorites")}
            className="w-[59px] h-[59px] p-2 rounded mb-2 text-xl 
                      bg-gradient-to-br from-[#4202f6] to-[#ffffff] 
                      hover:opacity-90 transition-opacity"
          >
            ❤
          </button>
        </nav>

        {/* Ручка ресайза */}
        <div
          onMouseDown={() => startResize("sidebar")}
          className="w-[2px] cursor-grab hover:bg-gray-500 my-2 transition-colors"
        />

        {/* Основной контент */}
        <section
          className="flex-1 flex flex-col bg-[#151515] rounded-lg overflow-y-auto"
          style={{ height: `calc(100vh - 154px)` }}
        >
          <Routes>
            <Route
              path="/lyrics"
              element={
                showLyrics ? (
                  <div className="flex-1 overflow-y-auto">
                    <Lyrics song={song} audioRef={audioRef} />
                  </div>
                ) : (
                  <div className="flex items-center justify-center flex-1 text-gray-400">
                    Выберите контент
                  </div>
                )
              }
            />
            <Route path="/artist/:id" 
            element={
              <ArtistRouteWrapper />

            } />
            <Route path="/favorites" element={<FavoritesPage />} />
          </Routes>
        </section>

        {/* Правая панель «Сейчас играет» */}
        {showNow && (
          <NowPlaying
            song={song}
            showNow={showNow}
            nowWidth={nowWidth}
            startResize={startResize}
          />
        )}
      </section>

      {/* Нижний плеер */}
      <aside className="fixed bottom-0 left-0 w-full bg-black rounded-xl z-50">
        <Player
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          audioRef={audioRef}
          showLyrics={showLyrics}
          setShowLyrics={setShowLyrics}
          showNow={showNow}
          setShowNow={setShowNow}
        />
      </aside>
    </main>
  );
}