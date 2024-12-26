// ./assets/js/components/Users.js

import React, {Component, useEffect} from 'react';
import axios from "axios";

class Position extends Component {

    constructor(props) {
        super(props);
        this.rate = this.props.rate
        this.latestRate = this.props.latestRate
        this.latestDate = this.props.latestDate
        this.state = {
            isOpen: false
        }
    }

    componentDidMount() {
        this.setState((state, props) => ({
            isOpen: props.isOpen
        }));
    }

    render() {
        return (<>
            <div className="row exchange-rates-position">
                <h4 className="col-3">
                    {this.rate.currency}
                </h4>
                <h5 className="col-1">
                    {this.rate.code}
                </h5>
                <div className="col-7 offset-1">
                    <div className="row">
                        <div className="col-4">
                            {this.rate.buyPrice ? this.formatCurrency(this.rate.buyPrice) : '-'}
                            <span className={"badge badge-pill badge-info text-middle"}>{this.getBuyPriceDiff()}</span>
                        </div>
                        <div className="col-4">
                            {this.rate.nbpRate ? this.formatCurrency(this.rate.nbpRate) : '-'}
                            <span className={" badge badge-pill badge-info text-middle"}>{this.getNbpRateDiff()}</span>
                        </div>
                        <div className="col-4">
                            {this.rate.sellPrice ? this.formatCurrency(this.rate.sellPrice) : '-'}
                            <span
                                className={" badge badge-pill badge-info text-middle"}>{this.getSellPriceDiff()}</span>
                        </div>
                    </div>
                </div>
            </div>
            {
                this.props.isOpen
                    ? (
                        <div className="row exchange-rates-position-sub">
                            <span className="col-5 date">
                                { 'Kurs na dzień ' + this.latestDate.toLocaleDateString() + ':'}
                            </span>
                            <div className="col-7">
                                <div className="row">
                                    <div className="col-4">
                                        {this.latestRate.buyPrice ? this.formatCurrency(this.latestRate.buyPrice) : '-'}
                                    </div>
                                    <div className="col-4">
                                        {this.latestRate.nbpRate ? this.formatCurrency(this.latestRate.nbpRate) : '-'}
                                    </div>
                                    <div className="col-4">
                                        {this.latestRate.sellPrice ? this.formatCurrency(this.latestRate.sellPrice) : '-'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : null
            }
        </>)
    }

    getBuyPriceDiff() {
        if (!this.latestRate?.buyPrice || !this.rate?.buyPrice) {
            return null;
        }

        return this.formatCurrency(this.rate.buyPrice - this.latestRate.buyPrice, 3);
    }

    getSellPriceDiff() {
        if (!this.latestRate?.sellPrice || !this.rate?.sellPrice) {
            return null;
        }

        return this.formatCurrency(this.rate.sellPrice - this.latestRate.sellPrice, 3)
    }

    getNbpRateDiff() {
        if (!this.latestRate?.nbpRate || !this.rate?.nbpRate) {
            return null;
        }
        let diff = this.rate.nbpRate - this.latestRate.nbpRate
        if (diff < 0) {
            return this.formatCurrency(diff);
        }

        if (diff > 0) {
            return '+' + this.formatCurrency(diff);
        }
    }

    formatCurrency(number, precision = 5) { //todo nice to move to utils helper
        return number ? number.toFixed(precision).toLocaleString('pl-PL') + ' zł ' : null;
    }
}

export default Position;
