$(document).ready(function() {
	// ************ map tabs in popup
	// карта
	$('.popup-map #map-tab1').click(function() {
		$('.block1, .block2, .block3').removeClass('active');
		$('.block1').addClass('active');
		
		map.invalidateSize();
	});
	$('.popup-map #map-tab2').click(function() {
		$('.block1, .block2, .block3').removeClass('active');
		$('.block2').addClass('active');
	});
	$('.popup-map #map-tab3').click(function() {
		$('.block1, .block2, .block3').removeClass('active');
		$('.block3').addClass('active');
	});
	
	$('.popup-map .submit').click(function() {
		var coordsToSend = [];
		
		if (map !== undefined) {
			for (var property in map._layers) {
				if (map._layers.hasOwnProperty(property)) {
					if (map._layers[property]._latlngs !== undefined) {
						for (var i = 0; i < map._layers[property]._latlngs.length; i++) {
							coordsToSend.push({lat: map._layers[property]._latlngs[i].lat, lon: map._layers[property]._latlngs[i].lng});
						}
					}
				}
			}
		}
		
		//////// send ajax or smthn
		console.log(coordsToSend);
		
		return false;
	});
	
	// районы
	$('.microdistrict ul li a').click(function() {
		if (!$(this).hasClass('active')) {
			$(this).addClass('active')
			
			var title = $(this).parents('.districts').children('span').text();
			var titleEl = $('.selectedDistrict h4:contains("' + title + '")');
			
			if (titleEl.length == 0) {
				$('.selectedDistrict').append('<div><h4>' + title + '</h4><ul></ul>');
				titleEl = $('.selectedDistrict h4:contains("' + title + '")');
			}
			
			titleEl.siblings('ul').append('<li><a href="#"><i class="icons-map-delete-district-2"></i></a>' + $(this).text() + '</li>');
		} else {
			$(this).removeClass('active')
			
			var thisTitle = $(this).text();
			$('.selectedDistrict ul li:contains("' + thisTitle + '")').remove();
			
			$('.selectedDistrict ul').each(function() {
				if ($(this).find('li').length == 0) {
					$(this).parent().remove();
				}
			});
		}
		return false;
	});
	
	// метро
	initStations();
	
	$('.metro-map div').click(function() {
		if (!$(this).hasClass('active')) {
			$(this).addClass('active');
			$('.block2-sidebar ul').append('<li>' + $(this).text() + '</li>');
			rebindStations();
		} else {
			$(this).removeClass('active');
			$('.block2-sidebar ul li:contains("' + $(this).text() + '")').remove();
		}
	});
	
	$('.radio-block label').eq(0).click(function() {
		$('.block2-sidebar ul').empty();
		$('.metro-map div').each(function() {
			if ($(this).data('center') == '1') {
				$(this).addClass('active');
				$('.block2-sidebar ul').append('<li>' + $(this).text() + '</li>');
			} else {
				$(this).removeClass('active');
				$('.block2-sidebar ul li:contains("' + $(this).text() + '")').remove();
			}
		});
		rebindStations();
	});
	$('.radio-block label').eq(1).click(function() {
		$('.block2-sidebar ul').empty();
		$('.metro-map div').each(function() {
			if ($(this).data('ring') == '1') {
				$(this).addClass('active');
				$('.block2-sidebar ul').append('<li>' + $(this).text() + '</li>');
			} else {
				$(this).removeClass('active');
				$('.block2-sidebar ul li:contains("' + $(this).text() + '")').remove();
			}
		});
		rebindStations();
	});
	
	function rebindStations() {
		$('.block2-sidebar ul li').click(function() {
			$(this).remove();
			$('.metro-map div:contains("' + $(this).text() + '")').removeClass('active');
		})
	}
	
	$('.draggable').draggable({
		containment: "parent"
	});
	
	// ******* map tabs END
	
	// главная - табы в слайдере
	$('.slider .button-slider').click(function() {
		$('.slider').addClass('animated bounceOutLeft').css('position','absolute');
		$('.slider2').addClass('animated bounceInRight').css('display','table');

		$('.slider2 .js-chosen').val($(this).text());
		$('.slider2 .js-chosen').trigger('chosen:updated');
		return false;
	});
	
	//
	$(".carousel").owlCarousel({
		loop:true,
		responsive:{
			320:{
				items:1
			},
			479:{
				items:2
			},
			768:{
				items:2
			},
			980:{
				items:4
			},
			1199:{
				items:6
			}
		}
	});
	
	// 1. Дизайн селекта
	$('.js-chosen').chosen({
		disable_search_threshold: 10
	});
	
	// 2.  При клике меняется направление сктрелочки вверх-вниз
	$('.js-sort a').click(function() {
		if ($(this).hasClass('active')) {
			$(this).toggleClass('up');
		} else {
			$('.js-sort a').removeClass('active up');
			$(this).addClass('active');
		}
		return false;
	});
	
	// 4. Сделать чтобы при клике на раздел - он становился активным
	$('.js-search a').click(function() {
		if ($(this).hasClass('active')) {
			$(this).removeClass('active');
			$('.offer_type').val('');
		} else {
			$('.js-search a').removeClass('active');
			$(this).addClass('active');
			$('.offer_type').val($(this).text());
		}
		
		doAjaxSearch();
		
		return false;
	});
	
	// 5. Сделать возможность выбора звездочек
	$('.js-stars li').click(function() {
		$('.js-stars li i').css('color', '#cdcfcf');
		var el = $(this).prevAll().add($(this));
		el.find('i').css('color', '#f5984b');
		$('.js-stars-count').text(el.length + '/10');
		
		doAjaxSearch();
	});
	
	// 6. Сделать возможность листание слайдеров
	$('.js-slider-range').each(function() {
		var el = $(this);
		var inp = el.next('.slider-param');
		el.slider({
			slide: function(ev, ui) {
				processSlider(ui, true, inp, el);
			},
			change: function(e, ui) {
				processSlider(ui, true, inp, el);
			}
		});
	});
	
	// 7. Сделать выпадающий блок по клику
	$('.js-show-popup1').click(function() {
		$('.popup1').toggle();
		return false;
	});

	// 8. 
	$('.js-show-map-popup').click(function() {
		$('.popup-map').bPopup({
			easing: 'easeOutBack',
			speed:'50',
			follow: [false, false],
			transition: 'slideDown',
			onClose: function() {
				// todo clear validation
				$('.js-validate-login input').removeClass('invalid').removeAttr('style');
			}
		});
		return false;
	});
	
	// fake ajax
	fakeAjaxResult = $('.search_result-item').eq(0).clone();
	fakeAjaxPagination = $('.result_body-paginator').clone();
	fakeAjaxInfocardItem = $('.infocard-item').clone();
	fakeAjaxInfocardInfo = $('.infocard-info').clone();	
	
	$('.js-ajax-form input, .js-ajax-form select').change(function() {
		doAjaxSearch();
	});
	
	// 
	bindInfocard();	

	// ЭТО НУЖНО БУДЕТ ОТРЕФАКТОРИТЬ
	/*
	$('.infocard-header a').click(function() {

		var getNumber = $(this).find('span').text();
		var transformNumber = parseInt(getNumber);
		var newNumber = transformNumber - 1;
		$(this).find('span').empty().append(newNumber);

		var getNumber1 = $(this).siblings('a').find('span').text();
		var transformNumber1 = parseInt(getNumber1);
		var newNumber1 = transformNumber1 + 1;
		$(this).siblings('a').find('span').empty().append(newNumber1);

		doAjaxSearch();

		if(newNumber === 0 || newNumber1 === 0) {
			$(this).hide();
			return false;
		}

		if ($(this).siblings('a').is(":hidden")) {
			$(this).siblings('a').show();
		}

		return false;
	});
	*/
	
	// валидация регистрации
	$('.js-validate').feelform({
		notificationType: 'message, class, border',
		errorMessages: {
			required: function() {
				return "Обязательное поле";
			},
			minLength: function(val) {
				return "Минимум " + val + " символов";
			},
			email: function() {
				return "Неправильный email";
			},
			phone: function() {
				return "Неправильный телефон";
			}
		},
		borderProperty: '#FF0000 2px solid',
		gravity: 'bottom',
		errorClass: 'invalid'
	});
	
	// попап логина – ЭТО НУЖНО БУДЕТ ОТРЕФАКТОРИТЬ
	$('.js-login').click(function() {
		$('.popup-logIn').bPopup({
			easing: 'easeOutBack',
			speed:'50',
			follow: [false, false],
			transition: 'slideDown',
			onClose: function() {
				// todo clear validation
				$('.js-validate-login input').removeClass('invalid').removeAttr('style');
			}
		});
		return false;
	});

	// валидация login – ЭТО НУЖНО БУДЕТ ОТРЕФАКТОРИТЬ
	$('.js-validate-login').feelform({
		notificationType: 'message, border, class',
		errorMessages: {
			required: function() {
				return "Обязательное поле";
			},
			email: function() {
				return "Неправильный email";
			}
		},
		gravity: 'bottom',
		borderProperty: '#00a8d3 2px solid',
		errorClass: 'invalid'
	});

	// валидация house-sett 
	$('.js-validate-house-sett').feelform({
		notificationType: 'message, border, class',
		errorMessages: {
			required: function() {
				return "Обязательное поле";
			},
			number: function() {
				return "Только цифры";
			}
		},
		gravity: 'bottom',
		borderProperty: '#FF0000 1px solid',
		errorClass: 'invalid'
	});
	
	// в попапе popup-write_letter - форму проверить на заполненость
	$('.js-validate-no-message').feelform();
	
	// календарь
	var currentdate = new Date();
	$('.js-book-table td').eq(0).text(currentdate.getHours() + ":" + currentdate.getMinutes());
	$('.js-book-table td').click(function() {
		if (!$(this).hasClass('inactive')) {
			var i = $(this).index();
			$('.js-book-table td.active').removeClass('active');
			$(this).addClass('active');
			
			$('.js-days-wrapper span').removeClass('active');
			$('.js-days-wrapper span').eq(i).addClass('active');
			
			var dayStr = '';
			if (i == 0) {
				dayStr = 'сегодня';
			} else if (i == 1) {
				dayStr = 'завтра';
			} else if (i == 2) {
				dayStr = 'послезавтра';
			} else {
				dayStr = 'через день';
			}
			
			$('.js-book-button span').text($(this).text() + ', ' + dayStr);
		}
	});
	var step = 0;
	var maxSteps = $('.js-book-table tr').length - 4;
	$('.timelist-up').click(function() {
		if (step > 0) {
			step--;
			var h = $('.js-book-table tr').eq(step).outerHeight();
			$('.js-book-table').css('transform', 'translate3d(0, ' + (-1 * step * h) + 'px, 0)');
		}
		return false;
	});
	$('.timelist-down').click(function() {
		if (step < maxSteps) {
			step++;
			var h = $('.js-book-table tr').eq(step).height();
			$('.js-book-table').css('transform', 'translate3d(0, ' + (-1 * step * h) + 'px, 0)');
		}
		return false;
	});
	
	// ******* настроить уведомления - попап
	$('.js-settings').click(function() {
		$('.popup-search_param').bPopup({
			easing: 'easeOutBack',
			speed:'50',
			transition: 'slideDown',
			amsl:0
		});
		return false;
	});
	$('.js-stars-popup li').click(function() {
		$('.js-stars-popup li i').css('color', '#cdcfcf');
		var el = $(this).prevAll().add($(this));
		el.find('i').css('color', '#f5984b');
		$('.js-stars-count-popup').text(el.length + '/10');
	});
	$('.js-slider-range-popup').each(function() {
		var el = $(this);
		var inp = el.next('.slider-param');
		el.slider({
			slide: function(ev, ui) {
				processSlider(ui, false, inp, el);
			},
			change: function(ev, ui) {
				processSlider(ui, false, inp, el);
			}		
		});
	});
	$('.js-double-slider-range').each(function() {
		var el = $(this);
		var inp = el.next('.slider-param');
		el.slider({
			range: true,
			min: 0,
			max: 2000,
			values: [0, 2000],
			slide: function(ev, ui) {
				inp.val(ui.value);
				$('.double-val1').text('от ' + ui.values[0]).append(' м<em>2</em>');
				$('.double-val2').text('до ' + ui.values[1]).append(' м<em>2</em>');
			}		
		});
		el.find('.ui-slider-handle').eq(0).append('<span class="double-val1">от 0 м<em>2</em></span>');
		el.find('.ui-slider-handle').eq(1).append('<span class="double-val2">до 2000 м<em>2</em></span>');
	});
	$('.js-change-slider-values input').click(function() {
		if ($(this).prop('checked')) {
			$('.js-double-slider-range').slider('option', 'values', [$(this).data('minval'), $(this).data('maxval')]);
			$('.double-val1').text('от ' + $(this).data('minval')).append(' м<em>2</em>');
			$('.double-val2').text('до ' + $(this).data('maxval')).append(' м<em>2</em>');
		}
	});
	
	$('#search-res1').click(function() {
		if ($(this).prop('checked')) {
			$('#search-res2, #search-res3, #search-res4').prop('checked', false);
		}
	});
	$('#search-res2, #search-res3, #search-res4').click(function() {
		if ($(this).prop('checked')) {
			$('#search-res1').prop('checked', false);
		}
	});
	// ****************
	
	// **** infocard big slider - в будущем внести в bindCarousels, когда будет приходить реальным ajax'ом
	var isBigBusy = false;
	var syncBig = $('.owl-big2');
	syncBig.owlCarousel({
		loop: true,
		items: 1,
		autoPlay: true,
		afterAction: function syncBig(el) {
			var current = this.currentItem;
			$('.gallery-2 .gallery-slider li').removeClass('active');
			$('.gallery-2 .gallery-slider li').eq(current).addClass('active');
		}
	});
	syncBig.data('owlCarousel').stop();
	
	$('.infocard-gallery .play').click(function() {
		$(this).toggleClass('active');
		if ($(this).hasClass('active')) {
			syncBig.data('owlCarousel').play();
		} else {
			syncBig.data('owlCarousel').stop();
		}
		return false;
	});	

	$('.gallery-2 .gallery-slider li a').click(function() {
		var i = $('.gallery-2 .gallery-slider li a').index($(this));
		syncBig.trigger("owl.goTo", i);
		
		$('.gallery-2 .gallery-slider li').removeClass('active');
		$(this).parent().addClass('active');
		
		return false;
	});
	$('.gallery-2 .nav-down').click(function() {
		var sl = $('.gallery-2 .gallery-slider');
		var slItem = $('.gallery-2 .gallery-slider li').eq(0);
		
		if (!isBigBusy && sl.offset().top + sl.height() > sl.parent().offset().top + sl.parent().height()) {
			isBigBusy = true;
			sl.animate({top: '-=' + (slItem.outerHeight() + 1) + 'px'}, 500, function() {
				isBigBusy = false;
			});
		}
		
		return false;
	});
	$('.gallery-2 .nav-up').click(function() {
		var sl = $('.gallery-2 .gallery-slider');
		var slItem = $('.gallery-2 .gallery-slider li').eq(0);
		
		if (!isBigBusy && sl.offset().top < sl.parent().offset().top) {
			isBigBusy = true;
			sl.animate({top: '+=' + (slItem.outerHeight() + 1) + 'px'}, 500, function() {
				isBigBusy = false;
			});
		}
		
		return false;
	});
	// **** infocard big slider END
});

