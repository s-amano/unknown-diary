import { atom } from "recoil";

export const pageAtom = atom({
  key: "pageAtom",
  default: 1,
});

export const diaryIDAtom = atom({
  key: "diaryIDAtom",
  default: "",
});

export const myAllFavoritesDiariesAtom = atom({
  key: "myAllFavoritesDiariesAtom",
  default: [],
});
