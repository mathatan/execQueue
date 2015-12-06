(function(define) {
    'use strict';

    var minIntSize = Math.pow(10, 19);

    var slicePos = ('' + minIntSize).length, slicePos2 = slicePos + 1;
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

        var getId = function (ts, id) {
            return Math.floor(minIntSize + ((ts || timing.perf()) * 1000)) + '_' + (id);
        };

        var LinkedList = function(arr) {
            this.itemCount = 0;
            this.itemId = 0;
            if (typeof arr === 'object' && arr.length) {
                for (var i = 0, iLen = arr.length; i < iLen; i++) {
                    this.add(arr[i]);
                }
            }
            this.sort = this.mergeSort;
        };

        LinkedList.prototype = {
            updateItemCount : function () {
                var i = 0;
                for (var node = this.head; node; node = node.next) {
                    i++;
                }
                this.itemCount = i;
            },
            connectNode : function (node) {
                if (!node.id) {
                    node.id = getId(node.ts, this.itemId++);
                    node.list = this;
                    this.itemCount++;
                }
            },
            disconnectNode : function (node) {
                node.id = undefined;
                node.list = undefined;
                this.itemCount--;
            },
            add : function (node, previous) {
                this.connectNode(node);

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

                this.connectNode(node);

                if (nextNode) {
                    node.next = nextNode;
                    nextNode.previous = node;
                } else {
                    this.tail = node;
                }

                return node.id;
            },
            addInOrder : function (node, fn) {
                this.connectNode(node);

                fn = fn || defSortFn;
                if (this.head) {
                    if (!fn(this.head, node)) {
                        this.addFirst(node);
                    } else if (fn(this.tail, node)) {
                        this.add(node);
                    } else {
                        var i = 1, item = this.head.next;
                        while (item && fn(item, node)) {
                            item = item.next;
                            i++;
                        }
                        this.add(node, item && item.previous);
                    }
                } else {
                    this.addFirst(node);
                }
            },            
            each : function (fn) {
                for (var node = this.head; node; node = node.next) {
                    fn(node);
                }
            },
            find : function (id) {
                for (var node = this.head; node; node = node.next) {
                    if (node.id === id) {
                        return node;
                    }
                }
            },
            at : function (index) {
                var i = 0, node;
                if (index < 0 || index >= this.itemCount) {
                    return undefined;
                }
                if (index === (this.itemCount - 1)) {
                    return this.tail;
                }
                if (index === 0) {
                    return this.head;
                }

                if (index > this.itemCount / 2) {
                    node = this.tail;
                    i = this.itemCount - 1;
                    while (i > index) {
                        node = node.previous;
                        i--;
                    }
                } else {
                    node = this.head;
                    while (i < index) {
                        node = node.next;
                        i++;
                    }
                }
                return node;
            },
            dropAllBefore : function (node) {
                this.head = node;
                node.previous = undefined;
                this.updateItemCount();
            },
            dropAllAfter : function (node) {
                this.tail = node;
                node.next = undefined;
                this.updateItemCount();
            },
            remove : function (node) {
                if (node.previous) {
                    node.previous.next = node.next;
                    if (node.next) {
                        node.next.previous = node.previous;
                    } else {
                        this.tail = node.previous;
                    }
                } else if (node.next) {
                    node.next.previous = undefined;
                    this.head = node.next;
                }
                node.next = undefined;
                node.previous = undefined;
                this.disconnectNode(node);
            },
            selectSort : function (fn) {
                fn = fn || defSortFn;

                var i = this.head,
                    j, min;

                for (;i; i = i.next) {

                    min = i;
                    for (j = i.next; j; j = j.next) {
                        if (fn(j, min)) {
                            min = j;
                        }
                    }

                    if (min && i.id !== min.id) {
                        this.swap(i, min);
                        i = min;
                    }
                }
                //console.log(this.listAll(this.head).join('\n'));
            },
            swap : function (aItem, bItem) {
                var aPrevious, aNext,
                bPrevious, bNext;

                aPrevious = aItem.previous;
                aNext = aItem.next;

                bPrevious = bItem.previous;
                bNext = bItem.next;

                // Swap is between siding items
                if (aNext && aNext.id === bItem.id ||
                    bNext && bNext.id === aItem.id
                   ) {

                    if (bNext && bNext.id === aItem.id) {
                        var tmp = aItem;
                        aItem = bItem;
                        bItem = tmp;

                        aPrevious = aItem.previous;
                        bNext = bItem.next;
                    }

                    if (aPrevious) {
                        aPrevious.next = bItem;
                        bItem.previous = aPrevious;
                    } else {
                        bItem.previous = undefined;
                        this.head = bItem;
                    }

                    if (bNext) {
                        bNext.previous = aItem;
                        aItem.next = bNext;
                    } else {
                        aItem.next = undefined;
                        this.tail = aItem;
                    }

                    aItem.previous = bItem;
                    bItem.next = aItem;

                // Swap is something else
                } else {
                    if (aPrevious) {
                        aPrevious.next = bItem;
                        bItem.previous = aPrevious;
                    } else {
                        bItem.previous = undefined;
                        this.head = bItem;
                    }

                    if (aNext) {
                        aNext.previous = bItem;
                        bItem.next = aNext;
                    } else {
                        bItem.next = undefined;
                        this.tail = bItem;
                    }

                    if (bPrevious) {
                        bPrevious.next = aItem;
                        aItem.previous = bPrevious;
                    } else {
                        aItem.previous = undefined;
                        this.head = aItem;
                    }

                    if (bNext) {
                        bNext.previous = aItem;
                        aItem.next = bNext;
                    } else {
                        aItem.next = undefined;
                        this.tail = aItem;
                        }
                    }

            },
            listAll : function (item) {
                var arr = [];
                while(item) {
                    arr.push(item.id);
                    item = item.next;
                }
                return arr;
            },
            _merge : function (items, left, right, fn) {
                items.head = undefined;
                items.tail = undefined;

                var handledList;

                while (left.head && right.head) {
                    if (fn(left.head, right.head)) {
                        handledList = left;
                    } else {
                        handledList = right;
                    }

                    if (!items.head) {
                        items.head = handledList.head;
                        items.tail = handledList.head;
                        items.head.previous = undefined;
                    } else {
                        items.tail.next = handledList.head;
                        handledList.head.previous = items.tail;
                    }
                    items.tail = handledList.head;
                    handledList.head = handledList.head.next;
                    items.tail.next = undefined;
                    if (handledList.head) {
                        handledList.head.previous = undefined;
                    }
                }

                if (left.head) {
                    if (items.tail) {
                        items.tail.next = left.head;
                        left.head.previous = items.tail;
                    } else {
                        items.head = left.head;
                    }
                    items.tail = left.tail;
                }
                if (right.head) {
                    if (items.tail) {
                        items.tail.next = right.head;
                        right.head.previous = items.tail;
                    } else {
                        items.head = right.head;
                    }
                    items.tail = right.tail;
                }
            },
            mergeSort : function (fn, items) {
                fn = fn || defSortFn;

                items = items || this;
                if (!items.head || items.head.id === items.tail.id) {
                    return items;
                }

                var left = {}, right = {}, list;

                var item = items.head, index = 0;

                while (item) {
                    if (index & 1) {
                        list = left;
                    } else {
                        list = right;
                    }

                    if (list.tail) {
                        list.tail.next = item;
                        item.previous = list.tail;
                    }

                    list.tail = item;
                    item = item.next;
                    list.tail.next = undefined;

                    if (!list.head) {
                        list.head = list.tail;
                        list.head.previous = undefined;
                    }
                    index++;
                }

                this.mergeSort(fn, left);
                this.mergeSort(fn, right);

                this._merge(items, left, right, fn);

                //if (items.mergeSort) {
                    //console.log(this.listAll(items.head).join('\n'));
                //}
            }
        };




        return LinkedList;

    });
})(typeof define === 'function' && define.amd ?
    define :
    function (factory) { 'use strict'; module.exports = factory(require); }
  );
