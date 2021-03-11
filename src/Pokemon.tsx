import React, { useState, FunctionComponent, useEffect } from 'react';
import { RouteComponentProps, useHistory, useLocation } from 'react-router-dom';
import { AppBar, Button, CircularProgress, Toolbar } from '@material-ui/core';
import PokeCardDetailed from './PokeCardDetailed';
import axios from 'axios';
import { stringify } from 'querystring';


interface componentProps {
    match: {
        params: {
            pokemonId: string,
            pageId: string,
        }
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

interface DefaultEvolution {
    name: string,
    id: string,
    sprite: string,
}

const Pokemon: FunctionComponent<componentProps> = ({ match }) => {

    const history = useHistory();
    const [detailedPokemonDataMain, setDetailedPokemonDataMain] = useState<PokemonPartialMain>();
    const [urlBridgeEvolution, setUrlBridgeEvolution] = useState<string>();
    const [defaultEvolution, setDefaultEvolution] = useState<string>();
    const [defaultEvolutionExpanded, setDefaultEvolutionExpanded] = useState<DefaultEvolution>();
    const [detailedPokemonDataEvolution, setDetailedPokemonDataEvolution] = useState<Array<PokemonPartialEvolution>>([]);
    const [detailedPokemonDataAbilities, setDetailedPokemonDataAbilities] = useState<Array<PokemonPartialAbilities>>([]);

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



    useEffect(() => {
        if (urlBridgeEvolution == undefined) { } else {
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
                } else {
                    setDetailedPokemonDataEvolution(previousState => {
                        return [...previousState,
                        {
                            name: "No evolutions found!",
                            min_level: "-",
                            trigger: "-",
                            special: [{name: "-", url: "-"}],
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



    useEffect(() => {
        if (detailedPokemonDataMain == undefined) { } else {
            console.log("fourth useEffect triggered! (dependent on the second one)");
            detailedPokemonDataMain?.abilities.forEach((item: { name: string, url: string }) => {
                axios.get(`${item.url}`).then(response => {
                    const { data } = response;
                    if (data.effect_entries.length != 0 ) {
                    data.effect_entries.forEach((subArray: {language: {name: string,}, short_effect: string,}) => {
                        if (subArray.language.name == "en") {
                            setDetailedPokemonDataAbilities(previousAbilities => {
                                return [...previousAbilities,
                                {
                                    name: item.name,
                                    url: subArray.short_effect,
                                }
                                ]
                            })

                        }
                    });
                } else if (data.flavor_text_entries.length != 0) {
                    console.log("debugging: ", data.flavor_text_entries[0].flavor_text)
                    setDetailedPokemonDataAbilities(previousAbilities => {
                        return [...previousAbilities,
                        {
                            name: item.name,
                            url: data.flavor_text_entries[0].flavor_text,
                        }
                        ]
                    })
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
            <AppBar position='static' style={{ background: '#5f72ea' }}>
                <Toolbar>
                    <Button variant="contained" size="large" onClick={() => {
                        history.push({
                            pathname: `/${match.params.pageId}`,
                            search: `?${(history.location.search).substring(1)}`,
                        })
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
            <AppBar position='static' style={{ background: '#5f72ea' }}>
                <Toolbar>
                    <Button style={{ marginLeft: "auto" }} variant="contained" size="large" onClick={() => {
                        history.goBack();
                    }}>Back</Button>

                </Toolbar>
            </AppBar>


        </>
    );

};


export default Pokemon;
