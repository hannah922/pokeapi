import React, { ChangeEvent, FunctionComponent, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { AppBar, Button, CircularProgress, Select, TextField, Typography, Toolbar, Grid } from '@material-ui/core';
import PokeCard from './PokeCard';
import axios from 'axios';
import { Poketype, componentPropsPokedex, Pokedata } from "./interfaces";
import Styles  from './styles';

//

//declaring variable outside of Pokedex so that changing it is possible inside without resetting after a rerender.
//stores input from user regarding the limit of pokemon cards
let textFieldInput: string = "54";

//component used to gather simple data from the api
const Pokedex: FunctionComponent<componentPropsPokedex> = ({ match }) => {


    const history = useHistory();
    const classes = Styles();

    //store the amount of cards displayed on the page in this state: corresponds to the ?limit part of the api's URL
    const [pokemonLimit, setPokemonLimit] = useState<number>((history.location.search != undefined) ? Number(history.location.search.substring(1)) : 54);
    
    //state storing the user input for changing the card limit, used for error checking
    const [textFieldData, setTextFieldData] = useState<string>("54");
    
    //state used to signal rerendering of page
    const [thisDoesNothing, setThisDoesNothing] = useState<string>("");

    //state used to store the pokemon data gathered from pokeapi
    const [newPokemonData, setNewPokemonData] = useState<Array<Poketype>>([]);

    //states used to determine if previous/next page exists
    const [nextPage, setNextPage] = useState<string>();
    const [prevPage, setPrevPage] = useState<string>();

    //state used to store how many pokemons there are in total in the api
    const [pokemonCount, setPokemonCount] = useState<string>();

    //axios request to gather data from the api
    useEffect(() => {

        //calculating offset
        const pokemonOffset = (((Number(match.params.pageId)) - 1) * pokemonLimit);
        axios.get(`https://pokeapi.co/api/v2/pokemon?offset=${pokemonOffset}&limit=${pokemonLimit}`).then(function (response) {
                const { data } = response;
                const { results } = data;
                setNextPage(data.next);
                setPrevPage(data.previous);
                setPokemonCount(data.count);

                //mapping through the results and storing them in an array
                const pokearray: Array<Poketype> = results.map((pokemon: Pokedata) => (
                    {
                        id: pokemon.url.substring(34, pokemon.url.length - 1),
                        name: pokemon.name,
                        sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.url.substring(34, pokemon.url.length - 1)}.png`
                    }
                ));
                //there can be no duplicate data inserted with this implementation
                setNewPokemonData(pokearray);
            }).catch(error =>{
                console.log("Error in very first axios, R.I.P.: ", error);
            });
    }, [pokemonLimit, thisDoesNothing]);

    const isFirstPage = (prevPage == null);
    const isLastPage = (nextPage == null);

    //declaring and filling an array with numbers representing the total amount of pages available
    const pagesList: Array<number> = []
    for (let i = 0; i < (Math.ceil((Number(pokemonCount!) / pokemonLimit))); i++) {
        pagesList.push(1 + i);
    };

    let i = 0;

    return (
        <>
            <AppBar key={"appBarTop"} position='static' className={classes.appBar}>
                <Toolbar key={"toolBarTop"}>
                    <Button key={"prevButtonTop"} variant="contained" size="large" disabled={isFirstPage} onClick={() => {
                        history.push(
                            {
                                pathname: `/${(Number(match.params.pageId) - 1)}`,
                                search: `?${pokemonLimit}`,
                            })
                        setThisDoesNothing(`${(Number(match.params.pageId) - 1)}`);
                    }}>Prev</Button>
                    <Typography key={"typographyPageTop"} className={classes.typography} style={{fontWeight: 800 }}>    Page:     </Typography>
                    <Select key={"selectPageTop"} native value={Number(match.params.pageId)} onClick={(event: React.MouseEvent<HTMLInputElement>) => {
                        const e = event.target as HTMLInputElement;
                        history.push(
                            {
                                pathname: `${e.value}`,
                                search: `?${pokemonLimit}`,
                            }
                        )
                        setThisDoesNothing(`${e.value}`);
                    }} >
                        {pagesList.map((item: number, index) => <option key={index} style={{ fontWeight: 800 }}>{item}</option>)}
                    </Select>
                    <Button key={"buttonNextTop"} variant="contained" size="large" disabled={isLastPage} onClick={() => {
                        history.push(
                            {
                                pathname: `/${(Number(match.params.pageId) + 1)}`,
                                search: `?${pokemonLimit}`,
                            })
                        setThisDoesNothing(`${(Number(match.params.pageId) + 1)}`);
                    }}>Next</Button>
                    <Typography key={"typographyDisplayTop"} style={{ whiteSpace: "pre", color: "black", fontWeight: 800 }}>          Cards displayed:    </Typography>

                    <TextField key={"textFieldTop"} id="outlined-basic" placeholder="(default: 54)" variant="outlined" error={(isNaN(Number(textFieldData)))} 
                    helperText={"Numbers only. (0 < n < " + pokemonCount + ")"}
                    onKeyPress={
                        params => {
                            if (!isNaN(Number(textFieldInput))) {
                                if (params.key === "Enter") {
                                    if(Number(textFieldInput) > Number(pokemonCount!)) {
                                        textFieldInput = pokemonCount!;
                                    };
                                    history.replace(`${match.params.pageId}?${textFieldInput}`);
                                    setPokemonLimit(Number(textFieldInput));
                                   
                                    

                                }
                            }
                        }} onChange={(event: ChangeEvent<HTMLInputElement>) => {
                            textFieldInput = event?.target.value;
                            setTextFieldData(event?.target.value);
                        }} />

                </Toolbar>
            </AppBar>
            {
                newPokemonData ? (
                    <Grid key={"key"} container spacing={2} className={classes.root}>
                        {newPokemonData.map((pokemon, index) => (
                            <PokeCard key={index} id={pokemon.id} name={pokemon.name} sprite={pokemon.sprite} pokedexPageId={match.params.pageId}
                            pokemonLimit={`${pokemonLimit}`} />
                        ))}

                    </Grid>
                ) : (
                        <CircularProgress key={"circularProgress"} ></CircularProgress>
                    )
            }
            <AppBar key={"appBarBottom"} position='static' className={classes.appBar}>
                <Toolbar key={"toolBarBottom"} className={classes.toolBar_bottom}>
                    <Typography key={"typographyDisplayBottom"} className={classes.typography} style={{ fontWeight: 800 }}>          Cards displayed:    </Typography>

                    <TextField key={"textFieldBottom"} id="outlined-basic" placeholder="(default: 54)" variant="outlined" error={(isNaN(Number(textFieldData)))} 
                    helperText={"Numbers only. (0 < n < " + pokemonCount + ")"}
                    onKeyPress={
                        params => {
                            if (!isNaN(Number(textFieldInput))) {
                                if (params.key === "Enter") {
                                    if(Number(textFieldInput) > Number(pokemonCount!)) {
                                        textFieldInput = pokemonCount!;
                                    };
                                    history.replace(`${match.params.pageId}?${textFieldInput}`);
                                    setPokemonLimit(Number(textFieldInput));
                                   

                                }
                            }
                        }} onChange={(event: ChangeEvent<HTMLInputElement>) => {
                            textFieldInput = event?.target.value;
                            setTextFieldData(event?.target.value);
                        }} />

                    <Button key={"prevButtonBottom"} variant="contained" size="large" disabled={isFirstPage} onClick={() => {
                        history.push(
                            {
                                pathname: `/${(Number(match.params.pageId) - 1)}`,
                                search: `?${pokemonLimit}`,
                            })
                        setThisDoesNothing(`${(Number(match.params.pageId) - 1)}`);
                    }}>Prev</Button>
                    <Typography key={"typographyPageBottom"} style={{ whiteSpace: "pre", color: "black", fontWeight: 800 }}>    Page:     </Typography>
                    <Select key={"selectPageBottom"} native value={Number(match.params.pageId)} onClick={(event: React.MouseEvent<HTMLInputElement>) => {
                        const e = event.target as HTMLInputElement;
                        history.push(
                            {
                                pathname: `${e.value}`,
                                search: `?${pokemonLimit}`,
                            }
                        )
                        setThisDoesNothing(`${e.value}`);
                    }} >
                        {pagesList.map((item: number, index) => <option key={index} style={{ fontWeight: 800 }}>{item}</option>)}
                    </Select>
                    <Button key={"buttonNextBottom"}  variant="contained" size="large" disabled={isLastPage} onClick={() => {
                        history.push(
                            {
                                pathname: `/${(Number(match.params.pageId) + 1)}`,
                                search: `?${pokemonLimit}`,
                            })
                        setThisDoesNothing(`${(Number(match.params.pageId) + 1)}`);
                    }}>Next</Button>


                </Toolbar>
            </AppBar>

        </>
    );
};


export default Pokedex;
