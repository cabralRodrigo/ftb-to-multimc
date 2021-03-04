import 'bootstrap/dist/css/bootstrap';

import React, { useEffect, useState } from "react";
import { Client as OverwolfClient } from "./overwolf/client";
import { Modpack } from "./overwolf/models";
import ModpackDeck from './components/ModpackDeck';

import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Jumbotron from 'react-bootstrap/Jumbotron';

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

    return <>
        <header>
            <Navbar bg="dark" expand="lg" variant="dark">
                <Navbar.Brand href="#home">FTB to MultiMC</Navbar.Brand>
            </Navbar>
        </header>
        <main role="main">
            <Jumbotron className="text-center mb-0">
                <Container>
                    <h1>FTB to MultiMC</h1>
                    <p>Here you can convert and download a FTB modpack to use as a MultiMC instance.</p>
                </Container>
            </Jumbotron>

            {loading ? <h1>Loading {loadingMessage}</h1> :
                <div className="py-5 bg-light">
                    <ModpackDeck modpacks={modpacks} />
                </div>}
        </main>
        <footer></footer>
    </>;
}