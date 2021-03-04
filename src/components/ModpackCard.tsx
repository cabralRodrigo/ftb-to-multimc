import React from "react"
import { Modpack } from "../overwolf/models";

import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons'

type Props = { modpack: Modpack };

export default function ModpackCard({ modpack }: Props) {
    return <Col key={modpack.id} md={4}>
        <Card className="mb-4 box-shadow">
            {modpack.art?.length >= 1 ? <Card.Img variant="top" src={modpack.art[0].url} /> : <></>}

            <Card.Body>
                <Card.Title>{modpack.name}</Card.Title>
                <Card.Text>{modpack.synopsis}</Card.Text>

                <Button variant="primary">
                    <FontAwesomeIcon icon={faSearch} className="mr-2" />
                View details
            </Button>
            </Card.Body>
        </Card>
    </Col>;
}