const KEY = "lastPlayedTrack";

export const saveLastTrack = (id: string) => {
  try {
    localStorage.setItem(KEY, id);
  } catch (e) {
    console.error("Ошибка сохранения последнего трека", e);
  }
};

export const getLastTrack = (): string | null => {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
};
