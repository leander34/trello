import { create } from "zustand";
interface ModalState {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}
export const useModalStore = create<ModalState>((set, get) => ({
  isOpen: false,
  closeModal: () => set({ isOpen: false }),
  openModal: () =>
    set({
      isOpen: true,
    }),
}));
