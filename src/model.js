/** Pure operations separated from DOM, useful for independent testing. */
export const STATUSES=Object.freeze(['planned','progress','done']);
export const INITIAL=Object.freeze([
{id:1,title:'Подготовить структуру HTML',description:'Семантические блоки страницы',status:'done'},
{id:2,title:'Оформить карточки CSS',description:'Сетка с адаптивной компоновкой',status:'progress'},
{id:3,title:'Добавить обработчики JavaScript',description:'Поиск и фильтрация элементов',status:'planned'},
{id:4,title:'Проверить ввод',description:'Валидация данных пользователя',status:'planned'},
{id:5,title:'Проверить мобильный экран',description:'Медиазапросы и размеры карточек',status:'progress'},
{id:6,title:'Составить тесты',description:'Проверка функций отдельного модуля',status:'done'}
]);
export const normalize = value => String(value ?? '').trim().toLocaleLowerCase('ru');
export function validateTask(input){
 if(!input||typeof input!=='object')return {ok:false,error:'Нет данных'};
 const title=String(input.title??'').trim();const description=String(input.description??'').trim();
 if(title.length<3||title.length>70)return {ok:false,error:'Название: 3–70 символов'};
 if(description.length<8||description.length>240)return {ok:false,error:'Описание: 8–240 символов'};
 if(!STATUSES.includes(input.status))return {ok:false,error:'Недопустимый статус'};
 return {ok:true,task:{title,description,status:input.status}};
}
export function filterTasks(tasks,query='',status='all'){
 if(status!=='all'&&!STATUSES.includes(status))throw new RangeError('Недопустимый фильтр');
 const term=normalize(query);
 return tasks.filter(t=>(status==='all'||t.status===status)&&normalize(t.title+' '+t.description).includes(term));
}
export function nextId(tasks){return Math.max(0,...tasks.map(t=>Number(t.id)||0))+1;}
export function addTask(tasks,input){const result=validateTask(input);if(!result.ok)return result;return {ok:true,tasks:[...tasks,{id:nextId(tasks),...result.task}]};}
export function readTasks(raw){if(!raw)return [...INITIAL];try{const arr=JSON.parse(raw);if(!Array.isArray(arr))return [...INITIAL];const result=arr.filter(x=>Number.isInteger(x.id)&&x.id>0&&validateTask(x).ok).map(x=>({id:x.id,...validateTask(x).task}));return result.length?result:[...INITIAL];}catch{return [...INITIAL];}}
export function statusCounts(tasks){return Object.fromEntries(STATUSES.map(s=>[s,tasks.filter(t=>t.status===s).length]));}
