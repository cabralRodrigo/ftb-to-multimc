import 'bootstrap/dist/css/bootstrap';
import React, { useEffect, useState } from "react";

import { Banner, LoadingMessage, ModpackSelection } from './components';
import { Modpack, OverwolfClient } from './overwolf';
import { ModpackStorage } from './util';

import Container from 'react-bootstrap/Container';

export default function App() {
    const [loading, setLoading] = useState(true);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [updateDate, setUpdateDate] = useState<Date>(null);
    const [modpacks, setModpacks] = useState<Modpack[]>([]);

    const fetchModpacks = async function (): Promise<Modpack[]> {
        const loadedModpacks = [];

        setLoadingMessage('Loading modpack list');
        const modpackIds = await OverwolfClient.listModpacks();

        setLoadingMessage(`Loading ${modpackIds.length} modpacks`);

        for (let i = 0; i < modpackIds.length; i++) {
            const modpack = await OverwolfClient.modpackDetails(modpackIds[i]);
            loadedModpacks.push(modpack);

            setLoadingMessage(`Loaded modpack '${modpack.name}' (${i + 1} of ${modpackIds.length})`)
        }

        return loadedModpacks;
    }

    const loadModpacks = async function () {
        if (!ModpackStorage.hasModpacks())
            ModpackStorage.set(await fetchModpacks());

        const [loadedModpacks, updatedDate] = ModpackStorage.get();

        setUpdateDate(updatedDate);
        setModpacks(loadedModpacks);
    };

    const refresh = async function () {
        ModpackStorage.clear();

        setLoading(true);
        await loadModpacks();
        setLoading(false);
    }

    useEffect(() => {
        (async () => {
            await loadModpacks();
            setLoading(false);
        })();
    }, []);

    return <main role="main">
        <Banner />
        <Container fluid>
            {loading ? (
                <LoadingMessage message={loadingMessage} />
            ) : (
                <ModpackSelection modpacks={modpacks} updateDate={updateDate} refresh={refresh} />
            )}
        </Container>
    </main>;
}