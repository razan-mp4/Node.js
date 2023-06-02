// task 1
function add(num) {
    let sum = num || 0;
  
    function innerAdd(nextNum) {
        if (nextNum === undefined) {
            return sum;
        }
  
        sum += nextNum;
        return innerAdd;
    }
  
    return innerAdd;
}
  
console.log(add(2)(5)(7)(1)(6)(5)(11)()); // 37
  
console.log('');

// task 2
function areAnagrams(str1, str2) {
    // Видаляємо пробіли з рядків і перетворюємо на нижній регістр
    const sortedStr1 = str1.replace(/\s/g, '').toLowerCase().split('').sort().join('');
    const sortedStr2 = str2.replace(/\s/g, '').toLowerCase().split('').sort().join('');

    // Порівнюємо відсортовані рядки
    return sortedStr1 === sortedStr2;
}
  
console.log(areAnagrams('listen', 'silent')); // true
console.log(areAnagrams('hello', 'world')); // false

console.log('');

// task 3
function deepClone(obj) {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }
  
    let clone;
  
    if (Array.isArray(obj)) {
        clone = [];
        for (let i = 0; i < obj.length; i++) {
            clone[i] = deepClone(obj[i]);
        }
    } else {
        clone = {};
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
            clone[key] = deepClone(obj[key]);
            }
        }
    }
  
    return clone;
}
  
// Приклад використання
const obj1 = {
    name: 'John',
    age: 30,
    address: {
        city: 'New York',
        country: 'USA'
    },
    hobbies: ['reading', 'painting']
};
  
const obj2 = deepClone(obj1);
  
console.log(obj2);
console.log(obj1 === obj2); // false

console.log('');

// task 4
const wrapper = (func) => {
    const cache = {};
  
    return (...args) => {
        const key = JSON.stringify(args);
      
        if (cache.hasOwnProperty(key)) {
            console.log(`Result from cache: ${cache[key]}`);
            return cache[key];
        }
      
        const result = func(...args);
        cache[key] = result;
        console.log(`Calculated: ${result}`);
        return result;
    };
};
const calc = (a, b, c) => a + b + c;
const cachedCalc = wrapper(calc);

cachedCalc(2, 2, 3); // Обчислено: 7
cachedCalc(5, 8, 1); // Обчислено: 14
cachedCalc(2, 2, 3); // З кешу: 7
