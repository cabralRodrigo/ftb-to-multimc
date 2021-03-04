import { Modpack } from "../overwolf/models";
import ModpackCard from './ModpackCard';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

type Props = { modpacks: Modpack[] };

export default function ModpackDeck({ modpacks }: Props) {
    return <Container>
        <Row>
            {modpacks.map(modpack => <ModpackCard modpack={modpack} />)}
        </Row>
    </Container>
}