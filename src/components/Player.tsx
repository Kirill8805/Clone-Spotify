import React, { FC, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { songs } from "../data/songs";
import type { Song } from "../data/songs";
import PlayerControls from "./PlayerControls";
import { toggleFavorite, isFavorite } from "../utils/favorites";
import { BsFilePlay } from "react-icons/bs";
import { TbMicrophone2 } from "react-icons/tb";
import { SlVolume2, SlVolumeOff } from "react-icons/sl";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";

interface Props {
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  isPlaying: boolean;
  setIsPlaying: (v: boolean) => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  showLyrics: boolean;
  setShowLyrics: (v: boolean) => void;
  showNow: boolean;
  setShowNow: (v: boolean) => void;
}

const Player: FC<Props> = ({
  currentIndex,
  setCurrentIndex,
  isPlaying,
  setIsPlaying,
  audioRef,
  showLyrics,
  setShowLyrics,
  showNow,
  setShowNow,
}) => {
  const song: Song = songs[currentIndex];
  const currentUrlRef = useRef<string | null>(null);
  const navigate = useNavigate();
  const [isHovering, setIsHovering] = useState(false);
  const [volume, setVolume] = useState(0.5);

  // локальное состояние избранного для ререндера
  const [fav, setFav] = useState(() => isFavorite(song.id));

  useEffect(() => {
    setFav(isFavorite(song.id));
  }, [song.id]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (currentUrlRef.current !== song.audioUrl) {
      currentUrlRef.current = song.audioUrl;
      audio.src = song.audioUrl;
      audio.volume = volume;
      if (isPlaying) audio.play().catch(() => {});
    }
  }, [song.audioUrl, isPlaying, audioRef]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
    isPlaying ? audio.play().catch(() => {}) : audio.pause();
  }, [isPlaying, audioRef, volume]);

  const handleToggleLyrics = () => {
    const newShowLyrics = !showLyrics;
    setShowLyrics(newShowLyrics);

    if (newShowLyrics) {
      navigate("/lyrics");
    } else {
      navigate(-1);
    }
  };

  const handleToggleNow = () => setShowNow(!showNow);

  const goToAuthor = (id?: string) => {
    if (id) navigate(`/artist/${id}`);
  };

  const handleFavorite = () => {
    toggleFavorite(song.id);
    setFav(isFavorite(song.id));
  };

  return (
    <div className="flex items-center justify-between mx-4 my-2 bg-black rounded-xl">
      <div className="flex flex-1 items-center gap-3">
        {song.coverUrl && (
          <img
            src={song.coverUrl}
            alt={song.title}
            className="w-[56px] h-[56px] object-cover rounded-md"
          />
        )}

        {/* Блок название + артист + кнопка */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <div className="text-[14px] text-white font-semibold hover:underline cursor-pointer">
              {song.title}
            </div>
            <button
              onClick={handleFavorite}
              className="text-gray-400 hover:text-white transition-colors"
              title={fav ? "Убрать из избранного" : "Добавить в избранное"}
            >
              {fav ? <AiFillHeart size={18} className="text-green-500" /> : <AiOutlineHeart size={18} />}
            </button>
          </div>

          <div className="text-[12px] text-[#b3b3b3]">
            <span
              onClick={() => goToAuthor(song.artistId)}
              className="hover:text-white hover:underline cursor-pointer"
            >
              {song.artist}
            </span>
            {song.secondArtist && (
              <>
                {", "}
                <span
                  onClick={() => goToAuthor(song.secondArtistId)}
                  className="hover:text-white hover:underline cursor-pointer"
                >
                  {song.secondArtist}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <audio ref={audioRef as React.RefObject<HTMLAudioElement>} style={{ display: "none" }} />

      <PlayerControls
        audioRef={audioRef}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
      />

      {/* Блок кнопок справа */}
      <div className="flex flex-1 justify-end items-center gap-3">
        <div onClick={handleToggleNow} className="relative flex flex-col items-center hover:scale-105 transition-transform">
          <BsFilePlay
            size={18}
            className={`cursor-pointer transition-colors ${showNow ? "text-green-600 hover:text-green-500" : "text-gray-400 hover:text-white"}`}
          />
          {showNow && (
            <span className="absolute bottom-0 left-1/2 top-[22px] -translate-x-1/2 w-[4px] h-[4px] bg-[#17af4e] rounded-full" />
          )}
        </div>

        <div onClick={handleToggleLyrics} className="relative flex flex-col items-center hover:scale-105 transition-transform">
          <TbMicrophone2
            size={18}
            className={`cursor-pointer transition-colors ${showLyrics ? "text-green-600 hover:text-green-500" : "text-gray-400 hover:text-white"}`}
          />
          {showLyrics && (
            <span className="absolute bottom-0 top-[22px] left-1/2 -translate-x-1/2 w-[4px] h-[4px] bg-[#17af4e] rounded-full" />
          )}
        </div>

        {/* Громкость */}
        <div className="relative flex flex-col items-center hover:scale-105 transition-transform">
          {volume > 0 ? (
            <SlVolume2
              size={18}
              className="cursor-pointer transition-colors text-gray-400 hover:text-white"
              onClick={() => setVolume(0)}
            />
          ) : (
            <SlVolumeOff
              size={18}
              className="cursor-pointer transition-colors text-gray-400 hover:text-white"
              onClick={() => setVolume(0.5)}
            />
          )}
        </div>

        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          style={{
            background: `linear-gradient(to right, ${isHovering ? "#17af4e" : "white"} ${volume * 100}%, #555 ${volume * 100}%)`,
          }}
          className="
            flex-1 max-w-[95px] h-1 rounded-full appearance-none bg-transparent cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:opacity-0 [&::-webkit-slider-thumb]:scale-75
            [&:hover::-webkit-slider-thumb]:opacity-100 [&:hover::-webkit-slider-thumb]:scale-100
            [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer
          "
        />
      </div>
    </div>
  );
};

export default Player;
