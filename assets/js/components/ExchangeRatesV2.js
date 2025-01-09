// ./assets/js/components/Users.js

import React from 'react';
import RatesList from "./ExchangeRates/RatesList";
import AbstractPageComponent from "./AbstractPageComponent";
import axios from "axios";
import RatesCalculator from "./ExchangeRates/RatesCalculator";

class ExchangeRatesV2 extends AbstractPageComponent {

    constructor(props) {
        super(props);
        this.state = {
            date: null,
            loading: true,
            responseIsOK: false,
            errorMessage: 'Undefined Error',
            responseData: [],
            responseLatestIsOk: false,
            loadingLatest: false,
            errorMessageLatest: 'Undefined Error',
            latestRatesResponse: []
        };
    }

    componentDidMount() {
        this.getLatestExchangeRates();
        this.getExchangeRates(); //todo load only when needed

    }

    getExchangeRates(date) {
        if(!date) {
            date = this.props.match.params.date;
        }

        if(date === null) {
            this.setState({responseIsOK: false, loading: false, message: "Niepoprawny format daty"});
            return false;
        }

        let dateObject = new Date(date);
        if (dateObject == 'Invalid Date') { // can be done better
            this.setState({responseIsOK: false, loading: false, message: "Niepoprawny format daty"});
            return false;
        }

        const baseUrl = this.getBaseUrl();
        let dateString = dateObject.toISOString().slice(0,10);

        this.setState({date: dateObject})
        return axios.get(baseUrl + `/api/exchange-rates/` + dateString).then(response => {
            let responseIsOK = response.status === 200
            this.setState({ responseData: response.data, responseIsOK: responseIsOK, loading: false})
        }).catch((error) => {
            this.setState({ responseIsOK: false, loading: false, errorMessage: error.response.data.error});
        });
    }

    getLatestExchangeRates() {
        const baseUrl = this.getBaseUrl();
        axios.get(baseUrl + `/api/exchange-rates/latest`).then(response => {
            let responseIsOK = response.status === 200
            this.setState({ latestRatesResponse: response.data, latestDate: new Date(response.data.date), responseLatestIsOk: responseIsOK, loadingLatest: false})
        }).catch((error) => {
            let messageLatest = "Data not found  :( - Try again later";
            if (error.response.status === 422) {
                messageLatest = error.response.data.error;
            }

            this.setState({ responseLatestIsOk: false, loadingLatest: false, errorMessageLatest: messageLatest});
        });
    }

    render() {
        return (
            <div>
                <section className="row-section">
                    <div className="container exchange-rates-container">
                        <RatesList
                            date={this.state.date}
                            loading={this.state.loading || this.state.loadingLatest}
                            rates={this.state.responseData.rates}
                            responsesAreOK={this.state.responseIsOK && this.state.responseLatestIsOk}
                            latestRates={this.state.latestRatesResponse?.rates}
                            latestDate={this.state.latestDate}
                            handleNext={this.nextDay}
                            handlePrevious={this.previousDay}
                            handleDateChange={this.handleDateChange}
                            errorMessage={this.state.errorMessage}
                        />
                        {
                            !this.state.loading && this.state.responseIsOK
                                ? <RatesCalculator
                                    rates={this.state.responseData.rates}
                                />
                                : null
                        }
                    </div>
                </section>
            </div>
        )
    }

    handleDateChange = (event) => {
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
        this.props.history.push('/exchange-rates/' + date.toISOString().slice(0, 10));
        this.getExchangeRates(date);
    }

}

export default ExchangeRatesV2;
