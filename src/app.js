import {INITIAL,readTasks,filterTasks,addTask,statusCounts} from './model.js';
const $=id=>document.getElementById(id);const KEY='trilayer-tasks';
let tasks=readTasks(localStorage.getItem(KEY));
const statusNames={planned:'В планах',progress:'В работе',done:'Готово'};
function taskCard(task){const item=document.createElement('article');item.className='card';const tag=document.createElement('span');tag.className='status-tag';tag.textContent=statusNames[task.status];const h=document.createElement('h3');h.textContent=task.title;const p=document.createElement('p');p.textContent=task.description;item.append(tag,h,p);return item;}
function render(){const visible=filterTasks(tasks,$('search').value,$('status').value);$('cards').replaceChildren(...visible.map(taskCard));$('count').textContent=`Показано ${visible.length} из ${tasks.length}`;$('empty').hidden=visible.length!==0;}
$('search').addEventListener('input',render);$('status').addEventListener('change',render);
$('theme').addEventListener('click',()=>{const dark=document.documentElement.dataset.theme!=='dark';document.documentElement.dataset.theme=dark?'dark':'light';$('theme').setAttribute('aria-pressed',String(dark));$('theme').textContent=dark?'Светлая тема':'Тёмная тема';});
$('task-form').addEventListener('submit',event=>{event.preventDefault();const data=Object.fromEntries(new FormData(event.currentTarget).entries());const result=addTask(tasks,data);if(!result.ok){$('message').textContent=result.error;return;}tasks=result.tasks;try{localStorage.setItem(KEY,JSON.stringify(tasks));$('message').textContent='Задача сохранена';}catch{$('message').textContent='Задача добавлена, но не сохранена на устройстве';}event.currentTarget.reset();$('search').value='';$('status').value='all';render();});
render();
