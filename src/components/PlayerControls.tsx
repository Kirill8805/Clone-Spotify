import React, { FC, useEffect, useState } from "react";
import { IoPlaySkipForwardSharp, IoPlaySkipBackSharp, IoShuffle } from "react-icons/io5";
import { FaPlay, FaPause } from "react-icons/fa";
import { TbRepeat } from "react-icons/tb";
import { songs } from "../data/songs";

interface Props {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  isPlaying: boolean;
  setIsPlaying: (v: boolean) => void;
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
}

const PlayerControls: FC<Props> = ({ audioRef, isPlaying, setIsPlaying, currentIndex, setCurrentIndex }) => {
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const [shuffle, setShuffle] = useState(false);
  const [repeatOne, setRepeatOne] = useState(false);

  // Слежение за прогрессом и окончанием трека
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTime = () => {
      if (!isDragging) setProgress(audio.currentTime);
    };
    const onLoaded = () => setDuration(audio.duration || 0);

    const onEnded = () => handleNext();

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("ended", onEnded);

    if (audio.readyState >= 1) onLoaded();

    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("ended", onEnded);
    };
  }, [audioRef, isDragging, currentIndex, shuffle, repeatOne]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const commitSeek = (time: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = time;
    setProgress(time);
  };

  const handleNext = () => {
    if (repeatOne) {
      commitSeek(0);
      audioRef.current?.play();
      setIsPlaying(true);
      return;
    }

    let nextIndex: number;
    if (shuffle) {
      nextIndex = Math.floor(Math.random() * songs.length);
      if (songs.length > 1) {
        while (nextIndex === currentIndex) {
          nextIndex = Math.floor(Math.random() * songs.length);
        }
      }
    } else {
      nextIndex = (currentIndex + 1) % songs.length;
    }

    setCurrentIndex(nextIndex);
    // сразу проигрываем
    setTimeout(() => {
      audioRef.current?.play();
      setIsPlaying(true);
    }, 0);
  };

  const handlePrev = () => {
    if (repeatOne) {
      commitSeek(0);
      audioRef.current?.play();
      setIsPlaying(true);
      return;
    }

    let prevIndex: number;
    if (shuffle) {
      prevIndex = Math.floor(Math.random() * songs.length);
      if (songs.length > 1) {
        while (prevIndex === currentIndex) {
          prevIndex = Math.floor(Math.random() * songs.length);
        }
      }
    } else {
      prevIndex = currentIndex === 0 ? songs.length - 1 : currentIndex - 1;
    }

    setCurrentIndex(prevIndex);
    setTimeout(() => {
      audioRef.current?.play();
      setIsPlaying(true);
    }, 0);
  };

  return (
    <div className="flex flex-col justify-center items-center w-[50%] h-[60px]">
      <div className="flex items-center gap-4 mx-2 mb-2">
        {/* Перемешка */}
        <button onClick={() => setShuffle(!shuffle)} className="relative">
          <IoShuffle
            size={23}
            className={`transition-colors duration-300 ${shuffle ? "text-green-600 hover:text-green-500" : "text-gray-400 hover:text-white"}`}
          />
          {shuffle && (
            <span className="absolute bottom-0 top-[20px] left-1/2 -translate-x-1/2 w-[4px] h-[4px] bg-[#17af4e] rounded-full" />
          )}
        </button>

        <button onClick={handlePrev} className="p-1 text-[#7d7d7d] hover:text-white transition-colors duration-300">
          <IoPlaySkipBackSharp size={20} />
        </button>

        <button
          onClick={togglePlay}
          className="w-[32px] h-[32px] rounded-full bg-white text-black font-bold flex items-center justify-center transition-transform duration-200 hover:scale-105"
        >
          {isPlaying ? <FaPause size={13} /> : <FaPlay size={13} />}
        </button>

        <button onClick={handleNext} className="p-1 text-[#7d7d7d] hover:text-white transition-colors duration-300">
          <IoPlaySkipForwardSharp size={20} />
        </button>

        {/* Повтор */}
        <button onClick={() => setRepeatOne(!repeatOne)} className="relative">
          <TbRepeat
            size={20}
            className={`transition-colors duration-300 ${repeatOne ? "text-green-600 hover:text-green-500" : "text-gray-400 hover:text-white"}`}
          />
          {repeatOne && (
            <span className="absolute bottom-0 top-[21px] left-1/2 -translate-x-1/2 w-[4px] h-[4px] bg-[#17af4e] rounded-full" />
          )}
        </button>
      </div>

      <div className="flex items-center gap-2 w-full">
        <div className="text-[12px] text-[#b3b3b3] w-10 text-right">{formatTime(progress)}</div>
        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={progress}
          onMouseDown={() => setIsDragging(true)}
          onChange={(e) => setProgress(Number(e.target.value))}
          onMouseUp={(e) => {
            setIsDragging(false);
            commitSeek(Number(e.currentTarget.value));
          }}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          style={{
            background: `linear-gradient(to right, ${isHovering ? '#17af4e' : 'white'} ${(progress / (duration || 1)) * 100}%, #555 ${(progress / (duration || 1)) * 100}%)`,
          }}
          className="
            flex-1 h-1 max-w-full rounded-full appearance-none bg-transparent cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:opacity-0 [&::-webkit-slider-thumb]:scale-75
            [&:hover::-webkit-slider-thumb]:opacity-100 [&:hover::-webkit-slider-thumb]:scale-100
            [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer
          "
        />
        <div className="text-[12px] text-[#b3b3b3] w-10">{formatTime(duration)}</div>
      </div>
    </div>
  );
};

function formatTime(sec: number) {
  if (!sec || !isFinite(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default PlayerControls;
