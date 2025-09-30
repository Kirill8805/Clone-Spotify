import React, { FC, useEffect, useRef, useState } from "react";
import type { Song } from "../data/songs";

interface Props {
  song: Song;
  audioRef: React.RefObject<HTMLAudioElement | null>;
}

const Lyrics: FC<Props> = ({ song, audioRef }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState<{ time: number; text: string }[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [dominantColor, setDominantColor] = useState({ r: 51, g: 51, b: 51 });

  const colorToRGB = ({ r, g, b }: { r: number; g: number; b: number }) => `rgb(${r},${g},${b})`;

  // --- Извлечение доминирующего цвета ---
  useEffect(() => {
    if (!song.coverUrl) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = song.coverUrl;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Сжимаем изображение до маленького размера для ускорения
      const w = 50;
      const h = Math.floor((img.height / img.width) * 50);
      canvas.width = w;
      canvas.height = h;

      ctx.drawImage(img, 0, 0, w, h);
      const data = ctx.getImageData(0, 0, w, h).data;

      let rSum = 0, gSum = 0, bSum = 0, count = 0;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        // Игнорируем слишком светлые и слишком темные пиксели
        if (brightness > 30 && brightness < 220) {
          rSum += r;
          gSum += g;
          bSum += b;
          count++;
        }
      }

      if (count === 0) count = 1; // защита от деления на ноль
      let rAvg = rSum / count;
      let gAvg = gSum / count;
      let bAvg = bSum / count;

      // Немного затемняем фон для читаемости текста
      rAvg *= 0.7;
      gAvg *= 0.7;
      bAvg *= 0.7;

      setDominantColor({ r: rAvg, g: gAvg, b: bAvg });
    };
  }, [song.coverUrl]);

  // --- Парсинг LRC ---
  useEffect(() => {
    setLines([]);
    setCurrentIndex(-1);

    if (!song.lyricsUrl) return;

    fetch(song.lyricsUrl)
      .then((r) => (r.ok ? r.text() : Promise.reject("lyrics not found")))
      .then((raw) => {
        const parsed: { time: number; text: string }[] = [];
        const rows = raw.split(/\r?\n/);
        for (const row of rows) {
          if (!row.trim()) continue;
          const timeRegex = /\[(\d{1,2}):(\d{2}(?:\.\d{1,3})?)\]/g;
          let match: RegExpExecArray | null;
          const timeMatches: RegExpExecArray[] = [];
          while ((match = timeRegex.exec(row)) !== null) timeMatches.push(match);
          const text = row.replace(/\[(\d{1,2}):(\d{2}(?:\.\d{1,3})?)\]/g, "").trim();
          for (const m of timeMatches) {
            const min = Number(m[1]);
            const sec = Number(m[2]);
            parsed.push({ time: min * 60 + sec, text: text || "♪" });
          }
        }
        parsed.sort((a, b) => a.time - b.time);
        setLines(parsed);
      })
      .catch(() => setLines([{ time: 0, text: "Текст не найден" }]));
  }, [song]);

  // --- Обновление текущей строки ---
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handler = () => {
      const t = audio.currentTime;
      if (!lines.length) return;
      let idx = lines.length - 1;
      for (let i = 0; i < lines.length; i++) {
        if (t < lines[i].time) {
          idx = i - 1;
          break;
        }
      }
      if (idx < 0) idx = 0;
      if (idx !== currentIndex) setCurrentIndex(idx);
    };
    audio.addEventListener("timeupdate", handler);
    return () => audio.removeEventListener("timeupdate", handler);
  }, [lines, currentIndex, audioRef]);

  // --- Автоскролл ---
  useEffect(() => {
    if (!containerRef.current || currentIndex < 0) return;
    const container = containerRef.current;
    const activeLine = container.children[currentIndex] as HTMLDivElement;
    if (!activeLine) return;

    const offset = activeLine.offsetTop - container.clientHeight / 2 + activeLine.clientHeight / 2;
    container.scrollTo({ top: offset, behavior: "smooth" });
  }, [currentIndex]);

  const jumpTo = (time: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = time;
    audio.play().catch(() => {});
  };

  const getTextColor = (index: number) => {
    const { r, g, b } = dominantColor;
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    // Если фон темный → текст светлый, если фон светлый → текст темный
    const base = brightness < 128 ? 220 : 40;

    if (index === currentIndex) return `white`;
    if (index === currentIndex + 1) return `rgb(${Math.floor(base * 0.7)},${Math.floor(base * 0.7)},${Math.floor(base * 0.7)})`;
    if (index < currentIndex) return `rgb(${Math.floor(base * 0.5)},${Math.floor(base * 0.5)},${Math.floor(base * 0.5)})`;
    return `rgb(${Math.floor(base * 0.7)},${Math.floor(base * 0.7)},${Math.floor(base * 0.7)})`;
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-full overflow-y-auto rounded-lg p-3 pt-16 font-bold"
      style={{ backgroundColor: colorToRGB(dominantColor) }}
    >
      {lines.length === 0 ? (
        <div className="flex items-center justify-center w-full h-full">
          <span className="text-[72px] text-white">
            Увы! Этого текста у нас <br /> пока нет.
          </span>
        </div>
      ) : (
        lines.map((ln, i) => (
          <div
            key={i}
            onClick={() => jumpTo(ln.time)}
            className="py-1 px-20 text-left text-[48px] cursor-pointer transition-colors hover:text-white hover:underline"
            style={{ color: getTextColor(i) }}
          >
            {ln.text}
          </div>
        ))
      )}
    </div>
  );
};

export default Lyrics;
