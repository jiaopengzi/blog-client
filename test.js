function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }
  
    if (Array.isArray(obj)) {
      const arrCopy = [];
      for (let i = 0; i < obj.length; i++) {
        arrCopy[i] = deepClone(obj[i]);
      }
      return arrCopy;
    }
  
    const objCopy = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        objCopy[key] = deepClone(obj[key]);
      }
    }
    return objCopy;
  }
  
  const obj = {
    name: 'test',
    details: {
      age: 25
    }
  };
  
  const obj2 = deepClone(obj);
  
  obj2.name = 'test2';
  obj2.details.age = 30;
  
  console.log(obj.name); // 输出: 'test'
  console.log(obj.details.age); // 输出: 25
  