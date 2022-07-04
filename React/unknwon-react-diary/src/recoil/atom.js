import { atom } from "recoil";

export const favoritePageAtom = atom({
  key: "favoritePageAtom",
  default: 1,
});

export const favoriteDiaryIDAtom = atom({
  key: "favoriteDiaryIDAtom",
  default: "",
});

export const myAllFavoritesDiariesAtom = atom({
  key: "myAllFavoritesDiariesAtom",
  default: [],
});

export const myPageAtom = atom({
  key: "myPageAtom",
  default: 1,
});

export const myDiaryIDAtom = atom({
  key: "myDiaryIDAtom",
  default: "",
});

export const myAllDiariesAtom = atom({
  key: "myAllDiariesAtom",
  default: [],
});
