import { create } from 'zustand';
import { DefinedError } from '../functions/definedError';

export type ErrorStore = {
	list: DefinedError[];
	updateList: (error: DefinedError) => void;
};

const useErrorStore = create<ErrorStore>((set) => ({
	list: [{ name: '', message: '', stack: '' }],
	updateList: (error: DefinedError) => {
		set((state) => ({ list: [...state.list, error] }));
	},
}));

export default useErrorStore;
