import React from 'react';
import { Grid, Card, CardContent, CardMedia, makeStyles, Typography,} from '@material-ui/core';
import { useHistory } from "react-router-dom";
import { PokeCardProps } from './interfaces';
import Styles  from './styles';


const toUpperCase = (name: string) => {
    return name.charAt(0).toUpperCase() + name.slice(1);

};

const PokeCard = ({ id, name, sprite, pokedexPageId, pokemonLimit}: PokeCardProps) => {
    const history = useHistory();
    const classes = Styles();
    return (
        <Grid container spacing={0} item xs={12} sm={2}>
            <Card onClick={() => history.push(
                {
                    pathname: `/${pokedexPageId}/${id}`,
                    search: `?${pokemonLimit}`
                })} className={classes.cards}>
                <CardContent className={classes.typographyCardId}>
                    <Typography variant="h4">
                        {id}
                    </Typography>
                </CardContent>
                <CardMedia
                    className={classes.cardMedia}
                    image={sprite}
                    style={{ height: "200px", width: "200px" }}>
                </CardMedia>
                <CardContent className={classes.typographyCardName}>

                    <Typography variant="h5" style={{fontWeight: 900, fontSize: "28px"}}>
                        {name && toUpperCase(name)}
                    </Typography>

                </CardContent>

            </Card>
        </Grid>
    );
};

export default PokeCard;