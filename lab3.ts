// task 1
function add(...args: number[]): any {
    let sum: number = args.reduce((a, b) => a + b, 0);
  
    function innerAdd(...innerArgs: number[]): any {
        if (innerArgs.length === 0) {
            return sum;
        }
  
        sum += innerArgs.reduce((a, b) => a + b, 0);
        return innerAdd;
    }
  
    return innerAdd;
}
  
console.log(add(2)(5)(7)(1)(6)(5)(11)()); // 37
  
console.log('');

// task 2
function areAnagrams(str1: string, str2: string): boolean {
    // Remove spaces from the strings and convert to lowercase
    const sortedStr1 = str1.replace(/\s/g, '').toLowerCase().split('').sort().join('');
    const sortedStr2 = str2.replace(/\s/g, '').toLowerCase().split('').sort().join('');

    // Compare the sorted strings
    return sortedStr1 === sortedStr2;
}

console.log(areAnagrams('listen', 'silent')); // true
console.log(areAnagrams('hello', 'world')); // false

console.log('');

// task 3
function deepClone<T>(obj: T): T {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }
  
    let clone: any;
  
    if (Array.isArray(obj)) {
        clone = [];
        for (let i = 0; i < obj.length; i++) {
            clone[i] = deepClone(obj[i]);
        }
    } else {
        clone = {};
        for (let key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                clone[key] = deepClone(obj[key]);
            }
        }
    }
  
    return clone as T;
}
  
// Example usage
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
const wrapper = <T extends (...args: any[]) => any>(func: T) => {
    const cache: { [key: string]: ReturnType<T> } = {};

    return (...args: Parameters<T>): ReturnType<T> => {
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

const calc = (a: number, b: number, c: number): number => a + b + c;
const cachedCalc = wrapper(calc);

cachedCalc(2, 2, 3); // Calculated: 7
cachedCalc(5, 8, 1); // Calculated: 14
cachedCalc(2, 2, 3); // Result from cache: 7
