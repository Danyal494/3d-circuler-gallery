import { create } from "zustand";

export default create((set) => ({
  image: null,
  setImage: (image) => set({ image }),
}));