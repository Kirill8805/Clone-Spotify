const STORAGE_KEY = "favoriteSongs";

/** Безопасное чтение из localStorage */
function read(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/** Безопасная запись */
function write(data: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error("Не удалось сохранить избранные треки:", err);
  }
}

/** Получить список избранных треков */
export function getFavorites(): string[] {
  return read();
}

/** Проверить, есть ли трек в избранном */
export function isFavorite(id: string): boolean {
  return read().includes(id);
}

/**
 * Добавить или удалить трек из избранного
 * @returns обновлённый список избранных
 */
function emitFavoritesChange() {
  window.dispatchEvent(new Event("favorites-changed"));
}

export function toggleFavorite(id: string): string[] {
  const saved = read();
  const updated = saved.includes(id)
    ? saved.filter(x => x !== id)
    : [...saved, id];
  write(updated);
  emitFavoritesChange();      // 🔑 оповещение
  return updated;
}
