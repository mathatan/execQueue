'use strict';
//var LinkedList =

//var list; = new LinkedList(items);
//    list2 = new LinkedList(items),
//    list3 = new LinkedList();

var values = [], LinkedList;

LinkedList = require('../src/list');

var i;

var count = 10e3,
    iterations = 5;

var values = [];

for (i = 0; i < iterations; i++) {
    values[i] = new Array(count);
    for (var j = 0, jLen = count; j < jLen; j++) {
        values[i][j] = Math.round(Math.random() * jLen * 100);
    }
}

var newList = function (i) {
    var items = [];
    for (var j = 0, jLen = values[i].length; j < jLen; j++) {
        items[j] = { ts : values[i][j], data : j };
    }
    return new LinkedList(items);
};

var now, list, totalIterations = 0, time = 0;

console.log('Test select sort');
for (i = 0; i < iterations; i++) {
    console.log('\t' + i + ' Iteration...');
    list = newList(i);
    now = Date.now();
    list.selectSort();
    time = time + Date.now() - now;
    totalIterations = totalIterations + count;
}
console.log('Sort speed on avarage ' + (time / totalIterations).toFixed(4) + ' ms per item');

totalIterations = 0; 
time = 0;

console.log('Test merge sort');
for (i = 0; i < iterations; i++) {
    console.log('\t' + i + ' Iteration...');
    list = newList(i);
    now = Date.now();
    list.mergeSort();
    time = time + Date.now() - now;
    totalIterations = totalIterations + count;
}
console.log('Sort speed on avarage ' + (time / totalIterations).toFixed(4) + ' ms per item');

console.log('Test add in order');
for (i = 0; i < iterations; i++) {
    console.log('\t' + i + ' Iteration...');
    list = new LinkedList();//newList(i);
    now = Date.now();
    for (var j = 0, jLen = values[i].length; j < jLen; j++) {
        list.addInOrder({ts : values[i][j], data : j});
    }
    //list.mergeSort();
    time = time + Date.now() - now;
    totalIterations = totalIterations + count;
}
console.log('Sort speed on avarage ' + (time / totalIterations).toFixed(4) + ' ms per item');

/*for (var item = list.head; item; item = item.next) {
    console.log(item.id);
}*/
