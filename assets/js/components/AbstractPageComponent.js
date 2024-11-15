// ./assets/js/components/Users.js

import React, {Component} from 'react';

class AbstractPageComponent extends Component {
    constructor() {
        super();
        this.state = { setupCheck: {}, loading: true};
    }

    getBaseUrl() {
        return 'http://telemedi-zadanie.localhost'; //todo move to env file
    }

}
export default AbstractPageComponent;
