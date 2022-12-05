export function copyObj(obj: any): any {
  if (typeof obj == "object") {
    if (Array.isArray(obj)) {
      let arr = [];
      for (let item of obj) {
        arr.push(Object.assign(copyObj(item)));
      }
      return arr;
    } else if (obj == null) {
      return null;
    } else {
      let obj1: any = {};
      for (let index in obj) {
        obj1[index] = copyObj((obj[index]));
      }
      return obj1;
    }
  } else if (typeof obj == "function") {
    return Object.assign(obj);
  } else if (typeof obj == undefined) {
    return undefined;
  } else {
    return obj;
  }
}