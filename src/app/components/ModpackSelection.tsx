import React, { useState } from 'react';

import { timeSince } from '../util';
import { Modpack } from '../overwolf';
import { Filters, ModpackDeck } from '.';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

type Props = {
    modpacks: Modpack[],
    updateDate: Date,
    refresh: () => void
};

export default function ModpackSelection({ modpacks, updateDate, refresh }: Props) {
    const [filteredModpacks, setFilteredModpacks] = useState<Modpack[]>([]);

    return <Row>
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
    </Row>;
}