import { create } from 'zustand'
// use zustand to create

interface State {
    ready: boolean;
    isReady: () => void;
}
// Object below is our state, which is called in our hero.
// Function when called, checks if the rest of the app is ready to start animation or wait.
export const useStore = create<State>((set) => ({
  ready: false,
  isReady: ()=> set({ready: true})
}))
