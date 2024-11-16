// ./assets/js/components/Users.js

import {Component} from 'react';

class AbstractPageComponent extends Component {
    constructor() {
        super();
        this.state = { setupCheck: {}, loading: true};
    }

    getBaseUrl() {
        return 'http://telemedi-zadanie.localhost'; //todo move to env file
    }


    getQueryParam(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

}

export default AbstractPageComponent;
