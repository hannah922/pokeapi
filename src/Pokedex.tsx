import React, { ChangeEvent, FunctionComponent, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { AppBar, Button, CircularProgress, makeStyles, Select, TextField, Typography, Toolbar, Grid } from '@material-ui/core';
import PokeCard from './PokeCard';
import axios from 'axios';


interface componentProps {
    match: {
        params: {
            pageId: string,
        }
    }
}

const Styles = makeStyles({
    root: {
        paddingTop: "20px",
        paddingLeft: "50px",
        paddingRight: "50px",
    },
});


interface Pokedata {
    name: string,
    url: string,
};


interface Poketype {
    id: string,
    name: string,
    sprite: string,
}

let textFieldInput: string = "54";

const Pokedex: FunctionComponent<componentProps> = ({ match }) => {


    const history = useHistory();
    const classes = Styles();

    const [pokemonLimit, setPokemonLimit] = useState<number>((history.location.search != undefined) ? Number(history.location.search.substring(1)) : 54);
    const [textFieldData, setTextFieldData] = useState<string>("54");
    const [thisDoesNothing, setThisDoesNothing] = useState<string>("");
    const [newPokemonData, setNewPokemonData] = useState<Array<Poketype>>([]);

    const [nextPage, setNextPage] = useState<string>();
    const [prevPage, setPrevPage] = useState<string>();
    const [pokemonCount, setPokemonCount] = useState<string>();

    useEffect(() => {
        const pokemonOffset = (((Number(match.params.pageId)) - 1) * pokemonLimit);
        axios
            .get(`https://pokeapi.co/api/v2/pokemon?offset=${pokemonOffset}&limit=${pokemonLimit}`)
            .then(function (response) {
                const { data } = response;
                const { results } = data;
                //console.log(results);
                //console.log(`adding pokemon: ${pokemon.name}`, newPokemonData);
                setNextPage(data.next);
                setPrevPage(data.previous);
                setPokemonCount(data.count);
                const pokearray: Array<Poketype> = results.map((pokemon: Pokedata) => (
                    //"https://pokeapi.co/api/v2/pokemon/26/"
                    {
                        id: pokemon.url.substring(34, pokemon.url.length - 1),
                        name: pokemon.name,
                        sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.url.substring(34, pokemon.url.length - 1)}.png`
                    }
                ));

                setNewPokemonData(pokearray);
            });
    }, [pokemonLimit, thisDoesNothing]);

    const isFirstPage = (prevPage == null);
    const isLastPage = (nextPage == null);
    const pagesList: Array<number> = []
    for (let i = 0; i < (Math.ceil((Number(pokemonCount!) / pokemonLimit))); i++) {
        pagesList.push(1 + i);
    };


    return (
        <>
            <AppBar position='static' style={{ background: '#5f72ea' }}>
                <Toolbar>
                    <Button variant="contained" size="large" disabled={isFirstPage} onClick={() => {
                        history.push(
                            {
                                pathname: `/${(Number(match.params.pageId) - 1)}`,
                                search: `?${pokemonLimit}`,
                            })
                        setThisDoesNothing(`${(Number(match.params.pageId) - 1)}`);
                    }}>Prev</Button>
                    <Typography style={{ whiteSpace: "pre", color: "black", fontWeight: 800 }}>    Page:     </Typography>
                    <Select native value={Number(match.params.pageId)} onClick={(event: React.MouseEvent<HTMLInputElement>) => {
                        const e = event.target as HTMLInputElement;
                        history.push(
                            {
                                pathname: `${e.value}`,
                                search: `?${pokemonLimit}`,
                            }
                        )
                        setThisDoesNothing(`${e.value}`);
                    }} >
                        {pagesList.map((item: number) => <option style={{ fontWeight: 800 }}>{item}</option>)}
                    </Select>
                    <Button variant="contained" size="large" disabled={isLastPage} onClick={() => {
                        history.push(
                            {
                                pathname: `/${(Number(match.params.pageId) + 1)}`,
                                search: `?${pokemonLimit}`,
                            })
                        setThisDoesNothing(`${(Number(match.params.pageId) + 1)}`);
                    }}>Next</Button>
                    <Typography style={{ whiteSpace: "pre", color: "black", fontWeight: 800 }}>          Cards displayed:    </Typography>

                    <TextField id="outlined-basic" placeholder="(default: 54)" variant="outlined" error={(isNaN(Number(textFieldData)))} 
                    helperText={"Numbers only. (0 < n < " + pokemonCount}
                    onKeyPress={
                        params => {
                            if (!isNaN(Number(textFieldInput))) {
                                if (params.key === "Enter") {
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
                    <Grid container spacing={2} className={classes.root}>
                        {/* {BetterObject.keys(PokemonData).map(
            (pokemonId) => PokeCard(pokemonId))} */}
                        {newPokemonData.map(pokemon => (
                            <PokeCard id={pokemon.id} name={pokemon.name} sprite={pokemon.sprite} pokedexPageId={match.params.pageId}
                            pokemonLimit={`${pokemonLimit}`} />
                        ))}

                    </Grid>
                ) : (
                        <CircularProgress></CircularProgress>
                    )
            }
            <AppBar position='static' style={{ background: '#5f72ea' }}>
                <Toolbar style={{ marginLeft: "auto" }}>
                    <Typography style={{ whiteSpace: "pre", color: "black", fontWeight: 800 }}>          Cards displayed:    </Typography>

                    <TextField id="outlined-basic" placeholder="(default: 54)" variant="outlined" error={(isNaN(Number(textFieldData)))} 
                    helperText={"Numbers only. (0 < n < " + pokemonCount}
                    onKeyPress={
                        params => {
                            if (!isNaN(Number(textFieldInput))) {
                                if (params.key === "Enter") {
                                    setPokemonLimit(Number(textFieldInput));

                                }
                            }
                        }} onChange={(event: ChangeEvent<HTMLInputElement>) => {
                            textFieldInput = event?.target.value;
                            setTextFieldData(event?.target.value);
                        }} />

                    <Button variant="contained" size="large" disabled={isFirstPage} onClick={() => {
                        history.push(
                            {
                                pathname: `/${(Number(match.params.pageId) - 1)}`,
                                search: `?${pokemonLimit}`,
                            })
                        setThisDoesNothing(`${(Number(match.params.pageId) - 1)}`);
                    }}>Prev</Button>
                    <Typography style={{ whiteSpace: "pre", color: "black", fontWeight: 800 }}>    Page:     </Typography>
                    <Select native value={Number(match.params.pageId)} onClick={(event: React.MouseEvent<HTMLInputElement>) => {
                        const e = event.target as HTMLInputElement;
                        history.push(
                            {
                                pathname: `${e.value}`,
                                search: `?${pokemonLimit}`,
                            }
                        )
                        setThisDoesNothing(`${e.value}`);
                    }} >
                        {pagesList.map((item: number) => <option style={{ fontWeight: 800 }}>{item}</option>)}
                    </Select>
                    <Button variant="contained" size="large" disabled={isLastPage} onClick={() => {
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
