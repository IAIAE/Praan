(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.Praan = factory());
}(this, (function () { 'use strict';

function method(Constructor, name, fn) {
    function foo() {}
    foo.prototype.method = function (_name, _fn) {
        Constructor.prototype[_name] = _fn;
        return this;
    };
    var f = new foo();
    return f.method(name, fn);
}

function sMethod(source, dist) {
    for (var key in dist) {
        if (dist.hasOwnProperty(key)) {
            source[key] = dist[key];
        }
    }
}

function Schedular(clockTimer, taskFlow) {
    this.clockTimer = clockTimer;
    this.taskFlow = taskFlow;
}

Schedular.of = function (timer, flow) {
    return new Schedular(timer, flow);
};

var warp = function warp(task, time, periodic) {
    task.time = time;
    task.periodic = periodic;
    return task;
};
/**
 * get current timestamp
 */
method(Schedular, 'now', function () {
    return this.clockTimer.now();
})

/**
 * schedule a task, put a task into the taskFlow at the right time
 */
.method('schedule', function (delay, periodic, callTime, task) {
    this.taskFlow.insert(task.time == undefined ? warp(task, callTime + delay, periodic) : task);
    this.runNextArrival(callTime);
}).method('unShedule', function () {
    this.timer && this.clockTimer.clearTimer(this.timer);
    this.timer = null;
    this._lastNextArrival = null;
})

/**
 * immediately put the task into the taskFlow
 */
.method('atOnce', function (task) {
    var now = this.now();
    this.schedule(0, -1, now, task);
})

/**
 * put the task into taskFlow, then the task will run periodicly
 */
.method('periodic', function (duration, task) {
    this.schedule(0, duration, this.now(), task);
})

/**
 * delay
 */
.method('delay', function (delay, task) {
    this.schedule(delay, -1, this.now(), task);
})

/**
 * at a accurate time
 */
.method('accurate', function (time, task) {
    var now = this.now();
    this.schedule(time - now, -1, now, task);
}).method('runNextArrival', function (now) {
    var _this = this;

    var nextArrival = this.taskFlow.nextArrival();
    if (nextArrival == null) return null;
    if (this.timer && this._lastNextArrival && nextArrival < this._lastNextArrival) {
        //  there has task in ready but not execute yet.
        this.unShedule();
    } else if (this.timer) {
        // if exist a ready-to-run task and the task's time is equal `nextArrival`
        // ignore this method call.
        return null;
    }
    this._lastNextArrival = nextArrival;
    this.timer = this.clockTimer.setTimer(function (_) {
        return _this._runTheTask();
    }, Math.max(0, nextArrival - now));
}).method('_runTheTask', function () {
    this.timer = null;
    var now = this.clockTimer.now();
    this.taskFlow.runTask(now, safeRunTask, this);
    this.runNextArrival(this.clockTimer.now());
});

function safeRunTask(task, scheduler, insertCb) {
    try {
        task.run(scheduler);
    } catch (e) {
        task.err(e);
    }
    if (task.periodic >= 0 && task.active) {
        task.time = task.time + task.periodic;
        insertCb(task);
    }
}

function Task(value, sink) {
    this.value = value;
    this.sink = sink;
    this.active = true;
    this.time = null; //time will set by scheduler
}

Task.of = function (value, sink) {
    return new Task(value, sink);
};

method(Task, 'run', function (scheduler) {
    return this.active && this.sink.event(this.value, this.time, scheduler, this);
}).method('err', function (err) {
    throw err;
}).method('dispose', function () {
    this.active = false;
});

function ClockTimer() {}

ClockTimer.of = function () {
    return new ClockTimer();
};

method(ClockTimer, 'now', Date.now).method('setTimer', function (fn, delay) {
    return delay <= 0 ? deferRun(fn) : setTimeout(fn, delay);
}).method('clearTimer', function (timer) {
    return timer instanceof Ap ? timer.stop() : clearTimeout(timer);
});

function deferRun(fn) {
    var ap = new Ap(fn);

    Promise.resolve(ap).then(function (_ap) {
        try {
            _ap.run();
        } catch (e) {
            _ap.err(e);
        }
    });

    return ap;
}

function Ap(fn) {
    this.fn = fn;
    this.active = true;
}
method(Ap, 'run', function () {
    this.active && this.fn();
}).method('err', function (e) {
    throw e;
}).method('stop', function () {
    this.active = false;
});

function TaskBundle(task, time) {
    this.bundle = [task];
    this.time = task.time ? task.time : time;
}

method(TaskBundle, 'add', function (taskLike) {
    this.bundle.push(taskLike);
    return this;
});

function TaskFlow() {
    this.queue = [];
}

TaskFlow.of = function () {
    return new TaskFlow();
};

method(TaskFlow, 'insert', function (timeTask) {
    var index;
    if (this.queue.length === 0) {
        this.queue.push(new TaskBundle(timeTask));
    } else {
        // 找到插入点并插入
        biSearchAndInsert(this.queue, timeTask);
    }
}).method('remove', function (timeTask) {
    if (this.queue.length === 0) {
        return false;
    }
    var index = biSearch(timeCompare, this.queue, timeTask.time);
    if (index >= 0 && index < this.queue.length) {
        var taskBundle = this.queue[index];
        var innerIndex = taskBundle.indexOf(timeTask);
        if (~innerIndex) {
            if (taskBundle.bundle.length === 1) {
                this.queue.splice(index, 1);
            } else {
                taskBundle.bundle.splice(innerIndex, 1);
            }
            return true;
        }
        return false;
    }
    return false;
}).method('removeAll', function (predicate) {}).method('runTask', function (when, runFunc, scheduler) {
    var i = 0;
    var j = 0;
    var k = 0;
    var taskBundles;
    var self = this;
    while (i < this.queue.length && when > this.queue[i].time) {
        i++;
    }
    taskBundles = this.queue.splice(0, i);
    for (; j < i; j++) {
        var taskBundle = taskBundles[j];
        var len = taskBundle.bundle.length;
        for (k = 0; k < len; k++) {
            runFunc(taskBundle.bundle[k], scheduler, function (timeTask) {
                return self.insert.call(self, timeTask);
            });
        }
    }
}).method('nextArrival', function () {
    if (this.queue.length === 0) {
        return null;
    }
    return this.queue[0].time;
});

var timeCompare = function timeCompare(time, taskBundle) {
    return time - taskBundle.time;
};

function biSearch(timeCompare, sortedArray, t) {
    var lo = 0;
    var hi = sortedArray.length;
    var mid, y;

    while (lo < hi) {
        mid = Math.floor((lo + hi) / 2);
        y = sortedArray[mid];

        if (timeCompare(t, y) === 0) {
            return mid;
        } else if (timeCompare(t, y) < 0) {
            hi = mid;
        } else {
            lo = mid + 1;
        }
    }
    return hi;
}

function biSearchAndInsert(queue, timeTask) {
    var l = queue.length;
    var i = biSearch(timeCompare, queue, timeTask.time);
    if (i >= l) {
        queue.push(new TaskBundle(timeTask));
    } else if (timeTask.time === queue[i].time) {
        queue[i].add(timeTask);
    } else {
        queue.splice(i, 0, new TaskBundle(timeTask));
    }
}

var defaultSchedular = function () {
    return Schedular.of(ClockTimer.of(), TaskFlow.of());
};

function Sink(fn, err) {
    this.fn = fn;
    this.err = err || defaultErr;
}
function defaultErr(e) {
    console.error('depreciate!!!!!*****##### cannot go into the default err function in sink');
    return e;
}
Sink.of = function (fn, err) {
    return new Sink(fn, err);
};

Sink.prototype.event = function (value, time, scheduler, task) {
    this.fn(value, time, scheduler, task);
};
Sink.prototype.err = function (e) {
    this.err(e);
};

function observe(_fn) {
    this.source = this.source.map({
        fn: function fn(value) {
            _fn && _fn(value);
        },
        err: function err(e, nextSink) {
            nextSink.err(e);
        }
    });
    this.source.sluice(defaultSchedular());
}

function map(_fn) {
    return Stream.of(this.source.map({
        fn: function fn(value, time, nextSink, scheduler, task) {
            var _value = void 0;
            try {
                _value = _fn(value);
            } catch (e) {
                return nextSink.err({ msg: 'map error ', err: e });
            }
            _value !== undefined && nextSink.event(_value, time, scheduler, task);
        },
        err: function err(e, nextSink) {
            nextSink.err(e);
        }
    }));
}

function tap(_fn) {
    return Stream.of(this.source.map({
        fn: function fn(value, time, nextSink, scheduler, task) {
            _fn(value);
            nextSink.event(value, time, scheduler, task);
        },
        err: function err(e, nextSink) {
            nextSink.err(e);
        }
    }));
}

function delay(time) {
    return Stream.of(this.source.map({
        fn: function fn(value, execTime, nextSink, scheduler) {
            scheduler.accurate(execTime + time, Task.of(value, Sink.of(function (_value, _time, _scheduler, _task) {
                return nextSink.event(_value, _time, _scheduler, _task);
            })));
        },
        err: function err(e, nextSink) {
            nextSink.err(e);
        }
    }));
}

function flatMap(_fn) {
    return Stream.of(this.source.map({
        fn: function fn(value, time, nextSink, scheduler, task) {
            try {
                var mapedValue = _fn(value);
            } catch (e) {
                return nextSink.err({ msg: 'flatMap error', err: e });
            }

            if (mapedValue === undefined) return; //if no return, means you don't wanna go on.

            if (mapedValue instanceof Stream) {
                mapedValue.end(function (_value) {
                    nextSink.event(_value, time, scheduler, task);
                }, function (err) {
                    nextSink.err(err);
                });
            } else {
                console.error('flatMap error:: value: `' + value + '` is not a Stream. use map instead.');
                nextSink.event(mapedValue, time, scheduler, task);
            }
        },
        err: function err(e, nextSink) {
            nextSink.err(e);
        }
    }));
}

function scan(reducer, seed) {
    var init = seed;
    return Stream.of(this.source.map({
        fn: function fn(value, time, nextSink, scheduler, task) {
            init = reducer(init, value);
            nextSink.event(init, time, scheduler, task);
        },
        err: function err(e, nextSink) {
            nextSink.err(e);
        }
    }));
}

function error$1(fn) {
    return Stream.of(this.source.map({
        fn: function fn(value, time, nextSink, scheduler, task) {
            nextSink.event(value, time, scheduler, task);
        },
        err: function err(e, nextSink) {
            var result = fn(e);
            if (result !== undefined) {
                nextSink.err(result);
            }
        }
    }));
}

function end(_fn, _err) {
    this.source = this.source.map({
        fn: function fn(value) {
            _fn(value);
        },
        err: function err(e) {
            _err(e);
        }
    });
    this.source.sluice(defaultSchedular());
}

var apis = {
    observe: observe,
    map: map,
    tap: tap,
    delay: delay,
    flatMap: flatMap,
    scan: scan,
    error: error$1,
    end: end
};

function Stream(source) {
    this.source = source;
}
Stream.of = function (source) {
    return new Stream(source);
};

for (var key in apis) {
    if (apis.hasOwnProperty(key)) {
        Stream.prototype[key] = apis[key];
    }
}

var emptyFunc = function emptyFunc() {};
var defaultErrFunc = function defaultErrFunc(e) {
    console.error('### depreciate #####, some error throwd and no handler catch it. the error drain to the bottom!!');
};
// Source.map(function(next, value, scheduler){
//     value = ...
//     next.event(value, scheduler)
// })

function foo(obj) {
    var fn = obj.fn;
    var err = obj.err;
    return function (next) {
        return Sink.of(function (value, time, scheduler, task) {
            return fn(value, time, next, scheduler, task);
        }, function (e) {
            return err(e, next);
        });
    };
}

function reInitSink(sinkArr) {
    var len = sinkArr.length;
    var next = Sink.of(emptyFunc, defaultErrFunc);
    for (var i = len - 1; i >= 0; i--) {
        next = foo(sinkArr[i])(next);
    }
    return next;
}

/**
 * Just is the simplest source that only emit a value once
 * @author  iaiae
 */
function Just(data) {
    this.value = data;
    this.sinks = [];
    this._sink = null;
}

Just.of = function (data) {
    return new Just(data);
};

Just.prototype.map = function (fn) {
    var newJust = Just.of(this.value);
    newJust.sinks = this.sinks.concat([fn]);
    newJust._sink = reInitSink(newJust.sinks);
    return newJust;
};

Just.prototype.sluice = function (scheduler) {
    return scheduler.atOnce(Task.of(this.value, this._sink));
};

function FromArray(arr) {
    this.array = arr;
    this.sinks = [{
        fn: function fn(value, time, nextSink, scheduler, task) {
            console.info('IAIAE--> fromarray sink ');
            for (var i = 0, len = value.length; i < len; i++) {
                nextSink.event(value[i], time, scheduler, task);
            }
            task.dispose();
        },
        err: function err(e, nextSink) {
            nextSink.err(e);
        }
    }];
}
FromArray.of = function (arr) {
    return new FromArray(arr);
};
FromArray.prototype.map = function (fn) {
    var newP = FromArray.of(this.array);
    newP.sinks = this.sinks.concat([fn]);
    newP._sink = reInitSink(newP.sinks);
    return newP;
};

FromArray.prototype.sluice = function (scheduler) {
    scheduler.atOnce(Task.of(this.array, this._sink));
};

var initSink = {
    fn: function fn(value, time, nextSink, scheduler, task) {
        value.then(function (data) {
            nextSink.event(data, time, scheduler, task);
        }).catch(function (err) {
            nextSink.err(err);
        });
        task.dispose();
    },
    err: function err(e, nextSink) {
        nextSink.err(e);
    }
};

function FromPromise(promise) {
    this.promise = promise;
    this.sinks = [initSink];
}
FromPromise.of = function (promise) {
    return new FromPromise(promise);
};
FromPromise.prototype.map = function (fn) {
    var newP = FromPromise.of(this.promise);
    newP.sinks = this.sinks.concat([fn]);
    newP._sink = reInitSink(newP.sinks);
    return newP;
};

FromPromise.prototype.sluice = function (scheduler) {
    scheduler.atOnce(Task.of(this.promise, this._sink));
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

// import Empty from '../../Functor/Headspring/Empty'

function getType(data) {
    if (Array.isArray(data) && data.length > 0) return 'array';else if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) === 'object' && typeof data.then === 'function') return 'promise';else if (data == null || Array.isArray(data) && data.length === 0) return 'empty';else return 'normal';
}

function of(data) {
    switch (getType(data)) {
        case 'array':
            return Stream.of(FromArray.of(data));
        case 'promise':
            return Stream.of(FromPromise.of(data));
        // case 'empty':
        //     return Stream.of(Empty.of());
        // case 'normal':
        default:
            return Stream.of(Just.of(data));
    }
}

/**
 * Periodic is a source that emit a `value` every `duration`
 * @author  iaiae
 */
function Periodic(duration, value) {
    this.duration = duration;
    this.value = value;
    this.sinks = [];
    this._sink = function () {};
}

Periodic.of = function (duration, value) {
    return new Periodic(duration, value);
};

Periodic.prototype.map = function (fn) {
    var newP = Periodic.of(this.duration, this.value);
    newP.sinks = this.sinks.concat([fn]);
    newP._sink = reInitSink(newP.sinks);
    return newP;
};

Periodic.prototype.sluice = function (scheduler) {
    return scheduler.periodic(this.duration, Task.of(this.value, this._sink));
};

function periodic(duration, value) {
    return Stream.of(Periodic.of(duration, value));
}

var staticMethods = {
    of: of,
    periodic: periodic,
    just: of
};

// static
function Praan() {}

sMethod(Praan, staticMethods);

return Praan;

})));
