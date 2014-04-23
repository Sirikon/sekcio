HTMLElement.prototype.Sekcio = null;

function Sekcio(element){
	var anchor = this;
	this._slides = [];
	this._actualSlide = 0;
	this._running = 0;
	$(element).find('*[sk-slide]').each(function(){
		anchor._slides.push($(this));
	});
	this._slides[0].addClass('visible');

	this.go = function(){
		var movement = 1
		if(arguments.length != 0){
			if( (this._actualSlide + arguments[0]) < 0 || (this._actualSlide + arguments[0]) > this._slides.length-1 || arguments[0] == 0 ){
				//console.error("Fuera de rango");
				return;
			}else{
				movement = arguments[0];
			}
		}
		if(!this._running){
			this._running = true;
			if(movement > 0){
				this._slides[this._actualSlide].addClass('visible hideUp');
				this._slides[this._actualSlide+movement].addClass('visible showUp');
			}else if(movement < 0){
				this._slides[this._actualSlide].addClass('visible hideDown');
				this._slides[this._actualSlide+movement].addClass('visible showDown');
			}
			this._actualSlide = this._actualSlide+movement;
		}
	}

	this.goTo = function(n){
		this.go(n-this._actualSlide);
	}

	if(Array.isArray(element)){
		element = element.get(0);
	}
	element.Sekcio = this;
}

var mouseWheelHandler = function(e){
	e.preventDefault();
	if(e.originalEvent){
		var evt = e.originalEvent;
	}else{
		var evt = e;
	}
	var compareValue = evt.deltaY || -evt.wheelDeltaY;
	if(compareValue > 0){
		this.Sekcio.go(1);
	}else if(compareValue < 0){
		this.Sekcio.go(-1);
	}
}

var animationEndHandler = function(){
	var e = $(this);
	if(e.hasClass('showUp') || e.hasClass('showDown')){
		e
			.removeClass('showUp')
			.removeClass('showDown');
	}else{
		e.attr('class','');
	}
	setTimeout(function(){
		e.parent().get(0).Sekcio._running = false;
	},300);
}

var findSekcio = function(e){
	var actualElement = e;
	var found = false;
	while(!found){
		if(actualElement.attr('sk-sekcio') == ''){
			found = true;
		}else{
			actualElement = actualElement.parent();
		}
	}
	return actualElement;
}

$(document).ready(function(){

	$('*[sk-sekcio]').each(function(){
		var nsk = new Sekcio(this);
	});

	$(document).on('mousewheel', "*[sk-sekcio]", mouseWheelHandler);
	$('*[sk-sekcio]').each(function(){
		this.addEventListener("mousewheel", mouseWheelHandler, false);
	});
	$(document).on('webkitAnimationEnd', '*[sk-slide]', animationEndHandler);
	$(document).on('animationend', '*[sk-slide]', animationEndHandler);

	$(document).on('click','*[sk-goto]', function(){
		var e = findSekcio($(this)).get(0);
		e.Sekcio.goTo(parseInt($(this).attr('sk-goto')));
	});

});