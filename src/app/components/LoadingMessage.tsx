import React from "react";

import Spinner from 'react-bootstrap/Spinner';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

type Props = {
    message: string
}

export default function LoadingMessage({ message }: Props) {
    return <Row>
        <Col className="text-center">
            <h3>
                Please, wait while we load all modpacks available.
            <Spinner animation="border" className="ml-3" />
            </h3>
            <h5>
                {message}
            </h5>
        </Col>
    </Row>;
}