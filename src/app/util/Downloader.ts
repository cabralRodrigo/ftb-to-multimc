import { Modpack, OverwolfClient, Target, VersionDetail } from '../overwolf';

import JSZip from 'jszip';
import { join } from 'path';
import { saveAs } from 'file-saver';

export type Options = {
    modpack: Modpack,
    versionId: number,
    signal: AbortSignal,
    reportStepCount: (steps: number) => void,
    reportCurrentStep: (step: number) => void,
    reportMessage: (message: string) => void,
    reportError: (error: string) => void
};

export async function downloadModpack({
    modpack,
    versionId,
    signal,
    reportStepCount,
    reportCurrentStep,
    reportMessage,
    reportError
}: Options): Promise<boolean> {
    try {
        reportMessage('Downloading version details');

        const version = await OverwolfClient.versionDetails(modpack.id, versionId, signal);

        if (signal.aborted)
            return true;

        reportStepCount(version.files.length + 2);

        const game = version.targets.filter(s => s.type === 'game')[0];
        if (!game) {
            reportError('Could not determine minecraft version.');
            return false;
        }

        const loader = version.targets.filter(s => s.type === 'modloader')[0];
        if (!loader) {
            reportError('Could not find the mod loader information.');
            return false;
        }

        const zip = new JSZip();

        const manifest = createManifest(modpack, version, game, loader);
        zip.file('manifest.json', JSON.stringify(manifest));

        for (let i = 0; i < version.files.length; i++) {
            const file = version.files[i];

            reportCurrentStep(i + 1);
            reportMessage(`Downloading ${file.name}`);

            const reponse = await fetch(file.url, { signal });
            if (signal.aborted)
                return true;

            const blob = await reponse.blob();

            const filePath = join('overrides', file.path);
            zip.folder(filePath)?.file(file.name, blob);
        }

        reportCurrentStep(version.files.length + 1);
        reportMessage('Generating zip file');

        if (!signal.aborted) {
            const content = await zip.generateAsync({ type: 'blob', compressionOptions: { level: 0 } });

            const fileName = `${modpack.name} - v${version.name}.zip`.replace(/[^a-z0-9A-z\s\.]/gi, '');
            saveAs(content, fileName);
        }

        return true;
    }
    catch (err) {
        if (err.name === 'AbortError' && signal.aborted)
            return true;
        else {
            reportError(err);
            return false;
        }
    }
}

function createManifest(modpack: Modpack, version: VersionDetail, game: Target, loader: Target) {
    return {
        minecraft: {
            version: game.version,
            modLoaders: [{
                id: `${loader.name}-${loader.version}`,
                primary: true
            }],
        },
        manifestType: 'minecraftModpack',
        manifestVersion: 1,
        name: modpack.name,
        version: version.name,
        author: modpack.authors.map(s => s.name).join(', '),
        overrides: 'overrides'
    };
}