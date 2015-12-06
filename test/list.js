'use strict';

var LinkedList = require('list');

describe('LinkedList', function() {

    var list;

    var setItem = function (data) {
        return { data : data };
    }, getItem = function (item) {
        return item.data;
    };

    //beforeEach(function () {
    //});

    describe('Add items to list', function () {
        beforeEach(function () { // done
            list = new LinkedList();
        });

        it('One item', function () {
            var item = setItem(1);
            list.add(item);

            expect(list.itemCount).toEqual(1);
            expect(getItem(list.head)).toEqual(1);
            expect(getItem(list.tail)).toEqual(1);
        });
        it('Multiple items', function () {
            var items = [];
            for (var i = 0; i < 5; i++) {
                items[i] = setItem(i);
                list.add(items[i]);
            }

            expect(list.itemCount).toEqual(5);
            expect(getItem(list.head)).toEqual(0);
            expect(getItem(list.tail)).toEqual(4);
            expect(getItem(items[2].next))
                .toEqual(getItem(items[4].previous));
        });

        it('Add an item at an index', function () {
            var items = [];
            for (var i = 0; i < 5; i++) {
                items[i] = setItem(i);
                list.add(items[i]);
            }

            var item = setItem('test');

            list.addAt(item, 2);
            expect(list.itemCount).toEqual(6);
            expect(getItem(items[1].next)).toEqual('test');
            expect(getItem(items[2].previous)).toEqual('test');
            expect(getItem(item.previous)).toEqual(1);
            expect(getItem(item.next)).toEqual(2);

            var item2 = setItem('test2');

            list.addAt(item2, 5);
            expect(list.itemCount).toEqual(7);
            expect(getItem(items[3].next)).toEqual('test2');
            expect(getItem(items[4].previous)).toEqual('test2');
            expect(getItem(item2.previous)).toEqual(3);
            expect(getItem(item2.next)).toEqual(4);
        });

        it('After an item', function () {
            var items = [];
            for (var i = 0; i < 5; i++) {
                items[i] = setItem(i);
                list.add(items[i]);
            }

            var item = setItem('test');

            list.add(item, items[2]);
            expect(list.itemCount).toEqual(6);
            expect(getItem(items[2].next)).toEqual('test');
            expect(getItem(items[3].previous)).toEqual('test');
            expect(getItem(item.previous)).toEqual(2);
            expect(getItem(item.next)).toEqual(3);
        });

        it('As first item', function () {
            var items = [];
            for (var i = 0; i < 2; i++) {
                items[i] = setItem(i);
                list.add(items[i]);
            }

            var item = setItem('test');

            list.addFirst(item);
            expect(list.itemCount).toEqual(3);
            expect(getItem(item.next)).toEqual(0);
            expect(getItem(items[0].previous)).toEqual('test');
        });
    });

    describe('Remove items from list', function () {
        var items;
        beforeEach(function () {
            list = new LinkedList();

            items = [];
            for (var i = 0; i < 5; i++) {
                items[i] = setItem(i);
                list.add(items[i]);
            }
        });

        it('One item', function () {
            list.remove(items[4]);

            expect(list.itemCount).toEqual(4);
            expect(getItem(list.tail)).toEqual(3);
            expect(list.tail.next).toEqual(undefined);
        });

        it('Multiple items', function () {
            list.remove(items[4]);
            list.remove(items[0]);
            list.remove(items[2]);

            expect(list.itemCount).toEqual(2);
            expect(getItem(list.tail)).toEqual(3);
            expect(list.tail.next).toEqual(undefined);
            expect(getItem(list.head)).toEqual(1);
            expect(list.head.previous).toEqual(undefined);
            expect(getItem(items[1].next)).toEqual(3);
            expect(getItem(items[3].previous)).toEqual(1);
        });

        it('All items after an item', function () {
            list.dropAllAfter(items[2]);

            expect(list.itemCount).toEqual(3);
            expect(getItem(list.tail)).toEqual(2);
            expect(list.tail.next).toEqual(undefined);
        });

        it('All items before an item', function () {
            list.dropAllBefore(items[2]);

            expect(list.itemCount).toEqual(3);
            expect(getItem(list.head)).toEqual(2);
            expect(list.head.previous).toEqual(undefined);
        });

    });

    describe('List methods', function () {
        var items;
        beforeEach(function () {
            list = new LinkedList();

            items = [];
            for (var i = 0; i < 5; i++) {
                items[i] = setItem(i);
                list.add(items[i]);
            }
        });

        it('Return an item from list by index', function () {
            expect(getItem(list.at(2))).toEqual(getItem(items[2]));
        });

        it('Find an item from list by id', function () {
            expect(getItem(list.find(items[2].id))).toEqual(getItem(items[2]));            
        });

        it('Run a function for each item', function () {
            list.each(function (item) { item.data = 'test' + item.data; });
            var item;

            for (var i = 0; i < items.length; i++) {
                item = items[i];
                expect(getItem(item)).toEqual('test' + i);
            }
        });

        it('Swap positions of items', function () {
            var item1 = items[1],
                item3 = items[3];

            list.swap(item1, item3);
            expect(getItem(item1.previous)).toEqual(2);
            expect(getItem(item1.next)).toEqual(4); 
            expect(getItem(item3.previous)).toEqual(0);
            expect(getItem(item3.next)).toEqual(2); 
            //expect(test5).toEqual(4);
        });

        it('Sort list without a sorting method', function () {
            var itemA = setItem('a'),
                itemB = setItem('b');

            list.addAt(itemA, 4);
            list.addAt(itemB, 2);

            list.selectSort();

            expect(getItem(itemA.next)).toEqual('b');
            expect(getItem(list.tail.previous)).toEqual('a');
        });

        it('Sort list with a sorting method', function () {
            list = new LinkedList();

            items = [];

            var numbers = [5,7,4,6,8,2,3,1,9], i;

            for (i = 0; i < numbers.length; i++) {
                items[i] = setItem(numbers[i]);
                list.add(items[i]);
            }

            list.selectSort(function (a, b) {
                return a.data < b.data;
            });

            var item = list.head;
            expect(getItem(item)).toEqual(1);
            for (i = 1; i < numbers.length; i++) {
                item = item.next;
                expect(getItem(item)).toEqual(i + 1);
            }
            expect(getItem(item)).toEqual(getItem(list.tail));
        });


        it('Merge sort list without a sorting method', function () {
            var itemA = setItem('a'),
                itemB = setItem('b');

            list.addAt(itemA, 4);
            list.addAt(itemB, 2);

            list.mergeSort();

            expect(getItem(itemA.next)).toEqual('b');
            expect(getItem(list.tail.previous)).toEqual('a');
        });

        it('Merge sort list with a sorting method', function () {
            list = new LinkedList();

            items = [];

            var numbers = [5,7,4,6,8,2,3,1,9], i;

            for (i = 0; i < numbers.length; i++) {
                items[i] = setItem(numbers[i]);
                list.add(items[i]);
            }

            list.mergeSort(function (a, b) {
                return a.data < b.data;
            });

            var item = list.head;
            expect(getItem(item)).toEqual(1);
            for (i = 1; i < numbers.length; i++) {
                item = item.next;
                expect(getItem(item)).toEqual(i + 1);
            }
            expect(getItem(item)).toEqual(getItem(list.tail));
        });        

        it('Add items to list in order without a sorting method', function () {
            var itemA = setItem('a'),
                itemB = setItem('b');

            list.addInOrder(itemA);
            list.addInOrder(itemB);

            //list.mergeSort();

            expect(getItem(itemA.next)).toEqual('b');
            expect(getItem(list.tail.previous)).toEqual('a');
        });

        it('Add items to list in order with a sorting method', function () {
            list = new LinkedList();

            items = [];

            var numbers = [5,7,4,6,8,2,3,1,9], i;

            var sortFn = function (a, b) {
                return a.data < b.data;
            };

            for (i = 0; i < numbers.length; i++) {
                items[i] = setItem(numbers[i]);
                list.addInOrder(items[i], sortFn);
            }

            //list.mergeSort();

            var item = list.head;
            expect(getItem(item)).toEqual(1);
            for (i = 1; i < numbers.length; i++) {
                item = item.next;
                expect(getItem(item)).toEqual(i + 1);
            }
            expect(getItem(item)).toEqual(getItem(list.tail));
        });              

    });

});
