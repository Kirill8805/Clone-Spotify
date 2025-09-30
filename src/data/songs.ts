export interface Song {
  id: string;
  title: string;
  artist: string;
  secondArtist?: string;
  audioUrl: string;
  coverUrl?: string;
  lyricsUrl?: string;
  album?: string;
  artistId?: string;
  secondArtistId?: string;
  albumId?: string;
}

export const songs: Song[] = [
  {
    id: "1",
    title: "We Found Love",
    artist: "Rihanna",
    artistId: "3fMbdgg4jU18AjLCKBhRSm",
    album: "Talk That Talk",
    albumId: "6dVIqQ8qmQ5GBnJ9shOYGE",
    audioUrl: process.env.PUBLIC_URL + "/songs/Rihanna - We Found Love.mp3",
    coverUrl: process.env.PUBLIC_URL + "/covers/Rihanna - We Found Love.png",
    lyricsUrl: process.env.PUBLIC_URL + "/lyrics/Rihanna - We Found Love.lrc",
  },
  {
    id: "2",
    title: "Snowman",
    artist: "Sia",
    artistId: "5WUlDfRSoLAfcVSX1WnrxN",
    album: "Everyday Is Christmas",
    albumId: "1mYsTxnqsietFxj1OgoGbG",
    audioUrl: process.env.PUBLIC_URL + "/songs/Sia - Snowman.mp3",
    coverUrl: process.env.PUBLIC_URL + "/covers/Sia - Snowman.png",
    lyricsUrl: process.env.PUBLIC_URL + "/lyrics/Sia - Snowman.lrc",
  },
  {
    id: "3",
    title: "Not Afraid",
    artist: "Eminem",
    artistId: "7dGJo4pcD2V6oG8kP0tJRR",
    album: "Recovery",
    albumId: "5s4hQ6jQQ2B7vKXQ4m0q2M",
    audioUrl: process.env.PUBLIC_URL + "/songs/Eminem - Not Afraid.mp3",
    coverUrl: process.env.PUBLIC_URL + "/covers/Eminem - Not Afraid.png", 
    lyricsUrl: process.env.PUBLIC_URL + "/lyrics/Eminem - Not Afraid.lrc",
  },
  {
    id: "4",
    title: "Mockingbird",
    artist: "Eminem",
    artistId: "7dGJo4pcD2V6oG8kP0tJRR",
    album: "Encore",
    albumId: "1s9p4xlr7n6vHk2j0e9w5M",
    audioUrl: process.env.PUBLIC_URL + "/songs/Eminem - Mockingbird.mp3",
    coverUrl: process.env.PUBLIC_URL + "/covers/Eminem - Mockingbird.png",
    lyricsUrl: process.env.PUBLIC_URL + "/lyrics/Eminem - Mockingbird.lrc",
  },
  {
    id: "5",
    title: "Whatever It Takes", 
    artist: "Imagine Dragons",
    artistId: "53XhwfbYqKCa1cC15pYq2q",
    album: "Evolve",
    albumId: "1s9p4xlr7n6vHk2j0e9w6M",
    audioUrl: process.env.PUBLIC_URL + "/songs/Imagine Dragons - Whatever It Takes.mp3",
    coverUrl: process.env.PUBLIC_URL + "/covers/Imagine Dragons - Whatever It Takes.png",
    lyricsUrl: process.env.PUBLIC_URL + "/lyrics/Imagine Dragons - Whatever It Takes.lrc",
  },
  {
    id: "6",
    title: "Demons",
    artist: "Imagine Dragons",
    artistId: "53XhwfbYqKCa1cC15pYq2q",
    album: "Night Visions",
    albumId: "2nLOHgzXzwFEpl62zAgCEC",
    audioUrl: process.env.PUBLIC_URL + "/songs/Imagine Dragons - Demons.mp3",
    coverUrl: process.env.PUBLIC_URL + "/covers/Imagine Dragons - Demons.png",
    lyricsUrl: process.env.PUBLIC_URL + "/lyrics/Imagine Dragons - Demons.lrc",
  },
  {
    id: "7",
    title: "Zero",
    artist: "Imagine Dragons",
    artistId: "53XhwfbYqKCa1cC15pYq2q",
    album: "Ralph Breaks The Internet Soundtrack",
    albumId: "5Z9iiGl0pW3jft4l6UQkM6",
    audioUrl: process.env.PUBLIC_URL + "/songs/Imagine Dragons - Zero.mp3",
    coverUrl: process.env.PUBLIC_URL + "/covers/Imagine Dragons - Zero.png",
    lyricsUrl: process.env.PUBLIC_URL + "/lyrics/Imagine Dragons - Zero.lrc",
  },
  {
    id: "8",
    title: "Прощание",
    artist: "Три Дня Дождя",
    secondArtist: "MONA",
    artistId: "37i6uIdwYkL8vXW8i0O4vG",
    secondArtistId: "1Xyo4u8uXC1ZmMpatF05PJ",
    album: "melancholia",
    albumId: "3mJ6k9XoX1pX1X1X1X1X1X",
    audioUrl: process.env.PUBLIC_URL + "/songs/Три Дня Дождя, MONA - Прощание.mp3",
    coverUrl: process.env.PUBLIC_URL + "/covers/Три Дня Дождя, MONA - Прощание.png",
    lyricsUrl: process.env.PUBLIC_URL + "/lyrics/Три Дня Дождя, MONA - Прощание.lrc",
  }
];
