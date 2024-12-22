// ./assets/js/components/Users.js

import React from 'react';
import RatesList from "./ExchangeRates/RatesList";
import AbstractPageComponent from "./AbstractPageComponent";
import axios from "axios";
import ErrorMessage from "./Common/ErrorMessage";
import Loader from "./Common/Loader";

class ExchangeRatesV2 extends AbstractPageComponent {

    constructor(props) {
        super(props);
        this.state = {
            date: null,
            loading: true,
            responseIsOK: false,
            errorMessage: 'Undefined Error',
            responseData: [],
        };
    }

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
            let errorMessage = "Data not found :( - Try again later";
            if (error.response.status === 422) {
                errorMessage = error.response.data.error;
            }

            this.setState({ responseIsOK: false, loading: false, errorMessage: errorMessage});
        });
    }

    render() {
        return (
            <div>
                <section className="row-section">
                    <div className="container exchange-rates-container">
                        {
                            this.state.loading
                                ? (<Loader/>)
                                : (this.state.responseIsOK
                                    ? (<RatesList rates={this.state.responseData.rates} date={this.state.date}/>)
                                    : (<ErrorMessage message={this.state.errorMessage}/>)
                                )
                        }
                    </div>
                </section>
            </div>
        )
    }

}

export default ExchangeRatesV2;
