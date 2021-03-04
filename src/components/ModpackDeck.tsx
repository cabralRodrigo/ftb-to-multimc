import { Modpack } from "../overwolf/models";
import ModpackCard from './ModpackCard';
import ModpackDetails from "./ModpackDetails";

import { useState } from "react";

import Container from 'react-bootstrap/Container';
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
        <Container>
            <Row>
                {modpacks.map(modpack => <ModpackCard key={modpack.id} modpack={modpack} open={openModal} />)}
            </Row>
        </Container>

        <ModpackDetails modpack={currentModpack} close={closeModal} />
    </>;
}