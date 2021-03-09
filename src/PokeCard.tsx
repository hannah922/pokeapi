import React from 'react';
import { Grid, Card, CardContent, CardMedia, makeStyles, Typography, Button, Divider, createMuiTheme, ThemeProvider, createStyles } from '@material-ui/core';
import { Route, Router, Switch } from 'react-router-dom';
import { useHistory } from "react-router-dom";

interface PokeCardProps {
    name: string,
    id: string,
    sprite: string,
    pokedexPageId: string,
};


const Styles = makeStyles({
    cards: {
        borderRight: '0.9em solid black', 
        borderBottom: '0.5em solid black',
        padding: '0.5em',
        borderRadius: 20,

    },
    cardMedia: {
        margin: "auto",
    },
    typography_id: {
        textAlign: "left",
        fontStyle: "italic",
    },
    typography_name: {
        fontSize: "28px", //hm this does nothing
        textAlign: "center",
        fontWeight: 'bold',  //this also does nothing.. typescript string type issue?
    },
});

const toUpperCase = (name: string) => {
    return name.charAt(0).toUpperCase() + name.slice(1);

};

const PokeCard = ({ id, name, sprite, pokedexPageId }: PokeCardProps) => {
    const history = useHistory();
    const classes = Styles();
    return (
        <Grid container spacing={0} item xs={12} sm={2}>
            <Card onClick={() => history.push(
                {
                    pathname: `/${pokedexPageId}/${id}`
                })} className={classes.cards}>
                <CardContent className={classes.typography_id}>
                    <Typography variant="h4">
                        {id}
                    </Typography>
                </CardContent>
                <CardMedia
                    className={classes.cardMedia}
                    image={sprite}
                    style={{ height: "200px", width: "200px" }}>
                </CardMedia>
                <CardContent className={classes.typography_name}>

                    <Typography variant="h5" style={{fontWeight: 900, fontSize: "28px"}}>
                        {name && toUpperCase(name)}
                    </Typography>

                </CardContent>

            </Card>
        </Grid>
    );
};

export default PokeCard;