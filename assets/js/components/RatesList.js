// ./assets/js/components/Users.js

import React, {Component} from 'react';
import Loader from "./Common/Loader";
import Position from "./ExchangeRates/Position";

class RatesList extends Component {

    constructor(props) {
        super(props);
    }

    render() {

       return this.props.rates.map((rate, index) => {
            return (
                <div className="card" key={index}>
                   <Position rate={rate} />
                </div>
            )
        });
    }

}

export default RatesList;
