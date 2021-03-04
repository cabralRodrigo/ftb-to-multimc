import { Modpack, ModpackList } from "./models";

export class Client {
    private static URL = 'https://api.modpacks.ch';

    public static async listModpacks(): Promise<number[]> {
        const response = await fetch(`${Client.URL}/public/modpack/all`);
        const json: ModpackList = await response.json();

        return json.packs;
    }

    public static async modpackDetails(modpackId: number): Promise<Modpack>
    {
        const response = await fetch(`${Client.URL}/public/modpack/${modpackId}`);
        return await response.json() as Modpack;
    }
}