'use strict';

const Code = require('code');
const Lab = require('lab');
const Manifest = require('../../config/manifest');


const lab = exports.lab = Lab.script();


lab.experiment('Manifest', () => {

    lab.test('it gets manifest data', (done) => {

        Code.expect(Manifest.get('/')).to.be.an.object();

        done();
    });

});
