import React, { useState, FunctionComponent, useEffect } from 'react';
import { useHistory, } from 'react-router-dom';
import { AppBar, Button, CircularProgress, Toolbar } from '@material-ui/core';
import PokeCardDetailed from './PokeCardDetailed';
import axios from 'axios';
import { componentPropsPokemon, PokemonPartialMain, PokemonPartialEvolution, PokemonPartialAbilities, DefaultEvolution } from './interfaces'
import Styles from './styles';



const Pokemon: FunctionComponent<componentPropsPokemon> = ({ match }) => {

    const history = useHistory();
    const classes = Styles();

    //state used to store a wide range of easily accessible data for the selected pokemon
    const [detailedPokemonDataMain, setDetailedPokemonDataMain] = useState<PokemonPartialMain>();

    //state used to store the specific evolution chain link of the pokemon
    const [urlBridgeEvolution, setUrlBridgeEvolution] = useState<string>();

    //state used to store the name of the very first, the default evolution of the pokemon
    const [defaultEvolution, setDefaultEvolution] = useState<string>();

    //state used to store the ID, name, and picture link of the default evolution
    const [defaultEvolutionExpanded, setDefaultEvolutionExpanded] = useState<DefaultEvolution>();

    //state used to store all pokemon evolutions that are NOT the default, as well as information regarding said evolutions
    const [detailedPokemonDataEvolution, setDetailedPokemonDataEvolution] = useState<Array<PokemonPartialEvolution>>([]);

    //state used to store a detailed version of the pokemon's abilities
    const [detailedPokemonDataAbilities, setDetailedPokemonDataAbilities] = useState<Array<PokemonPartialAbilities>>([]);

    //gathering a detailed version of data, same request as for the card, just storing more information
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
        }).catch(error => {
            console.log("Getting an error in the very fist query, if this happens the very core of the API's functionality has been changed, so R.I.P.: ", error);
        });
    }, []);

    //getting the URL for the evolution page of the selected pokemon
    useEffect(() => {
        if (detailedPokemonDataMain == undefined) { } else {
            console.log("second useEffect triggered! (dependent on the first one)");
            axios.get(`${detailedPokemonDataMain?.species_url}`).then(response => {
                const { data } = response;
                setUrlBridgeEvolution(data.evolution_chain.url);
            }).catch(error => {
                console.log("Getting an error in the second useEffect: ", error);
            });
        };
    }, [detailedPokemonDataMain]);

    //getting the name of the default evolution of the pokemon
    useEffect(() => {
        if (urlBridgeEvolution == undefined) { } else {
            axios.get(`${urlBridgeEvolution}`).then(response => {
                const { data } = response;
                setDefaultEvolution(`${data.chain.species.name}`);
            }).catch(error => {
                console.log("Error in an axios: ", error);
            });
        };
    }, [urlBridgeEvolution]);

    //getting the ID, the name and the sprite URL of the default evolution
    useEffect(() => {
        if (defaultEvolution == undefined) { } else {
            axios.get(`https://pokeapi.co/api/v2/pokemon/${defaultEvolution}`).then(response => {
                const { data } = response;
                setDefaultEvolutionExpanded({
                    name: data.name,
                    id: data.id,
                    sprite: data.sprites.front_default,
                });
            }).catch(error => {
                console.log("Error in an axios: ", error);
            });
        };
    }, [defaultEvolution]);


    //gathering all the additional evolutions from the pokemon, with lots of additional information:
    //we store: the name, the trigger, the minimum level, and the additional conditions of the pokemon
    useEffect(() => {
        if (urlBridgeEvolution == undefined) { } else {
            console.log("third useEffect triggered! (dependent on the second one)");
            axios.get(`${urlBridgeEvolution}`).then(response => {
                const { data } = response;
                const { chain } = data;


                //this is a recursive function, used to iterate through all the possible nodes of the evolution tree,
                //IGNORING the default one
                function getEvolutionDetails(chain: any) {
                    //setting a boolean to determine if there are nodes in the tree to begin with
                    const isLastPokemonInChain = ((chain.evolves_to).length === 0);
                    const { evolves_to } = chain;
                    //the top level can contain an unknown amount of nodes, this for loop is used to iterate through all of them
                    for (let i = 0; i < (evolves_to).length; i++) {

                        //Iterating through the evolution details field, to gather the possible conditions of the evolution
                        //this field should never be empty
                        //we don't store ALL the available information for simplicity's sake
                        const temporaryArray: { name: string, url: string }[] = [];
                        let j = 0;
                        Object.values(evolves_to[i].evolution_details[0]).forEach(value => {
                            if (value != null && value != "false" && value != "" && i != 16 && i != 9) {
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
                        //we store the gathered data
                        if (detailedPokemonDataEvolution.find(item => item.name === evolves_to[i].species.name)) {
                            //if the element is already in the array we do nothing
                            //caused by async
                        } else {
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
                        }
                        //if there are more evolutions available in the chain, we call the function again, with the additional nodes as parameter
                        if (!isLastPokemonInChain) {
                            getEvolutionDetails(evolves_to[i]);

                        }
                    }

                };
                //calling the recursion the first time, if there are any evolutions avaialble
                if ((data.chain.evolves_to).length != 0) {
                    getEvolutionDetails(data.chain);
                } else {
                    //if there are no evolutions avaialble we set some dummy data to avoid soft-lock, and to signal that no evolutions could be found
                    setDetailedPokemonDataEvolution(previousState => {
                        return [...previousState,
                        {
                            name: "No evolutions found!",
                            min_level: "-",
                            trigger: "-",
                            special: [{ name: "-", url: "-" }],
                        }
                        ]

                    });

                };

            }).catch(error => {
                console.log("Getting an error in the third useEffect: ", error)
            }
            );
        };

    }, [urlBridgeEvolution]);


    //gathering ability descriptions and storing them, along with the ability names
    useEffect(() => {
        if (detailedPokemonDataMain == undefined) { } else {
            console.log("fourth useEffect triggered! (dependent on the second one)");
            detailedPokemonDataMain?.abilities.forEach((item: { name: string, url: string }) => {
                axios.get(`${item.url}`).then(response => {
                    const { data } = response;
                    //there is some weird inconsistency as of right now regarding which field is used for storing the short description
                    //the majority of pokemons use the effect_entries field
                    if (data.effect_entries.length != 0) {
                        data.effect_entries.forEach((subArray: { language: { name: string, }, short_effect: string, }) => {
                            //storing the ENGLISH version of the ability description
                            if (subArray.language.name == "en") {
                                if (detailedPokemonDataAbilities.find(item2 => item2.name === item.name)) {
                                    //if the element is already in the array we do nothing
                                    //caused by async
                                } else {
                                    setDetailedPokemonDataAbilities(previousAbilities => {
                                        return [...previousAbilities,
                                        {
                                            name: item.name,
                                            url: subArray.short_effect,
                                        }
                                        ]
                                    });
                                };

                            }
                        });
                        //however a small portion uses flavor_text_entries, this attempts to catch that
                    } else if (data.flavor_text_entries.length != 0) {
                        if (detailedPokemonDataAbilities.find(item2 => item2.name === item.name)) {
                            //if the element is already in the array we do nothing
                            //caused by async
                        } else {
                        setDetailedPokemonDataAbilities(previousAbilities => {
                            return [...previousAbilities,
                            {
                                name: item.name,
                                url: data.flavor_text_entries[0].flavor_text,
                            }
                            ]
                        }); };
                        //it is also possible that neither of these fields store any information
                        //so we just insert dummy data to avoid soft-lock and signal that it could not be found
                    } else {
                        setDetailedPokemonDataAbilities(previousAbilities => {
                            return [...previousAbilities,
                            {
                                name: item.name,
                                url: "description not found :(",
                            }
                            ]
                        })
                    };

                }).catch(error => {
                    console.log("Getting an error in the fourth useEffect: ", error);
                });

            });
        };
    }, [detailedPokemonDataMain]);



    return (
        <>
            <AppBar position='static' className={classes.appBar}>
                <Toolbar>
                    <Button variant="contained" size="large" onClick={() => {
                        history.push({
                            pathname: `/${match.params.pageId}`,
                            search: `?${(history.location.search).substring(1)}`,
                        });
                    }
                    }>Back</Button>

                </Toolbar>
            </AppBar>
            {(detailedPokemonDataMain != undefined && defaultEvolutionExpanded != undefined && detailedPokemonDataEvolution.length != 0 && detailedPokemonDataAbilities.length != 0) ? (

                <div>

                    {
                        <PokeCardDetailed
                            url_history={match.params.pageId}
                            id={detailedPokemonDataMain.id}
                            name={detailedPokemonDataMain.name}
                            abilities={detailedPokemonDataAbilities}
                            stats={detailedPokemonDataMain.stats}
                            sprite={detailedPokemonDataMain.sprite}
                            types={detailedPokemonDataMain.types}
                            evolutions={detailedPokemonDataEvolution}
                            default_evolution={defaultEvolutionExpanded}
                        />
                    }
                </div>

            ) : (
                    <CircularProgress></CircularProgress>
                )}
            <AppBar position='static' className={classes.appBar}>
                <Toolbar>
                    <Button style={{ marginLeft: "auto" }} variant="contained" size="large" onClick={() => {
                        history.push({
                            pathname: `/${match.params.pageId}`,
                            search: `?${(history.location.search).substring(1)}`,
                        });
                    }}>Back</Button>

                </Toolbar>
            </AppBar>


        </>
    );

};


export default Pokemon;
