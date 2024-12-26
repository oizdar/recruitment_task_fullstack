// ./assets/js/components/Users.js

import React, {Component} from 'react';
import Position from "./Position";
import Loader from "../Common/Loader";
import ErrorMessage from "../Common/ErrorMessage";

class RatesList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isOpen: []
        }
    }

    render() {
        return (
            <div className="card exchange-rates-list-card">
                <div className="card-header align-items-center">
                    <div className="row">
                        <button type="button" className="btn btn-info col-1 offset-2"
                                onClick={this.props.handlePrevious}>Previous
                        </button>
                        <div className="col-6 text-center">
                            <h3 className="mt-2  ">Kurs na dzień: {this.props.date?.toLocaleDateString()}</h3>
                        </div>
                        <button type="button" className="btn btn-info col-1" onClick={this.props.handleNext}>Next
                        </button>

                    </div>
                </div>
                <div className="card-body">
                    {
                        this.props.loading
                            ? (<Loader/>)
                            : (this.props.responsesAreOK
                                ? (<div className="list-group">
                                        <div className="list-group-item" key="header">
                                            <div className="row exchange-rates-header">
                                                <div className="col-3">
                                                    Nazwa waluty
                                                </div>
                                                <div className="col-1">
                                                    Kod
                                                </div>
                                                <div className="col-7 offset-1">
                                                    <div className="row">
                                                        <div className="col-4">
                                                            Cena zakupu
                                                        </div>
                                                        <div className="col-4">
                                                            Cena NBP
                                                        </div>
                                                        <div className="col-4">
                                                            Cena sprzedaży
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {
                                            this.props.rates?.map((rate) => {
                                                return (
                                                    <div className="list-group-item list-group-item-action" key={rate.code} onClick={() => this.openDetails(rate.code)}>
                                                        <Position
                                                            rate={rate}
                                                            latestRate={this.props.latestRates.find((latestRate) => latestRate.code === rate.code)}
                                                            isOpen={this.state.isOpen[rate.code]}
                                                            latestDate={this.props.latestDate}
                                                        />
                                                    </div>
                                                )
                                            }, this)
                                        }
                                    </div>
                                ) : (<ErrorMessage message={this.props.errorMessage}/>)
                            )
                    }

                </div>
                <div className="card-footer text-muted text-center">
                    Kurs porównywany do najnowszego kursu z dnia: {this.props.latestDate?.toLocaleDateString()}
                </div>
            </div>
        )
    }

    openDetails(key) {
        this.setState((state, props) => ({isOpen: { ...state.isOpen, [key]: !state.isOpen[key]}}));
    }

}

export default RatesList;