function bindCarousels() {
	$('.result_item-slider').each(function() {
		var sync1 = $(this).find('.gallery-slider');
		var sync2 = $(this).find('.owl-inner2');
		
		// 1
		sync1.owlCarousel({
			loop: true,
			items: 1,
			afterAction: syncPosition,
			autoPlay: true
		});
		sync1.data('owlCarousel').stop();
		
		$(this).find('.play').click(function() {
			$(this).toggleClass('active');
			if ($(this).hasClass('active')) {
				sync1.data('owlCarousel').play();
			} else {
				sync1.data('owlCarousel').stop();
			}
			return false;
		});
		
		$(this).find('.nav-left').click(function() {
			sync1.trigger('owl.prev');
			return false;
		});
		$(this).find('.nav-right').click(function() {
			sync1.trigger('owl.next');
			return false;
		});
		
		function syncPosition(el) {
			var current = this.currentItem;
			sync2.find(".owl-item").removeClass("synced").eq(current).addClass("synced");
			sync2.find(".owl-item > div").removeClass('active');
			sync2.find(".owl-item").eq(current).children('div').addClass('active');
			if (sync2.data("owlCarousel") !== undefined) {
				center(current);
			}
		}
		function center(number) {
			var sync2visible = sync2.data("owlCarousel").owl.visibleItems;
			var num = number;
			var found = false;
			for (var i in sync2visible) {
				if (num === sync2visible[i]) {
					var found = true;
				}
			}

			if (found===false) {
				if (num > sync2visible[sync2visible.length-1]) {
					sync2.trigger("owl.goTo", num - sync2visible.length + 2);
				} else {
					if (num - 1 === -1) {
						num = 0;
					}
					sync2.trigger("owl.goTo", num);
				}
			} else if (num === sync2visible[sync2visible.length - 1]) {
				sync2.trigger("owl.goTo", sync2visible[1]);
			} else if (num === sync2visible[0]) {
				sync2.trigger("owl.goTo", num-1);
			}
		}
		
		// 2
		sync2.owlCarousel({
			loop: true,
			items: 3,
		    afterInit: function(el) {
				el.find(".owl-item").eq(0).addClass("synced");
				el.find(".owl-item > div").eq(0).addClass("active");
			}
		});
		
		sync2.on("click", ".owl-item", function(e) {
			var number = $(this).data("owlItem");
			sync1.trigger("owl.goTo", number);
			return false;
		});
	});
}

