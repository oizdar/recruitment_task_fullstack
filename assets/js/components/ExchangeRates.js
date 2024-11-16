// ./assets/js/components/Users.js

import React from 'react';
import axios from 'axios';
import AbstractPageComponent from "./AbstractPageComponent.js";

class ExchangeRate extends AbstractPageComponent {
    componentDidMount() {
        this.getExchangeRates();
    }

    getExchangeRates() {
        const { date } = this.props.match.params;
        if(date === null) {
            this.setState({responseIsOK: false, loading: false, message: "Invalid date"});
            return false;
        }

        let dateObject = new Date(date);
        if (dateObject == 'Invalid Date') { // can be done better
            this.setState({responseIsOK: false, loading: false, message: "Invalid date"});
            return false;
        }

        const baseUrl = this.getBaseUrl();
        let dateString = dateObject.toISOString().slice(0,10);

        this.setState({date: dateObject})
        axios.get(baseUrl + `/api/exchange-rates/` + dateString).then(response => {
            console.log(response.status);
            let responseIsOK = response.status === 200
            this.setState({ responseData: response.data, responseIsOK: responseIsOK, loading: false})
        }).catch((error) => {
            let message = "Don't found any rates :( - try again later";
            if (error.response.status === 422) {
                message = error.response.data.error;

            }
            this.setState({ responseIsOK: false, loading: false, message: message});
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
                                {this.state.responseIsOK === true ? (
                                    this.renderTable()
                                        ) : (
                                            <h3 className={'text-error text-bold'}><strong>{this.state.message}</strong></h3>
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

    renderTable() { //todo: move to separate component
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
                    this.state.responseData.rates?.map((rate, index) => {
                        return(<tr key={index}>
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
