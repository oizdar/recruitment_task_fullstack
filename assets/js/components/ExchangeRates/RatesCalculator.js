// ./assets/js/components/Users.js

import React, {Component} from 'react';

class RatesCalculator extends Component {

    constructor(props) {
        super(props);
        this.rates = [...this.props.rates, {code: "PLN", currency: "Polski złoty", sellPrice: 1, buyPrice: 1}];
        this.state = {
            buyValue: 0,
            sellValue: 0,
            buyCurrency: this.props.rates[0]?.code,
            sellCurrency: this.props.rates[1]?.code,
        }
    }

    render() {
        return (
            <div className="card exchange-rates-calculator-card">
                <div className="card-header text-center">
                    <h3>Przelicz walutę:</h3>
                </div>
                <div className="card-body">
                    <div className={"offset-3 col-6"}>
                        <div className="input-group mt-3 row">
                            <select className="custom-select"
                                    onChange={this.updateBuyCurrency}
                                    defaultValue={this.state.buyCurrency}
                            >
                                {
                                    this.rates ? this.rates.map((rate) => {
                                        if (rate.sellPrice) {
                                            return <option key={rate.code} value={rate.code}>{rate.currency} </option>
                                        }
                                    }) : null
                                }
                            </select>
                            <div className="input-group-prepend">
                                <label className="input-group-text"  htmlFor="buyCurrencySelect">Kupuję</label>
                            </div>
                            <input type="number" className="form-control" id="buyCurrencyValue" value={this.state.buyValue} onChange={this.updateBuyValue}/>
                        </div>
                        <div className="input-group mt-3 row">
                            <select className="custom-select"
                                    onChange={this.updateSellCurrency}
                                    defaultValue={this.state.sellCurrency}
                            >
                                {
                                    this.rates ? this.rates.map((rate) => {
                                        if (rate.buyPrice) {
                                            return <option key={rate.code} value={rate.code}>{rate.currency}</option>
                                        }
                                    }) : null
                                }
                            </select>
                            <div className="input-group-prepend">
                                <label className="input-group-text" htmlFor="sellCurrencyValue"> Płacę</label>
                            </div>
                            <input type="number" className="form-control" id="sellCurrencyValue" value={this.state.sellValue} onChange={this.updateSaleValue}/>
                        </div>
                        <div className="row mt-3">
                            <button className="btn btn-info offset-3 col-6" onClick={this.cleanupValues}>Wyczyść</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    cleanupValues = () => {
        this.setState({buyValue: 0, sellValue: 0});
    }

    updateBuyCurrency = (event) => {
        this.setState({buyCurrency: event.target.value}, this.calculateSellValue)
    }

    updateSellCurrency = (event) => {
        this.setState({sellCurrency: event.target.value}, this.calculateSellValue)
    }

    updateBuyValue = (event) => {
        this.setState({buyValue: event.target.valueAsNumber || 0}, this.calculateSellValue);
    };

    updateSaleValue = (event) => {
        this.setState({sellValue: event.target.valueAsNumber || 0}, this.calculateBuyValue);
    };

    calculateSellValue = () => {
        const {buyValue, buyCurrency, sellCurrency} = this.state;

        if ( buyCurrency && sellCurrency && this.rates) {
            const buyRate = this.rates.find((rate) => rate.code === buyCurrency)?.sellPrice || 1;
            const sellRate = this.rates.find((rate) => rate.code === sellCurrency)?.buyPrice || 1;

            const sellValue = (buyValue * buyRate) / sellRate;
            this.setState({sellValue: sellValue.toFixed(2)});
        }
    }

    calculateBuyValue = () => {
        const {sellValue, buyCurrency, sellCurrency} = this.state;

        if (buyCurrency && sellCurrency && this.rates) {
            const buyRate = this.rates.find((rate) => rate.code === buyCurrency)?.sellPrice || 1;
            const sellRate = this.rates.find((rate) => rate.code === sellCurrency)?.buyPrice || 1;

            const buyValue = (sellValue * sellRate) / buyRate;
            this.setState({buyValue: buyValue.toFixed(2)});
        }
    };
}

export default RatesCalculator;