var fakeAjaxResult, fakeAjaxPagination, fakeAjaxInfocardItem, fakeAjaxInfocardInfo;
var th;
function doAjaxSearch() {
	$('.infocard-body').removeClass('animated bounceInLeft').hide();
	$('.js-result-wrapper-infocard').removeClass('animated bounceInLeft');
	
	$('.search_result-body').removeClass('animated bounceOutLeft').show();
	$('.js-result-wrapper').empty().append('<div class="ajax-preloader"><p>&nbsp;</p><p>&nbsp;</p></div>').show();
	
	clearTimeout(th);
	th = setTimeout(function() {
		var data = $('.js-ajax-form').serialize();
		console.log(data);
		
		// fake ajax
		$('.js-result-wrapper').empty().append(fakeAjaxResult.clone()).append(fakeAjaxResult.clone()).append(fakeAjaxPagination);
		$('.js-result-wrapper .search_result-item').addClass('animated fadeInUp');
		
		bindInfocard();
	}, 2000);
}

var isAjaxBusy = false;
function bindInfocard() {
	bindCarousels();
	
	$('.js-delete').unbind().click(function() {
		$(this).parents('.search_result-item').remove();
		return false;
	});
	
	// infocard binds
	$('.js-result-wrapper .search_result-item .result_item-header h3').unbind().click(function() {
		if (!isAjaxBusy) {
			isAjaxBusy = true;
			
			$('.search_result-body').addClass('animated fadeOutLeft');
			setTimeout(function() {
				$('.search_result-body').hide();
				$('.infocard-body').show();
				$('.infocard-body').addClass('animated fadeInRight');
				bindInfocard();
				
				isAjaxBusy = false;
			}, 800);
		}
		return false;
	});
	
	$('.infocard-header .prev').unbind().click(function() {
		// fake ajax
		var el = $(this);
		var prevNum = el.find('span').text();
		var nextNum = el.siblings('.next').find('span').text();
		
		if (!isAjaxBusy && prevNum > 0) {
			isAjaxBusy = true;
			
			$('.js-result-wrapper-infocard').removeClass('animated fadeInRight fadeInLeft').addClass('animated fadeOutRight');
			setTimeout(function() {
				$('.js-result-wrapper-infocard').empty();
				$('.infocard-header').after('<div class="ajax-preloader"><p>&nbsp;</p><p>&nbsp;</p></div>')
				$('.ajax-preloader').show();
				
				prevNum--;
				nextNum++;
				
				// тут должен быть реальный ajax
				// .......
				// 
				
				// результаты якобы приходят через 2с
				setTimeout(function() {
					$('.ajax-preloader').remove();
					$('.js-result-wrapper-infocard').empty().append(fakeAjaxInfocardItem.clone()).append(fakeAjaxInfocardInfo.clone());
					
					// это удалить, т.к. новые номера придут уже с сервера и их не надо менять скриптом
					$('.infocard-header .prev span').text(prevNum);
					$('.infocard-header .next span').text(nextNum);
					// -----------
					
					$('.js-result-wrapper-infocard').removeClass('animated fadeOutRight').addClass('animated fadeInLeft');
					bindInfocard();
					
					isAjaxBusy = false;
				}, 2000);
			}, 800);
		}
		return false;
	});
	
	$('.infocard-header .next').unbind().click(function() {
		// fake ajax
		var el = $(this);
		var nextNum = el.find('span').text();
		var prevNum = el.siblings('.prev').find('span').text();
		
		if (!isAjaxBusy && nextNum > 0) {
			isAjaxBusy = true;
			
			$('.js-result-wrapper-infocard').removeClass('animated fadeInLeft fadeInRight').addClass('animated fadeOutLeft');
			setTimeout(function() {
				$('.js-result-wrapper-infocard').empty()
				$('.infocard-header').after('<div class="ajax-preloader"><p>&nbsp;</p><p>&nbsp;</p></div>')
				$('.ajax-preloader').show();

				prevNum++;
				nextNum--;
				
				// тут должен быть реальный ajax
				// .......
				// 
				
				// результаты якобы приходят через 2с
				setTimeout(function() {
					$('.ajax-preloader').remove();
					$('.js-result-wrapper-infocard').empty().append(fakeAjaxInfocardItem.clone()).append(fakeAjaxInfocardInfo.clone());
					
					// это удалить, т.к. новые номера придут уже с сервера и их не надо менять скриптом
					$('.infocard-header .prev span').text(prevNum);
					$('.infocard-header .next span').text(nextNum);
					// -----------
					
					$('.js-result-wrapper-infocard').removeClass('animated fadeOutLeft').addClass('animated fadeInRight');
					bindInfocard();
					
					isAjaxBusy = false;
				}, 2000);
			}, 800);
		}
		return false;
	});
	
	$('.js-show-popup-write').unbind().click(function() {
		console.log('write');

		$('.popup-write_letter').toggle();
		return false;
	});
	
	$('.js-show-popup-choosetime').unbind().click(function() {
		console.log('choose time');
		
		$('.popup-choose_time1').toggle();
		return false;
	});
	
	console.log('binds');
	// ***** END infocard binds
}

