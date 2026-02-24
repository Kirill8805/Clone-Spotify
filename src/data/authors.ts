// src/data/authors.ts
export interface Author {
  id: string;
  name: string;
  photoUrl: string;
  listeners?: number;
  bio?: string;
}

export const authors: Author[] = [
  {
    id: "3fMbdgg4jU18AjLCKBhRSm",
    name: "Rihanna",
    photoUrl: process.env.PUBLIC_URL + "/authors/Rihanna.jpg",
    bio: "Барбадосская певица, автор песен и актриса."
  },
  {
    id: "5WUlDfRSoLAfcVSX1WnrxN",
    name: "Sia",
    photoUrl: process.env.PUBLIC_URL + "/authors/Sia.jpg"
  },
  {
    id: "7dGJo4pcD2V6oG8kP0tJRR",
    name: "Eminem",
    photoUrl: process.env.PUBLIC_URL + "/authors/Eminem.jpg",
    listeners: 67878478,
  },
  {
    id: "53XhwfbYqKCa1cC15pYq2q",
    name: "Imagine Dragons",
    photoUrl: "/authors/Imagine Dragons.jpg",
    listeners: 53023784,
  },
  {
    id: "37i6uIdwYkL8vXW8i0O4vG",
    name: "Три Дня Дождя",
    photoUrl: process.env.PUBLIC_URL + "/authors/Три Дня Дождя.jpg"
  },
  {
    id: "1Xyo4u8uXC1ZmMpatF05PJ",
    name: "MONA",
    photoUrl: process.env.PUBLIC_URL + "/authors/MONA.jpg"
  }
];
