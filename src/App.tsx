import React from 'react';
import Pokedex from './Pokedex'
import Pokemon from './Pokemon'
import {Route, Switch, Redirect} from 'react-router-dom';


const App = (): React.ReactElement =>  {
  return (
    <Switch>
      <Route exact path="/">
    <Redirect to="/1" />
</Route>
      <Route exact path="/:pageId" render={(props) => <Pokedex {...props} />} />
    <Route
      exact path="/:pageId/:pokemonId" render={(props) => <Pokemon {...props} />}
    />
    </Switch>
  );
}

export default App;