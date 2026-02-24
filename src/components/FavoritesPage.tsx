import { useEffect, useState } from "react";
import { songs, Song } from "../data/songs";

const STORAGE_KEY = "favoriteSongs";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Song[]>([]);

  useEffect(() => {
    const load = () => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
        const ids: string[] = JSON.parse(saved);
        setFavorites(songs.filter(s => ids.includes(s.id)));
        } else {
        setFavorites([]);
        }
    };

    load(); // начальная загрузка
    window.addEventListener("favorites-changed", load);
    return () => window.removeEventListener("favorites-changed", load);
    }, []);

  const removeFavorite = (id: string) => {
    const updated = favorites.filter(s => s.id !== id);
    setFavorites(updated);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updated.map(s => s.id))
    );
  };

  return (
    <main>

    <div className="p-6 bg-gradient-to-tr from-[#281c4e] to-[#533ca0]">
      <header className="flex items-end space-x-4">
        <div className="min-w-[200px] min-h-[200px] p-2 rounded mb-2 text-xl  bg-gradient-to-br from-[#4202f6] to-[#ffffff] hover:opacity-90 transition-opacity  flex items-center justify-center">
          <span className="text-7xl">❤</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[14px]">Плейлист</span>
          <h1 className="text-[96px] font-bold">Любимые треки</h1>
          <p>
            <span className="font-bold">Vãnïllã</span>
            <span className="text-gray-400">
              {" "}• {favorites.length} треков
            </span>
          </p>
        </div>
      </header>
    </div>
      {favorites.length === 0 ? (
        <p className="text-gray-400">Нет добавленных треков</p>
      ) : (
        <table className="w-full text-left border-separate border-spacing-y-2 p-6">

          <thead>
            <tr className="text-gray-400 text-sm">
              <th className="px-3">#</th>
              <th className="px-3">Название</th>
              <th className="px-3">Альбом</th>
              {/* <th className="px-3 text-right">Действие</th> */}
            </tr>
          </thead>

          <tbody>
            {favorites.map((song, index) => (
              <tr
                key={song.id}
                className="hover:bg-[#2a2a2a] transition-colors rounded-md"
              >
                <td className="px-3 py-3 text-gray-400 text-sm">
                  {index + 1}
                </td>

                <td className="px-3 py-3">
                  <div className="flex items-center space-x-3">
                    <img
                      src={song.coverUrl}
                      className="h-[40px] w-[40px] object-cover rounded-sm"
                      alt=""
                    />
                    <section className="flex flex-col">
                      <span className="font-semibold">{song.title}</span>
                      <span className="text-gray-400 text-[14px]">{song.artist} {song.secondArtist && `, ${song.secondArtist}`}</span>
                    </section>
                  </div>
                </td>

                <td className="px-3 py-3 text-gray-400">
                  {song.album}
                </td>

                <td className="px-3 py-3 text-right">
                  <button
                    onClick={() => removeFavorite(song.id)}
                    className="text-red-400 hover:text-red-600 transition-colors"
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )} 
    </main>
  );
}
