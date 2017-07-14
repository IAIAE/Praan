function Restore(value){
    this.value = value;
}
Restore.of = function(_){
    return new Restore(_);
}
export default Restore;