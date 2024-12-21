// ./assets/js/components/Users.js

import React, {Component, useEffect} from 'react';
import axios from "axios";

class Loader extends Component {

    constructor() {
        super();
        this.state = {
            loading: true
        };
    }

    render() {
        return  (
            <div className={'text-center'}>
                <span className="fa fa-spin fa-spinner fa-4x"></span>
            </div>
        )
    }

}

export default Loader;
