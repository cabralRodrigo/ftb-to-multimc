import 'bootstrap/dist/css/bootstrap';

import React, { useEffect, useState } from "react";
import { Client as OverwolfClient } from "./overwolf/client";
import { Modpack } from "./overwolf/models";
import ModpackDeck from './components/ModpackDeck';

import Container from 'react-bootstrap/Container';
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
        <main role="main">
            <Jumbotron className="text-center mb-0">
                <Container>
                    <h1>FTB to MultiMC</h1>
                    <p>Here you can convert and download a FTB modpack to use as a MultiMC instance.</p>
                    <i>
                        <p>
                            The aim of this application is not to remove the ad revenue of the FTB team.
                            If in any point of future the FTB app adds a option to export a modpack to MultiMC this application will be discontinued.
                            PLEASE, support the FTB team by downloading and using the official <a href="https://www.feed-the-beast.com/" target="_black">FTB app</a>.
                        </p>
                        <p>
                            Ads or any form of monetization is not present.
                            <br/>
                            I'm not trying to take money from the FTB team or modders, I'm just creating a tool that I needed for myself.
                        </p>
                    </i>

                    <p className="mt-4">
                        <strong>
                            Got a bug or suggestion? Open a issue in the <a href="https://github.com/cabralRodrigo/ftb-to-multimc" target="_blank"> official Github repository</a>.
                        </strong>
                    </p>
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