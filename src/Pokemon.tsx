import React from 'react';
import { useState } from 'react';
import { FunctionComponent } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import MockData from './MockData';

import {
    BrowserRouter as Router,
    Route,
    Link,
    match
} from 'react-router-dom';
import { CircularProgress, Typography } from '@material-ui/core';
import PokeCardDetailed from './PokeCardDetailed';
import { useEffect } from 'react';
import axios from 'axios';

interface componentProps {
    match: {
        params: {
            pokemonId: string,
        }
    }
}

interface pokedata {
    name: string,
    url: string,
};

interface abilitydata {
    ability: {
        name: string,
    },
};

interface statdata {
    base_stat: string,
    effort: string,
    stat: {
        name: string,
    }

};

interface movedata {
    move: {
        name: string,
        url: string,
    },
};

interface typedata {
    type: {
        name: string
    }
};


interface poketype {
    id: string,
    name: string,
    abilities: [{ name: string }],
    sprites: string,
    types: [{ name: string }],
    stats: [{
        name: string,
        effort: string,
        value: string
    }],
    evolutions: Array<{
        name: string,
        url: string,
        trigger: string,
        held_item: {
            name: string,
            url: string,
        },
        min_level: string,
    }>,
    moves: [{ name: string }]
}


interface species {
    name: string,
    url: string,
    min_level: string,
    trigger: string,
    held_item: {
        name: string,
        url: string,
    },
}

interface evolutionChainType {
    evolution_details: Array<{
        trigger: { name: string, url: string },
        min_level: string,
        held_item: {
            name: string,
            url: string,
        }
    }>,
    evolves_to: Array<evolutionChainType>,
    is_baby: boolean,
    species: {
        name: string,
        url: string,
    }
}
//paramteres: URL & version: follows the link and returns a url from there (version used to control where data is located: 2 use cases)
function getURL(url: string, version: number) {
    var newURL;
    axios.get(url).then(function (response) {
        if (version == 0) {
            newURL = response.data.evolution_chain.url;
        }
        else {
            newURL = response.data.sprites.default;
        }
    })
    return newURL;
};

//there has to be a joint query for evolutions

