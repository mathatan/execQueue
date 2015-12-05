(function(define) {
    'use strict';

    var _id = 0;
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

        var getId = function (ts) {
            return Math.floor(minIntSize + ((ts || timing.perf()) * 1000)) + '_' + (_id++);
        };

        var LinkedList = function() {
            this.itemCount = 0;
        };

        LinkedList.prototype = {
            updateItemCount : function () {
                var i = 0;
                for (var node = this.head; node; node = node.next) {
                    i++;
                }
                this.itemCount = i;
            },
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
                node.id = undefined;
                this.itemCount--;
            },
            sort : function (fn) {
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

                    if (i.id !== min.id) {
                        this.swap(i, min);
                        i = min;
                    }
                }

            },
            swap : function (aItem, bItem) {
                var aPrevious, aNext,
                bPrevious, bNext;

                aPrevious = aItem.previous;
                aNext = aItem.next;

                bPrevious = bItem.previous;
                bNext = bItem.next;

                // Swap is between current and next item
                if (aNext && aNext.id === bItem.id) {
                    bItem.next = aItem;
                    aItem.previous = bItem;
                    aPrevious.next = bItem;
                    bNext.previous = aItem;
                    aItem.next = bNext;

                    if (aItem.previous === undefined) {
                        this.head = aItem;
                    }
                    if (bItem.next === undefined) {
                        this.tail = bItem;
                    }
                // Swap is between current and previous item
                } else if (aPrevious && aPrevious.id === bItem.id) {
                    aItem.previous = bPrevious;
                    bPrevious.next = aItem;
                    aItem.next = bItem;
                    bItem.previous = aItem;
                    aNext.previous = bItem;

                    if (bItem.previous === undefined) {
                        this.head = bItem;
                    }
                    if (aItem.next === undefined) {
                        this.tail = aItem;
                    }
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

                // var item = this.head, str = '';
                // while(item) {
                //     str += item.data + ' < ';
                //     item = item.next;
                // }
                // console.log('str', str);
            }
        };




        return LinkedList;

    });
})(typeof define === 'function' && define.amd ?
    define :
    function (factory) { 'use strict'; module.exports = factory(require); }
  );
