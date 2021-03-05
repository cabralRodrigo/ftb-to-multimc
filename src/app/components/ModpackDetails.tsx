import React, { useState } from "react";
import ReactMarkdown from 'react-markdown';

import { Modpack } from "../overwolf";
import { downloadModpack } from "../util";

import Row from 'react-bootstrap/Row';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Col from 'react-bootstrap/Col';
import Badge from 'react-bootstrap/Badge';
import ProgressBar from 'react-bootstrap/ProgressBar';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons'

type Props = {
    modpack: Modpack | null,
    close: () => void;
};

export default function ModpackDetails({ modpack, close }: Props) {
    const [downloading, setDownloading] = useState(false);
    const [steps, setSteps] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);
    const [message, setMessage] = useState('');

    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [abortController, setAbortController] = useState<AbortController | null>(null);

    const download = async function (versionId: number) {
        if (!modpack || downloading)
            return;

        setDownloading(true);

        const abortControllerLocal = new AbortController();
        setAbortController(abortControllerLocal);

        const success = await downloadModpack({
            modpack,
            versionId,
            signal: abortControllerLocal.signal,
            reportCurrentStep: setCurrentStep,
            reportError: message => {
                setError(true);
                setErrorMessage(message);
            },
            reportMessage: setMessage,
            reportStepCount: setSteps
        });

        setAbortController(null);

        if (success) {
            setDownloading(false);
            setSteps(0);
            setCurrentStep(0);
            setMessage('');
        }
    }

    const abortOrClearError = function () {
        if (error) {
            setErrorMessage('');
            setError(false);
            setDownloading(false);
            setSteps(0);
            setCurrentStep(0);
            setMessage('');
        }
        else {
            abortController?.abort();
        }
    }

    const normalBody = function () {
        return <Tabs defaultActiveKey="overview" id="modpack-details">
            <Tab eventKey="overview" title="Overview">
                <ReactMarkdown children={modpack.description} linkTarget="_blank" />
            </Tab>
            <Tab eventKey="versions" title="Versions">
                {modpack.versions.map((version, i) =>
                    <Row key={i} className={`m-2 ${i % 2 !== 0 ? 'bg-light' : ''}`}>
                        <Col>
                            Version {version.name}
                        </Col>
                        <Col>
                            <Col className="text-right">
                                <Button size="sm" onClick={() => { download(version.id) }}>
                                    <FontAwesomeIcon icon={faDownload} className="mr-2" />
                                    Download
                                </Button>
                            </Col>
                        </Col>
                    </Row>
                )}
            </Tab>
        </Tabs>;
    }

    const downloadingBody = function () {

        if (error)
            return <>
                An error occured. Try again.
                Details: {errorMessage}
            </>
        else
            return <>
                {message}
                <ProgressBar striped animated max={steps} now={currentStep} />
            </>;
    }

    if (!modpack)
        return <></>;

    return <Modal show={true} onHide={() => close()} size="lg" backdrop="static" keyboard={false}>
        <Modal.Header>
            <Modal.Title>
                {modpack?.name}
                <div>
                    {modpack.tags.map((tag, i) => <Badge key={i} variant="secondary" className="mr-1">{tag.name}</Badge>)}
                </div>
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {downloading ? downloadingBody() : normalBody()}
        </Modal.Body>
        <Modal.Footer>
            {downloading ?
                <Button variant={error ? 'warning' : 'danger'} onClick={() => abortOrClearError()}>
                    {error ? 'Ok' : 'Cancel download'}
                </Button>
                :
                <Button variant="secondary" onClick={() => close()}>
                    Close
                </Button>
            }
        </Modal.Footer>
    </Modal>;
}