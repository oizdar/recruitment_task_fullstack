// ./assets/js/components/Home.js

import React, {Component} from 'react';
import {Route, Redirect, Switch, Link} from 'react-router-dom';
import SetupCheck from "./SetupCheck";
import ExchangeRates from "./ExchangeRates";
import ExchangeRatesV2 from "./ExchangeRatesV2";

class Home extends Component {

    getExchangeRatesTodayPath(path) {
        let today = new Date();
        if(today.getHours() < 12) {
            today.setDate(today.getDate() - 1);
        }
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        const yyyy = today.getFullYear();
        return `${path}/${yyyy}-${mm}-${dd}`;
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
                            <li className="nav-item">
                                <Link className={"nav-link"} to={"/exchange-rates-old"}> Exchange Rates (OLD)</Link>
                            </li>

                        </ul>
                    </div>
                </nav>
                <Switch>
                    <Redirect exact from="/" to="/setup-check"/>
                    <Route path="/setup-check" component={SetupCheck} />
                    <Route
                        path="/exchange-rates-old/:date"
                        render={(props) => <ExchangeRates {...props} />}
                    />
                    <Redirect exact from="/exchange-rates-old" to={this.getExchangeRatesTodayPath('/exchange-rates-old')}/>
                    <Route
                        path="/exchange-rates/:date"
                        render={(props) => <ExchangeRatesV2 {...props} />}
                    />
                    <Redirect exact from="/exchange-rates" to={this.getExchangeRatesTodayPath('/exchange-rates')}/>
                </Switch>
            </div>
        )
    }
}

export default Home;
