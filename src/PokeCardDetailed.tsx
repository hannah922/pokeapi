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
        borderBottom: "none",
        borderTop: "none",
    },

});

const toUpperCase = (name: string) => {
    return name.charAt(0).toUpperCase() + name.slice(1);

};




interface spriteInterface {
    evolutionName: string,
    itemName: string,
    itemSpriteUrl: string,
};

interface pokemonAvatarInterface {
    pokemonName: string,
    pokemonID: string,
    pokemonSprite: string,
};

const PokeCardDetailed = ({ id, name, abilities, sprites, types, stats, evolutions, moves }: PokeCardDetailedProps) => {

    console.log({ evolutions })

    // mapName('test name', [{name: 'pika', sprite: 'pika.jpg'}, {name: 'bulbasaur', sprite: 'bulbasaur.jpg'}]);
    const [evolutionItems, setEvolutionItems] = useState<Array<spriteInterface>>([]);
    const [evolutionNameProperties, setEvolutionNameProperties] = useState<Array<pokemonAvatarInterface>>([]);

    const history = useHistory();
    const classes = Styles();

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
                    }]
                })
            })
        })
    }, []);

    useEffect(() => {
        evolutions.forEach((evolution) => {
            axios.get(`https://pokeapi.co/api/v2/pokemon/${evolution.name}`).then(response => {
                setEvolutionNameProperties(previousEvolutionNames => {
                    return [...previousEvolutionNames,
                    {
                        pokemonName: evolution.name,
                        pokemonID: response.data.id,
                        pokemonSprite: response.data.sprites.front_default,
                    }
                    ]
                })
            })
        })

    }, []);


    const evolution_column: GridColDef[] = [
        { field: 'id', width: 20, hide: true },
        {
            field: 'name', width: 300, align: 'right',
            renderCell: (params) => {
                const rowData = params.row.name;
                return (
                    <div>
                        <Typography align={'right'} style={{ fontSize: 25, whiteSpace: "pre", paddingLeft: "00px", fontWeight: 800 }}>{rowData[0]}:</Typography>
                        <Avatar style={{ width: "80px", height: "80px", paddingLeft: "0px" }} src={rowData[2]}></Avatar>
                    </div>
                )
            }
        },
        {
            field: 'rest', width: 300, align: 'left', type: 'string',
            renderCell: (params) => {
                const rowData = params.row.rest;
                return (
                    <div>
                        <Typography style={{ fontSize: 25, paddingLeft: "0px" }}>Level: {rowData[0]}</Typography>
                        <Typography style={{ fontSize: 25, paddingLeft: "0px" }}>Condition: {rowData[1]}</Typography>
                        {rowData[2] && <Typography style={{ fontSize: 25, paddingLeft: "0px", display: "flex", whiteSpace: "pre" }}>
                            Item: {rowData[2]} <Avatar style={{ width: "40px", height: "40px" }} src={rowData[3]}></Avatar>
                        </Typography>}
                    </div>);
            },

        }
    ];

    let evolutionRows: GridRowsProp = [];



    const statsColumns: GridColDef[] = [
        { field: 'id', width: 20, hide: true },
        {
            field: 'stats', width: 300, align: 'left',
            renderCell: (params) => {
                const rowData = params.row.stats;
                console.log("hoi", rowData);
                return (
                    <div>
                        <Typography style={{ fontWeight: 800, fontSize: "25px", whiteSpace: "pre" }}>{rowData[0]}: </Typography> <Typography>{rowData[1]}</Typography>
                    </div>
                );
            },
        },
        {
            field: 'effort', width: 150, align: 'left',
            renderCell: (params) => {
                const rowData = params.row.effort;
                return (
                    <div>
                        <Typography style={{ fontSize: "25px", fontStyle: (rowData == "0") ? "normal" : "italic" }}>(effort: {rowData})</Typography>
                    </div>
                );
            },
        },
    ];

    let statRows: GridRowsProp = [];


    let evolutionID = 0;
    evolutions.forEach((evolution: { name: string, trigger: string, held_item: { name: string, url: string }, min_level: string }) => {
        let itemSprite = evolutionItems.find(item => item.evolutionName === evolution.name);
        let itemNameDetails = evolutionNameProperties.find(item => item.pokemonName === evolution.name);

        evolutionRows.push({
            id: evolutionID++,
            name: [
                evolution.name,
                itemNameDetails?.pokemonID,
                itemNameDetails?.pokemonSprite,
            ],
            rest: [
                evolution.min_level,
                evolution.trigger,
                evolution.held_item.name === 'Object_was_null' ? '' : evolution.held_item.name,
                itemSprite ? itemSprite.itemSpriteUrl : ''
            ],
        });

        console.log({ evolution_row: evolutionRows });


    }
    );
    let statID = 0;
        stats.forEach((items: { name: string, effort: string, value: string }) => {
         
            statRows.push({
                id: statID++,
                stats: [items.name, items.value],
                effort: items.effort,

            });
        });

        console.log("whatthe: ", statRows);
    

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



                </Table>

                <DataGrid
                    className={classes.datagrid}
                    disableColumnSelector={true}
                    disableColumnMenu={true}
                    rows={statRows}
                    columns={statsColumns}
                    autoHeight={true}
                    disableSelectionOnClick={true}
                    hideFooter={true}
                    showCellRightBorder={false}
                    showColumnRightBorder={false}
                    headerHeight={0}
                    disableExtendRowFullWidth={false}
                    rowHeight={75}
                ></DataGrid>
                <Typography style={{ fontSize: "30px", fontWeight: 700, paddingLeft: "40px", whiteSpace: "pre" }}>Evolutions: </Typography>
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
                    rowHeight={125}
                ></DataGrid>



            </Box>


        </>
    );
};

export default PokeCardDetailed;