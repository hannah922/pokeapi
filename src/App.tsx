import React from 'react';
import Pokedex from './Pokedex'
import Pokemon from './Pokemon'
//import { Route, Switch} from 'react-router-dom';

import { RouteComponentProps } from 'react-router';

import {
  BrowserRouter as Router,
  Route,
  Link,
  match,
  Switch,
  Redirect
} from 'react-router-dom';

interface pokemonID {id: string; }




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