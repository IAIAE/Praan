import { method } from '../../util.js'
import Task from '../Task/Task.js'
import TaskBundle from '../Task/TaskBundle.js'

function TaskFlow() {
    this.queue = [];
}

TaskFlow.of = function(){
    return new TaskFlow();
}

method(TaskFlow, 'insert', function (timeTask) {
    var index;
    if (this.queue.length === 0) {
        this.queue.push(new TaskBundle(timeTask));
    } else {
        // 找到插入点并插入
        biSearchAndInsert(this.queue, timeTask);
    }
})
.method('remove', function (timeTask) {
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
})
.method('removeAll', function (predicate) {


})
.method('runTask', function (when, runFunc, scheduler) {
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
        for(k = 0; k < len; k++){
            runFunc(taskBundle.bundle[k], scheduler, function(timeTask){
                return self.insert.call(self, timeTask);
            })
        }
    }
})

.method('nextArrival', function(){
    if(this.queue.length === 0){
        return null;
    }
    return this.queue[0].time;
})



var timeCompare = function (time, taskBundle) {
    return time - taskBundle.time;
}

function biSearch(timeCompare, sortedArray, t) {
    var lo = 0
    var hi = sortedArray.length
    var mid, y

    while (lo < hi) {
        mid = Math.floor((lo + hi) / 2)
        y = sortedArray[mid]

        if (timeCompare(t, y) === 0) {
            return mid
        } else if (timeCompare(t, y) < 0) {
            hi = mid
        } else {
            lo = mid + 1
        }
    }
    return hi
}

function biSearchAndInsert(queue, timeTask) {
    var l = queue.length
    var i = biSearch(timeCompare, queue, timeTask.time);
    if (i >= l) {
        queue.push(new TaskBundle(timeTask))
    } else if (timeTask.time === queue[i].time) {
        queue[i].add(timeTask)
    } else {
        queue.splice(i, 0, new TaskBundle(timeTask))
    }
}

export default TaskFlow;
