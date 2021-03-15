import React from "react";
import Pokedex from "./Pokedex";
import Pokemon from "./Pokemon";
import { Route, Switch, Redirect, BrowserRouter } from "react-router-dom";

const App = (): React.ReactElement => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/">
          <Redirect to="/1?54" />
        </Route>
        <Route
          exact
          path="/:pageId"
          render={(props) => <Pokedex {...props} />}
        />
        <Route
          path="/:pageId/:pokemonId"
          render={(props) => <Pokemon {...props} />}
        />
      </Switch>
    </BrowserRouter>
  );
};

export default App;
