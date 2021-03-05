import { Modpack } from "../overwolf/models";

const KEY = 'modpacks';

type StoredModpacks = {
    modpacks: Modpack[],
    updateDate: string | Date
}

export default class ModpackStorage {
    public static hasModpacks() {
        return !!localStorage.getItem(KEY);
    }

    public static clear() {
        localStorage.removeItem(KEY);
    }

    public static get(): [Modpack[], Date] {
        const json = localStorage.getItem(KEY);
        const stored = JSON.parse(json) as StoredModpacks;
        const date = new Date(Date.parse(stored.updateDate as string));

        return [stored.modpacks, date];
    }

    public static set(modpacks: Modpack[]) {
        const stored: StoredModpacks = { modpacks, updateDate: new Date() };
        const json = JSON.stringify(stored);

        localStorage.setItem(KEY, json);
    }
}