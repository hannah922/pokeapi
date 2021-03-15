import React from 'react';
import { Grid, Card, CardContent, CardMedia, Typography,} from '@material-ui/core';
import { useHistory } from "react-router-dom";
import { PokeCardProps } from './interfaces';
import Styles  from './styles';

const toUpperCase = (name: string) => {
    return name.charAt(0).toUpperCase() + name.slice(1);

};



function onEnterBorderChange(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.currentTarget.style.borderStyle = "double";
  }

  function onLeaveBorderChange(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.currentTarget.style.borderStyle = "solid";
  }


//component used to display contents of the simple pokecards: ID, name, picture
//clicking on a card opens a new page containing their detailed description
const PokeCard = ({ id, name, sprite, pokedexPageId, pokemonLimit}: PokeCardProps) => {
    const history = useHistory();
    const classes = Styles();
    return (
        <Grid key={"pokemonGrid"} item xs={"auto"} sm={"auto"}>
            <Card key={"pokemonCard"}
             onMouseLeave={onLeaveBorderChange}
             onMouseEnter={onEnterBorderChange} 
             onClick={() => history.push(
                {
                    pathname: `/${pokedexPageId}/${id}`,
                    search: `?${pokemonLimit}`
                })} className={classes.cards}>
                <CardContent key={"pokemonCardContentTop"} className={classes.typographyCardId}>
                    <Typography component={'span'} key={"typographyPokemonID"} variant="h4">
                        {id}
                    </Typography>
                </CardContent>
                <CardMedia
                    key={"pokemonAvatar"}
                    className={classes.cardMedia}
                    image={sprite}
                    style={{ height: "200px", width: "200px" }}>
                </CardMedia>
                <CardContent key={"pokemonCardContentBottom"} className={classes.typographyCardName}>

                    <Typography component={'span'} key={"typographyPokemonName"} variant="h5" style={{fontWeight: 900, fontSize: "28px"}}>
                        {name && toUpperCase(name)}
                    </Typography>

                </CardContent>

            </Card>
        </Grid>
    );
};

export default PokeCard;