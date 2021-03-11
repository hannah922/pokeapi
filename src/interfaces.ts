import React from 'react';

export interface Poketype {
    id: string,
    name: string,
    sprite: string,
}

export interface componentPropsPokedex {
    match: {
        params: {
            pageId: string,
        }
    }
}

export interface Pokedata {
    name: string,
    url: string,
}

export interface PokeCardProps {
    name: string,
    id: string,
    sprite: string,
    pokedexPageId: string,
    pokemonLimit: string,
}


export interface componentPropsPokemon {
    match: {
        params: {
            pokemonId: string,
            pageId: string,
        }
    }
}


export interface PokemonPartialMain {
    id: string,
    name: string,
    abilities: [{ name: string, url: string }],
    sprite: string,
    types: [{ name: string }],
    stats: [{
        name: string,
        effort: string,
        value: string
    }],
    species_url: string,
}


export interface PokemonPartialEvolution {
    name: string,
    trigger: string,
    special: Array<{
        name: string,
        url: string,
    }>,
    min_level: string,
};

export interface PokemonPartialAbilities {
    name: string,
    url: string,
};

export interface DefaultEvolution {
    name: string,
    id: string,
    sprite: string,
}



export interface PokeCardDetailedProps {
    id: string,
    name: string,
    abilities: Array<{ name: string, url: string }>,
    sprite: string,
    types: [{ name: string }],
    stats: [{
        name: string,
        effort: string,
        value: string
    }],
    evolutions: Array<{
        name: string,
        trigger: string,
        special: Array<{
            name: string,
            url: string,
        }>,
        min_level: string,
    }>,
    default_evolution: {
        id: string,
        name: string,
        sprite: string,
    },
    url_history: string,
}
export interface pokemonAvatarInterface {
    pokemonName: string,
    pokemonID: string,
    pokemonSprite: string,
}

export interface evolutionConditions {
    pokemonName: string,
    condition: Array<{ id: string, name: string }>,
    sprite: string,
}