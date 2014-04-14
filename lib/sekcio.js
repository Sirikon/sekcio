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
	this.down = function(){
		if(this._actualSlide != this._slides.length-1 && !this._running){
			this._running = true;
			this._slides[this._actualSlide].addClass('visible hideUp');
			this._slides[this._actualSlide+1].addClass('visible showUp');
			this._actualSlide++;
		}
	}
	this.up = function(){
		if(this._actualSlide != 0 && !this._running){
			this._running = true;
			this._slides[this._actualSlide].addClass('visible hideDown');
			this._slides[this._actualSlide-1].addClass('visible showDown');
			this._actualSlide--;
		}
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
	console.log(compareValue);
	if(compareValue > 0){
		this.Sekcio.down();
	}else if(compareValue < 0){
		this.Sekcio.up();
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

});