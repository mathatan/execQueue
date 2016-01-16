'use strict';

var start;

if (typeof process !== 'undefined' && process.hrtime) {
    start = process.hrtime();
} else {
    start = (new Date()).getTime();
}

var timing = require('timing');

describe('Timing', function() {

    //beforeEach(function () {
    //});
    
    var nativeValue, value;

    var eighties = (new Date('1980-01-01')).getTime();

    describe('Test date method', function () {
        beforeEach(function () {
            nativeValue = Date.now();
            value = timing.date();        
        });

        it('Date should return a number', function () {
            expect(value).toEqual(jasmine.any(Number));
        });

        it('Date should be close to normal date', function () { // done
            expect(value).toBeCloseTo(nativeValue, 2);
        });
    });

    describe('Test performance method', function () {
        beforeEach(function () {
            if (typeof window !== 'undefined' && window.performance) {
                nativeValue = window.performance.now();
            } else if (typeof process !== 'undefined' && process.hrtime) {
                var now = process.hrtime(start);
                nativeValue = now[0] + now[1] * 1e-9;
            } else {
                nativeValue = (new Date()).getTime() - start;
            }

            value = timing.perf();

        });

        it('Performance should return a number', function () {
            expect(value).toEqual(jasmine.any(Number));
        });

        it('Performance should value should be small', function () {
            expect(value).toBeLessThan(eighties);
        });

        it('Performance should be close to normal performance', function () { // done
            expect(value).toBeCloseTo(nativeValue, -1);
        });
    });    
});
