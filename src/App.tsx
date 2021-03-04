import { useEffect, useState } from "react"
import { Client as OverwolfClient } from "./overwolf/client";
import { Modpack } from "./overwolf/models";

export default function App() {
    const [loading, setLoading] = useState(true);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [modpacks, setModpacks] = useState<Modpack[]>([]);

    const loadModpacks = async function () {
        const json = localStorage.getItem('modpacks');
        if (json)
            setModpacks(JSON.parse(json));
        else {
            const loadedModpacks = [];

            setLoadingMessage('modpack list');
            const modpackIds = await OverwolfClient.listModpacks();

            for (const modpackId of modpackIds) {
                const modpack = await OverwolfClient.modpackDetails(modpackId);
                loadedModpacks.push(modpack);
                setLoadingMessage(modpack.name);
            }

            localStorage.setItem('modpacks', JSON.stringify(loadedModpacks));
            setModpacks(loadedModpacks);
        }
    };

    useEffect(() => {
        (async () => {
            await loadModpacks();
            setLoading(false);
        })();
    }, []);

    if (loading)
        return <h1>Loading {loadingMessage}</h1>;
    else
        return <>
            <h1>FTB 2 MULTIC</h1>
            <ul>
                {modpacks.map(modpack => <li key={modpack.id}>{modpack.name}</li>)}
            </ul>
        </>;
}