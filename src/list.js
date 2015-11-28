(function(define) { 
    'use strict';

    var _id = 0;
    var minIntSize = Math.pow(10, 19);

    var slicePos = minIntSize.length, slicePos2 = slicePos + 1;
    var defSortFn = function (a, b) {
        a = a.id; b = b.id;

        var aTS = parseInt(a.slice(0, slicePos)),
            bTS = parseInt(b.slice(0, slicePos)),
            aID, bID;

        var ret = 0;

        if (aTS === bTS) {
            aID = parseInt(a.slice(slicePos2));
            bID = parseInt(b.slice(slicePos2));

            ret = aID < bID;
        } else {
            ret = aTS < bTS;
        }

        return ret;
    };

    define(function (require) {
        var timing = require('./timing.js');

        var getId = function (ts) {
            return (minIntSize + ((ts || timing.perf()) * 1000) |0) + '_' + (_id++);
        };

        var LinkedList = function() {
            this.itemCount = 0;
        };

        LinkedList.prototype = {
            add : function (node, previous) {
                if (!node.id) {
                    node.id = getId(node.ts);
                    this.itemCount++;
                }

                if (previous && previous.next) {
                    node.next = previous.next;
                    node.next.previous = node;

                    previous.next = node;

                    node.previous = previous;
                } else if (previous) {
                    previous.next = node;
                    node.previous = previous;
                    this.tail = node;
                } else if (this.tail) {
                    this.tail.next = node;
                    node.previous = this.tail;
                    this.tail = node;
                } else {
                    this.head = this.tail = node;
                }

                return node.id;
            },
            each : function (fn) {
                for (var node = this.head.next; node; node = node.next) {
                    fn(node);
                }
            },
            find : function (id) {
                for (var node = this.head.next; node; node = node.next) {
                    if (node.id === id) {
                        return node;
                    }
                }
            },
            at : function (index, node) {
                var i;
                if (index < 0 || index >= this.itemCount) {
                    return undefined;
                }
                if (index === (this.itemCount - 1)) {
                    return this.tail;
                }
                node = node || this.head;
                while (i < index) {
                    node = node.next;
                    i++;
                }
                return node;
            },
            addAt : function (node, index) {
                if (index > 0) { 
                    var previousNode = this.at(index - 1);
                    return this.add(node, previousNode);
                } else {
                    return this.addFirst(node);
                }
            },
            addFirst : function (node) {
                var nextNode = this.head;
                this.head = node;

                if (!node.id) {
                    node.id = getId(node.ts);
                    this.itemCount++;
                }

                if (nextNode) {
                    node.next = nextNode;
                    nextNode.previous = node;
                } else {
                    this.tail = node;
                }

                return node.id;
            },
            remove : function (node) {
                node.previous.next = node.next;
                node.previous = undefined;
                node.next = undefined;
            },
            sort : function (fn) {
                fn = fn || defSortFn;

                var min, tmp, i, len, j,
                    minItem, iItem;

                for (i = 0, len = this.itemCount; i < len; i++) {
                    min = i; minItem = iItem = this.at(min);
                    for (j = i + 1; j < len; j++) {
                        tmp = (tmp || minItem).next;
                        if (fn(minItem, tmp)) {
                            min = j; minItem = tmp;
                            tmp = undefined;
                        }
                    }
                    if (min !== i) {
                        //tmp = arr[i];
                        var place1 = iItem.previous;
                        this.remove(iItem);
                        var place2 = min.previous;
                        this.remove(min);

                        this.add(min, place1);
                        this.add(iItem, place2);
                        //arr[i] = arr[min];
                        //arr[min] = tmp;
                    }
                }

            }
        };




        return LinkedList;

    });
})(typeof define === 'function' && define.amd ? 
    define : 
    function (factory) { 'use strict'; module.exports = factory(require); }
  );
