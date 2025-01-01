// ./assets/js/components/Users.js

import React, {Component, useRef} from 'react';

class DatePicker extends Component {

    constructor(props) {
        super(props);
        this.inputRef = React.createRef();
    }


    render() {
        let today = new Date()
        let startDate = new Date('2024-01-01 1:00')

        return (<>
            <div className="date-picker offset-3 col-6" onClick={this.handleDivClick}>
                <span className="date-picker-day">{this.props.date?.toISOString().slice(8, 10)}</span>
                <span className="date-picker-month">{this.props.date?.toLocaleString('default', { month: 'short' })}</span>
            </div>
            <input //todo style date picker & move it near to the div with datee
                hidden
                ref={this.inputRef}
                type="date"
                className={"form-control " + this.props.className}
                min={startDate.toISOString().slice(0, 10)}
                max={today.toISOString().slice(0, 10)}
                       value={this.props.date ? this.props.date?.toISOString().slice(0, 10) : ""} //prevents console error when props undefined on first render
                       onChange={this.props.handleDateChange}
                       onKeyDown={(e) => e.preventDefault()}

                />
        </>)
    }

    handleDivClick = () => {
        if (this.inputRef.current) {
            this.inputRef.current.showPicker();
        }
    };

}

export default DatePicker;
