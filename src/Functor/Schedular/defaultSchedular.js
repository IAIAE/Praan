import Schedular from './Schedular.js'
import ClockTimer from '../Timer/ClockTimer'
import TaskFlow from '../TaskFlow/TaskFlow'


export default function(){
    return Schedular.of(ClockTimer.of(), TaskFlow.of())
}
