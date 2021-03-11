import { makeStyles } from '@material-ui/core';
import React from 'react';


const Styles = makeStyles({
    root: {
        paddingTop: "20px",
        paddingLeft: "50px",
        paddingRight: "50px",
    },
    appBar: {
        backgroundColor: '#5f72ea',
    },
    toolBar_bottom: {
        marginLeft: "auto",
    },
    typography: {
        whiteSpace: "pre",
        color: "black",
    },
    cards: {
        borderRight: '0.9em solid black', 
        borderBottom: '0.5em solid black',
        padding: '0.5em',
        borderRadius: 20,

    },
    cardMedia: {
        margin: "auto",
    },
    typographyCardId: {
        textAlign: "left",
        fontStyle: "italic",
    },
    typographyCardName: {
        fontSize: "28px", //hm this does nothing
        textAlign: "center",
        fontWeight: 'bold',  //this also does nothing.. typescript string type issue?
    },
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
    paper: {
        borderRight: '0.5em solid black',
        borderBottom: '0.3em solid black',
        padding: '0.5em',
        borderRadius: 80,
        width: 700,
        margin: "auto",
        backgroundColor: "#E0E0E0",
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
        whiteSpace: "normal",
    },
    typographyEvolution: {
        fontSize: 25,
        paddingLeft: "10px",
    },
    typographyDefEvolution: {
        fontSize: 25,
        whiteSpace: "pre",
        paddingLeft: "20px",
    },
    typographySections: {
        fontSize: "40px",
        paddingLeft: "10px",
        whiteSpace: "pre"
    },
})

export default Styles;