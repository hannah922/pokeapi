import React, { useEffect, useState } from 'react';
import { FunctionComponent } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { AppBar, CircularProgress, createStyles, makeStyles, Typography } from '@material-ui/core';
import { Toolbar } from '@material-ui/core';
import { Grid } from '@material-ui/core';
import MockData from './MockData';
import PokeCard from './PokeCard';
import Pokemon from './Pokemon';
import axios from 'axios';


const useStyles = makeStyles({
    pokedexContainer: {
        paddingTop: "20px",
        paddingLeft: "50px",
        paddingRight: "50px",
    }
});

const Styles = makeStyles({
    root: {
        paddingTop: "20px",
        paddingLeft: "50px",
        paddingRight: "50px",
    },
});


interface pokedata {
    name: string,
    url: string,
};


interface poketype {
    id: string,
    name: string,
    sprite: string,
}

const Pokedex: FunctionComponent<RouteComponentProps> = () => {

    const [PokemonData, setPokemonData] = useState(Object.values(MockData));
    const classes = Styles();
    //return <div> this is the pokedex page  </div>;

    const [newPokemonData, setNewPokemonData] = useState<Array<poketype>>([]);


    useEffect(() => {
        axios
            .get(`https://pokeapi.co/api/v2/pokemon?limit=50`)
            .then(function (response) {
                const { data } = response;
                const { results } = data;
                //console.log(results);
                //console.log(`adding pokemon: ${pokemon.name}`, newPokemonData);

                const pokearray: Array<poketype> = results.map((pokemon: pokedata) => (
                    //"https://pokeapi.co/api/v2/pokemon/26/"
                    {
                        id: pokemon.url.substring(34, pokemon.url.length - 1),
                        name: pokemon.name,
                        sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.url.substring(34, pokemon.url.length - 1)}.png`
                    }
                ));

                setNewPokemonData(pokearray);
            });
    }, []);




    return (
        <>
            <AppBar position='static'>
                <Toolbar>

                </Toolbar>
            </AppBar>
            {newPokemonData ? (
                <Grid container spacing={2} className={classes.root}>
                    {/* {BetterObject.keys(PokemonData).map(
            (pokemonId) => PokeCard(pokemonId))} */}
                    {newPokemonData.map(pokemon => (
                        <PokeCard id={pokemon.id} name={pokemon.name} sprite={pokemon.sprite}/>
                    ))}

                </Grid>
            ) : (
                    <CircularProgress></CircularProgress>
                )}

        </>
    );
};


export default Pokedex;
