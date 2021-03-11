import React, { useState, useEffect } from 'react';
import { makeStyles, Typography, Avatar, Paper, } from '@material-ui/core';
import { useHistory } from "react-router-dom";
import { DataGrid, GridColDef, GridRowsProp } from '@material-ui/data-grid';
import axios from 'axios';
import { PokeCardDetailedProps, pokemonAvatarInterface, evolutionConditions} from './interfaces';
import Styles  from './styles';


const toUpperCase = (name: string) => {
    return name.charAt(0).toUpperCase() + name.slice(1);

};



const PokeCardDetailed = ({ id, name, abilities, sprite, types, stats, evolutions, default_evolution, url_history }: PokeCardDetailedProps) => {


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
            }).catch(error => {
                console.log("Getting an error in the evolution details axios: ", error);
            });
        })

    }, [evolutions]);


    const evolutionColumn: GridColDef[] = [
        { field: 'id', width: 20, hide: true },
        {
            field: 'name', width: 300, align: 'right',
            renderCell: (params) => {
                const rowData = params.row.name;
                console.log("debugging2: ", rowData);
                return (
                    <div>
                        <Typography align={'right'} className={classes.typographyDefEvolution} style={{fontWeight: 800 }}>{rowData[0]}:</Typography>
                        {(rowData[2] != undefined) && <Avatar style={{ width: "80px", height: "80px", paddingLeft: "20px" }} src={rowData[2]}></Avatar>}
                    </div>
                )
            }
        },
        {
            field: 'rest', width: 300, align: 'left', type: 'string',
            renderCell: (params) => {
                const rowData = params.row.rest;
                let temporaryArray = rowData[2].split('|');
                let conditions = (temporaryArray.length) - 1;
                return (
                    <div>
                        {(params.row.name[2] != undefined) && <Typography className={classes.typographyEvolution}>Level: {rowData[0]}</Typography>}
                        {(params.row.name[2]) && <Typography className={classes.typographyEvolution}>Trigger: {rowData[1]}</Typography>}
                        {(conditions >= 1) && <Typography className={classes.typographyEvolution} style={{display: "flex", whiteSpace: "pre" }}>
                            {temporaryArray[0]} {(rowData[3] != "") && <Avatar style={{ width: "40px", height: "40px" }} src={rowData[3]}></Avatar>}
                        </Typography>}
                        {(conditions >= 2) && <Typography className={classes.typographyEvolution} style={{display: "flex", whiteSpace: "pre" }}>
                            {temporaryArray[1]} {(rowData[3] != "") && <Avatar style={{ width: "40px", height: "40px" }} src={rowData[3]}></Avatar>}
                        </Typography>}
                        {(conditions >= 3) && <Typography className={classes.typographyEvolution} style={{display: "flex", whiteSpace: "pre" }}>
                            {temporaryArray[2]} {(rowData[3] != "") && <Avatar style={{ width: "40px", height: "40px" }} src={rowData[3]}></Avatar>}
                        </Typography>}
                        {(conditions == 4) && <Typography className={classes.typographyEvolution} style={{display: "flex", whiteSpace: "pre" }}>
                            {temporaryArray[4]} {(rowData[3] != "") && <Avatar style={{ width: "40px", height: "40px" }} src={rowData[3]}></Avatar>}
                        </Typography>}
                    </div>);
            },

        }
    ];

    const evolutionDefaultColumn: GridColDef[] = [
        { field: 'id', width: 20, hide: true },
        {
            field: 'name', width: 300, align: 'right',
            renderCell: (params) => {
                const rowData = params.row.name;
                return (
                    <div>
                        <Typography align={'right'} className={classes.typographyDefEvolution} style={{fontWeight: 800 }}>{rowData[0]}:</Typography>
                        <Avatar style={{ width: "80px", height: "80px", paddingLeft: "20px" }} src={rowData[1]}></Avatar>
                    </div>
                )
            }
        },
        {
            field: 'doesnothing', width: 300, align: 'left', type: 'string',
            renderCell: (params) => {
                return (
                    <div>
                        <Typography style={{ fontSize: 25, paddingLeft: "10px", fontStyle: "italic" }}>(Default)</Typography>


                    </div>
                )
            },

        },
    ];


    let evolutionDefaultRow: GridRowsProp = [{
        id: 0,
        name: [default_evolution.name, default_evolution.sprite],
        doesnothing: default_evolution.id,

    }];
    let evolutionRows: GridRowsProp = [];



    const statsColumns: GridColDef[] = [
        { field: 'id', width: 20, hide: true },
        {
            field: 'stats', width: 300, align: 'left',
            renderCell: (params) => {
                const rowData = params.row.stats;
                return (
                    <div>
                        <Typography className={classes.typographyDefEvolution} style={{ fontWeight: 800, display: "flex" }}>{rowData[0]}: <Typography style={{ display: "flex", fontSize: 25 }}>{rowData[1]}</Typography></Typography>
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

    const abilitiesColumns: GridColDef[] = [
        { field: 'id', width: 20, hide: true },
        {
            field: 'abilities', width: 270, align: 'left',
            renderCell: (params) => {
                const rowData = params.row.abilities;
                return (
                    <div>
                        <Typography className={classes.typographyDefEvolution} style={{ fontWeight: 800, }}>{rowData}:</Typography>
                    </div>
                );
            },
        },
        {
            field: 'descriptions', width: 330, align: 'left',
            renderCell: (params) => {
                const rowData = params.row.descriptions;
                console.log("debugging: ", params.row.description);
                let cellHeight: string;
                if (rowData.length <= 20) {
                    cellHeight = "50px";
                } else if (rowData.length <= 40) {
                    cellHeight = "100px";
                } else if (rowData.length <= 60) {
                    cellHeight = "150px";
                } else {
                    cellHeight = "200px";
                };

                return (
                    <div>
                        {<Typography style={{ fontSize: "25px", whiteSpace: "normal", paddingLeft: "20px", height: cellHeight, alignItems: "center", paddingTop: "0px" }}>{rowData}</Typography>}
                    </div>
                );
            },
        },

    ];

    let abilitiesRows: GridRowsProp = [];

    const typeColumns: GridColDef[] = [
        { field: 'id', width: 20, hide: true },
        {
            field: "types", width: 330, align: 'left',
            renderCell: (params) => {
                const rowData = params.row.types;
                return (
                    <div>
                        <Typography className={classes.typographyDefEvolution} style={{ fontWeight: 800,}}>{rowData}</Typography>
                    </div>
                );
            },
        }
    ];

    let typeRows: GridRowsProp = [];

    let evolutionID = 0;
    evolutions.forEach((evolution: { name: string, trigger: string, special: Array<{ name: string, url: string }>, min_level: string }) => {
        let itemSprite = evolutionConditions.find(item => item.pokemonName === evolution.name);
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
    stats.forEach((stat: { name: string, effort: string, value: string }) => {

        statRows.push({
            id: statID++,
            stats: [stat.name, stat.value],
            effort: stat.effort,

        });
    });

    let abilitiesID = 0;
    abilities.forEach((ability: { name: string, url: string }) => {
        console.log("debugging: abilities: ", ability);
        abilitiesRows.push({
            id: abilitiesID++,
            abilities: ability.name,
            descriptions: ability.url,
        });

    });

    let typeID = 0;
    types.forEach((type: { name: string }) => {
        typeRows.push({
            id: typeID++,
            types: type.name,
        });
    });




    return (
        <>

            <Paper className={classes.paper}>


                <Typography className={classes.typography_id} variant="h3" style={{ fontWeight: 900 }}>
                    ({id}) {toUpperCase(name)}
                </Typography>
                <Avatar
                    className={classes.avatar}
                    src={sprite}
                    style={{ height: "250px", width: "250px" }}>
                </Avatar>
                <Typography className={classes.typographySections} style={{ fontWeight: 700,}}>Types: </Typography>
                <DataGrid
                    className={classes.datagrid}
                    disableColumnSelector={true}
                    disableColumnMenu={true}
                    rows={typeRows}
                    columns={typeColumns}
                    autoHeight={true}
                    disableSelectionOnClick={true}
                    hideFooter={true}
                    showCellRightBorder={false}
                    showColumnRightBorder={false}
                    headerHeight={0}
                    disableExtendRowFullWidth={false}
                    rowHeight={75}
                    density='comfortable'
                ></DataGrid>
                <Typography  className={classes.typographySections} style={{ fontWeight: 700,}}>Abilities: </Typography>
                <DataGrid
                    className={classes.datagrid}
                    disableColumnSelector={true}
                    disableColumnMenu={true}
                    rows={abilitiesRows}
                    columns={abilitiesColumns}
                    autoHeight={true}
                    disableSelectionOnClick={true}
                    hideFooter={true}
                    showCellRightBorder={false}
                    showColumnRightBorder={false}
                    headerHeight={0}
                    disableExtendRowFullWidth={false}
                    rowHeight={150}
                    density='comfortable'
                ></DataGrid>
                <Typography  className={classes.typographySections} style={{ fontWeight: 700,}}>Moves & Stats: </Typography>
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
                <Typography  className={classes.typographySections} style={{fontWeight: 700,}}>Evolutions: </Typography>
                <DataGrid
                    onRowClick={(params) => {
                        history.push(
                            {
                                pathname: `/${url_history}/${params.row.doesnothing}`
                            }
                        );
                        window.location.reload();
                    }}
                    className={classes.datagrid}
                    disableColumnSelector={true}
                    disableColumnMenu={true}
                    rows={evolutionDefaultRow}
                    columns={evolutionDefaultColumn}
                    autoHeight={true}
                    disableSelectionOnClick={true}
                    hideFooter={true}
                    showCellRightBorder={false}
                    showColumnRightBorder={false}
                    headerHeight={0}
                    disableExtendRowFullWidth={false}
                    rowHeight={150}
                ></DataGrid>
                <DataGrid
                    onRowClick={(params) => {
                        if (params.row.name[2] != undefined) {
                            history.push(
                                {
                                    pathname: `/${url_history}/${params.row.name[1]}`
                                }
                            );
                            window.location.reload();
                        } else { };
                    }}
                    className={classes.datagrid}
                    disableColumnSelector={true}
                    disableColumnMenu={true}
                    rows={evolutionRows}
                    columns={evolutionColumn}
                    autoHeight={true}
                    disableSelectionOnClick={true}
                    hideFooter={true}
                    showCellRightBorder={false}
                    showColumnRightBorder={false}
                    headerHeight={0}
                    disableExtendRowFullWidth={false}
                    rowHeight={150}
                ></DataGrid>
                <div style={{ height: "40px" }}></div>
            </Paper>


        </>
    );
};

export default PokeCardDetailed;