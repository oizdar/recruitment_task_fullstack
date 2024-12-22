// ./assets/js/components/Users.js

import React, {Component} from 'react';
import Position from "./Position";

class RatesList extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        console.log(this.props)
        return (
            <div className="card">
                <div className="card-header text-center">
                    <h2>Kurs na dzień: {this.props.date?.toLocaleDateString()}</h2>
                </div>
                <div className="card-body">
                    <div className="list-group">

                        {
                            this.props.rates.map((rate) => {
                                return (
                                    <div className="list-group-item" key={rate.code}>
                                        <Position rate={rate}/>
                                    </div>
                                )
                            }, this)
                        }
                    </div>
                </div>
            </div>
        )
    }

}

export default RatesList;
