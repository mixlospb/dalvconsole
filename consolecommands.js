"use strict";
var consolecommands = {

	// свойства с именами начинающимися с _ недоступны через консоль (считай приватные)

	_private : {
		
		main: function (){
			_console.cl('------------------------------');
		},
		
		help: function (){
			_console.cl('------------------------------');
		}
		
	},
	
	help : {
		main: function (){
			_console.cl('HELP - список доступных комманд');
			_console.cl('&nbsp;');
			$(_console.funcs).each(function(){
				_console.cl('> <syntax>' + this + '</syntax>');
			});
			_console.cl('&nbsp;');
			_console.cl('Для более подробной информации наберите имя_команды /?');
			_console.cl('------------------------------');
		},
		help: function (){
			_console.cl('HELP - вывод справки о консоли');
			_console.cl('------------------------------');
		}
	},

	hist : {
		main: function (){
			$(_console.hist).each(function(i, e){
				_console.cl(e);
			});
			_console.cl('------------------------------');
		},
		help: function (){
			_console.cl('HIST HELP - вывод истории действий');
			_console.cl('------------------------------');
		}
	},

	clear : {
		main: function (){
			_console._log.empty();
			_console.motd();
		},
		help: function (){
			_console.cl('CLEAR HELP');
			_console.cl('Очистка консоли');
			_console.cl('------------------------------');
		}
	},
	
	
}
