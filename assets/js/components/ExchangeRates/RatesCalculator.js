// ./assets/js/components/Users.js

import React, {Component} from 'react';

class RatesCalculator extends Component {

    constructor(props) {
        super(props);
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
                    <div className="input-group mb-3">
                        <div className="input-group-prepend">
                            <label className="input-group-text" htmlFor="buyCurrencySelect">Kupuję</label>
                        </div>
                        <select className="custom-select" id="buyCurrencySelect" onChange={this.updateBuyCurrency} defaultValue={this.state.buyCurrency}>
                            {
                                this.props.rates ? this.props.rates.map((rate) => {
                                    if(rate.sellPrice) {
                                        return <option key={rate.code} value={rate.code}>{rate.currency} </option>
                                    }
                                }) : null
                            }
                        </select>
                        <input type={"number"} value={this.state.buyValue} onChange={this.updateBuyValue}/>
                    </div>
                    <div className="input-group mb-3">
                        <div className="input-group-prepend">
                            <label className="input-group-text" htmlFor="sellCurrencySelect">Płacę</label>
                        </div>
                        <select className="custom-select" id="sellCurrencySelect" onChange={this.updateSellCurrency} defaultValue={this.state.sellCurrency}>
                            {
                                this.props.rates ? this.props.rates.map((rate) => {
                                    if(rate.buyPrice) {
                                        return <option key={rate.code} value={rate.code}>{rate.currency}</option>
                                    }
                                }) : null
                            }
                        </select>
                        <input type={"number"} value={this.state.sellValue} onChange={this.updateSaleValue}/>
                    </div>
                </div>
            </div>
        )
    }

    updateBuyCurrency = (event) => {
        this.setState({buyCurrency: event.target.value}, this.calculateSellValue)
    }

    updateSellCurrency = (event) => {
        this.setState({sellCurrency: event.target.value}, this.calculateSellValue)
    }

    updateBuyValue = (event) => {
        this.setState({ buyValue: event.target.valueAsNumber || 0 }, this.calculateSellValue);
    };

    updateSaleValue = (event) => {
        this.setState({ sellValue: event.target.valueAsNumber || 0 }, this.calculateBuyValue);
    };

    calculateSellValue = () => {
        const { buyValue, buyCurrency, sellCurrency } = this.state;
        const { rates } = this.props;

        if (buyValue > 0 && buyCurrency && sellCurrency && rates) {
            const buyRate = rates.find((rate) => rate.code === buyCurrency)?.sellPrice || 1;
            const sellRate = rates.find((rate) => rate.code === sellCurrency)?.buyPrice || 1;

            const sellValue = (buyValue * buyRate) / sellRate;
            this.setState({ sellValue: sellValue.toFixed(2) });
        }
    }

    calculateBuyValue = () => {
        const { sellValue, buyCurrency, sellCurrency } = this.state;
        const { rates } = this.props;

        if (sellValue > 0 && buyCurrency && sellCurrency && rates) {
            const buyRate = rates.find((rate) => rate.code === buyCurrency)?.sellPrice || 1;
            const sellRate = rates.find((rate) => rate.code === sellCurrency)?.buyPrice || 1;

            const buyValue = (sellValue * sellRate) / buyRate;
            this.setState({ buyValue: buyValue.toFixed(2) });
        }
    };
}

export default RatesCalculator;
