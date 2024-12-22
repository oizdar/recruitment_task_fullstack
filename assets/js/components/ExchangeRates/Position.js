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
                <div className="row exchange-rates-position">
                    <h4 className="col-3">
                        {rate.currency}
                    </h4>
                    <h5 className="col-3">
                       {rate.code}
                    </h5>
                    <div className="col-6">
                        <div className="row">Kupno: {rate.buyPrice}</div>
                        <div className="row">NBP: {rate.nbpRate}</div>
                        <div className="row">Sprzedaż: {rate.sellPrice}</div>
                    </div>
                </div>
        )
    }

}

export default Loader;
