export type ModpackList = {
    packs: number[],
    total: number,
    refreshed: number,
    status: string
}

export type Modpack = {
    synopsis: string,
    description: string,
    art: Art[],
    links: Link[],
    authors: Author[],
    versions: Version[],
    installs: number,
    plays: number,
    featured: boolean,
    refreshed: number,
    notification: string,
    rating: Rating,
    status: string,
    id: number,
    name: string,
    type: string,
    updated: number,
    tags: Tag[],
}

export type Art = {
    width: number,
    height: number,
    compressed: boolean,
    url: string,
    sha1: string,
    size: number,
    id: number,
    type: string,
    updated: number,
}

export type Link = {
    id: number,
    name: string,
    type: string,
    link: string,
}

export type Author = {
    website: string,
    id: number,
    name: string,
    type: string,
    updated: number,
}

export type Version = {
    specs: Specs,
    id: number,
    name: string,
    type: string,
    updated: number,
}

export type Specs = {
    id: number,
    minimum: number,
    recommended: number,
}

export type Rating = {
    Id: number,
    Configured: boolean,
    Verified: boolean,
    Age: number,
    Gambling: boolean,
    Frightening: boolean,
    Alcoholdrugs: boolean,
    Nuditysexual: boolean,
    Sterotypeshate: boolean,
    Language: boolean,
    Violence: boolean,
}

export type Tag = {
    id: number,
    name: string
}