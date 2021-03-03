import React from 'react';
import { Grid, Card, CardContent, CardMedia, makeStyles, Typography, Button, Avatar, Box, Divider, List, Table, TableRow, TableCell } from '@material-ui/core';
import { Route, Router, Switch } from 'react-router-dom';
import { useHistory } from "react-router-dom";
import { ListItem } from '@material-ui/core';
import { DataGrid, GridCellParams, GridColDef, GridRowModel, GridRowsProp } from '@material-ui/data-grid';
import { stringify } from 'querystring';



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

interface evolutionprops {
    id: number,
    name: string,
    rest: {
        level: string,
        trigger: string,
        item: string,
    },
}

const PokeCardDetailed = ({ id, name, abilities, sprites, types, stats, evolutions, moves }: PokeCardDetailedProps) => {
    //console.log(id, name);
    const history = useHistory();
    const classes = Styles();

    const evolution_column: GridColDef[] = [
        { field: 'id', width: 20, hide: true},
        { field: 'name', width: 300, align: 'right',
        renderCell: (params) => (
            <div>
                <Typography align={'right'} style={{fontSize: 25, whiteSpace: "pre"}}>              {params.value}:</Typography>
            </div>
        )
    },
        { field: 'rest', width: 300, align: 'center', type: 'string',
        renderCell: (params) =>  {
            var getValues = (params.value as string)!.split(",");
            return(
            <div>
            <Typography style={{fontSize: 25}}>Level: {getValues[0]}</Typography>
            <Typography style={{fontSize: 25}}>Condition: {getValues[1]}</Typography>
            <Typography style={{fontSize: 25}} hidden={(getValues[2] == null) ? true : false}>{getValues[2]}</Typography>
            </div>);
        },
          
    }
    ];

    var evolution_row: GridRowsProp = [];
    var i = 0;

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
                        
                            <Typography style={{ fontSize: "30px", fontWeight: 700, paddingLeft: "40px", whiteSpace: "pre"}}>Evolutions: </Typography>
           
                        </TableRow>
                        </Table>

                                {evolutions.map((item: { name: string, trigger: string, held_item: {name: string, url: string}, min_level: string }) => {
                                    evolution_row.push({
                                        id: i++,
                                        name: item.name,
                                        rest: item.min_level + "," + item.trigger +"," +item.held_item,
                                    });
                                    console.log({evolution_row});

                        
                                }
                                )}
                        <DataGrid className={classes.datagrid} disableColumnSelector={true} disableColumnMenu={true} 
                        rows={evolution_row} columns={evolution_column} autoHeight={true}
                        disableSelectionOnClick={true}
                        hideFooter={true} showCellRightBorder={false} showColumnRightBorder={false}
                        headerHeight={0} disableExtendRowFullWidth={false} rowHeight={100}
                        ></DataGrid>
  


            </Box>


        </>
    );
};

export default PokeCardDetailed;