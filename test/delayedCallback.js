'use strict';

var delayedCallback = require('delayedCallback'),
    timing = require('timing'),
    native = require('nativeFunctions');

describe('Delayed callbacks', function() {

    //beforeEach(function () {
    //});
    
    var callback;

    beforeEach(function (done) {
        
    });


    xdescribe('Test', function () {
        beforeEach(function () { // done
            callback = delayedCallback(timing, native);
        });
        

        xit('Should run beforeEach', function () { // done

        });
    });
});
