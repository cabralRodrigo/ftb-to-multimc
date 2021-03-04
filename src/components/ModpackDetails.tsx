import { Modpack } from "../overwolf/models";

import ReactMarkdown from 'react-markdown';

import Row from 'react-bootstrap/Row';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Col from 'react-bootstrap/Col';
import Badge from 'react-bootstrap/Badge';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons'

type Props = {
    modpack: Modpack | null,
    close: () => void;
};

export default function ModpackDetails({ modpack, close }: Props) {
    if (!modpack)
        return <></>;

    return <Modal show={true} onHide={() => close()} size="lg">
        <Modal.Header closeButton>
            <Modal.Title>
                {modpack?.name}
                <div>
                    {modpack.tags.map((tag, i) => <Badge key={i} variant="secondary" className="mr-1">{tag.name}</Badge>)}
                </div>
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Tabs defaultActiveKey="overview" id="modpack-details">
                <Tab eventKey="overview" title="Overview">
                    <ReactMarkdown children={modpack.description}/>
                </Tab>
                <Tab eventKey="versions" title="Versions">
                    {modpack.versions.map((version, i) =>
                        <Row key={i} className={`m-2 ${i % 2 != 0 ? 'bg-light' : ''}`}>
                            <Col>
                                Version {version.name}
                            </Col>
                            <Col>
                                <Col className="text-right">
                                    <Button size="sm">
                                        <FontAwesomeIcon icon={faDownload} className="mr-2" />
                                        Download
                                    </Button>
                                </Col>
                            </Col>
                        </Row>
                    )}
                </Tab>
            </Tabs>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={() => close()}>
                Close
            </Button>
        </Modal.Footer>
    </Modal>;
}