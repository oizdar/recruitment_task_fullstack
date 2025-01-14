// ./assets/js/components/Users.js

import React, {useEffect} from 'react';
import axios from 'axios';
import AbstractPageComponent from "./AbstractPageComponent.js";

class ExchangeRates extends AbstractPageComponent {

    constructor() {
        super();
        this.state = {loading: true, loadingLatest: true};
    }

    componentDidMount() {
        this.getExchangeRates();
        this.getLatestExchangeRates();
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
            let message = "Data not found :( - Try again later";
            if (error.response.status === 422) {
                message = error.response.data.error;
            }

            this.setState({ responseIsOK: false, loading: false, message: message});
        });
    }

    getLatestExchangeRates() {
        const baseUrl = this.getBaseUrl();
        axios.get(baseUrl + `/api/exchange-rates/latest`).then(response => {
            let responseIsOK = response.status === 200
            this.setState({ responseLatestData: response.data, responseLatestIsOk: responseIsOK, loadingLatest: false})
        }).catch((error) => {
            let messageLatest = "Data not found  :( - Try again later";
            if (error.response.status === 422) {
                messageLatest = error.response.data.error;
            }

            this.setState({ responseLatestIsOk: false, loadingLatest: false, messageLatest: messageLatest});
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
                                     <div>
                                         {this.renderTableRates()}
                                         {this.renderCalculation()}
                                     </div>
                                        ) : (
                                            <h3 className={'text-error text-bold'}><strong>{this.state.message}</strong></h3>
                                        )}
                                    </div>
                                )}
                                {this.state.loadingLatest ? (
                                    <div className={'text-center'}>
                                        <span className="fa fa-spin fa-spinner fa-4x"></span>
                                    </div>
                                ) : (
                                    <div className={'text-center mt-5'}>
                                        <h2 className="text-center">Latest Exchange Rates: {new Date(this.state.responseLatestData?.date).toLocaleDateString()}</h2>
                                        {this.state.responseLatestIsOk === true ? (
                                            this.renderTableLatest()
                                        ) : (
                                            <h3 className={'text-error text-bold'}>
                                                <strong>{this.state.messageLatest}</strong></h3>
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
        let startDate = new Date('2024-01-01 0:00')
        const disableNext =
            this.state.date.toISOString().slice(0, 10) === today.toISOString().slice(0,10) //prevent hours diference
            || this.state.date > today
        const disablePrev = this.state.date <= startDate //todo: prevent timezone difference

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
                           min={startDate.toISOString().slice(0, 10)}
                           max={today.toISOString().slice(0, 10)}
                           value={this.state.date.toISOString().slice(0,10)}
                           onChange={this.changeDate} />
                    <button type="button" className="btn btn-sm btn-secondary col-2"
                            disabled={disableNext}
                            onClick={this.nextDay}>
                        Next
                    </button>
                </div>
            </div>
        )
    }

    renderCalculation() {
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
                    this.state.responseData?.calculations.map((rate, index) => {
                        return rate.calculation.map((calculation, index) => {
                            return (
                                <tr key={index}>
                                    <td>{calculation.code}</td>
                                    <td>{calculation.currency}</td>
                                    <td>{calculation.buyPrice} {calculation.buyPrice === 'N/A' ? null : rate.code}</td>
                                    <td>{calculation.sellPrice} {calculation.sellPrice === 'N/A' ? null : rate.code}</td>
                                </tr>
                            )
                        })



                    })
                }
                </tbody>
            </table>
        )
    }

    changeDate = (event) => {
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
        this.props.history.push('/exchange-rates-old/' + date.toISOString().slice(0, 10)); // todo: don't know how to use proper Redirect / router with object initialization
        this.getExchangeRates(date);
    }

    renderTableRates() { //todo: move to separate component
        return (
            <table className="table">
                <thead>
                <tr>
                    <th scope="col">Code</th>
                    <th scope="col">Name</th>
                    <th scope="col">NBP Price</th>
                    <th scope="col">Buy Price</th>
                    <th scope="col">Sell Price</th>
                </tr>
                </thead>
                <tbody>
                {
                    this.state.responseData?.rates?.map((rate, index) => {
                        return (<tr key={index}>
                            <td>{rate.code}</td>
                            <td>{rate.currency}</td>
                            <td>{rate.nbpRate}</td>
                            <td>{rate.buyPrice}</td>
                            <td>{rate.sellPrice}</td>
                        </tr>)
                    })
                }
                </tbody>
            </table>
        )
    }

    renderTableLatest() { //todo: move to separate component
        return (
            <table className="table">
                <thead>
                <tr>
                    <th scope="col">Code</th>
                    <th scope="col">Name</th>
                    <th scope="col">NBP Price</th>
                    <th scope="col">Buy Price</th>
                    <th scope="col">Sell Price</th>
                </tr>
                </thead>
                <tbody>
                {
                    this.state.responseLatestData?.rates?.map((rate, index) => {
                        return (<tr key={index}>
                            <td>{rate.code}</td>
                            <td>{rate.currency}</td>
                            <td>{rate.nbpRate}</td>
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

export default ExchangeRates;
