// task 1
function runSequent<T, R>(
    array: T[],
    callback: (item: T, index: number) => Promise<R>
  ): Promise<R[]> {
    const results: R[] = [];
  
    const processItem = async (item: T, index: number) => {
      const result = await callback(item, index);
      results.push(result);
    };
  
    const processNextItem = (index: number):any => {
      if (index >= array.length) {
        return Promise.resolve();
      }
      const item = array[index];
      return processItem(item, index).then(() => processNextItem(index + 1));
    };
  
    return processNextItem(0).then(() => results);
  }
  
  // Приклад виклику
  const array: Array<string> = ["one", "two", "three"];
  const results = runSequent(array, (item, index) =>
    Promise.resolve({
      item,
      index,
    })
  );
  
  results.then((result) => {
    console.log('Task 1');
    console.log(result);
  });
  

  console.log('');


// task 2
function arrayChangeDelete<T>(array: T[], rule: (item: T) => boolean): T[] {
    const deletedElements: T[] = [];
    let i = 0;
  
    while (i < array.length) {
      if (rule(array[i])) {
        const deletedElement = array.splice(i, 1)[0];
        deletedElements.push(deletedElement);
      } else {
        i++;
      }
    }
  
    return deletedElements;
  }

  interface Person {
    name: string;
    age: number;
  }
  
  const persons: Person[] = [
    { name: 'John', age: 25 },
    { name: 'Jane', age: 30 },
    { name: 'Mike', age: 20 },
    { name: 'Sarah', age: 35 },
  ];
  
  const deletedElements = arrayChangeDelete(persons, (person) => person.age < 30);
  console.log('Task 2');
  console.log(persons);
  /*
  Output:
  [
    { name: 'Jane', age: 30 },
    { name: 'Sarah', age: 35 },
  ]
  */
  
  console.log(deletedElements);
  /*
  Output:
  [
    { name: 'John', age: 25 },
    { name: 'Mike', age: 20 },
  ]
  */


console.log('');

// task 3  

import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';

interface LinkData {
  links: string[];
}

async function saveHtmlContent(url: string, folderPath: string) {
  try {
    const response = await axios.get(url);
    const htmlContent = response.data;
    const fileName = url.split('/').pop() || 'index.html';
    const filePath = path.join(folderPath, fileName);
    fs.writeFileSync(filePath, htmlContent);
    console.log('Task 3');
    console.log(`Saved HTML content for ${url}`);
  } catch (error) {
    console.error(`Failed to save HTML content for ${url}`);
    console.error(error);
  }
}

function createFolder(folderName: string) {
  const folderPath = path.join(__dirname, folderName);
  fs.mkdirSync(folderPath);
  return folderPath;
}

function processLinks(jsonFilePath: string) {
  const jsonData = fs.readFileSync(jsonFilePath, 'utf-8');
  const linkData: LinkData = JSON.parse(jsonData);

  const jsonFileName = path.basename(jsonFilePath, '.json');
  const folderName = `${jsonFileName}_pages`;
  const folderPath = createFolder(folderName);

  linkData.links.forEach((link, index) => {
    const url = link.trim();
    saveHtmlContent(url, folderPath);
  });
}

// Перевірка наявності параметра командного рядка
if (process.argv.length < 3) {
  console.log('Вкажіть шлях до JSON-файлу як параметр командного рядка.');
} else {
  const jsonFilePath = process.argv[2];
  processLinks(jsonFilePath);
  console.log();
}

console.log('');

// task 4
import os from 'os';
import si from 'systeminformation';

interface SystemInfo {
  'Operating System': string;
  'Architecture': string;
  'Current User': string;
  'CPU Cores': string[];
  'CPU Temperature': string;
  'Graphic Controllers': string[];
  'Memory': {
    'Total': string;
    'Used': string;
    'Free': string;
  };
  'Battery': {
    'Charging': boolean;
    'Percent': number;
    'Remaining Time': number;
  };
}

function printSystemInfo() {
  const systemInfo: SystemInfo = {
    'Operating System': os.type(),
    'Architecture': os.arch(),
    'Current User': os.userInfo().username,
    'CPU Cores': os.cpus().map(cpu => cpu.model),
    'CPU Temperature': '',
    'Graphic Controllers': [],
    'Memory': {
      'Total': '0',
      'Used': '0',
      'Free': '0'
    },
    'Battery': {
      'Charging': false,
      'Percent': 0,
      'Remaining Time': 0
    }
  };

  si.cpuTemperature()
    .then(data => {
        if (data.main !== null) {
            systemInfo['CPU Temperature'] = data.main.toString();
          }
          return si.graphics();
    })
    .then(data => {
      systemInfo['Graphic Controllers'] = data.controllers.map(controller => `${controller.vendor}: ${controller.model}`);
      return si.mem();
    })
    .then(data => {
      systemInfo['Memory'].Total = (data.total / 1024 / 1024 / 1024).toFixed(2).toString();
      systemInfo['Memory'].Used = (data.used / 1024 / 1024 / 1024).toFixed(2).toString();
      systemInfo['Memory'].Free = (data.free / 1024 / 1024 / 1024).toFixed(2).toString();
      return si.battery();
    })
    .then(data => {
      systemInfo['Battery'].Charging = data.isCharging;
      systemInfo['Battery'].Percent = data.percent;
      systemInfo['Battery']['Remaining Time'] = data.timeRemaining;
      console.log(systemInfo);
    })
    .catch(error => {
      console.error('Failed to retrieve system information:');
      console.error(error);
    });
}

// Перевірка наявності параметра командного рядка
if (process.argv.length < 3) {
  console.log('Task 4');
  console.log('Вкажіть частоту в секундах як параметр командного рядка.');
} else {
  const frequency = parseInt(process.argv[2]);
  setInterval(printSystemInfo, frequency * 1000);
}

console.log('');

// task 5 
type EventHandler = () => void;

class MyEventEmitter {
    private events: { [eventName: string]: EventHandler[] };
  
    constructor() {
      this.events = {};
    }
  
    public registerHandler(eventName: string, handler: EventHandler): void {
      if (!this.events[eventName]) {
        this.events[eventName] = [];
      }
  
      this.events[eventName].push(handler);
    }
  
    public emitEvent(eventName: string): void {
      const handlers = this.events[eventName];
  
      if (handlers) {
        handlers.forEach((handler) => handler());
      }
    }
  }
  
  // Приклад використання
  console.log('Task 5');
  const emitter = new MyEventEmitter();
  emitter.registerHandler('userUpdated', () => console.log('Обліковий запис користувача оновлено'));
  emitter.emitEvent('userUpdated'); // Виведе "Обліковий запис користувача оновлено"
  