// ./assets/js/components/Users.js

import React, {Component} from 'react';

class ErrorMessage extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="alert alert-danger offset-3 col-6 text-center" role="alert">
                {this.props.message}
            </div>
        )
    }

}

export default ErrorMessage;
