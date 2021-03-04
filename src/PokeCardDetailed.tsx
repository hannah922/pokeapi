import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, CardMedia, makeStyles, Typography, Button, Avatar, Box, Divider, List, Table, TableRow, TableCell } from '@material-ui/core';
import { Route, Router, Switch } from 'react-router-dom';
import { useHistory } from "react-router-dom";
import { ListItem } from '@material-ui/core';
import { DataGrid, GridCellParams, GridColDef, GridRowModel, GridRowsProp } from '@material-ui/data-grid';
import { stringify } from 'querystring';
import axios from 'axios';



interface PokeCardDetailedPropstest {
    name: string,
    id: number
};
interface PokeCardDetailedProps {
    id: string,
    name: string,
    abilities: [{ name: string }],
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



const Styles = makeStyles({
    pokedexContainer: {
        paddingTop: "20px",
        paddingLeft: "50px",
        paddingRight: "50px",
    },
    avatar: {
        margin: "auto",
    },
    typography_id: {
        paddingLeft: "40px",
        paddingTop: "40px",
        textAlign: "left",
        fontStyle: "italic",
    },
    box: {
        margin: "auto",
        borderRight: "5px solid black",
        backgroundColor: "cyan",
        width: "700px",
    },
    table: {
        borderTopWidth: 3,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderColor: "black",
        borderStyle: "solid",
    },
    table_row: {
        borderBottomWidth: 3,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderTopWidth: 0,
        borderColor: "black",
        borderStyle: "solid",
    },
    table_cell_1: {
        paddingBottom: "100px",
        width: "100px",
    },
    table_cell_2: {
        paddingBottom: "45px",

    },
    spacing: {
        whiteSpace: "pre",
    },
    datagrid: {
        overflow: "hidden",
    },

});

const toUpperCase = (name: string) => {
    return name.charAt(0).toUpperCase() + name.slice(1);

};

function mapName(name: string, ayyyylmao: Array<{ name: string, sprite: string }>) {
    var sprite = "";
    console.log("the name: ",name,"and the array:", ayyyylmao, "and its length: ", ayyyylmao.length);
    for (let j = 0; j < ayyyylmao.length; j++) {
        if (name == ayyyylmao[j].name) {
            console.log("we doing something bois");
            sprite = ayyyylmao[j].sprite;
        }
        else {
            console.log("we aint doing nothing bois");
        }
    };
    return sprite;
};


interface spriteInterface {
    evolutionName: string,
    itemName: string,
    itemSpriteUrl: string,
}

const PokeCardDetailed = ({ id, name, abilities, sprites, types, stats, evolutions, moves }: PokeCardDetailedProps) => {

    console.log({evolutions})

    // mapName('test name', [{name: 'pika', sprite: 'pika.jpg'}, {name: 'bulbasaur', sprite: 'bulbasaur.jpg'}]);
   const [evolutionItems, setEvolutionItems] = useState<Array<spriteInterface>>([]);

    //console.log(id, name);
    const history = useHistory();
    const classes = Styles();


    // let evolutionSprites: Array<spriteInterface> = [];
    // console.log('evolution_sprite after declaration', evolutionSprites);
/* 
    evolution_sprite.push({ name: 'test name', sprite: 'test sprite'});
    console.log('evolution_sprite array with one test element', evolution_sprite);
 */
/*     evolutions.map((element: { name: string, trigger: string, held_item: { name: string, url: string }, min_level: string }) => {
        axios.get(`${element.held_item.url}`).then(function (response) {
            evolutionSprites.push({ name: element.name, sprite: response.data.sprites.default });
        }).catch(error => {
            evolutionSprites.push({ name: element.name, sprite: "nothing" });
        });

    }); */

    useEffect(() => {
        evolutions.forEach((evolution) => {
            if (evolution.held_item.name === "Object_was_null") {
                return;
            }
            axios.get(`${evolution.held_item.url}`).then(response => {
                setEvolutionItems(previousEvolutionItems => {
                    return [...previousEvolutionItems,
                {
                    evolutionName: evolution.name,
                    itemName: evolution.held_item.name,
                    itemSpriteUrl: response.data.sprites.default
                }]})
            })
        })
    }, []);


    const evolution_column: GridColDef[] = [
        { field: 'id', width: 20, hide: true },
        {
            field: 'name', width: 300, align: 'right',
            renderCell: (params) => (
                <div>
                    <Typography align={'right'} style={{ fontSize: 25, whiteSpace: "pre", paddingLeft: "100px", fontWeight: 800 }}>{params.value}:</Typography>
                </div>
            )
        },
        {
            field: 'rest', width: 300, align: 'left', type: 'string',
            renderCell: (params) => {
                console.log({params})
                const rowData = params.row.rest;
                return (
                    <div>
                        <Typography style={{ fontSize: 25, paddingLeft: "40px" }}>Level: {rowData[0]}</Typography>
                        <Typography style={{ fontSize: 25, paddingLeft: "40px" }}>Condition: {rowData[1]}</Typography>
                        {rowData[2] && <Typography style={{ fontSize: 25, paddingLeft: "0px", display: "flex", whiteSpace: "pre" }}>
                            Item: {rowData[2]} <Avatar style={{ width: "40px", height: "40px" }} src={rowData[3]}></Avatar>
                        </Typography>}
                    </div>);
            },

        }
    ];

    var evolutionRows: GridRowsProp = [];
    var i = 0;


    evolutions.forEach((evolution: { name: string, trigger: string, held_item: { name: string, url: string }, min_level: string }) => {
        let item = evolutionItems.find(item => item.evolutionName === evolution.name);

        evolutionRows.push({
            id: i++,
            name: evolution.name,
            rest: [
                evolution.min_level,
                evolution.trigger,
                evolution.held_item.name === 'Object_was_null' ? '' : evolution.held_item.name,
                item ? item.itemSpriteUrl : ''
            ],
        });

        console.log({ evolution_row: evolutionRows });


    }
    )

    return (
        <>

            <Box className={classes.box}>


                <Typography className={classes.typography_id} variant="h3" style={{ fontWeight: 900 }}>
                    ({id}) {toUpperCase(name)}
                </Typography>
                <Avatar
                    className={classes.avatar}
                    src={sprites}
                    style={{ height: "250px", width: "250px" }}>
                </Avatar>
                <Table className={classes.table}>
                    <TableRow className={classes.table_row} >
                        <TableCell className={classes.table_cell_1} style={{ fontSize: "30px", fontWeight: 700, }}>
                            Types:
                        </TableCell>
                        <TableCell className={classes.table_cell_2} style={{ fontSize: "25px", }}>
                            <List>
                                {types.map((name: { name: string }) => {
                                    return (
                                        <ListItem>{name.name}</ListItem>
                                    )
                                })}
                            </List>
                        </TableCell>
                    </TableRow>
                    <TableRow className={classes.table_row}>
                        <TableCell className={classes.table_cell_1} style={{ fontSize: "30px", fontWeight: 700, }}>
                            Abilities:
                        </TableCell>
                        <TableCell className={classes.table_cell_2} style={{ fontSize: "25px", }}>
                            <List>
                                {abilities.map((name: { name: string }) => {
                                    return (
                                        <ListItem>{name.name}</ListItem>
                                    )
                                })}

                            </List>
                        </TableCell>
                    </TableRow>
                    <TableRow className={classes.table_row}>
                        <TableCell className={classes.table_cell_1} style={{ fontSize: "30px", fontWeight: 700, }}>
                            Stats:
                        </TableCell>
                        <TableCell className={classes.table_cell_2} style={{ fontSize: "25px", }}>
                            <List>
                                <Typography style={{ fontSize: "30px", whiteSpace: "pre", fontStyle: "italic" }}>  Moves: </Typography>
                                {stats.map((items: { name: string, value: string }) => {
                                    return (
                                        <ListItem className={classes.spacing}><Typography style={{ fontWeight: 800, fontSize: "25px" }}>{items.name}: </Typography>{items.value}</ListItem>
                                    )
                                })}
                            </List>
                        </TableCell>
                        <TableCell>
                            <List>
                                {stats.map((items: { effort: string }) => {
                                    return (
                                        <ListItem className={classes.spacing}><Typography style={{ fontSize: "25px", fontStyle: (items.effort == "0") ? "normal" : "italic" }}>(effort: {items.effort})</Typography></ListItem>
                                    )
                                })}
                            </List>

                        </TableCell>
                    </TableRow>
                    <TableRow className={classes.table_row}>

                        <Typography style={{ fontSize: "30px", fontWeight: 700, paddingLeft: "40px", whiteSpace: "pre" }}>Evolutions: </Typography>

                    </TableRow>
                </Table>

                <DataGrid
                    className={classes.datagrid}
                    disableColumnSelector={true}
                    disableColumnMenu={true}
                    rows={evolutionRows}
                    columns={evolution_column}
                    autoHeight={true}
                    disableSelectionOnClick={true}
                    hideFooter={true}
                    showCellRightBorder={false}
                    showColumnRightBorder={false}
                    headerHeight={0}
                    disableExtendRowFullWidth={false}
                    rowHeight={150}
                ></DataGrid>



            </Box>


        </>
    );
};

export default PokeCardDetailed;