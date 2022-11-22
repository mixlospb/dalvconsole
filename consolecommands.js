"use strict";
var consolecommands = {

	// свойства с именами начинающимися с _ недоступны через консоль (считай приватные)

	_private : {
		
		main: function (){
			cl('------------------------------');
		},
		
		help: function (){
			cl('------------------------------');
		}
		
	},
	
	help : {
		main: function (){
			cl('HELP - список доступных комманд');
			cl('&nbsp;');
			$(_console.funcs).each(function(){
				cl('> <syntax>' + this + '</syntax>');
			});
			cl('&nbsp;');
			cl('Для более подробной информации наберите имя_команды /?');
			cl('------------------------------');
		},
		help: function (){
			cl('HELP - вывод справки о консоли');
			cl('------------------------------');
		}
	},

	hist : {
		main: function (){
			$(_console.hist).each(function(i, e){
				cl(e);
			});
			cl('------------------------------');
		},
		help: function (){
			cl('HIST HELP - вывод истории действий');
			cl('------------------------------');
		}
	},

	clear : {
		main: function (){
			_console._log.empty();
			_console.motd();
		},
		help: function (){
			cl('CLEAR HELP');
			cl('Очистка консоли');
			cl('------------------------------');
		}
	},
	
	
}
