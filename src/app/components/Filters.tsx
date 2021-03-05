import React, { useEffect, useState } from "react";

import { Modpack, Tag } from "../overwolf/models";

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

type Props = {
    modpacks: Modpack[],
    setFilteredModpacks: (value: Modpack[]) => void
}

type Filter = {
    name: string;
    tags: number[];
}

const getDistinctTags = function (modpacks: Modpack[]): Tag[] {
    const tagMap: Record<number, Tag> = {};
    for (const modpack of modpacks)
        for (const tag of modpack.tags)
            if (!tagMap[tag.id])
                tagMap[tag.id] = tag;

    const tags = Object.keys(tagMap).map(id => tagMap[Number(id)]);
    tags.sort((a, b) => a.name > b.name ? 0 : -1);

    return tags;
}

export default function Filters({ modpacks, setFilteredModpacks }: Props) {
    const [filter, setFilter] = useState<Filter>({ name: '', tags: [] });

    const onNameChanged = function (event: React.ChangeEvent<HTMLInputElement>) {
        setFilter({ ...filter, name: event.target.value });
    }

    const onTagChanged = function (event: React.ChangeEvent<HTMLInputElement>) {
        const tagId = Number(event.target.value);
        if (isNaN(tagId))
            return;

        const shouldTagBePresent = event.target.checked;
        const isTagPresent = filter.tags.indexOf(tagId) >= 0;

        if (isTagPresent && !shouldTagBePresent)
            setFilter({ ...filter, tags: filter.tags.filter(s => s !== tagId) });
        else if (!isTagPresent && shouldTagBePresent)
            setFilter({ ...filter, tags: [...filter.tags, tagId] });
    }

    const clear = function () {
        setFilter({ name: '', tags: [] });
    }

    useEffect(() => {
        const filteredModpacks: Modpack[] = [];

        for (const modpack of modpacks) {
            if (filter.name && !modpack.name.toLowerCase().includes(filter.name.toLowerCase()))
                continue;

            let skip = false;
            for (const tagId of filter.tags)
                if (!modpack.tags.filter(s => s.id == tagId).length) {
                    skip = true;
                    break;
                }

            if (skip)
                continue;

            filteredModpacks.push(modpack);
        }

        setFilteredModpacks(filteredModpacks);
    }, [filter]);

    const tags = getDistinctTags(modpacks);

    return <Form>
        <Form.Group>
            <Form.Label>Modpack name</Form.Label>
            <Form.Control type="text" placeholder="Name" onChange={onNameChanged} value={filter.name} />
        </Form.Group>

        <Form.Label>Tags</Form.Label>

        {tags.map(tag =>
            <Form.Check type="switch"
                key={tag.id}
                label={tag.name}
                value={tag.id}
                id={`tag-${tag.id}`}
                onChange={onTagChanged}
                checked={filter.tags.indexOf(tag.id) >= 0} />
        )}

        <Button className="mt-3" variant="primary" type="button" onClick={clear}>
            Clear
        </Button>
    </Form>;
}