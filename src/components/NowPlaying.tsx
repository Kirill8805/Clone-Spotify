import React, { FC } from "react";
import type { Song } from "../data/songs";

interface Props {
  song: Song;
  showNow: boolean;
  nowWidth: number;
  startResize: (type: "now") => void;
}

const NowPlaying: FC<Props> = ({ song, showNow, nowWidth, startResize }) => {
  if (!showNow) return null;

  return (
    <>
      {/* Ручка для ресайза */}
      <div
        onMouseDown={() => startResize("now")}
        className="w-[2px] cursor-grab hover:bg-gray-500 my-2 transition-colors"
      />

      {/* Секция "Играет сейчас" */}
      <section
        className="bg-[#121212] p-4 rounded-lg overflow-hidden"
        style={{
          width: `${nowWidth}px`,
          height: `calc(100vh - 154px)`
        }}
      >
        <div className="text-white">
          <h2 className="text-[16px] font-bold mb-4 hover:underline cursor-pointer">{song.title}</h2>
          <div className="flex flex-col items-start">
            {song.coverUrl && (
              <img
                src={song.coverUrl}
                alt={song.title}
                className="w-full rounded-lg mb-2 cursor-pointer"
              />
            )}
            <div className="text-[24px] font-bold hover:underline cursor-pointer">{song.title}</div>
            <div className="text-[16px] text-[#b3b3b3]">
              <span className="hover:text-white hover:underline cursor-pointer">
                {song.artist}
              </span>
              {song.secondArtist && (
                <>
                  {", "}
                  <span className="hover:text-white hover:underline cursor-pointer">
                    {song.secondArtist}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default NowPlaying;
