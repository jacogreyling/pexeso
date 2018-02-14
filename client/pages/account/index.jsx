/* global window */
'use strict';

const App = require('./app.jsx');
const ReactDOM = require('react-dom');

import { hydrate } from 'react-dom';

class Page {
    static blastoff() {

        this.mainElement = ReactDOM.hydrate(
            App,
            window.document.getElementById('app-mount')
        );
    }
}


module.exports = Page;


/* $lab:coverage:off$ */
if (!module.parent) {
    window.page = Page;
    Page.blastoff();
}
/* $lab:coverage:on$ */
