// ./assets/js/components/Users.js

import React, {Component, useEffect} from 'react';
import axios from "axios";

class Position extends Component {

    constructor(props) {
        super(props);
        console.log(props)
    }

    render() {
        let rate = this.props.rate
        let latestRate = this.props.latestRate
        return  (
                <div className="row exchange-rates-position">
                    <h4 className="col-3">
                        {rate.currency}
                    </h4>
                    <h5 className="col-1">
                       {rate.code}
                    </h5>
                    <div className="col-7 offset-1">
                        <div className="row">Kupno: {rate.buyPrice}</div>
                        {latestRate ? (<div className="row">Ostatni kurs kupna: {latestRate.buyPrice}</div>) : null}
                        <div className="row">NBP: {rate.nbpRate}</div>
                        {latestRate ? (<div className="row">Ostatni kurs NBP: {latestRate.nbpRate}</div>) : null}
                        <div className="row">Sprzedaż: {rate.sellPrice}</div>
                        {latestRate ? (<div className="row">Ostatni kurs sprzedaży: {latestRate.sellPrice}</div>) : null}
                    </div>
                </div>
        )
    }

}

export default Position;
