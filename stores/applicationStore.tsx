import { create } from 'zustand';

export type ApplicationStore = {
	client: string;
	server: string;
	setClientStatus: (status: string) => void;
	setServerStatus: (status: string) => void;
};

const useApplicationStore = create<ApplicationStore>((set) => ({
	client: '',
	server: '',
	setClientStatus: (status: string) => {
		set(() => ({ client: status }));
	},
	setServerStatus: (status: string) => {
		set(() => ({ server: status }));
	},
}));

export default useApplicationStore;
