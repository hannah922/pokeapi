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
    sprites: string,
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
    url: string,
    trigger: string,
    special: Array<{
        name: string,
        url: string,
    }>,
    min_level: string,
};


const Pokemon: FunctionComponent<componentProps> = ({ match }) => {

    //return <div> this is the pokemon page {match.params.pokemonId} </div>;
    const [newPokemonDataDetailed, setNewPokemonDataDetailed] = useState<poketype>();
    const [detailedPokemonDataMain, setDetailedPokemonDataMain] = useState<PokemonPartialMain>();
    const [urlBridgeEvolution, setUrlBridgeEvolution] = useState("");
    const [detailedPokemonDataEvolution, setDetailedPokemonDataEvolution] = useState<Array<PokemonPartialEvolution>>([]);


    useEffect(() => {
        var newPokeData_temp: poketype = {
            id: "",
            name: "",
            abilities: [{ name: "", url: "" }],
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
                interface abilitydata {
                    ability: {
                        name: string,
                        url: string,
                    },
                };
                const ability_array: [{ name: string, url: string }] = abilities.map((ability: {
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
                newPokeData_temp.abilities = ability_array;
                //console.log("abilities: ", ability_array);

                //********//STATS//********//
                const { stats } = data;
                const stats_array: [{ name: string, effort: string, value: string }] = stats.map((stat: { base_stat: string, effort: string, stat: { name: string, } }) => (
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
                                        speciesArrayPart.push({
                                            name: arrayitem.species.name, url: arrayitem.species.url,
                                            min_level: arrayitem.evolution_details[0].min_level,
                                            trigger: arrayitem.evolution_details[0].trigger.name,
                                            held_item: (arrayitem.evolution_details[0].held_item == null) ? { name: "Object_was_null", url: "" } :
                                                { name: arrayitem.evolution_details[0].held_item.name, url: arrayitem.evolution_details[0].held_item.url }
                                        });
                                        number_of_nodes++;
                                    })
                                    if (!isLastPokemonInChain) {
                                        for (let i = 0; i < number_of_nodes; i++) {
                                            const evolvesTo: evolutionChainType = evolutionChain.evolves_to[i];
                                            //console.log({evolvesTo});
                                            recursion(evolvesTo);
                                        }

                                    }
                                    return speciesArrayPart;
                                }
                                return evolution_array;
                            }
                            newPokeData_temp.evolutions = gatherevolutions(data);
                            setNewPokemonDataDetailed(newPokeData_temp);
                        });


                });

            });

    }, []);

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
                    sprites: data.sprites.front_default,
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
                console.log('test calling the function with species', chain.species.name);
                console.log('test chain', chain);
                for (let i = 0; i < (evolves_to).length; i++) {
                    console.log("test inside the for loop now.. i= ", i, "length= ",(evolves_to).length);
                    //ITERATING THROUGH THE EVOLUTION_DETAILS FIELD
                    const temporaryArray: { name: string, url: string }[] = [];
                    let j = 0;
                    Object.values(evolves_to[i].evolution_details[0]).forEach(value => {
                        if (value != null && value != "false" && value != "" && i != 16 && i != 9) {
                            console.log(j, " key was not found null: ", value);
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
                                        default: {break;}
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

/*                     console.log("this is supposed to go in the state: ");
                    console.log(
                        "name:", evolves_to[i].species.name,
                            "url:" ,evolves_to[i].species.url,
                            "min_level:", (evolves_to[i].evolution_details[0].min_level == null) ? "-" : evolves_to[i].evolution_details[0].min_level,
                            "trigger:", evolves_to[i].evolution_details[0].trigger.name,
                            "special:", temporaryArray,
                    ); */
                    
                    console.log('test trying to set state');
                    setDetailedPokemonDataEvolution(previousState => {
                        console.log("test setting the state. state before was", previousState, 'newly added item:',
                        {
                            name: evolves_to[i].species.name,
                            url: evolves_to[i].species.url,
                            min_level: (evolves_to[i].evolution_details[0].min_level == null) ? "-" : evolves_to[i].evolution_details[0].min_level,
                            trigger: evolves_to[i].evolution_details[0].trigger.name,
                            special: temporaryArray,
                        }
                        );
                        return [...previousState,
                        {
                            name: evolves_to[i].species.name,
                            url: evolves_to[i].species.url,
                            min_level: (evolves_to[i].evolution_details[0].min_level == null) ? "-" : evolves_to[i].evolution_details[0].min_level,
                            trigger: evolves_to[i].evolution_details[0].trigger.name,
                            special: temporaryArray,
                        }
                        ]

                    });

                    if (!isLastPokemonInChain) {
                        getEvolutionDetails(evolves_to[i]);
                        
                    }
                    console.log("test end of a recursion function");
                }


              
                console.log('test get evolution details has finished, pokemon was ', chain.species.name)

            };
            if ((data.chain.evolves_to).length != 0) {
                console.log("recursion triggered");
                getEvolutionDetails(data.chain);
            }

        }).catch(error => {
            console.log("Getting an error in the third useEffect: ", error)
        }
        );

    }, [urlBridgeEvolution])


    console.log('test state is ', detailedPokemonDataEvolution);
    return (
        <>
            {newPokemonDataDetailed ? (

                <div>
                    <PokeCardDetailed id={newPokemonDataDetailed.id} name={newPokemonDataDetailed.name}
                        abilities={newPokemonDataDetailed.abilities} stats={newPokemonDataDetailed.stats}
                        sprites={newPokemonDataDetailed.sprites} types={newPokemonDataDetailed.types}
                        evolutions={newPokemonDataDetailed.evolutions} moves={newPokemonDataDetailed.moves}
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
