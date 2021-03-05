import 'bootstrap/dist/css/bootstrap';

import React, { useEffect, useState } from "react";
import { Client as OverwolfClient } from "./overwolf/client";
import { Modpack } from "./overwolf/models";
import ModpackDeck from './components/ModpackDeck';

import Container from 'react-bootstrap/Container';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Filters from './components/Filters';
import ModpackStorage from './util/ModpackStorage';

const timeSince = function (date: Date) {
    const now = new Date();
    const seconds = Math.floor((now.valueOf() - date.valueOf()) / 1000);

    let interval = Math.floor(seconds / 31536000);
    if (interval > 1)
        return interval + " years";

    interval = Math.floor(seconds / 2592000);
    if (interval > 1)
        return interval + " months";

    interval = Math.floor(seconds / 86400);
    if (interval > 1)
        return interval + " days";

    interval = Math.floor(seconds / 3600);
    if (interval > 1)
        return interval + " hours";

    interval = Math.floor(seconds / 60);
    if (interval > 1)
        return interval + " minutes";

    return Math.floor(seconds) + " seconds";
}

export default function App() {
    const [loading, setLoading] = useState(true);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [updateDate, setUpdateDate] = useState<Date>(null);
    const [modpacks, setModpacks] = useState<Modpack[]>([]);
    const [filteredModpacks, setFilteredModpacks] = useState<Modpack[]>([]);

    const fetchModpacks = async function (): Promise<Modpack[]> {
        const loadedModpacks = [];

        setLoadingMessage('modpack list');
        const modpackIds = await OverwolfClient.listModpacks();

        for (const modpackId of modpackIds) {
            const modpack = await OverwolfClient.modpackDetails(modpackId);
            setLoadingMessage(modpack.name);

            loadedModpacks.push(modpack);
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

    return <>
        <main role="main">
            <Jumbotron className="text-center mb-0 p-3">
                <Container>
                    <h1>FTB to MultiMC</h1>
                    <p>Here you can convert and download a FTB modpack to use as a MultiMC instance.</p>
                    <i>
                        <p>
                            The aim of this application is not to remove the ad revenue of the FTB team.
                            If in any point of future the FTB app adds a option to export a modpack to MultiMC (or vice versa), this application will be discontinued.
                            PLEASE, support the FTB team by downloading and using the official <a href="https://www.feed-the-beast.com/" target="_black">FTB app</a>.
                        </p>
                        <p>
                            Ads or any form of monetization is not present.
                            <br />
                            I'm not trying to take money from the FTB team or modders, I'm just creating a tool that I needed for myself.
                        </p>
                    </i>

                    <p className="mt-4">
                        <strong>
                            Got a bug or suggestion? Open an issue in the <a href="https://github.com/cabralRodrigo/ftb-to-multimc" target="_blank"> official Github repository</a>.
                        </strong>
                    </p>
                </Container>
            </Jumbotron>

            {loading ? <h1>Loading {loadingMessage}</h1> :
                <Container fluid className="bg-light pt-2">
                    <Row>
                        <Col sm={2}>
                            <h2>Filters</h2>
                            <Filters modpacks={modpacks} setFilteredModpacks={setFilteredModpacks} />
                        </Col>
                        <Col>
                            <h2 className="mb-0">Modpacks</h2>
                            <div className="text-secondary mb-3">
                                <i>
                                    Last updated {timeSince(updateDate)} ago. <a href="#" onClick={refresh}>Click here</a> to refresh.
                                </i>
                            </div>

                            <ModpackDeck modpacks={filteredModpacks} />
                        </Col>
                    </Row>
                </Container>
            }
        </main>
    </>;
}