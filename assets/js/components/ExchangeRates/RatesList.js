// ./assets/js/components/Users.js

import React, {Component} from 'react';
import Position from "./Position";
import Loader from "../Common/Loader";
import ErrorMessage from "../Common/ErrorMessage";

class RatesList extends Component {

    constructor(props) {
        super(props);

    }

    render() {
        return (
            <div className="card exchange-rates-list-card">
                <div className="card-header align-items-center">
                    <div className="row">
                            <button type="button" className="btn btn-info col-1 offset-2"  onClick={this.props.handlePrevious}>Previous</button>
                            <div className="col-6 text-center">
                                <h3 className="mt-2  ">Kurs na dzień: {this.props.date?.toLocaleDateString()}</h3>
                            </div>
                            <button type="button"  className="btn btn-info col-1" onClick={this.props.handleNext}>Next</button>

                    </div>
                </div>
                <div className="card-body">
                    {
                        this.props.loading
                            ? (<Loader/>)
                            : (this.props.responsesAreOK
                                    ? (
                                        <div className="list-group">
                                            {
                                                this.props.rates?.map((rate) => {
                                                    return (
                                                        <div className="list-group-item" key={rate.code}>
                                                            <Position rate={rate} latestRate={this.props.latestRates.find((latestRate) => latestRate.code === rate.code )}/>
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

}

export default RatesList;
