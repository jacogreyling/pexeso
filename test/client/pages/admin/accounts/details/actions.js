'use strict';
const Code = require('code');
const Constants = require('../../../../../../client/pages/admin/accounts/details/constants');
const FluxConstant = require('flux-constant');
const Lab = require('lab');
const Proxyquire = require('proxyquire');


const lab = exports.lab = Lab.script();
const stub = {
    ApiActions: {
        get: function () {

            stub.ApiActions.get.mock.apply(null, arguments);
        },
        put: function () {

            stub.ApiActions.put.mock.apply(null, arguments);
        },
        post: function () {

            stub.ApiActions.post.mock.apply(null, arguments);
        },
        delete: function () {

            stub.ApiActions.delete.mock.apply(null, arguments);
        }
    },
    Store: {

        dispatch: function () {

            stub.Store.dispatch.mock.apply(null, arguments);
        }
    }
};
const Actions = Proxyquire('../../../../../../client/pages/admin/accounts/details/actions', {
    '../../../../actions/api': stub.ApiActions,
    './store': stub.Store
});


lab.experiment('Admin Accounts Details Actions', () => {

    lab.test('it calls ApiActions.get from getDetails', (done) => {

        stub.ApiActions.get.mock = function (url, data, store, typeReq, typeRes, callback) {

            Code.expect(url).to.be.a.string();
            Code.expect(url).to.include('abcxyz');
            Code.expect(data).to.be.undefined();
            Code.expect(store).to.be.an.object();
            Code.expect(typeReq).to.be.an.instanceof(FluxConstant);
            Code.expect(typeRes).to.be.an.instanceof(FluxConstant);
            Code.expect(callback).to.not.exist();

            done();
        };

        Actions.getDetails('abcxyz');
    });


    lab.test('it calls ApiActions.put from saveDetails', (done) => {

        stub.ApiActions.put.mock = function (url, data, store, typeReq, typeRes, callback) {

            Code.expect(url).to.be.a.string();
            Code.expect(url).to.include('abcxyz');
            Code.expect(data).to.be.an.object();
            Code.expect(store).to.be.an.object();
            Code.expect(typeReq).to.be.an.instanceof(FluxConstant);
            Code.expect(typeRes).to.be.an.instanceof(FluxConstant);
            Code.expect(callback).to.not.exist();

            done();
        };

        Actions.saveDetails('abcxyz', {});
    });


    lab.test('it calls dispatch from hideDetailsSaveSuccess', (done) => {

        stub.Store.dispatch.mock = function (action) {

            if (action.type === Constants.HIDE_DETAILS_SAVE_SUCCESS) {

                done();
            }
        };

        Actions.hideDetailsSaveSuccess();
    });


    lab.test('it calls ApiActions.put from linkUser', (done) => {

        stub.ApiActions.put.mock = function (url, data, store, typeReq, typeRes, callback) {

            Code.expect(url).to.be.a.string();
            Code.expect(url).to.include('abcxyz');
            Code.expect(data).to.be.an.object();
            Code.expect(store).to.be.an.object();
            Code.expect(typeReq).to.be.an.instanceof(FluxConstant);
            Code.expect(typeRes).to.be.an.instanceof(FluxConstant);
            Code.expect(callback).to.not.exist();

            done();
        };

        Actions.linkUser('abcxyz', {});
    });


    lab.test('it calls ApiActions.delete from unlinkUser', (done) => {

        stub.ApiActions.delete.mock = function (url, data, store, typeReq, typeRes, callback) {

            Code.expect(url).to.be.a.string();
            Code.expect(url).to.include('abcxyz');
            Code.expect(data).to.be.undefined();
            Code.expect(store).to.be.an.object();
            Code.expect(typeReq).to.be.an.instanceof(FluxConstant);
            Code.expect(typeRes).to.be.an.instanceof(FluxConstant);
            Code.expect(callback).to.not.exist();

            done();
        };

        Actions.unlinkUser('abcxyz');
    });


    lab.test('it calls dispatch from hideUserSaveSuccess', (done) => {

        stub.Store.dispatch.mock = function (action) {

            if (action.type === Constants.HIDE_USER_SAVE_SUCCESS) {

                done();
            }
        };

        Actions.hideUserSaveSuccess();
    });


    lab.test('it calls ApiActions.post from newNote', (done) => {

        stub.ApiActions.post.mock = function (url, data, store, typeReq, typeRes, callback) {

            Code.expect(url).to.be.a.string();
            Code.expect(url).to.include('abcxyz');
            Code.expect(data).to.be.an.object();
            Code.expect(store).to.be.an.object();
            Code.expect(typeReq).to.be.an.instanceof(FluxConstant);
            Code.expect(typeRes).to.be.an.instanceof(FluxConstant);
            Code.expect(callback).to.not.exist();

            done();
        };

        Actions.newNote('abcxyz', {});
    });


    lab.test('it calls dispatch from hideNoteSaveSuccess', (done) => {

        stub.Store.dispatch.mock = function (action) {

            if (action.type === Constants.HIDE_NOTE_SAVE_SUCCESS) {

                done();
            }
        };

        Actions.hideNoteSaveSuccess();
    });


    lab.test('it calls ApiActions.delete from delete (success)', (done) => {

        const scrollTo = global.window.scrollTo;

        global.window.scrollTo = function () {

            global.window.scrollTo = scrollTo;

            done();
        };

        stub.ApiActions.delete.mock = function (url, data, store, typeReq, typeRes, callback) {

            Code.expect(url).to.be.a.string();
            Code.expect(url).to.include('abcxyz');
            Code.expect(data).to.be.undefined();
            Code.expect(store).to.be.an.object();
            Code.expect(typeReq).to.be.an.instanceof(FluxConstant);
            Code.expect(typeRes).to.be.an.instanceof(FluxConstant);
            Code.expect(callback).to.exist();

            callback(null, {});
        };

        const history = {
            push: function (path) {

                Code.expect(path).to.be.a.string();
            }
        };

        Actions.delete('abcxyz', history);
    });


    lab.test('it calls ApiActions.delete from delete (failure)', (done) => {

        stub.ApiActions.delete.mock = function (url, data, store, typeReq, typeRes, callback) {

            Code.expect(url).to.be.a.string();
            Code.expect(url).to.include('abcxyz');
            Code.expect(data).to.be.undefined();
            Code.expect(store).to.be.an.object();
            Code.expect(typeReq).to.be.an.instanceof(FluxConstant);
            Code.expect(typeRes).to.be.an.instanceof(FluxConstant);
            Code.expect(callback).to.exist();

            callback(new Error('sorry pal'));

            done();
        };

        Actions.delete('abcxyz');
    });
});
