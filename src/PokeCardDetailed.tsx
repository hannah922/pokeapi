import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, CardMedia, makeStyles, Typography, Button, Avatar, Box, Divider, List, Table, TableRow, TableCell } from '@material-ui/core';
import { Route, Router, Switch } from 'react-router-dom';
import { useHistory } from "react-router-dom";
import { ListItem } from '@material-ui/core';
import { DataGrid, GridCellParams, GridColDef, GridRowModel, GridRowsProp } from '@material-ui/data-grid';
import { stringify } from 'querystring';
import axios from 'axios';



interface PokeCardDetailedProps {
    id: string,
    name: string,
    abilities: Array<{ name: string, url: string }>,
    sprite: string,
    types: [{ name: string }],
    stats: [{
        name: string,
        effort: string,
        value: string
    }],
    evolutions: Array<{
        name: string,
        trigger: string,
        special: Array<{
            name: string,
            url: string,
        }>,
        min_level: string,
    }>,
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

interface evolutionConditions {
    pokemonName: string,
    condition: Array<{ id: string, name: string }>,
    sprite: string,
};

const PokeCardDetailed = ({ id, name, abilities, sprite, types, stats, evolutions, }: PokeCardDetailedProps) => {

    const [evolutionNameProperties, setEvolutionNameProperties] = useState<Array<pokemonAvatarInterface>>([]);
    const [evolutionConditions, setEvolutionConditions] = useState<Array<evolutionConditions>>([]);

    const history = useHistory();
    const classes = Styles();
    useEffect(() => {
        evolutions.forEach((evolution) => {
            let temporaryConditionArray: Array<{ id: string, name: string }> = [];
            for (let i = 0; i < evolution.special.length; i++) {
                if (evolution.special[i].url === "NULL_gender") {
                    temporaryConditionArray.push({ id: "0", name: evolution.special[i].name });
                } else
                if (evolution.special[i].url === "NULL_knownmove") {
                    temporaryConditionArray.push({ id: "1", name: evolution.special[i].name });
                } else
                if (evolution.special[i].url === "NULL_location") {
                    temporaryConditionArray.push({ id: "2", name: evolution.special[i].name });
                } else
                if (evolution.special[i].url != "NULL_gender" && evolution.special[i].url != "NULL_knownmove" && evolution.special[i].url != "NULL_location") {
                    temporaryConditionArray.push({ id: "3", name: evolution.special[i].name });
                    axios.get(`${evolution.special[i].url}`).then(response => {
  
                        setEvolutionConditions(previousState => {
                            return [...previousState,
                            {
                                pokemonName: evolution.name,
                                condition: (temporaryConditionArray.length > 0) ? temporaryConditionArray : [{ id: "100", name: "" }],
                                sprite: response.data.sprites.default,
                            }]
                        });
                    }).catch(error => {
                        console.log("Error in the first useState in PokeCardDetailed: ", error);
                    });

                };

            };
            

        });
    }, [evolutions]);




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

    }, [evolutions]);


    const evolution_column: GridColDef[] = [
        { field: 'id', width: 20, hide: true },
        {
            field: 'name', width: 300, align: 'right',
            renderCell: (params) => {
                const rowData = params.row.name;
                return (
                    <div>
                        <Typography align={'right'} style={{ fontSize: 25, whiteSpace: "pre", paddingLeft: "20px", fontWeight: 800 }}>{rowData[0]}:</Typography>
                        <Avatar style={{ width: "80px", height: "80px", paddingLeft: "20px" }} src={rowData[2]}></Avatar>
                    </div>
                )
            }
        },
        {
            field: 'rest', width: 300, align: 'left', type: 'string',
            renderCell: (params) => {
                const rowData = params.row.rest;
                console.log("test1: rowData: ", rowData);
                let temporaryArray = rowData[2].split('|');
                let conditions = (temporaryArray.length) - 1;
                return (
                    <div>
                        <Typography style={{ fontSize: 25, paddingLeft: "10px" }}>Level: {rowData[0]}</Typography>
                        <Typography style={{ fontSize: 25, paddingLeft: "10px" }}>Trigger: {rowData[1]}</Typography>
                        {(conditions >= 1) && <Typography style={{ fontSize: 25, paddingLeft: "10px", display: "flex", whiteSpace: "pre" }}>
                            {temporaryArray[0]} {(rowData[3] != "") && <Avatar style={{ width: "40px", height: "40px" }} src={rowData[3]}></Avatar>}
                        </Typography>}
                        {(conditions >= 2) && <Typography style={{ fontSize: 25, paddingLeft: "10px", display: "flex", whiteSpace: "pre" }}>
                            {temporaryArray[1]} {(rowData[3] != "") && <Avatar style={{ width: "40px", height: "40px" }} src={rowData[3]}></Avatar>}
                        </Typography>}
                        {(conditions >= 3) && <Typography style={{ fontSize: 25, paddingLeft: "10px", display: "flex", whiteSpace: "pre" }}>
                            {temporaryArray[2]} {(rowData[3] != "") && <Avatar style={{ width: "40px", height: "40px" }} src={rowData[3]}></Avatar>}
                        </Typography>}
                        {(conditions == 4) && <Typography style={{ fontSize: 25, paddingLeft: "10px", display: "flex", whiteSpace: "pre" }}>
                            {temporaryArray[4]} {(rowData[3] != "") && <Avatar style={{ width: "40px", height: "40px" }} src={rowData[3]}></Avatar>}
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
                return (
                    <div>
                        <Typography style={{ fontWeight: 800, fontSize: "25px", whiteSpace: "pre", paddingLeft: "20px", display: "flex" }}>{rowData[0]}: <Typography style={{ display: "flex", fontSize: 25 }}>{rowData[1]}</Typography></Typography>
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
                        <Typography style={{ fontSize: "25px", fontStyle: (rowData == "0") ? "normal" : "italic", paddingLeft: 10 }}>(effort: {rowData})</Typography>
                    </div>
                );
            },
        },
    ];

    let statRows: GridRowsProp = [];


    let evolutionID = 0;
    evolutions.forEach((evolution: { name: string, trigger: string, special: Array<{ name: string, url: string }>, min_level: string }) => {
        let itemSprite = evolutionConditions.find(item => item.pokemonName === evolution.name);
        console.log("test5: evolutioncondition: ", evolutionConditions);
        console.log("test5: itemsprite: ", itemSprite);
        let itemNameDetails = evolutionNameProperties.find(item => item.pokemonName === evolution.name);
        let temporaryString = "";
        for (let i = 0; i < ((itemSprite != undefined) ? itemSprite!.condition.length : 0); i++) {
            if (itemSprite!.condition[i].id == "0") {
                temporaryString += "Gender: " + itemSprite!.condition[i].name + "|";
            } else if (itemSprite!.condition[i].id == "1") {
                temporaryString += "Known Move: " + itemSprite!.condition[i].name + "|";
            } else if (itemSprite!.condition[i].id == "2") {
                temporaryString += "Location: " + itemSprite!.condition[i].name + "|";
            } else if (itemSprite!.condition[i].id == "3") {
                temporaryString += "Item: " + itemSprite!.condition[i].name + "|";
            };

        };
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
                temporaryString,
                itemSprite?.sprite,
            ],
        });




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




    return (
        <>

            <Box className={classes.box}>


                <Typography className={classes.typography_id} variant="h3" style={{ fontWeight: 900 }}>
                    ({id}) {toUpperCase(name)}
                </Typography>
                <Avatar
                    className={classes.avatar}
                    src={sprite}
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



                </Table>
                <Typography style={{ fontSize: "40px", fontWeight: 700, paddingLeft: "10px", whiteSpace: "pre" }}>Moves & Stats: </Typography>
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
                <Typography style={{ fontSize: "40px", fontWeight: 700, paddingLeft: "10px", whiteSpace: "pre" }}>Evolutions: </Typography>
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