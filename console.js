"use strict";
var _console = {
	_started : false,
	oldonkey : null,
	
	_bg : $("<div class='dalv_console_bg'></div>"),
	_div : $("<div class='dalv_console_div'></div>"),
	_log : null,
	_inp : $("<input id='dalv_console_input'>"),
	_height:0,
	
	funcs: [],
	hist: null,
	maxHistLength: 50,
	
	isOpened : function(){
		return $('.dalv_console_bg:visible').length > 0 ? true : false;
	},
	
	iterifyArr : function(arr){
		var cur = 0;
		arr.next = (function () {
			if (cur >= (this.length-1))
				return false
			else
				return this[++cur];
		});
		
		arr.prev = (function () {
			if (cur <= 0)
				return false
			else
				return this[--cur];
		});
		
		arr.end = (function () {
			cur = this.length;
		});
		
		arr.start = (function () {
			cur = 1;
		});
		
		return arr;
	},
	
	getRoot : function(arr){
		var root = '';
		var check = '';
		function hasRoot(word) {
			return word.indexOf(check) == 0;
		}
		
		var max = 9999;
		arr.forEach(function(e, i){
			if (e.length < max)
				max = e.length;
		});
		
		for (var i=1; i <= max; i++){
			check = arr[0].substr(0, i);
			var res = arr.every(hasRoot);
			if (!res)
				break;
			root = check;
		}
		
		return root;
	},
	
	st : function(){
		var txt = '';
		if(window.getSelection)
			txt = window.getSelection().toString();
		else if(document.getSelection)
			txt = document.getSelection();                
		else if(document.selection)
			txt = document.selection.createRange().text;

		return txt;
	},
	
	switchToENG : function(str){
		var rus = [
			"й","ц","у","к","е","н","г","ш","щ","з","х","ъ",
			"ф","ы","в","а","п","р","о","л","д","ж","э",
			"я","ч","с","м","и","т","ь","б","ю"
		];

		var eng = [
			"q","w","e","r","t","y","u","i","o","p","\\[","\\]",
			"a","s","d","f","g","h","j","k","l",";","'",
			"z","x","c","v","b","n","m",",","\\."
		];
		
		var result = '';
		for (var i=0; i < str.length; i++){
			var index = rus.indexOf(str[i].toLowerCase());
			if (index != -1)
				result += (str[i] == str[i].toLowerCase() ? eng[index] : eng[index].toUpperCase())
			else
				result += str[i];
		}
		return result;
	},

	motd : function(){
		cl('<c_lightgreen>Dalv Console</c_lightgreen>');
		cl('<c_lightgreen>Для справки введите HELP</c_lightgreen>');
		cl('<c_lightgreen>Автозавершение комманд кнопкой TAB</c_lightgreen>');
		cl('&nbsp;');
	},
	
	findCommands : function(txt){
		var finded = [];
		$(_console.funcs).each(function(){
			if (this.toLowerCase().indexOf(txt) == 0)
				finded.push(this.toString());
		});
		return finded;
	},
	
	makeHeight: function(){
		this._height = Math.round(window.innerHeight / 2 * 0.9);
		
		this._div.height(this._height)
		this._logcontainer.scrollTop(1000000000);
	},
	
	strip_tags : function(str){
		return $('<div>' + str.replace(/<script>.*<\/script>/gi, "") + '</div>').text();
	},
	
	init : function(){
		if (this._started == true)
			return;
		if ($('body').length == 0)
			return;
		
		top.cl = function(text){
			if (_console && _console._log != null){
				if (typeof text == "string")
					_console._log.prepend("<div style='padding-left:9px;'>" + text + "</div>")
				else
					_console._log.prepend("<div style='padding-left:9px;'>" + JSON.stringify(text) + "</div>");
				_console._logcontainer.scrollTop(1000000000);
			} else
				try {console.log(text)} catch(e){console.log(e)}
		};
		
		_console.initHist();
		
		this._logcontainer = $("<div class='dalv_console_log_container'></div>");
		this._log = $("<div class='dalv_console_log'></div>");
		this._logcontainer.append(this._log);
		this._close = $("<div class='dalv_console_closebutton'>[ Закрыть консоль ]</div>");
		this._div
			.height(this._height)
			.css('width', 'calc(100% + 20px)')
			.css('left','0')
			.css('top', -this._height-2)
			.append(this._close)
			.append(this._logcontainer)
			.append(this._inp)
			.appendTo(this._bg);
		this._bg.appendTo($('body'));
		
		this._div.on('mouseup', function(e){
			var sl = _console.st();
			if (sl == '')
				_console._inp.focus()
			else
				e.stopPropagation();
		});
		
		
		//*****************
		this._bg.on('mouseup', function(e){
			_console._inp.focus();
		});
		
		//*****************
		this._close.on('click', function(e){
			_console.close();
		});
		
		$(document.body).keydown(function(e) {
			if (e.keyCode == 192){
				e.preventDefault();
				e.stopImmediatePropagation();
				_console.toggle();
			} 
		});
		
		//*****************
		this._inp.keydown(function(e) {

			if (e.key == "Enter"){
				e.preventDefault();
				e.stopImmediatePropagation();
				//var command = _console._inp.val().toLowerCase();
				var command = _console._inp.val();
				while (command.indexOf('/') == 0)
					command = command.substr(1);
				if (command == ''){
					return;
				}
				_console.run(command);
				// =========================
			} else if (e.keyCode == 38) { // up
				e.preventDefault();
				var p = _console.hist.prev();
				if (p != false)
					_console._inp.val(p)
				else {
					_console.hist.start();
				}
			} else if (e.keyCode == 40) { // down
				e.preventDefault();
				var p = _console.hist.next();
				if (p != false)
					_console._inp.val(p)
				else {
					_console._inp.val('');
					_console.hist.end();
				}
			} else if (e.keyCode == 9) { // TAB
				e.preventDefault();
				var val = _console._inp.val().toLowerCase();
				if (val == '')
					return;
				var finded = _console.findCommands(val);
				if (finded.length == 0)
					finded = _console.findCommands(_console.switchToENG(val));
				
				if (finded.length > 0){
					cl('<c_lightgreen>Найдены соответствия:</c_lightgreen>');
					$(finded).each(function(){
						cl(this);
					});
					if (finded.length == 1)
						_console._inp.val(finded[0] + ' ')
					else
						_console._inp.val(_console.getRoot(finded));
					cl('&nbsp;');
					_console._log.stop().scrollTop(1000000);
				}
			}
			
		});
		
		$(window).resize(function(){
			_console.makeHeight();
		});
		
		this.reloadCommands();
		this.makeHeight();
		this._started = true;
		
		this.motd();
	},
	
	initHist : function(){
		if (localStorage.console_hist && $.isArray(localStorage.console_hist))
			_console.hist = _console.iterifyArr(localStorage.console_hist);
		else
			_console.hist = _console.iterifyArr(['']);
	},
	
	reloadCommands : function(){
		this.funcs = [];
		if (consolecommands)
			for (var f in consolecommands){
				if (f[0] != '_' && f != 'god')
					this.funcs.push(f);
			}
		this.funcs.sort();
	},
	
	toggle : function(force){
		if (force == undefined || force == null)
			force = false;
		if (!_console._started && !force)
			return;
		if (this._div.css('top').indexOf('-') != -1)
			this.open()
		else
			this.close();
	},
	
	open : function(force){

		if (force == undefined || force == null)
			force = false;
		if (!_console._started && !force)
			return;
		if (this._div.css('top').indexOf('-') != -1){
			this._bg.show();
			this._div.stop().animate({'top':0}, 100, 'linear', function (){
				_console._inp.removeAttr('disabled');
				_console._inp.focus();
				_console._inp.val('');
			});
		}
	},
	
	close : function(force){

		if (force == undefined || force == null)
			force = false;
		if (!_console._started && !force)
			return;
		if (this._div.css('top').indexOf('-') == -1){
			this._div.stop().animate({'top':-this._height-2}, 100, 'linear', function (){
				_console._inp.attr('disabled','disabled');
				_console._inp.val('');
				_console._inp.blur();
				_console._bg.hide();
			});
		}
	},
	
	parseArgs : function(line){
		var args = [];
		var i = 1;
		while (line != ""){
			line = line.replace(/\s{2,}/g, ' ');
			line = line.trim();
			var spos = line.indexOf(" ");
			var kpos = line.indexOf('"');
			
			if (spos != -1 && (spos < kpos || kpos == -1)){
				var sub = line.substr(0, spos);
				line = line.substr(spos);
				sub = sub.replace(/\s{2,}/g, ' ');
				sub = sub.trim();
				if (sub != "" && sub != " "){
					sub = sub.replace(/'/g, '"');
					args.push(sub);
				}
			} else if (spos == -1 && kpos == -1){
				sub = line;
				if (sub != "" && sub != " "){
					sub = sub.replace(/'/g, '"');
					args.push(sub);
				}
				line = "";
			}
			
			kpos = line.indexOf('"');
			if (kpos == 0){
				line = line.substr(1);
				kpos = line.indexOf('"');
				var sub;
				if (kpos != -1){
					sub = line.substr(0, kpos)
					line = line.substr(kpos+1);
				} else {
					sub = line.substr(0);
					line = "";
				}
				sub = sub.replace(/\s{2,}/g, ' ');
				sub = sub.trim();
				if (sub != "" && sub != " "){
					sub = sub.replace(/'/g, '"');
					args.push(sub);
				}
			} else if (kpos > 0){
				var sub = line.substr(0, kpos);
				line = line.substr(kpos);
				sub = sub.replace(/\s{2,}/g, ' ');
				sub = sub.trim();
				if (sub != "" && sub != " "){
					sub = sub.replace(/'/g, '"');
					args.push(sub);
				}
			}
			
			i++;
			if (i > 50){
				cl("parseArgs break: " + line ,true);
				break;
			}
		}
		
		args[0] = args[0].toLowerCase();
		
		return args;
	},
	
	pushToHist : function(command){
		if (command == _console.hist[_console.hist.length-1])
			return;
		_console.hist.push(command);
		if (_console.hist.length > _console.maxHistLength){
			var delta = _console.hist.length - _console.maxHistLength;
			_console.hist.splice(0, delta);
			_console.hist[0] = "";
		}
		localStorage.setItem("console_hist", _console.hist);
	},
	
	run : function(command, silent, e){
		//cl(command, true)
		if (!this._started)
			return;
		while (command.indexOf('/') == 0)
			command = command.substr(1);
		if (command == '')
			return;
		command = this.strip_tags(command);
		if (command.indexOf(' ') == -1)
			command += ' ';
		
		
		var args = _console.parseArgs(command);
		var cmd = args[0];
		args.shift();
		//cl(args, true);
		if (!silent && _console.funcs.indexOf(cmd) != -1 && !consolecommands[cmd].onlysilent)
			_console.pushToHist(command);
		if (!silent)
			cl('<c_darkgreen>/' + command + '</c_darkgreen>');
		
		if (!silent){
			_console._inp.val('').focus();
			_console._log.stop().scrollTop(1000000);
		}
		// =========================
		_console.hist.end();
		if (_console.funcs.indexOf(cmd) == -1 && cmd !== 'god') {
			cl('Неизвестная команда "' + cmd + '"');
			}
		else if (args.join(' ') == '/?'){
			consolecommands[cmd].help();
		} else {
			consolecommands[cmd].main(args, silent, e);
		}
	}

};

