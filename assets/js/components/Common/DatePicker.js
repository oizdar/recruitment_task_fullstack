// ./assets/js/components/Users.js

import React, {Component} from 'react';

class DatePicker extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        let today = new Date()
        let startDate = new Date('2024-01-01 1:00')

        return (
            <input type="date"
                   className={"form-control " + this.props.className}
                   min={startDate.toISOString().slice(0, 10)}
                   max={today.toISOString().slice(0, 10)}
                   value={this.props.date ? this.props.date?.toISOString().slice(0, 10) : ""} //prevents console error when props undefined on first render
                   onChange={this.props.handleDateChange}
                   onKeyDown={(e) => e.preventDefault()}

            />
        )
    }

}

export default DatePicker;
