import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { authors } from "../data/authors";
import { songs } from "../data/songs";
import { HiBadgeCheck } from "react-icons/hi";
import { FastAverageColor } from "fast-average-color";
import { FaPlay, FaPause } from "react-icons/fa";

interface Props {
  currentIndex: number;
  setCurrentIndex: (v: number) => void;
  isPlaying: boolean;
  setIsPlaying: (v: boolean) => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
}

export default function ArtistPage({
  currentIndex,
  setCurrentIndex,
  isPlaying,
  setIsPlaying,
  audioRef,
}: Props) {
  const { id } = useParams<{ id: string }>();
  const author = authors.find((a) => a.id === id);
  const artistSongs = songs.filter(
    (s) => s.artistId === id || s.secondArtistId === id
  );
  const [dominant, setDominant] = useState("#000");
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    if (!author) return;
    const fac = new FastAverageColor();
    fac
      .getColorAsync(author.photoUrl, { crossOrigin: "anonymous" })
      .then((color: any) => setDominant(color.hex))
      .catch(() => setDominant("#000"));
  }, [author]);

  if (!author)
    return <div className="text-white p-6">Исполнитель не найден</div>;

  const handlePlay = () => {
    if (!artistSongs.length || !audioRef.current) return;
    const firstTrackIndex = songs.findIndex((s) => s.id === artistSongs[0].id);
    if (firstTrackIndex !== -1) {
      setCurrentIndex(firstTrackIndex);
      setIsPlaying(true);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto text-white w-full min-h-screen relative">
      {/* Блок с фото */}
      <div className="sticky top-0 z-10 h-[300px] flex items-end p-6 select-none">
        <img
          src={author.photoUrl}
          alt={author.name}
          className="absolute inset-0 w-full h-full object-cover object-top"
          style={{ filter: "saturate(1.2)" }}
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="absolute top-20 left-8 z-10">
        <span className="text-sm font-medium flex items-center gap-1">
          <span className="relative w-5 h-5 flex items-center justify-center">
            <span className="absolute inset-0 bg-white rounded-full"></span>
            <HiBadgeCheck className="absolute text-blue-400" size={30} />
          </span>
          Подтвержденный исполнитель
        </span>
        <h2 className="text-[96px] font-bold mb-6 leading-none">
          {author.name}
        </h2>
        <span className="text-[16px] font-normal">
          {new Intl.NumberFormat("ru-RU").format(author.listeners ?? 0)}{" "}
          слушателя за месяц
        </span>
      </div>

      {/* Контент */}
      <div className="relative z-40 bg-[#151515]">
        {/* Градиент + кнопка в одном sticky контейнере */}
        <div 
          className="sticky left-0 top-0 w-full h-[85px] z-40 flex items-start"
          style={{
            background: `${dominant}`,
          }}
        >
          <button
            onClick={handlePlay}
            className="absolute top-0 ml-6 my-4 w-14 h-14 rounded-full bg-green-500 flex items-center justify-center text-black shadow-lg hover:scale-110 transition-transform"
          >
            {isPlaying && songs[currentIndex].artistId === id ? (
              <FaPause size={18} />
            ) : (
              <FaPlay size={18} />
            )}
          </button>
        </div>
        <div
          className="sticky left-0 top-0 w-full h-[50px] z-30 flex items-start"
          style={{
            background: `linear-gradient(to bottom, ${dominant}, transparent)`,
          }}
        />
        <section className="px-6">
          <h2 className="text-2xl font-semibold mb-4">Популярные треки</h2>
          <div className="space-y-1">
            {artistSongs.map((song, index) => (
              <div
                key={song.id}
                className="flex items-center gap-3 z-20 bg-[#151515] p-2 rounded-md hover:bg-[#2a2a2a] transition cursor-pointer"
                onMouseEnter={() => setHovered(index)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => {
                  const idx = songs.findIndex((s) => s.id === song.id);
                  if (idx !== -1) {
                    setCurrentIndex(idx);
                    setIsPlaying(true);
                  }
                }}
              >
                {/* Номер трека или иконка при наведении */}
                <div className="w-6 text-gray-400 text-right pr-1 flex items-center justify-end select-none">
                  {hovered === index ? (
                    <FaPlay size={11} className="text-gray-300" />
                  ) : (
                    index + 1
                  )}
                </div>

                {song.coverUrl && (
                  <img
                    src={song.coverUrl}
                    alt={song.title}
                    className="w-[40px] h-[40px] rounded-[3px] object-cover"
                  />
                )}

                <div>
                  <span className="font-semibold">{song.title}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
