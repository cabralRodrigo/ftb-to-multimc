import React from "react";

import Container from 'react-bootstrap/Container';
import Jumbotron from 'react-bootstrap/Jumbotron';

export default function Banner() {
    return <Jumbotron className="text-center p-2">
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
    </Jumbotron>;
}