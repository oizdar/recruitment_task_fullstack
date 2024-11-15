// ./assets/js/components/Users.js

import React from 'react';
import axios from 'axios';
import AbstractPageComponent from "./AbstractPageComponent.js";

class ExchangeRate extends AbstractPageComponent {

    componentDidMount() {
        this.getExchangeRates();
    }

    getExchangeRates() {
        const baseUrl = this.getBaseUrl();
        axios.get(baseUrl + `/api/exchange-rates`).then(response => {
            let responseIsOK = response.status === 200
            this.setState({ data: response.data, setupCheck: responseIsOK, loading: false})
        }).catch(function (error) {
            console.error(error);
            this.setState({ setupCheck: false, loading: false});
        });
    }

    render() {
        const loading = this.state.loading;
        return(
            <div>
                <section className="row-section">
                    <div className="container">
                        <div className="row mt-5">
                            <div className="col-md-8 offset-md-2">
                                <h2 className="text-center"><span>Exchange Rates</span> @ Telemedi</h2>

                                {loading ? (
                                    <div className={'text-center'}>
                                        <span className="fa fa-spin fa-spinner fa-4x"></span>
                                    </div>
                                ) : (
                                    <div className={'text-center'}>
                                {this.renderDatePicker()}
                                {this.state.setupCheck === true ? (
                                    this.renderTable()
                                        ) : (
                                            <h3 className={'text-error text-bold'}><strong>Dont found any rates :( - try again later</strong></h3>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        )
    }



    renderDatePicker() {
        return (
            <div className="form-group">
                <div className="input-group ml-2 mr-2">
                    <button type="button" className="btn btn-sm btn-secondary col-2">Prev</button>
                    <input type="date" className="form-control small ml-2 mr-2" id="date" name="date"/>
                    <button type="button" className="btn btn-sm btn-secondary col-2" disabled>Next</button>
                </div>
            </div>
        )
    }

    renderTable() {
        return (
            <table className="table">
                <thead>
                <tr>
                    <th scope="col">Code</th>
                    <th scope="col">Name</th>
                    <th scope="col">Buy Price</th>
                    <th scope="col">Sell Price</th>
                </tr>
                </thead>
                <tbody>
                {
                    this.state.data.rates?.map((rate) => {
                        return(<tr>
                            <td>{rate.code}</td>
                            <td>{rate.currency}</td>
                            <td>{rate.buyPrice}</td>
                            <td>{rate.sellPrice}</td>
                        </tr>)
                    })
                }
                </tbody>
            </table>
        )
    }
}

export default ExchangeRate;
