// ./assets/js/components/Users.js

import React, {Component} from 'react';
import Position from "./Position";
import Loader from "../Common/Loader";
import ErrorMessage from "../Common/ErrorMessage";
import DatePicker from "../Common/DatePicker";

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
                        <button type="button" className="btn btn-info col-1 offset-3"
                                onClick={this.props.handlePrevious}>Previous
                            <i className="fab fa-mdb"></i>

                        </button>
                        <div className="offset-1 col-2 text-center">
                            <DatePicker
                                className={"exchange-rates-date-picker"}
                                date={this.props.date}
                                handleDateChange={this.props.handleDateChange}
                            />
                        </div>
                        <button type="button" className="btn btn-info col-1 offset-1" onClick={this.props.handleNext}>Next
                        </button>

                    </div>
                </div>
                <div className={"card-body " + (this.props.responsesAreOK && !this.props.loading ? "p-0" : null)}>
                    {
                        this.props.loading
                            ? (<Loader/>)
                            : (this.props.responsesAreOK
                                ? (<div className="list-group list-group-flush">
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
                                                    <div className={"list-group-item " + (!this.checkDatesAreEqual() ? 'list-group-item-action' : '')}
                                                         key={rate.code}
                                                         onClick={!this.checkDatesAreEqual() ? () => this.toggleDetails(rate.code) : null}>
                                                        <Position
                                                            rate={rate}
                                                            latestRate={this.props.latestRates.find((latestRate) => latestRate.code === rate.code)}
                                                            isOpen={!this.checkDatesAreEqual() && this.state.isOpen[rate.code]}
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
                {!this.checkDatesAreEqual() && this.props.responsesAreOK && !this.props.loading
                    ? (
                        <div className="card-footer text-center">
                            Kurs porównywany do najnowszego kursu z dnia: {this.props.latestDate?.toLocaleDateString()}
                        </div>
                    ) : null
                }

            </div>
        )
    }

    checkDatesAreEqual() {
        return this.props.latestDate?.getTime() === this.props.date?.getTime();
    }

    toggleDetails(key) {
        this.setState((state) => ({
            isOpen: {
                ...state.isOpen,
                [key]: !state.isOpen[key]
            }
        }));
    }

    hideAllDetails() {
        this.setState({
            isOpen: []
        });
    }

    showInput = () => {
        this.setState({showDateInput: true});
    }

}

export default RatesList;
