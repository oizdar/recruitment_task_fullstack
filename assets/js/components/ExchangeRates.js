// ./assets/js/components/Users.js

import React, {useEffect} from 'react';
import axios from 'axios';
import AbstractPageComponent from "./AbstractPageComponent.js";

class ExchangeRate extends AbstractPageComponent {
    componentDidMount() {
        this.getExchangeRates();
    }

    getExchangeRates(date) {
        if(!date) {
            date = this.props.match.params.date;
        }
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
            let responseIsOK = response.status === 200
            this.setState({ responseData: response.data, responseIsOK: responseIsOK, loading: false})
        }).catch((error) => {
            let message = "Nie znaleziono danych :( - Spróbuj ponownie później";
            if (error.response.status === 422) {
                message = error.response.data.error;
            }

            this.setState({ responseIsOK: false, loading: false, message: message});
        });
    }

    render() {
        return(
            <div>
                <section className="row-section">
                    <div className="container">
                        <div className="row mt-5">
                            <div className="col-md-8 offset-md-2">
                                <h2 className="text-center"><span>Exchange Rates</span> @ Telemedi</h2>
                                {this.state.loading ? ( //todo: re-load only table without date picker
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
        let today = new Date()
        const disableNext =
            this.state.date.toISOString().slice(0, 10) === today.toISOString().slice(0,10) //prevent hours diference
            || this.state.date > today
        console.log(disableNext)
        const disablePrev = this.state.date <= new Date('2024-01-01 0:00') //todo: prevent timezone difference

        console.log(disablePrev)
        return (
            <div className="form-group">
                <div className="input-group">
                    <button type="button" className="btn btn-sm btn-secondary col-2"
                            disabled={disablePrev}
                            onClick={this.previousDay}>
                        Prev
                    </button>
                    <input type="date"
                           className="form-control small ml-2 mr-2"
                           id="date"
                           name="date"
                           value={this.state.date.toISOString().slice(0,10)}
                           onChange={this.updateRoute} />
                    <button type="button" className="btn btn-sm btn-secondary col-2"
                            disabled={disableNext}
                            onClick={this.nextDay}>
                        Next
                    </button>
                </div>
            </div>
        )
    }

    updateRoute = (event) => {
        this.setState({loading: true});
        let date = new Date(event.target.value);
        this.updateDay(date);
    }


    nextDay = () => {
        this.setState({loading: true});
        let date = new Date(this.state.date);
        date.setDate(date.getDate() + 1);
        this.updateDay(date);
    }

    previousDay = () => {
        this.setState({loading: true});
        let date = new Date(this.state.date);
        date.setDate(date.getDate() - 1);
        this.updateDay(date);
    }

    updateDay = (date) => {
        this.setState({date: date});
        this.props.history.push('/exchange-rates/' + date.toISOString().slice(0, 10)); // todo: don't know how to use proper Redirect / router with object initialization
        this.getExchangeRates(date);
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
