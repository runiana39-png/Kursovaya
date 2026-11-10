import test from 'node:test';import assert from 'node:assert/strict';
import {STATUSES,INITIAL,normalize,validateTask,filterTasks,nextId,addTask,readTasks,statusCounts} from '../src/model.js';
const valid={title:'Новая задача',description:'Описание новой задачи',status:'planned'};
const tests=[
['01 статусы',()=>assert.equal(STATUSES.length,3)],['02 исходные данные',()=>assert.equal(INITIAL.length,6)],
['03 регистр',()=>assert.equal(normalize('  ПРИВЕТ '),'привет')],['04 null',()=>assert.equal(normalize(null),'')],
['05 верный ввод',()=>assert.equal(validateTask(valid).ok,true)],['06 нет объекта',()=>assert.equal(validateTask(null).ok,false)],
['07 короткое имя',()=>assert.equal(validateTask({...valid,title:'а'}).ok,false)],['08 длинное имя',()=>assert.equal(validateTask({...valid,title:'а'.repeat(71)}).ok,false)],
['09 короткое описание',()=>assert.equal(validateTask({...valid,description:'кор'}).ok,false)],['10 длинное описание',()=>assert.equal(validateTask({...valid,description:'а'.repeat(241)}).ok,false)],
['11 неверный статус',()=>assert.equal(validateTask({...valid,status:'bad'}).ok,false)],['12 обрезка пробелов',()=>assert.equal(validateTask({...valid,title:'  Новая '}).task.title,'Новая')],
['13 все карточки',()=>assert.equal(filterTasks(INITIAL).length,6)],['14 done',()=>assert.equal(filterTasks(INITIAL,'','done').length,2)],
['15 planned',()=>assert.equal(filterTasks(INITIAL,'','planned').length,2)],['16 progress',()=>assert.equal(filterTasks(INITIAL,'','progress').length,2)],
['17 поиск html',()=>assert.equal(filterTasks(INITIAL,'HTML').length,1)],['18 поиск описания',()=>assert.equal(filterTasks(INITIAL,'валидация').length,1)],
['19 нечувствительность к регистру',()=>assert.equal(filterTasks(INITIAL,'css').length,1)],['20 неверный фильтр',()=>assert.throws(()=>filterTasks(INITIAL,'','bad'),RangeError)],
['21 пустой поиск',()=>assert.equal(filterTasks(INITIAL,'неттакого').length,0)],['22 комбинация',()=>assert.equal(filterTasks(INITIAL,'код','planned').length,0)],
['23 следующий id',()=>assert.equal(nextId(INITIAL),7)],['24 пустой id',()=>assert.equal(nextId([]),1)],
['25 добавление',()=>assert.equal(addTask(INITIAL,valid).tasks.length,7)],['26 неизменность исходного',()=>{addTask(INITIAL,valid);assert.equal(INITIAL.length,6)}],
['27 отказ добавления',()=>assert.equal(addTask(INITIAL,{...valid,status:'bad'}).ok,false)],['28 id добавленного',()=>assert.equal(addTask(INITIAL,valid).tasks.at(-1).id,7)],
['29 пустое хранилище',()=>assert.equal(readTasks('').length,6)],['30 ошибочный json',()=>assert.equal(readTasks('{').length,6)],
['31 иной тип json',()=>assert.equal(readTasks('{}').length,6)],['32 сохранённые задачи',()=>assert.equal(readTasks(JSON.stringify([{id:10,...valid}])).length,1)],
['33 фильтрация испорченных',()=>assert.equal(readTasks(JSON.stringify([{id:3,...valid},{id:-5,...valid}])).length,1)],
['34 статистика',()=>assert.deepEqual(statusCounts(INITIAL),{planned:2,progress:2,done:2})],['35 пустая статистика',()=>assert.deepEqual(statusCounts([]),{planned:0,progress:0,done:0})]
];
for(const [name,fn] of tests)test(name,fn);
