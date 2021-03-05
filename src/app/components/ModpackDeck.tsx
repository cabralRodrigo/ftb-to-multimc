import React, { useState } from "react";

import { Modpack } from "../overwolf";
import { ModpackCard, ModpackDetails } from ".";

import Row from 'react-bootstrap/Row';

type Props = { modpacks: Modpack[] };

export default function ModpackDeck({ modpacks }: Props) {
    const [currentModpack, setCurrentModpack] = useState<Modpack | null>(null);

    const closeModal = function () {
        setCurrentModpack(null);
    }

    const openModal = function (modpack: Modpack) {
        setCurrentModpack(modpack);
    }

    return <>
        <Row>
            {modpacks.map(modpack => <ModpackCard key={modpack.id} modpack={modpack} open={openModal} />)}
        </Row>

        <ModpackDetails modpack={currentModpack} close={closeModal} />
    </>;
}