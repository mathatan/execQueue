'use strict';

var ExecQueue = require('ExecQueue'),
    timing = require('timing');

describe('ExecQueue', function() {

    //beforeEach(function () {
    //});
    
    var queue = new ExecQueue();

    var timingTests = {};

    beforeEach(function (done) {
        var count = 0;
        var start = timing.perf();

        var countDone = function () {
            count--;
            if (count < 1) {
                console.log(timingTests);
                done();
            }
        };

        if (typeof requestAnimationFrame !== 'undefined') {
            count += 1;
            requestAnimationFrame(function () {
                timingTests.requestAnimationFrame = timing.perf() - start;
                countDone();
            });
        }

        if (typeof setTimeout !== 'undefined') {
            count += 3;

            setTimeout(function () {
                timingTests.setTimeoutZero = timing.perf() - start;
                countDone();
            });
            setTimeout(function () {
                timingTests.setTimeoutTen = timing.perf() - start;
                countDone();
            }, 10);
            setTimeout(function () {
                timingTests.setTimeoutSecond = timing.perf() - start;
                countDone();
            }, 1000);
        }

        if (typeof setInterval !== 'undefined') {
            count += 3;
            
            var a = 2, b = 2, c = 2;
            var aI = setInterval(function () {
                a--;
                if (a < 0) {
                    timingTests.setIntervalZero = timing.perf() - start;
                    countDone();
                    clearInterval(aI);
                }
            });
            var bI = setInterval(function () {
                b--;
                if (b < 0) {
                    timingTests.setIntervalTen = timing.perf() - start;
                    countDone();
                    clearInterval(bI);
                }
            }, 10);

            var cI = setInterval(function () {
                c--;
                if (c < 0) {
                    timingTests.setIntervalSecond = timing.perf() - start;
                    countDone();
                    clearInterval(cI);
                }
            }, 1000);        
        }
    });


    xdescribe('Test', function () {
        beforeEach(function () { // done
            queue = new ExecQueue();
        });
        

        xit('Should run beforeEach', function () { // done

        });
    });
});
