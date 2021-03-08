import React from 'react';
import { useState } from 'react';
import { FunctionComponent } from 'react';
import { RouteComponentProps } from 'react-router-dom';

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
    abilities: [{ name: string, url: string }],
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

interface PokemonPartialMain {
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

interface PokemonPartialEvolution {
    name: string,
    trigger: string,
    special: Array<{
        name: string,
        url: string,
    }>,
    min_level: string,
};

interface PokemonPartialAbilities {
    name: string,
    url: string,
};

let abilitiesDone = false;

const Pokemon: FunctionComponent<componentProps> = ({ match }) => {

    //return <div> this is the pokemon page {match.params.pokemonId} </div>;
    const [newPokemonDataDetailed, setNewPokemonDataDetailed] = useState<poketype>();
    const [detailedPokemonDataMain, setDetailedPokemonDataMain] = useState<PokemonPartialMain>();
    const [urlBridgeEvolution, setUrlBridgeEvolution] = useState("");
    const [detailedPokemonDataEvolution, setDetailedPokemonDataEvolution] = useState<Array<PokemonPartialEvolution>>([]);
    const [detailedPokemonDataAbilities, setDetailedPokemonDataAbilities] = useState<Array<PokemonPartialAbilities>>([]);

    //useEffect rework

    useEffect(() => {
        console.log("first useEffect triggered! (no dependencies)");
        axios.get(`https://pokeapi.co/api/v2/pokemon/${match.params.pokemonId}`).then(response => {
            const { data } = response;
            //********//ABILITIES//********//

            const { abilities } = data;
            const abilitiesArray: [{ name: string, url: string }] = abilities.map((ability: {
                ability: {
                    name: string,
                    url: string,
                }
            }) => (
                {
                    name: ability.ability.name,
                    url: ability.ability.url,
                }
            ));

            //********//STATS//********//
            const { stats } = data;
            const statsArray: [{ name: string, effort: string, value: string }] = stats.map((stat: { base_stat: string, effort: string, stat: { name: string } }) => (
                {
                    value: stat.base_stat,
                    effort: stat.effort,
                    name: stat.stat.name,
                }
            ));

            //********//TYPES//********//
            const { types } = data;
            const typesArray: [{ name: string }] = types.map((type: {
                type: {
                    name: string
                }
            }) => (
                {
                    name: type.type.name,
                }
            ));

            setDetailedPokemonDataMain(
                {
                    id: data.id,
                    name: data.name,
                    abilities: abilitiesArray,
                    sprite: data.sprites.front_default,
                    types: typesArray,
                    stats: statsArray,
                    species_url: data.species.url,
                }
            );
        });
    }, []);


    useEffect(() => {
        console.log("second useEffect triggered! (dependent on the first one)");
        axios.get(`${detailedPokemonDataMain?.species_url}`).then(response => {
            const { data } = response;
            setUrlBridgeEvolution(data.evolution_chain.url);
        }).catch(error => {
            console.log("Getting an error in the second useEffect: ", error);
        });
    }, [detailedPokemonDataMain]);





    useEffect(() => {
        console.log("third useEffect triggered! (dependent on the second one)");
        axios.get(`${urlBridgeEvolution}`).then(response => {
            const { data } = response;
            const { chain } = data;



            function getEvolutionDetails(chain: any) {
                const isLastPokemonInChain = ((chain.evolves_to).length === 0);
                const { evolves_to } = chain;
                for (let i = 0; i < (evolves_to).length; i++) {
                    //ITERATING THROUGH THE EVOLUTION_DETAILS FIELD
                    const temporaryArray: { name: string, url: string }[] = [];
                    let j = 0;
                    Object.values(evolves_to[i].evolution_details[0]).forEach(value => {
                        if (value != null && value != "false" && value != "" && i != 16 && i != 9) {
                            //console.log(j, " key was not found null: ", value);
                            switch (j) {
                                case 0: {
                                    //1st element is gender
                                    switch (value) {
                                        case "0": {
                                            temporaryArray.push({ name: "female", url: "NULL_gender" });
                                            break;
                                        }
                                        case "1": {
                                            temporaryArray.push({ name: "male", url: "NULL_gender" });
                                            break;
                                        }
                                        case "2": {
                                            temporaryArray.push({ name: "nongendered", url: "NULL_gender" });
                                            break;
                                        }
                                        default: { break; }
                                    }
                                    break;
                                }
                                case 1:
                                case 2: {
                                    //the 2nd and 3rd element are either an item that must be held, or an item that is required
                                    temporaryArray.push(value as { name: string, url: string });
                                    break;
                                }
                                case 3: {
                                    //the 4th element is known_move
                                    temporaryArray.push({ name: (value as { name: string, url: string }).name, url: "NULL_knownmove" });
                                    break;
                                }
                                case 5: {
                                    //the 6th element is location
                                    temporaryArray.push({ name: (value as { name: string, url: string }).name, url: "NULL_location" });
                                    break;
                                }
                                default: {
                                    //well we very conveniently just ignore all other cases.. so
                                    break;
                                }
                            };
                        }
                        j++;
                    });

                    setDetailedPokemonDataEvolution(previousState => {
                        return [...previousState,
                        {
                            name: evolves_to[i].species.name,
                            min_level: (evolves_to[i].evolution_details[0].min_level == null) ? "-" : evolves_to[i].evolution_details[0].min_level,
                            trigger: evolves_to[i].evolution_details[0].trigger.name,
                            special: temporaryArray,
                        }
                        ]

                    });
                    if (!isLastPokemonInChain) {
                        getEvolutionDetails(evolves_to[i]);

                    }
                }

            };
            if ((data.chain.evolves_to).length != 0) {
                getEvolutionDetails(data.chain);
            }

        }).catch(error => {
            console.log("Getting an error in the third useEffect: ", error)
        }
        );

    }, [urlBridgeEvolution]);

    useEffect(() => {
        let forEachFinish = 0;
        console.log("fourth useEffect triggered! (dependent on the second one)");
        detailedPokemonDataMain?.abilities.forEach((item: { name: string, url: string }) => {
            axios.get(`${item.url}`).then(response => {
                const { data } = response;
                setDetailedPokemonDataAbilities(previousAbilities => {
                    return [...previousAbilities,
                    {
                        name: item.name,
                        url: data.effect_entries[1].short_effect,
                    }
                    ]
                })

            }).catch(error => {
                console.log("Getting an error in the fourth useEffect: ", error);
            });
            forEachFinish++;

            if (forEachFinish === detailedPokemonDataMain?.abilities.length) {
                abilitiesDone = true;
                console.log("test10: we got all the details!");

                console.log("test10: uhh ", abilitiesDone);
            };
        });
    }, [detailedPokemonDataMain]);


    console.log("test10: just the normal var: ", abilitiesDone);
    console.log("test13: evolutions? ", detailedPokemonDataEvolution);
    console.log("test10.. is it true or fale? ", ( abilitiesDone && detailedPokemonDataMain != undefined && detailedPokemonDataEvolution.length != 0 && detailedPokemonDataAbilities.length != 0))
    return (
        <>
            {( abilitiesDone && detailedPokemonDataMain != undefined && detailedPokemonDataEvolution.length != 0 && detailedPokemonDataAbilities.length != 0) ? (

                <div>
                    <PokeCardDetailed
                        id={detailedPokemonDataMain.id}
                        name={detailedPokemonDataMain.name}
                        abilities={detailedPokemonDataAbilities}
                        stats={detailedPokemonDataMain.stats}
                        sprite={detailedPokemonDataMain.sprite}
                        types={detailedPokemonDataMain.types}
                        evolutions={detailedPokemonDataEvolution}
                    />
                    <div>{`evolutions in state: ${detailedPokemonDataEvolution.length}`}</div>
                </div>

            ) : (
                    <CircularProgress></CircularProgress>
                )}


        </>
    );

};


export default Pokemon;