const Pokemon: FunctionComponent<componentProps> = ({ match }) => {
    const [PokemonData, setPokemon] = useState(Object.values(MockData));

    //return <div> this is the pokemon page {match.params.pokemonId} </div>;
    const [newPokemonDataDetailed, setNewPokemonDataDetailed] = useState<poketype>();


    useEffect(() => {
        var newPokeData_temp: poketype = {
            id: "",
            name: "",
            abilities: [{ name: "" }],
            sprites: "",
            types: [{ name: "" }],
            stats: [{
                name: "",
                effort: "",
                value: ""
            }],
            evolutions: [{
                name: "",
                url: "",
                held_item: {
                    name: "",
                    url: "",
                },
                trigger: "",
                min_level: "",
            }],
            moves: [{ name: "" }],
        };
        axios
            .get(`https://pokeapi.co/api/v2/pokemon/${match.params.pokemonId}`)
            .then(function (response) {
                const { data } = response;

                //********//ABILITIES//********//
                const { abilities } = data;
                const ability_array: [{ name: string }] = abilities.map((ability: abilitydata) => (
                    {
                        name: ability.ability.name,
                    }
                ));
                newPokeData_temp.abilities = ability_array;
                //console.log("abilities: ", ability_array);

                //********//STATS//********//
                const { stats } = data;
                const stats_array: [{ name: string, effort: string, value: string }] = stats.map((stat: statdata) => (
                    {
                        value: stat.base_stat,
                        effort: stat.effort,
                        name: stat.stat.name,
                    }
                ));
                newPokeData_temp.stats = stats_array;
                //console.log("stats: ", stats_array);

                //********//MOVES//********//
                const { moves } = data;
                const moves_array: [{ name: string }] = moves.map((move: movedata) => (
                    {
                        name: move.move.name,
                    }
                ));
                newPokeData_temp.moves = moves_array;
                //console.log("moves: ", moves_array)

                //********//TYPES//********//
                const { types } = data;
                const types_array: [{ name: string }] = types.map((type: typedata) => (
                    {
                        name: type.type.name,
                    }
                ));
                newPokeData_temp.types = types_array;
                //console.log("types: ", types_array)

                newPokeData_temp.name = data.name;
                //console.log(data.name);

                newPokeData_temp.sprites = data.sprites.front_default;
                newPokeData_temp.id = data.id;
                //********//TYPES//********//
                const species_url = data.species.url;


                var evolution_id;
                axios.get(`${species_url}`).then(function (response) {
                    const { data } = response;
                    evolution_id = data.evolution_chain.url;


                    axios.get(`${evolution_id}`)
                        .then(function (response) {
                            const { data } = response;

                            function gatherevolutions(pass_the_data: any) {
                                const { chain } = pass_the_data;
                                let speciesArrayPart: Array<species> = [];
                                // const evolution_array: [{name: string, url: string}] = recursion(chain)!; //telling compiler this can not be undefined
                                //speciesArrayPart.push({ name: chain.species.name, url: chain.species.url });
                                const evolution_array: Array<species> = recursion(chain);


                                //part1: main level
                                function recursion(evolutionChain: evolutionChainType) {
                                    let isLastPokemonInChain = evolutionChain.evolves_to.length === 0;
                                    let number_of_nodes = 0;
                                    evolutionChain.evolves_to.forEach(function (arrayitem: typeof evolutionChain) {
                                        // console.log(arrayitem);
                                        speciesArrayPart.push({ name: arrayitem.species.name, url: arrayitem.species.url, 
                                            min_level: arrayitem.evolution_details[0].min_level,
                                                trigger: arrayitem.evolution_details[0].trigger.name,
                                            held_item: (arrayitem.evolution_details[0].held_item == null) ? {name: "Object_was_null", url: ""} : 
                                            { name: arrayitem.evolution_details[0].held_item.name, url: arrayitem.evolution_details[0].held_item.url}});
                                        number_of_nodes++;
                                    })
                                    if (!isLastPokemonInChain) {
                                        for (let i = 0; i < number_of_nodes; i++) {
                                            const evolvesTo: evolutionChainType = evolutionChain.evolves_to[i];
                                            //console.log({evolvesTo});
                                            const result = recursion(evolvesTo);
                                        }

                                    }
                                    return speciesArrayPart;
                                }
                                return evolution_array;
                            }
                            newPokeData_temp.evolutions = gatherevolutions(data);
                            setNewPokemonDataDetailed(newPokeData_temp);
                        });


                }); /* function recursion(evolutionChain: evolutionChainType) {
                    let isLastPokemonInChain = evolutionChain.evolves_to.length === 0;
                    let number_of_nodes = 0;
                    evolutionChain.evolves_to.forEach(function (arrayitem: typeof evolutionChain) {
                        console.log(arrayitem);
                        speciesArrayPart.push({ name: arrayitem.species.name, url: arrayitem.species.url, 
                            min_level: arrayitem.evolution_details[0].min_level,
                                trigger: arrayitem.evolution_details[0].trigger.name,
                            held_item: (arrayitem.evolution_details[0].held_item == null) ? "" : arrayitem.evolution_details[0].held_item[0]});
                        number_of_nodes++;
                    })
                    if (!isLastPokemonInChain) {
                        for (let i = 0; i < number_of_nodes; i++) {
                            const evolvesTo: evolutionChainType = evolutionChain.evolves_to[i];
                            //console.log({evolvesTo});
                            const result = recursion(evolvesTo);
                        }

                    }
                    return speciesArrayPart;
                }*/





            });





    }, []);



    return (
        <>
            {newPokemonDataDetailed ? (

                <div>
                    <PokeCardDetailed id={newPokemonDataDetailed.id} name={newPokemonDataDetailed.name}
                        abilities={newPokemonDataDetailed.abilities} stats={newPokemonDataDetailed.stats}
                        sprites={newPokemonDataDetailed.sprites} types={newPokemonDataDetailed.types}
                        evolutions={newPokemonDataDetailed.evolutions} moves={newPokemonDataDetailed.moves}
                    />
                </div>

            ) : (
                    <CircularProgress></CircularProgress>
                )}


        </>
    );

};


export default Pokemon;
