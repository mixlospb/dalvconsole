Юзер-консоль для браузера

Браузеры: все что на хроме, FF, Edge, Safari

### Использование:

### 1) подключаем скрипты:
```html
<script src="jquery-3.6.1.min.js"></script>
<script src="console.js"></script>
<script src="consolecommands.js"></script>
```
### 2) инициализируем консоль по событию jQuery.ready:
```html
<script>
	$(()=>{
		_console.init();
	});
</script>
```
Живой пример в test.html

### 3) использование:

Для открытия консоли используем клавишу `
Код клавиши открытия/закрытия консоли устанавливается в _console.openKeyCode, по умолчанию 192.

Команды по умолчанию:
help
clear
hist

### 4) добавление своих комманд
```js
_console.addCommands(objectWithCommands);

Добавляем 1 команду

_console.addCommands({
	mycommand : {
		main: function (args, silent, data){
			// args - аргументы переданные команде
			// silent - если установлено в true то то команда будет выполнена без записи в историю
			// data - передача прочих данных
			
			cl('Команда mycommand выполнена');
		},
		
		help: function (){
			cl('MYCOMMAND HELP');
			cl('Текст описания вашей команды');
		}
	}
});
```

Добавляем несколько команд описаных отдельно в переменной
```js
var myComands = {
	
	mycommand1 : {
		main: function (){
			cl('Команда mycommand1 выполнена');
		},
		
		help: function (){
			cl('MYCOMMAND1 HELP');
			cl('Текст описания команды mycommand1');
		}
	},
	
	mycommand2 : {
		main: function (){
			cl('Команда mycommand2 выполнена');
		},
		
		help: function (){
			cl('MYCOMMAND2 HELP');
			cl('Текст описания команды mycommand2');
		}
	},
	
	mycommand3 : {
		main: function (){
			cl('Команда mycommand3 выполнена');
		},
		
		help: function (){
			cl('MYCOMMAND3 HELP');
			cl('Текст описания команды mycommand3');
		}
	},
	
}

_console.addCommands(myComands);
```

Контакты:
https://capitalcity.combats.com/inf.pl?dalv