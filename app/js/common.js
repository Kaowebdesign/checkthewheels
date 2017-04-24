$(document).ready(function($) {
	var select = $('.main__selecteds'),
		items = select.find('.selItem'),
		img=select.find('.main__image');

	select.click(function(){
		$(this).find('.main__select').toggleClass('main__select_window');	
		img.toggleClass('main__image_up');	
	});

	items.click(function (event){
		var text = this.innerHTML;
		$(this).closest('.main__selecteds').find('input').val(text);
	});
});