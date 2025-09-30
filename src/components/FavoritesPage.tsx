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
    <div className="p-4">
      <h1 className="text-2xl mb-4">Понравившиеся треки</h1>
      {favorites.length === 0 ? (
        <p className="text-gray-400">Нет добавленных треков</p>
      ) : (
        <ul className="space-y-3">
          {favorites.map(song => (
            <li
              key={song.id}
              className="flex items-center justify-between bg-[#222] rounded-lg p-3"
            >
              <div>
                <div className="font-semibold">{song.title}</div>
                <div className="text-sm text-gray-400">
                  {song.artist}
                  {song.secondArtist && `, ${song.secondArtist}`}
                </div>
              </div>
              <button
                onClick={() => removeFavorite(song.id)}
                className="text-red-400 hover:text-red-600"
              >
                Удалить
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
