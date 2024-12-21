// ./assets/js/components/Users.js

import React, {Component, useEffect} from 'react';
import axios from "axios";

class Loader extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        let rate = this.props.rate
        return  (
            <div className="exchange-rates-position card">
                <div className="card-body">
                    <h4 className="card-title">
                        {rate.code}
                    </h4>
                    <h5 className="card-subtitle">
                       {rate.currency}
                    </h5>
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item">NBP: {rate.nbpRate}</li>
                        <li className="list-group-item">Cena zakupu: {rate.buyPrice}</li>
                        <li className="list-group-item">Cena sprzedaży: {rate.sellPrice}</li>
                    </ul>
                </div>
            </div>
        )
    }

}

export default Loader;