function processSlider(ui, withAjax, inp, el) {
	inp.val(ui.value);
	
	var tmp = el.find('.ui-slider-handle').attr('style').split(':');
	var percent = parseInt(tmp[1]);
	
	var ps;
	if (percent < 30) {
		ps = 'w-30';
	} else if (percent < 60) {
		ps = 'w-60';
	} else {
		ps = 'w-100';
	}
	el.find('.progVal').removeClass('w-30 w-60 w-100').addClass(ps).attr('style', 'width:' + tmp[1]);
	
	el.parents('.search_parambar').find('.wr-sliderParam').removeClass('active');
	el.parents('.wr-sliderParam').addClass('active');
	
	if (withAjax) {
		doAjaxSearch();
	}
}

function initStations() {
	var stations = [
		// в центре - на кольце - название - стиль надписи - стиль галки
		[true, false, 'Борисово', 'left: 720px; top: 813px; width: 56px; height: 12px; background-position: -720px -813px', 'left: 707px; top: 811px; width: 15px; height: 15px; background-position: -707px -811px'],
		[true, true, 'Шипиловская', 'left: 720px; top: 840px; width: 79px; height: 12px; background-position: -720px -840px;', 'left: 707px; top: 838px; width: 15px; height: 15px; background-position: -707px -838px;'],
		[false, true, 'Зябликово', 'left: 720px; top: 865px; width: 62px; height: 12px; background-position: -720px -865px;', 'left: 707px; top: 863px; width: 15px; height: 15px; background-position: -707px -863px;'],
		[false, true, 'Чертановская', 'left: 464px; top: 835px; width: 78px; height: 16px; background-position: -464px -835px;', 'left: 451px; top: 834px; width: 15px; height: 15px; background-position: -451px -834px;'],
		[true, false, 'Южная', 'left: 453px; top: 868px; width: 44px; height: 15px; background-position: -453px -868px;', 'left: 444px; top: 856px; width: 15px; height: 15px; background-position: -444px -856px;'],
	];
	
	for (var i = 0; i < stations.length; i++) {
		var dataCenter = "";
		var dataRing = "";
		if (stations[i][0] == true) {
			dataCenter = ' data-center="1"';
		}
		if (stations[i][1] == true) {
			dataRing = ' data-ring="1"';
		}
		$('.metro-map').append('<div' + dataCenter + dataRing + ' style="' + stations[i][3] + '">' + stations[i][2] + '</div>');
	}
}