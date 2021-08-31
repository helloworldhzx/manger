const MODULE = 'zz'
const store = {
  setItem(key, value){
    const obj = this.getStorage();
    obj[key] = value;
    localStorage.setItem(MODULE, JSON.stringify(obj))
  },
  getStorage(){
    return JSON.parse(localStorage.getItem(MODULE)) || {}
  },
  getItem(key){
    return this.getStorage()[key]
  },
  clearItem(key){
    const obj = this.getStorage();
    delete obj[key];
    localStorage.setItem(MODULE, JSON.stringify(obj))
  },
  clearStorage(){
    localStorage.clear()
  },
}

export default store