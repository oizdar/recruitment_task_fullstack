// ./assets/js/components/Home.js

import React, {Component} from 'react';
import {Route, Redirect, Switch, Link} from 'react-router-dom';
import SetupCheck from "./SetupCheck";
import ExchangeRates from "./ExchangeRates";

class Home extends Component {

    getExchangeRatesTodayPath() {
        let today = new Date();
        if(today.getHours() < 12) {
            today.setDate(today.getDate() - 1);
        }
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        const yyyy = today.getFullYear();
        return `/exchange-rates/${yyyy}-${mm}-${dd}`;
    }

    render() {
        return (
            <div>
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                    <Link className={"navbar-brand"} to={"#"}> Telemedi Zadanko </Link>
                    <div id="navbarText">
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item">
                                <Link className={"nav-link"} to={"/setup-check"}> React Setup Check </Link>
                            </li>
                            <li className="nav-item">
                                <Link className={"nav-link"} to={"/exchange-rates"}> Exchange Rates </Link>
                            </li>

                        </ul>
                    </div>
                </nav>
                <Switch>
                    <Redirect exact from="/" to="/setup-check"/>
                    <Route path="/setup-check" component={SetupCheck} />
                    <Route
                        path="/exchange-rates/:date"
                        render={(props) => <ExchangeRates {...props} />}
                    />
                    <Redirect exact from="/exchange-rates" to={this.getExchangeRatesTodayPath()}/>
                </Switch>
            </div>
        )
    }
}

export default Home;
