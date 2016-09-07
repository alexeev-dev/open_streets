$('.js-chosen').chosen({
	disable_search_threshold: 10
});

$(document).ready(function() {
	// cabinet
	$('.deleteItems').click(function() {
		$(this).parents('.cabinet-hidden_items').remove();
		return false;
	});

	$('.cabinet-brand_info a').click(function() {
		$('.cabinet-brand_info input').removeClass('active');
		$(this).siblings('input').addClass('active');

		$('.cabinet-brand_info .icons-cabinet-sidebar-pencil-active').attr('class', 'icons-cabinet-sidebar-pencil-inactive');
		$(this).find('i').attr('class', 'icons-cabinet-sidebar-pencil-active');

		return false;
	});

	// ************ map tabs in popup
	// карта
	$('.popup-map #map-tab1').click(function() {
		$('.block1, .block2, .block3').removeClass('active');
		$('.block1').addClass('active');

		if (map !== undefined) {
			console.log(map);
			map.invalidateSize();
		}
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

		$('.popup-map').bPopup().close();
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

	$('.metro-map div.one-station').click(function() {
		if (!$(this).parent().hasClass('active')) {
			$(this).parent().addClass('active');
			$('.block2-sidebar ul').append('<li>' + $(this).text() + '</li>');
			rebindStations();
		} else {
			$(this).parent().removeClass('active');
			$('.block2-sidebar ul li:contains("' + $(this).text() + '")').remove();
		}
	});

	$('.radio-block label').eq(0).click(function() {
		$('.block2-sidebar ul').empty();
		$('.metro-map div.one-station').each(function() {
			if ($(this).data('center') == '1') {
				$(this).parent().addClass('active');
				$('.block2-sidebar ul').append('<li>' + $(this).text() + '</li>');
			} else {
				$(this).parent().removeClass('active');
				$('.block2-sidebar ul li:contains("' + $(this).text() + '")').remove();
			}
		});
		rebindStations();
	});
	$('.radio-block label').eq(1).click(function() {
		$('.block2-sidebar ul').empty();
		$('.metro-map div.one-station').each(function() {
			if ($(this).data('ring') == '1') {
				$(this).parent().addClass('active');
				$('.block2-sidebar ul').append('<li>' + $(this).text() + '</li>');
			} else {
				$(this).parent().removeClass('active');
				$('.block2-sidebar ul li:contains("' + $(this).text() + '")').remove();
			}
		});
		rebindStations();
	});

	function rebindStations() {
		$('.block2-sidebar ul li').click(function() {
			$(this).remove();
			$('.metro-map div.one-station:contains("' + $(this).text() + '")').parent().removeClass('active');
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
	$(".js-carousel").owlCarousel({
		loop: true
	});

	// 1. Дизайн селекта
	//$('.js-chosen').chosen({
//		disable_search_threshold: 10
//	});

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
	/*
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
	*/
	validation();

	// попап логина
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

	// валидация login
	/*
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
	*/

	// валидация house-sett
	/*
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
	*/

	// в попапе popup-write_letter - форму проверить на заполненость
	//$('.js-validate-no-message').feelform();

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
	$('.js-subscribe').click(function() {
		$('.popup-subscribe').bPopup({
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
				el.find('.double-val1').text('от ' + ui.values[0]).append(' м<em>2</em>');
				el.find('.double-val2').text('до ' + ui.values[1]).append(' м<em>2</em>');

				var d = el.find('.double-val1').offset().left - el.find('.double-val2').offset().left;
				if (d < -90) {
					el.find('.double-val2').removeClass('shifted');
				} else {
					el.find('.double-val2').addClass('shifted');
				}
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
});

function bindCarousels() {
	$('.result_item-slider').each(function() {
		var curEl = $(this);
		var sync1 = $(this).find('.gallery-slider');
		var sync2 = $(this).find('.owl-inner2');

		// 1
		sync1.owlCarousel({
			loop: true,
			items: 1,
			itemsDesktop: 1,
			itemsDesktopSmall: 1,
			itemsTablet: 1,
			itemsTabletSmall: 1,
			itemsMobile: 1,
			afterAction: syncPosition,
			autoPlay: true,
			lazyLoad: true
		});
		sync1.data('owlCarousel').stop();

		$(this).find('.play').unbind().click(function() {
			$(this).toggleClass('active');
			if ($(this).hasClass('active')) {
				sync1.data('owlCarousel').next();
				sync1.data('owlCarousel').play();
			} else {
				sync1.data('owlCarousel').stop();
			}
			return false;
		});

		$(this).find('.fancybox').fancybox({nextEffect: 'fade', prevEffect: 'fade', openEffect: 'fade'});

		$(this).find('.markplace').unbind().click(function() {
			$('.yandex-map-popup').bPopup({
				easing: 'easeOutBack',
				speed:'50',
				transition: 'slideDown',
				amsl:0
			});
			return false;
		});

		$(this).find('.threeD').unbind().click(function() {
			$('.gallery-image-popup').bPopup({
				easing: 'easeOutBack',
				speed:'50',
				transition: 'slideDown',
				amsl:0
			});
			return false;
		});

		$(this).find('.nav-left').unbind().click(function() {
			sync1.trigger('owl.prev');
			return false;
		});
		$(this).find('.nav-right').unbind().click(function() {
			sync1.trigger('owl.next');
			return false;
		});

		function syncPosition(el) {
			if (this.owl.currentItem == 0) {
				curEl.find('.nav-left').addClass('last-active');
			} else {
				curEl.find('.nav-left').removeClass('last-active');
			}
			if (this.owl.currentItem + 1 == this.owl.owlItems.length) {
				curEl.find('.nav-right').addClass('last-active');
			} else {
				curEl.find('.nav-right').removeClass('last-active');
			}

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
			itemsDesktop: 3,
			itemsDesktopSmall: 3,
			itemsTablet: 3,
			itemsTabletSmall: 3,
			itemsMobile: 3,
			lazyLoad: true,
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

	// **** infocard big slider
	var isBigBusy = false;
	var syncBig = $('.owl-big2');
	if (syncBig.length) {
		syncBig.owlCarousel({
			loop: true,
			items: 1,
			lazyLoad: true,
			autoPlay: true,
			afterAction: function syncBig(el) {
				var current = this.currentItem;
				$('.gallery-2 .gallery-slider li').removeClass('active');
				$('.gallery-2 .gallery-slider li').eq(current).addClass('active');
			}
		});
		syncBig.data('owlCarousel').stop();

		$('.infocard-gallery .play').unbind().click(function() {
			$(this).toggleClass('active');
			if ($(this).hasClass('active')) {
				syncBig.data('owlCarousel').next();
				syncBig.data('owlCarousel').play();
			} else {
				syncBig.data('owlCarousel').stop();
			}
			return false;
		});

		$('.infocard-gallery').find('.fancybox').fancybox({nextEffect: 'fade', prevEffect: 'fade', openEffect: 'fade'});

		$('.infocard-gallery .markplace').unbind().click(function() {
			$('.yandex-map-popup').bPopup({
				easing: 'easeOutBack',
				speed:'50',
				transition: 'slideDown',
				amsl:0
			});
			return false;
		});

		$('.infocard-gallery .threeD').unbind().click(function() {
			$('.gallery-image-popup').bPopup({
				easing: 'easeOutBack',
				speed:'50',
				transition: 'slideDown',
				amsl:0
			});
			return false;
		});

		$('.gallery-2 .gallery-slider li a').unbind().click(function() {
			if ($(this).parent().hasClass('active')) {
				return false;
			}

			var i = $('.gallery-2 .gallery-slider li a').index($(this));
			syncBig.trigger("owl.goTo", i);

			$('.gallery-2 .gallery-slider li').removeClass('active');
			$(this).parent().addClass('active');

			if ($('.small-gallery').offset().top - $(this).offset().top > -150) {
				$('.gallery-2 .nav-up').click();
			} else {
				$('.gallery-2 .nav-down').click();
			}
			return false;
		});
		$('.gallery-2 .nav-down').unbind().click(function() {
			var sl = $('.gallery-2 .gallery-slider');
			var slItem = $('.gallery-2 .gallery-slider li').eq(0);

			if (!isBigBusy && sl.offset().top + sl.height() > sl.parent().offset().top + sl.parent().height()) {
				isBigBusy = true;
				sl.animate({top: '-=' + (slItem.outerHeight() + 1) + 'px'}, 500, function() {
					isBigBusy = false;
					checkArrows();
				});
			}

			return false;
		});
		$('.gallery-2 .nav-up').unbind().click(function() {
			var sl = $('.gallery-2 .gallery-slider');
			var slItem = $('.gallery-2 .gallery-slider li').eq(0);

			if (!isBigBusy && sl.offset().top < sl.parent().offset().top) {
				isBigBusy = true;
				sl.animate({top: '+=' + (slItem.outerHeight() + 1) + 'px'}, 500, function() {
					isBigBusy = false;
					checkArrows();
				});
			}

			return false;
		});
	}
	// **** infocard big slider END

	// Вызов попапа с видео
	$('.js-video-popup-button').click(function() {
		$('.item-video-popup').bPopup();
	});
}

function checkArrows() {
	var sl = $('.gallery-2 .gallery-slider');
	if (sl.offset().top + sl.height() <= sl.parent().offset().top + sl.parent().height()) {
		$('.gallery-2 .nav-down').addClass('last-active');
	} else {
		$('.gallery-2 .nav-down').removeClass('last-active');
	}
	if (sl.offset().top >= sl.parent().offset().top) {
		$('.gallery-2 .nav-up').addClass('last-active');
	} else {
		$('.gallery-2 .nav-up').removeClass('last-active');
	}
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

			$('.search_result-body').removeClass('fadeInRight').addClass('animated fadeOutLeft');
			setTimeout(function() {
				$('.search_result-body').removeClass('fadeOutLeft').hide();
				$('.infocard-body').show();
				$('.infocard-body').removeClass('fadeOutLeft').addClass('animated fadeInRight');
				bindInfocard();

				isAjaxBusy = false;
			}, 800);
		}
		return false;
	});

	$('.infocard-body .closeInfo').unbind().click(function() {
		$('.infocard-body').removeClass('fadeInRight').addClass('fadeOutLeft');
		setTimeout(function() {
			$('.infocard-body').hide();
			$('.search_result-body').show();
			$('.search_result-body').addClass('fadeInRight');
		}, 800);
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
		[false, false, 'Борисово', 'left: 720px; top: 813px; width: 56px; height: 12px; background-position: -720px -813px', 'left: 707px; top: 811px; width: 15px; height: 15px; background-position: -707px -811px'],
		[false, false, 'Шипиловская', 'left: 720px; top: 840px; width: 79px; height: 12px; background-position: -720px -840px;', 'left: 707px; top: 838px; width: 15px; height: 15px; background-position: -707px -838px;'],
		[false, false, 'Зябликово', 'left: 720px; top: 865px; width: 62px; height: 12px; background-position: -720px -865px;', 'left: 707px; top: 863px; width: 15px; height: 15px; background-position: -707px -863px;'],
		[false, false, 'Чертановская', 'left: 464px; top: 835px; width: 78px; height: 16px; background-position: -464px -835px;', 'left: 451px; top: 834px; width: 15px; height: 15px; background-position: -451px -834px;'],
		[false, false, 'Южная', 'left: 453px; top: 868px; width: 44px; height: 15px; background-position: -453px -868px;', 'left: 444px; top: 856px; width: 15px; height: 15px; background-position: -444px -856px;'],
		[false, false, 'Пражская', 'left: 434px; top: 887px; width: 57px; height: 15px; background-position: -434px -887px;', 'left: 426px; top: 876px; width: 15px; height: 15px; background-position: -426px -876px;'],
		[false, false, 'Улица Академика Янгеля', 'left: 415px; top: 907px; width: 135px; height: 15px; background-position: -415px -907px;', 'left: 407px; top: 894px; width: 15px; height: 15px; background-position: -407px -894px;'],
		[false, false, 'Аннино', 'left: 348px; top: 893px; width: 47px; height: 15px; background-position: -348px -893px;', 'left: 365px; top: 906px; width: 15px; height: 15px; background-position: -365px -906px;'],
		[false, false, 'Алтуфьево', 'left: 339px; top: 5px; width: 63px; height: 16px; background-position: -339px -5px;', 'left: 326px; top: 5px; width: 15px; height: 15px; background-position: -326px -5px;'],
		[false, false, 'Бибирево', 'left: 338px; top: 23px; width: 59px; height: 16px; background-position: -338px -23px;', 'left: 326px; top: 23px; width: 15px; height: 15px; background-position: -326px -23px;'],
		[false, false, 'Отрадное', 'left: 338px; top: 43px; width: 57px; height: 15px; background-position: -338px -43px;', 'left: 326px; top: 42px; width: 15px; height: 15px; background-position: -326px -42px;'],
		[false, false, 'Владыкино', 'left: 338px; top: 62px; width: 65px; height: 16px; background-position: -338px -62px;', 'left: 326px; top: 61px; width: 15px; height: 15px; background-position: -326px -61px;'],
		[false, false, 'Петровско-Разумовская', 'left: 338px; top: 81px; width: 131px; height: 15px; background-position: -338px -81px;', 'left: 326px; top: 81px; width: 15px; height: 15px; background-position: -326px -81px;'],
		[false, false, 'Дмитровская', 'left: 338px; top: 158px; width: 76px; height: 12px; background-position: -338px -158px;', 'left: 326px; top: 156px; width: 15px; height: 15px; background-position: -326px -156px;'],
		[false, false, 'Марьина Роща', 'left: 447px; top: 167px; width: 82px; height: 12px; background-position: -447px -167px;', 'left: 435px; top: 165px; width: 15px; height: 15px; background-position: -435px -165px;'],
		[false, false, 'Достоевская', 'left: 447px; top: 193px; width: 71px; height: 12px; background-position: -447px -193px;', 'left: 435px; top: 191px; width: 15px; height: 15px; background-position: -435px -191px;'],
		[true, false, 'Трубная', 'left: 421px; top: 312px; width: 50px; height: 12px; background-position: -421px -312px;', 'left: 409px; top: 309px; width: 15px; height: 15px; background-position: -409px -309px;'],
		[true, false, 'Сретенский бульвар', 'left: 492px; top: 313px; width: 61px; height: 21px; background-position: -492px -313px;', 'left: 515px; top: 333px; width: 15px; height: 15px; background-position: -515px -333px;'],
		[false, true, 'Менделеевская', 'left: 348px; top: 212px; width: 86px; height: 17px; background-position: -348px -212px;', 'left: 347px; top: 226px; width: 15px; height: 15px; background-position: -347px -226px;'],
		[true, false, 'Чеховская', 'left: 395px; top: 365px; width: 59px; height: 15px; background-position: -395px -365px;', 'left: 383px; top: 357px; width: 15px; height: 15px; background-position: -383px -357px;'],
		[true, false, 'Полянка', 'left: 463px; top: 601px; width: 51px; height: 15px; background-position: -463px -601px;', 'left: 451px; top: 601px; width: 15px; height: 15px; background-position: -451px -601px;'],
		[false, true, 'Серпуховская', 'left: 462px; top: 648px; width: 80px; height: 16px; background-position: -462px -648px;', 'left: 451px; top: 646px; width: 15px; height: 15px; background-position: -451px -646px;'],
		[false, false, 'Тульская', 'left: 464px; top: 676px; width: 52px; height: 16px; background-position: -464px -676px;', 'left: 451px; top: 675px; width: 15px; height: 15px; background-position: -451px -675px;'],
		[false, false, 'Нагатинская', 'left: 464px; top: 700px; width: 71px; height: 15px; background-position: -464px -700px;', 'left: 451px; top: 700px; width: 15px; height: 15px; background-position: -451px -700px;'],
		[false, false, 'Нагорная', 'left: 464px; top: 725px; width: 56px; height: 15px; background-position: -464px -725px;', 'left: 451px; top: 724px; width: 15px; height: 15px; background-position: -451px -724px;'],
		[false, false, 'Нахимовский проспект', 'left: 464px; top: 750px; width: 77px; height: 24px; background-position: -464px -750px;', 'left: 451px; top: 750px; width: 15px; height: 15px; background-position: -451px -750px;'],
		[false, false, 'Севастопольская', 'left: 464px; top: 807px; width: 94px; height: 15px; background-position: -464px -807px;', 'left: 451px; top: 806px; width: 15px; height: 15px; background-position: -451px -806px;'],
		[true, false, 'Цветной бульвар', 'left: 350px; top: 299px; width: 45px; height: 21px; background-position: -350px -299px;', 'left: 396px; top: 295px; width: 15px; height: 15px; background-position: -396px -295px;'],
		[false, false, 'Тимирязевская', 'left: 341px; top: 102px; width: 85px; height: 15px; background-position: -341px -102px;', 'left: 326px; top: 102px; width: 15px; height: 15px; background-position: -326px -102px;'],
		[false, false, 'Тимирязевская', 'left: 352px; top: 117px; width: 73px; height: 10px; background-position: -352px -117px;', 'left: 347px; top: 123px; width: 15px; height: 15px; background-position: -347px -123px;'],
		[false, false, 'Римская', 'left: 712px; top: 483px; width: 50px; height: 12px; background-position: -712px -483px;', 'left: 700px; top: 480px; width: 15px; height: 15px; background-position: -700px -480px;'],
		[false, false, 'Крестьянская Застава', 'left: 724px; top: 543px; width: 69px; height: 19px; background-position: -724px -543px;', 'left: 707px; top: 559px; width: 15px; height: 15px; background-position: -707px -559px;'],
		[false, false, 'Дубровка', 'left: 720px; top: 627px; width: 57px; height: 12px; background-position: -720px -627px;', 'left: 707px; top: 625px; width: 15px; height: 15px; background-position: -707px -625px;'],
		[false, false, 'Кожуховская', 'left: 720px; top: 654px; width: 72px; height: 12px; background-position: -720px -654px;', 'left: 707px; top: 651px; width: 15px; height: 15px; background-position: -707px -651px;'],
		[false, false, 'Печатники', 'left: 720px; top: 680px; width: 63px; height: 12px; background-position: -720px -680px;', 'left: 707px; top: 678px; width: 15px; height: 15px; background-position: -707px -678px;'],
		[false, false, 'Волжская', 'left: 720px; top: 707px; width: 56px; height: 12px; background-position: -720px -707px;', 'left: 707px; top: 704px; width: 15px; height: 15px; background-position: -707px -704px;'],
		[false, false, 'Люблино', 'left: 720px; top: 733px; width: 55px; height: 12px; background-position: -720px -733px;', 'left: 707px; top: 731px; width: 15px; height: 15px; background-position: -707px -731px;'],
		[false, false, 'Каширская', 'left: 597px; top: 721px; width: 64px; height: 12px; background-position: -597px -721px;', ['left: 584px; top: 720px; width: 15px; height: 15px; background-position: -584px -720px;','left: 598px; top: 732px; width: 15px; height: 15px; background-position: -598px -732px;']],
		[false, false, 'Красногвардейская', 'left: 589px; top: 888px; width: 108px; height: 12px; background-position: -589px -888px;', 'left: 694px; top: 877px; width: 15px; height: 15px; background-position: -694px -877px;'],
		[false, false, 'Орехово', 'left: 651px; top: 817px; width: 49px; height: 12px; background-position: -651px -817px;', 'left: 641px; top: 825px; width: 15px; height: 15px; background-position: -641px -825px;'],
		[false, false, 'Царицыно', 'left: 626px; top: 793px; width: 62px; height: 12px; background-position: -626px -793px;', 'left: 618px; top: 801px; width: 15px; height: 15px; background-position: -618px -801px;'],
		[false, false, 'Кантемировская', 'left: 602px; top: 768px; width: 93px; height: 12px; background-position: -602px -768px;', 'left: 593px; top: 775px; width: 15px; height: 15px; background-position: -593px -775px;'],
		[false, false, 'Коломенская', 'left: 596px; top: 687px; width: 74px; height: 12px; background-position: -596px -687px;', 'left: 584px; top: 685px; width: 15px; height: 15px; background-position: -584px -685px;'],
		[false, false, 'Автозаводская', 'left: 584px; top: 630px; width: 92px; height: 12px; background-position: -584px -630px;', 'left: 584px; top: 627px; width: 15px; height: 15px; background-position: -584px -627px;'],
		[false, true, 'Павелецкая', 'left: 585px; top: 596px; width: 67px; height: 12px; background-position: -585px -596px;', ['left: 574px; top: 584px; width: 15px; height: 15px; background-position: -574px -584px;','left: 574px; top: 602px; width: 15px; height: 15px; background-position: -574px -602px;']],
		[true, false, 'Театральная', 'left: 456px; top: 453px; width: 72px; height: 12px; background-position: -456px -453px;', 'left: 447px; top: 459px; width: 15px; height: 15px; background-position: -447px -459px;'],
		[true, false, 'Тверская', 'left: 311px; top: 367px; width: 53px; height: 12px; background-position: -311px -367px;','left: 362px; top: 357px; width: 15px; height: 15px; background-position: -362px -357px;' ],
		[false, false, 'Аэропорт', 'left: 243px; top: 219px; width: 54px; height: 12px; background-position: -243px -219px;', 'left: 231px; top: 227px; width: 15px; height: 15px; background-position: -231px -227px;'],
		[false, false, 'Сокол', 'left: 228px; top: 189px; width: 37px; height: 12px; background-position: -228px -189px;', 'left: 215px; top: 186px; width: 15px; height: 15px; background-position: -215px -186px;'],
		[false, false, 'Войковская', 'left: 228px; top: 157px; width: 66px; height: 12px; background-position: -228px -157px;', 'left: 215px; top: 154px; width: 15px; height: 15px; background-position: -215px -154px;'],
		[false, false, 'Братиславская', 'left: 720px; top: 760px; width: 81px; height: 12px; background-position: -720px -760px;', 'left: 707px; top: 758px; width: 15px; height: 15px; background-position: -707px -758px;'],
		[false, false, 'Марьино', 'left: 720px; top: 787px; width: 54px; height: 12px; background-position: -720px -787px;', 'left: 707px; top: 784px; width: 15px; height: 15px; background-position: -707px -784px;'],
		[false, false, 'Домодедовская', 'left: 582px; top: 860px; width: 89px; height: 12px; background-position: -582px -860px;', 'left: 665px; top: 849px; width: 15px; height: 15px; background-position: -665px -849px;'],
		[false, true, 'Белорусская', 'left: 216px; top: 289px; width: 68px; height: 12px; background-position: -216px -289px;', ['left: 281px;top: 277px;width: 15px;height: 15px;background-position: -281px -277px;','left: 282px;top: 297px;width: 15px;height: 15px; background-position: -282px -297px;']],
		[false, false, 'Савеловская', 'left: 338px; top: 186px; width: 72px; height: 12px; background-position: -338px -186px;', 'left: 326px; top: 183px; width: 15px; height: 15px; background-position: -326px -183px;'],
		[false, false, 'Варшавская', 'left: 477px; top: 781px; width: 70px; height: 12px; background-position: -477px -781px;', 'left: 506px; top: 792px; width: 15px; height: 15px; background-position: -506px -792px;'],
		[true, false, 'Кузнецкий Мост', 'left: 418px; top: 393px; width: 56px; height: 17px; background-position: -418px -393px;', 'left: 464px; top: 376px; width: 15px; height: 15px; background-position: -464px -376px;'],
		[true, false, 'Лубянка', 'left: 483px; top: 410px; width: 51px; height: 12px; background-position: -483px -410px;', 'left:483px;top:394px;width: 15px;height: 15px;background-position:-483px-394px;'],
		[true, false, 'Китай-город', 'left: 477px; top: 431px; width: 71px; height: 12px; background-position: -477px -431px;', ['left: 541px; top: 418px; width: 15px; height: 15px; background-position: -541px -418px;','left: 548px; top: 436px; width: 15px; height: 15px; background-position: -548px -436px;']],
		[true, false, 'Библиотека им. Ленина', 'left: 403px; top: 497px; width: 64px; height: 21px; background-position: -403px -497px;', 'left: 391px;top: 485px;width: 15px;height: 15px;background-position: -391px -485px;'],
		[true, false, 'Сухаревская', 'left: 481px; top: 284px; width: 71px; height: 12px; background-position: -481px -284px;', 'left: 469px; top: 282px; width: 15px; height: 15px; background-position: -469px -282px;'],
		[true, false, 'Тургеневская', 'left: 434px; top: 354px; width: 69px; height: 11px; background-position: -434px -354px;', 'left: 505px; top: 352px; width: 15px; height: 15px; background-position: -505px -352px;'],
		[false, true, 'Октябрьская', 'left: 374px; top: 611px; width: 73px; height: 12px; background-position: -374px -611px;', ['left: 366px; top: 600px; width: 15px; height: 15px; background-position: -366px -600px;','left: 366px; top: 619px; width: 15px; height: 15px; background-position: -366px -619px;']],
		[false, false, 'Шаболовская', 'left: 327px; top: 659px; width: 77px; height: 12px; background-position: -327px -659px;', 'left: 319px; top: 647px; width: 15px; height: 15px; background-position: -319px -647px;'],
		[false, false, 'Ленинский проспект', 'left: 306px; top: 680px; width: 116px; height: 12px; background-position: -306px -680px;', 'left: 299px; top: 666px; width: 15px; height: 15px; background-position: -299px -666px;'],
		[false, true, 'Парк культуры', 'left: 324px; top: 573px; width: 54px; height: 21px; background-position: -324px -573px;', ['left: 312px;top: 564px;width: 15px;height: 15px;background-position: -312px -564px;','left: 312px;top: 588px;width: 15px;height: 15px;background-position: -312px -588px;']],
		[false, true, 'Добрынинская', 'left: 357px; top: 644px; width: 85px; height: 12px; background-position: -357px -644px;', 'left: 438px; top: 633px; width: 15px; height: 15px; background-position: -438px -633px;'],
		[false, true, 'Курская', 'left: 650px; top: 382px; width: 48px; height: 12px; background-position: -650px -382px;', ['left: 634px; top: 382px; width: 15px; height: 15px; background-position: -634px -382px;','left: 644px; top: 394px; width: 15px; height: 15px; background-position: -644px -394px;']],
		[false, false, 'Проспект Вернадского', 'left: 102px; top: 703px; width: 123px; height: 12px; background-position: -102px -703px;', 'left: 90px; top: 692px; width: 15px; height: 15px; background-position: -90px -692px;'],
		[false, false, 'Университет', 'left: 124px; top: 680px; width: 73px; height: 12px; background-position: -124px -680px;', 'left: 113px; top: 669px; width: 15px; height: 15px; background-position: -113px -669px;'],
		[false, false, 'Воробьевы горы', 'left: 146px; top: 655px; width: 93px; height: 17px; background-position: -146px -655px;', 'left: 136px; top: 646px; width: 15px; height: 15px; background-position: -136px -646px;'],
		[false, false, 'Спортивная', 'left: 176px; top: 634px; width: 69px; height: 12px; background-position: -176px -634px;', 'left: 205px; top: 618px; width: 15px; height: 15px; background-position: -205px -618px;'],
		[false, false, 'Фрунзенская', 'left: 200px; top: 596px; width: 77px; height: 13px; background-position: -200px -596px;', 'left: 272px; top: 605px; width: 15px; height: 15px; background-position: -272px -605px;'],
		[true, false, 'Охотный Ряд', 'left: 385px; top: 432px; width: 48px; height: 21px; background-position: -385px -432px;', 'left: 433px;top: 444px;width: 15px;height: 15px;background-position: -433px -444px;'],
		[false, false, 'Сокольники', 'left: 654px; top: 216px; width: 68px; height: 12px; background-position: -654px -216px;', 'left: 641px; top: 214px; width: 15px; height: 15px; background-position: -641px -214px;'],
		[false, false, 'Преображенская площадь', 'left: 654px; top: 169px; width: 95px; height: 21px; background-position: -654px -169px;', 'left: 642px; top: 168px; width: 15px; height: 15px; background-position: -642px -168px;'],
		[false, false, 'Черкизовская', 'left: 653px; top: 134px; width: 79px; height: 12px; background-position: -653px -134px;', 'left: 642px;top: 132px;width: 15px;height: 15px;background-position: -642px -132px;'],
		[false, false, 'Бульвар Рокоссовского', 'left: 653px; top: 99px; width: 96px; height: 30px; background-position: -653px -99px;', 'left: 641px;top: 97px;width: 15px;height: 15px;background-position: -641px -97px;'],
		[false, false, 'Юго-Западная', 'left: 82px; top: 725px; width: 82px; height: 12px; background-position: -82px -725px;', 'left: 70px; top: 712px; width: 15px; height: 15px; background-position: -70px -712px;'],
		[false, false, 'Сходненская', 'left: 118px; top: 164px; width: 73px; height: 12px; background-position: -118px -164px;', 'left: 106px; top: 162px; width: 15px; height: 15px; background-position: -106px -162px;'],
		[false, false, 'Тушинская', 'left: 118px; top: 191px; width: 63px; height: 12px; background-position: -118px -191px;', 'left: 106px; top: 189px; width: 15px; height: 15px; background-position: -106px -189px;'],
		[false, false, 'Щукинская', 'left: 118px; top: 245px; width: 67px; height: 12px; background-position: -118px -245px;', 'left: 106px; top: 242px; width: 15px; height: 15px; background-position: -106px -242px;'],
		[false, false, 'Октябрьское Поле', 'left: 118px; top: 268px; width: 104px; height: 20px; background-position: -118px -268px;', 'left: 106px; top: 269px; width: 15px; height: 15px; background-position: -106px -269px;'],
		[false, false, 'Полежаевская', 'left: 118px; top: 296px; width: 85px; height: 19px; background-position: -118px -296px;', 'left: 106px; top: 296px; width: 15px; height: 15px; background-position: -106px -296px;'],
		[false, false, 'Беговая', 'left: 131px; top: 327px; width: 50px; height: 18px; background-position: -131px -327px;', 'left: 122px; top: 338px; width: 15px; height: 15px; background-position: -122px -338px;'],
		[false, false, 'Улица 1905 года', 'left: 170px; top: 354px; width: 50px; height: 21px; background-position: -170px -354px;', 'left: 187px; top: 376px; width: 15px; height: 15px; background-position: -187px -376px;'],
		[false, false, 'Бауманская', 'left: 679px; top: 357px; width: 69px; height: 12px; background-position: -679px -357px;', 'left: 671px; top: 344px; width: 15px; height: 15px; background-position: -671px -344px;'],
		[false, false, 'Электрозаводская', 'left: 714px; top: 323px; width: 101px; height: 12px; background-position: -714px -323px;', 'left: 705px; top: 311px; width: 15px; height: 15px; background-position: -705px -311px;'],
		[false, false, 'Семеновская', 'left: 745px; top: 292px; width: 74px; height: 12px; background-position: -745px -292px;', 'left: 736px; top: 279px; width: 15px; height: 15px; background-position: -736px -279px;'],
		[false, false, 'Партизанская', 'left: 765px; top: 245px; width: 81px; height: 12px; background-position: -765px -245px;', 'left: 754px; top: 243px; width: 15px; height: 15px; background-position: -754px -243px;'],
		[false, false, 'Измайловская', 'left: 766px; top: 211px; width: 81px; height: 12px; background-position: -766px -211px;', 'left: 754px; top: 209px; width: 15px; height: 15px; background-position: -754px -209px;'],
		[false, false, 'Первомайская', 'left: 766px; top: 176px; width: 82px; height: 12px; background-position: -766px -176px;', 'left: 754px; top: 174px; width: 15px; height: 15px; background-position: -754px -174px;'],
		[false, false, 'Щелковская', 'left: 766px; top: 142px; width: 71px; height: 12px; background-position: -766px -142px;', 'left: 754px; top: 140px; width: 15px; height: 15px; background-position: -754px -140px;'],
		[false, false, 'Выхино', 'left: 812px; top: 710px; width: 46px; height: 12px; background-position: -812px -710px;', 'left: 800px; top: 708px; width: 15px; height: 15px; background-position: -800px -708px;'],
		[false, false, 'Лермонтовский проспект', 'left: 812px; top: 736px; width: 88px; height: 24px; background-position: -812px -736px;', 'left: 800px; top: 735px; width: 15px; height: 15px; background-position: -800px -735px;'],
		[false, false, 'Жулебино', 'left: 812px; top: 770px; width: 62px; height: 12px; background-position: -812px -770px;', 'left: 800px; top: 768px; width: 15px; height: 15px; background-position: -800px -768px;'],
		[false, false, 'Рязанский проспект', 'left: 812px; top: 674px; width: 62px; height: 21px; background-position: -812px -674px;', 'left: 800px; top: 673px; width: 15px; height: 15px; background-position: -800px -673px;'],
		[false, false, 'Кузьминки', 'left: 796px; top: 620px; width: 65px; height: 12px; background-position: -796px -620px;', 'left: 787px; top: 627px; width: 15px; height: 15px; background-position: -787px -627px;'],
		[false, false, 'Текстильщики', 'left: 778px; top: 601px; width: 81px; height: 12px; background-position: -778px -601px;', 'left: 769px; top: 609px; width: 15px; height: 15px; background-position: -769px -609px;'],
		[false, false, 'Волгоградский проспект', 'left: 724px; top: 581px; width: 134px; height: 12px; background-position: -724px -581px;', 'left: 731px; top: 592px; width: 15px; height: 15px; background-position: -731px -592px;'],
		[false, false, 'Новогиреево', 'left: 793px; top: 390px; width: 74px; height: 12px; background-position: -793px -390px;', 'left: 784px; top: 377px; width: 15px; height: 15px; background-position: -784px -377px;'],
		[false, false, 'Перово', 'left: 774px; top: 408px; width: 45px; height: 12px; background-position: -774px -408px;', 'left: 766px; top: 395px; width: 15px; height: 15px; background-position: -766px -395px;'],
		[false, false, 'Шоссе Энтузиастов', 'left: 755px; top: 428px; width: 106px; height: 12px; background-position: -755px -428px;', 'left: 746px; top: 415px; width: 15px; height: 15px; background-position: -746px -415px;'],
		[false, false, 'Авиамоторная', 'left: 736px; top: 446px; width: 82px; height: 12px; background-position: -736px -446px;', 'left: 728px; top: 434px; width: 15px; height: 15px; background-position: -728px -434px;'],
		[false, false, 'Площадь Ильича', 'left: 712px; top: 466px; width: 93px; height: 12px; background-position: -712px -466px;', 'left: 700px; top: 461px; width: 15px; height: 15px; background-position: -700px -461px;'],
		[false, false, 'Студенческая', 'left: 39px; top: 521px; width: 74px; height: 12px; background-position: -39px -521px;', 'left: 66px; top: 507px; width: 15px; height: 15px; background-position: -66px -507px;'],
		[false, false, 'Кутузовская', 'left: 35px; top: 452px; width: 69px; height: 12px; background-position: -35px -452px;', 'left: 23px; top: 449px; width: 15px; height: 15px; background-position: -23px -449px;'],
		[false, false, 'Фили', 'left: 35px; top: 429px; width: 34px; height: 12px; background-position: -35px -429px;', 'left: 23px; top: 427px; width: 15px; height: 15px; background-position: -23px -427px;'],
		[false, false, 'Багратионовская', 'left: 35px; top: 407px; width: 95px; height: 12px; background-position: -35px -407px;', 'left: 23px; top: 404px; width: 15px; height: 15px; background-position: -23px -404px;'],
		[false, false, 'Филевский парк', 'left: 34px; top: 384px; width: 92px; height: 12px; background-position: -34px -384px;', 'left: 23px; top: 381px; width: 15px; height: 15px; background-position: -23px -381px;'],
		[false, false, 'Пионерская', 'left: 34px; top: 361px; width: 70px; height: 12px; background-position: -34px -361px;', 'left: 23px; top: 358px; width: 15px; height: 15px; background-position: -23px -358px;'],
		[false, false, 'Кунцевская', 'left: 21px; top: 318px; width: 66px; height: 12px; background-position: -21px -318px;', ['left: 23px; top: 332px; width: 15px; height: 15px; background-position: -23px -332px;','left: 6px; top: 315px; width: 15px; height: 15px; background-position: -6px -315px;']],
		[false, false, 'Молодежная', 'left: 18px; top: 288px; width: 73px; height: 12px; background-position: -18px -288px;', 'left: 6px; top: 285px; width: 15px; height: 15px; background-position: -6px -285px;'],
		[false, false, 'Крылатское', 'left: 18px; top: 258px; width: 68px; height: 12px; background-position: -18px -258px;', 'left: 6px; top: 255px; width: 15px; height: 15px; background-position: -6px -255px;'],
		[false, false, 'Строгино', 'left: 18px; top: 228px; width: 56px; height: 12px; background-position: -18px -228px;', 'left: 6px; top: 225px; width: 15px; height: 15px; background-position: -6px -225px;'],
		[false, false, 'Мякинино', 'left: 18px; top: 198px; width: 61px; height: 12px; background-position: -18px -198px;', 'left: 6px; top: 195px; width: 15px; height: 15px; background-position: -6px -195px;'],
		[false, false, 'Волоколамская', 'left: 18px; top: 172px; width: 85px; height: 12px; background-position: -18px -172px;', 'left: 6px; top: 167px; width: 15px; height: 15px; background-position: -6px -167px;'],
		[false, false, 'Митино', 'left: 18px; top: 142px; width: 49px; height: 12px; background-position: -18px -142px;', 'left: 6px; top: 140px; width: 15px; height: 15px; background-position: -6px -140px;'],
		[false, false, 'Славянский бульвар', 'left: 40px; top: 554px; width: 67px; height: 21px; background-position: -40px -554px;', 'left: 66px; top: 538px; width: 15px; height: 15px; background-position: -66px -538px;'],
		[false, false, 'Парк Победы', 'left: 127px; top: 558px; width: 47px; height: 22px; background-position: -127px -558px;', ['left: 128px; top: 538px; width: 15px; height: 15px; background-position: -128px -538px;','left: 111px; top: 555px; width: 15px; height: 15px; background-position: -111px -555px;']],
		[false, false, 'Международная', 'left: 142px; top: 432px; width: 92px; height: 12px; background-position: -142px -432px;', 'left: 130px; top: 429px; width: 15px; height: 15px; background-position: -130px -429px;'],
		[true, false, 'Кропоткинская', 'left: 342px; top: 557px; width: 86px; height: 12px; background-position: -342px -557px;', 'left: 333px;top: 543px;width: 15px;height: 15px;background-position: -333px -543px;'],
		[false, true, 'Комсомольская', 'left: 611px; top: 290px; width: 86px; height: 12px; background-position: -611px -290px;', ['left: 599px;top: 277px;width: 15px;height: 15px;background-position: -599px -277px;','left: 600px;top: 298px;width: 15px;height: 15px;background-position: -600px -298px;']],
		[true, false, 'Пл. Революции', 'left: 469px; top: 484px; width: 84px; height: 17px; background-position: -469px -484px;', 'left: 461px; top: 474px; width: 15px; height: 15px; background-position: -461px -474px;'],
		[false, false, 'Красносельская', 'left: 634px; top: 265px; width: 89px; height: 12px; background-position: -634px -265px;', 'left: 625px;top: 252px;width: 15px;height: 15px;background-position: -625px -252px;'],
		[false, false, 'Новокосино', 'left: 813px; top: 370px; width: 69px; height: 12px; background-position: -813px -370px;', 'left: 803px; top: 358px; width: 15px; height: 15px; background-position: -803px -358px;'],
		[false, false, 'Каховская', 'left: 393px; top: 782px; width: 58px; height: 12px; background-position: -393px -782px;', 'left: 438px; top: 792px; width: 15px; height: 15px; background-position: -438px -792px;'],
		[false, false, 'Пролетарская', 'left: 616px; top: 577px; width: 79px; height: 12px; background-position: -616px -577px;', 'left: 695px; top: 572px; width: 15px; height: 15px; background-position: -695px -572px;'],
		[false, false, 'Выставочная', 'left: 145px; top: 475px; width: 71px; height: 12px; background-position: -145px -475px;', 'left: 130px; top: 474px; width: 15px; height: 15px; background-position: -130px -474px;'],
		[false, false, 'Алма-Атинская', 'left: 631px; top: 908px; width: 85px; height: 12px; background-position: -631px -908px;', 'left: 713px; top: 897px; width: 15px; height: 15px; background-position: -713px -897px;'],
		[false, false, 'Пятницкое шоссе', 'left: 22px; top: 103px; width: 57px; height: 22px; background-position: -22px -103px;', 'left: 6px; top: 100px; width: 15px; height: 15px; background-position: -6px -100px;'],
		[false, false, 'Улица Старокачаловская', 'left: 134px; top: 880px; width: 85px; height: 19px; background-position: -134px -880px;', 'left: 215px; top: 893px; width: 15px; height: 15px; background-position: -215px -893px;'],
		[false, false, 'Улица Скобелевская', 'left: 120px; top: 919px; width: 67px; height: 18px; background-position: -120px -919px;', 'left: 147px; top: 906px; width: 15px; height: 15px; background-position: -147px -906px;'],
		[false, false, 'Бульвар Адмирала Ушакова', 'left: 53px; top: 891px; width: 89px; height: 18px; background-position: -53px -891px;', 'left: 90px; top: 906px; width: 15px; height: 15px; background-position: -90px -906px;'],
		[false, false, 'Улица Горчакова', 'left: 39px; top: 919px; width: 48px; height: 18px; background-position: -39px -919px;', 'left: 56px; top: 906px; width: 15px; height: 15px; background-position: -56px -906px;'],
		[false, false, 'Бунинская аллея', 'left: 2px; top: 891px; width: 50px; height: 17px; background-position: -2px -891px;', 'left: 19px; top: 906px; width: 15px; height: 15px; background-position: -19px -906px;'],
		[false, false, 'Планерная', 'left: 118px; top: 137px; width: 64px; height: 12px; background-position: -118px -137px;', 'left: 106px; top: 135px; width: 15px; height: 15px; background-position: -106px -135px;'],
		[false, false, 'Медведково', 'left: 550px; top: 7px; width: 71px; height: 12px; background-position: -550px -7px;', 'left: 538px; top: 5px; width: 15px; height: 15px; background-position: -538px -5px;'],
		[false, false, 'Бабушкинская', 'left: 550px; top: 27px; width: 82px; height: 12px; background-position: -550px -27px;', 'left: 538px; top: 25px; width: 15px; height: 15px; background-position: -538px -25px;'],
		[false, false, 'Свиблово', 'left: 550px; top: 46px; width: 56px; height: 12px; background-position: -550px -46px;', 'left: 538px; top: 44px; width: 15px; height: 15px; background-position: -538px -44px;'],
		[false, false, 'Ботанический сад', 'left: 551px; top: 67px; width: 100px; height: 12px; background-position: -551px -67px;', 'left: 538px; top: 64px; width: 15px; height: 15px; background-position: -538px -64px;'],
		[false, false, 'Ул. Сергея Эйзенштейна', 'left: 559px; top: 90px; width: 68px; height: 18px; background-position: -559px -90px;', 'left: 585px; top: 104px; width: 15px; height: 15px; background-position: -585px -104px;'],
		[false, false, 'Речной вокзал', 'left: 228px; top: 81px; width: 80px; height: 12px; background-position: -228px -81px;', 'left: 215px; top: 78px; width: 15px; height: 15px; background-position: -215px -78px;'],
		[false, false, 'Водный стадион', 'left: 228px; top: 125px; width: 91px; height: 12px; background-position: -228px -125px;', 'left: 215px; top: 122px; width: 15px; height: 15px; background-position: -215px -122px;'],
		[false, false, 'Динамо', 'left: 269px; top: 245px; width: 46px; height: 12px; background-position: -269px -245px;', 'left: 258px; top: 253px; width: 15px; height: 15px; background-position: -258px -253px;'],
		[true, false, 'Маяковская', 'left: 269px; top: 340px; width: 68px; height: 12px; background-position: -269px -340px;', 'left: 334px; top: 330px; width: 15px; height: 15px; background-position: -334px -330px;'],
		[false, true, 'Краснопресненская', 'left: 247px; top: 407px; width: 108px; height: 12px; background-position: -247px -407px;', 'left: 237px; top: 396px; width: 15px; height: 15px; background-position: -237px -396px;'],
		[false, true, 'Баррикадная', 'left: 259px; top: 392px; width: 77px; height: 12px; background-position: -259px -392px;', 'left: 257px; top: 376px; width: 15px; height: 15px; background-position: -257px -376px;'],
		[true, false, 'Арбатская', 'left: 294px; top: 468px; width: 60px; height: 11px; background-position: -294px -468px;', 'left: 340px; top: 455px; width: 15px; height: 15px; background-position: -340px -455px;'],
		[true, false, 'Арбатская', 'left: 294px; top: 479px; width: 55px; height: 11px; background-position: -294px -479px;', 'left: 344px; top: 486px; width: 15px; height: 15px; background-position: -344px -486px;'],
		[true, false, 'Смоленская', 'left: 266px; top: 492px; width: 68px; height: 11px; background-position: -266px -492px;', 'left: 259px; top: 479px; width: 15px; height: 15px; background-position: -259px -479px;'],
		[true, false, 'Смоленская', 'left: 258px; top: 503px; width: 70px; height: 15px; background-position: -258px -503px;', 'left: 321px; top: 508px; width: 15px; height: 15px; background-position: -321px -508px;'],
		[false, false, 'Академическая', 'left: 285px; top: 701px; width: 86px; height: 12px; background-position: -285px -701px;', 'left: 277px; top: 688px; width: 15px; height: 15px; background-position: -277px -688px;'],
		[false, false, 'Профсоюзная', 'left: 276px; top: 720px; width: 86px; height: 12px; background-position: -276px -720px;', 'left: 264px; top: 718px; width: 15px; height: 15px; background-position: -264px -718px;'],
		[false, false, 'Новые Черемушки', 'left: 276px; top: 740px; width: 102px; height: 12px; background-position: -276px -740px;', 'left: 264px; top: 738px; width: 15px; height: 15px; background-position: -264px -738px;'],
		[false, false, 'Калужская', 'left: 276px; top: 760px; width: 61px; height: 12px; background-position: -276px -760px;', 'left: 264px; top: 758px; width: 15px; height: 15px; background-position: -264px -758px;'],
		[false, false, 'Беляево', 'left: 276px; top: 781px; width: 49px; height: 12px; background-position: -276px -781px;', 'left: 264px; top: 778px; width: 15px; height: 15px; background-position: -264px -778px;'],
		[false, false, 'Коньково', 'left: 276px; top: 801px; width: 55px; height: 12px; background-position: -276px -801px;', 'left: 264px; top: 798px; width: 15px; height: 15px; background-position: -264px -798px;'],
		[false, false, 'Теплый Стан', 'left: 276px; top: 821px; width: 71px; height: 12px; background-position: -276px -821px;', 'left: 264px; top: 818px; width: 15px; height: 15px; background-position: -264px -818px;'],
		[false, false, 'Ясенево', 'left: 276px; top: 841px; width: 48px; height: 12px; background-position: -276px -841px;', 'left: 264px; top: 838px; width: 15px; height: 15px; background-position: -264px -838px;'],
		[false, false, 'Новоясеневская', 'left: 275px; top: 863px; width: 90px; height: 12px; background-position: -275px -863px;', 'left: 264px; top: 861px; width: 15px; height: 15px; background-position: -264px -861px;'],
		[false, false, 'Бульвар Дмитрия Донского', 'left: 237px; top: 919px; width: 105px; height: 21px; background-position: -237px -919px;', 'left: 228px; top: 906px; width: 15px; height: 15px; background-position: -228px -906px;'],
		[true, false, 'Чистые пруды', 'left: 538px; top: 362px; width: 41px; height: 21px; background-position: -538px -362px;', 'left: 526px;top: 351px;width: 15px;height: 15px;background-position: -526px -351px;'],
		[false, true, 'Проспект Мира', 'left: 531px; top: 231px; width: 81px; height: 11px; background-position: -531px -231px;', ['left: 518px; top: 237px; width: 15px; height: 15px; background-position: -518px -237px;','left: 518px; top: 217px; width: 15px; height: 15px; background-position: -518px -217px;']],
		[false, false, 'ВДНХ', 'left: 551px; top: 132px; width: 36px; height: 15px; background-position: -551px -132px;', 'left: 538px;top: 132px;width: 15px;height: 15px;background-position: -538px -132px;'],
		[false, false, 'Алексеевская', 'left: 550px; top: 158px; width: 79px; height: 17px; background-position: -550px -158px;', 'left: 538px; top: 159px; width: 15px; height: 15px; background-position: -538px -159px;'],
		[false, false, 'Рижская', 'left: 550px; top: 185px; width: 52px; height: 16px; background-position: -550px -185px;', 'left: 538px; top: 185px; width: 15px; height: 15px; background-position: -538px -185px;'],
		[true, false, 'Красные Ворота', 'left: 573px; top: 329px; width: 46px; height: 21px; background-position: -573px -329px;', 'left: 561px;top: 316px;width: 15px;height: 15px;background-position: -561px -316px;'],
		[true, false, 'Александровский сад', 'left: 286px; top: 435px; width: 97px; height: 21px; background-position: -286px -435px;', 'left: 380px; top: 455px; width: 15px; height: 15px; background-position: -380px -455px;'],
		[false, true, 'Новослободская', 'left: 350px; top: 261px; width: 89px; height: 12px; background-position: -350px -261px;', 'left: 347px; top: 245px; width: 15px; height: 15px; background-position: -347px -245px;'],
		[false, true, 'Чкаловская', 'left: 569px; top: 417px; width: 65px; height: 12px; background-position: -569px -417px;', 'left: 622px; top: 403px; width: 15px; height: 15px; background-position: -622px -403px;'],
		[false, true, 'Таганская', 'left: 579px; top: 506px; width: 57px; height: 12px; background-position: -579px -506px;', ['left: 634px; top: 497px; width: 15px; height: 15px; background-position: -634px -497px;','left: 636px; top: 512px; width: 15px; height: 15px; background-position: -636px -512px;']],
		[true, false, 'Новокузнецкая', 'left: 528px; top: 541px; width: 86px; height: 12px; background-position: -528px -541px;', 'left: 518px; top: 546px; width: 15px; height: 15px; background-position: -518px -546px;'],
		[true, false, 'Третьяковская', 'left: 424px; top: 570px; width: 82px; height: 12px; background-position: -424px -570px;', ['left: 507px; top: 567px; width: 15px; height: 15px; background-position: -507px -567px;','left: 496px; top: 556px; width: 15px; height: 15px; background-position: -496px -556px;']],
		[false, true, 'Киевская', 'left: 205px; top: 524px; width: 52px; height: 12px; background-position: -205px -524px;', ['left: 259px; top: 523px; width: 15px; height: 15px; background-position: -259px -523px;','left: 231px; top: 538px; width: 15px; height: 15px; background-position: -231px -538px;','left: 231px; top: 506px; width: 15px; height: 15px; background-position: -231px -506px;']],
		[false, true, 'Марксистская', 'left: 666px; top: 515px; width: 79px; height: 12px; background-position: -666px -515px;', 'left: 657px; top: 505px; width: 15px; height: 15px; background-position: -657px -505px;'],
		[true, false, 'Пушкинская', 'left: 343px; top: 392px; width: 71px; height: 12px; background-position: -343px -392px;', 'left: 373px; top: 376px; width: 15px; height: 15px; background-position: -373px -376px;'],
		[true, false, 'Боровицкая', 'left: 383px; top: 520px; width: 71px; height: 16px; background-position: -383px -520px;', 'left: 380px; top: 506px; width: 15px; height: 15px; background-position: -380px -506px;'],
		[false, false, 'Деловой центр', 'left: 63px; top: 475px; width: 48px; height: 23px; background-position: -63px -475px;', 'left: 111px; top: 474px; width: 15px; height: 15px; background-position: -111px -474px;'],
		[false, false, 'Выставочный центр', 'left: 467px; top: 104px; width: 64px; height: 18px; background-position: -467px -104px;', 'left: 523px; top: 116px; width: 15px; height: 15px; background-position: -523px -116px;'],
		[false, false, 'Ул. Академика Королева', 'left: 460px; top: 134px; width: 66px; height: 18px; background-position: -460px -134px;', 'left: 485px; top: 121px; width: 15px; height: 15px; background-position: -485px -121px;'],
		[false, false, 'Телецентр', 'left: 429px; top: 117px; width: 49px; height: 9px; background-position: -429px -117px;', 'left: 449px; top: 124px; width: 15px; height: 15px; background-position: -449px -124px;'],
		[false, false, 'Ул. Милашенкова', 'left: 376px; top: 134px; width: 81px; height: 10px; background-position: -376px -134px;', 'left: 410px; top: 120px; width: 15px; height: 15px; background-position: -410px -120px;'],
		[false, false, 'Битцевский парк', 'left: 165px; top: 863px; width: 82px; height: 10px; background-position: -165px -863px;', 'left: 247px; top: 861px; width: 15px; height: 15px; background-position: -247px -861px;'],
		[false, false, 'Лесопарковая', 'left: 236px; top: 891px; width: 69px; height: 10px; background-position: -236px -891px;', 'left: 226px; top: 881px; width: 15px; height: 15px; background-position: -226px -881px;'],
		[false, false, 'Спартак', 'left: 118px; top: 218px; width: 50px; height: 13px; background-position: -118px -218px;', 'left: 106px; top: 215px; width: 15px; height: 15px; background-position: -106px -215px;'],
		[false, false, 'Тропарево', 'left: 59px; top: 746px; width: 63px; height: 12px; background-position: -59px -746px;', 'left: 50px; top: 732px; width: 15px; height: 15px; background-position: -50px -732px;'],
		[false, false, 'Котельники', 'left: 816px; top: 795px; width: 65px; height: 12px; background-position: -816px -795px;', 'left: 800px; top: 793px; width: 15px; height: 15px; background-position: -800px -793px;'],
		[false, false, 'Технопарк', 'left: 596px; top: 655px; width: 65px; height: 14px; background-position: -596px -655px;', 'left: 584px; top: 655px; width: 15px; height: 15px; background-position: -584px -655px;'],
		[false, false, 'Румянцево', 'left: 37px; top: 768px; width: 63px; height: 12px; background-position: -37px -768px;', 'left: 28px; top: 754px; width: 15px; height: 15px; background-position: -28px -754px;'],
		[false, false, 'Саларьево', 'left: 25px; top: 787px; width: 71px; height: 12px; background-position: -25px -787px;', 'left: 21px; top: 785px; width: 15px; height: 15px; background-position: -21px -785px;'],
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
			var st = "";
			if (typeof stations[i][4] === 'string') {
				st = '<div class="one-galka" style="' + stations[i][4] + '"></div>';
			} else {
				for (var j = 0; j < stations[i][4].length; j++) {
					st += '<div class="one-galka" style="' + stations[i][4][j] + '"></div>';
				}
			}

			$('.metro-map').append('<div class="wr-station"><div' + dataCenter + dataRing + ' class="one-station" style="' + stations[i][3] + '">' + stations[i][2] + '</div>' + st + '</div>');
		}
	}

// yandex карта
ymaps.ready(init);

var myMap, myMap2,
	myPlacemark, myPlacemark2;

function init(){
	if ($("#yandex-map").length > 0) {
		myMap = new ymaps.Map("yandex-map", {
			center: [55.76, 37.64],
			zoom: 10
		});
		myPlacemark = new ymaps.Placemark([55.76, 37.64], {
			hintContent: 'Москва!',
			balloonContent: 'Столица России'
		});
		myMap.geoObjects.add(myPlacemark);
	}

	if ($("#yandex-map2").length > 0) {
		myMap2 = new ymaps.Map("yandex-map2", {
			center: [55.76, 37.64],
			zoom: 10,
			controls: []
		});
		myPlacemark2 = new ymaps.Placemark([55.76, 37.64], {
			hintContent: 'Москва!',
			balloonContent: 'Столица России'
		});
		myMap2.geoObjects.add(myPlacemark2);
	}
}

function validation() {
    $('form button').unbind().on('click', function(e) {

    	e.preventDefault();

		// Текущая форма
		var $form = $(this).parents('form');
		// Удаляем старые ошибки
		$form.find('.error-text').remove();
		$form.find('.error').removeClass('error');

		// ====== Проверяем параметры ====== //
		var $inp = $form.find('[name=name], [name=name2], [name=phone], input.required, textarea.required');
		$inp.each(function() {
			if (!($(this).val().length >= 4)) {
				$(this).addClass('error').after('<span class="error-text">Заполните поле, минимум 4 символа</span>');
			}
		});

		var _email = new RegExp('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$');
		var $email = $form.find('[name=email]');
		if ($email.length && !_email.test($email.val())) {
			$email.addClass('error').after('<span class="error-text">Это неправильный e-mail</span>');
		}
		var $email = $form.find('[name=email_login]');
		if ($email.length && !_email.test($email.val())) {
			$email.addClass('error').after('<a href="#" class="error-text user-not-found">Нет такого пользователя</a>');
		}

		var $pass0 = $form.find('[name=pass_login]');
		if ($pass0.length && !($pass0.val().length >= 4)) {
			$pass0.addClass('error').after('<p class="error-text invalid-password">Пароль не подходит, вы можете <a href="#">пройти процедуру восстановления</a></p>');
		}

		var $pass1 = $form.find('[name=pass1]');
		if ($pass1.length && !($pass1.val().length >= 4)) {
			$pass1.addClass('error').after('<span class="error-text">Укажите пароль, минимум 4 символа</span>');
		}

		var $pass2 = $form.find('[name=pass2]');
		if ($pass2.length && !(($pass1.val() == $pass2.val()) && ($pass2.val().length >= 4))) {
			$pass2.addClass('error').after('<span class="error-text">Пароли должны совпадать</span>');
		}

		var $capcha = $form.find('[name=capcha]');
		if ($capcha.length && !($capcha.val().length >= 4 )) {
			$capcha.addClass('error');
		}

		var $agree = $form.find('[name=agree]');
		if ($agree.length && !($agree.prop('checked'))) {
			$agree.addClass('error');
		}

		// ====== Если ошибок нет отправляем форму ====== //
		if ($form.find('.error').length == 0) {
			var $CompWin = $('#lawyer-complete-win');
			$CompWin.find('h4').html('Спасибо за регистрацию!');
			$CompWin.find('.note').html('Форма заполнена верно.');
			$CompWin.find('.small').html('Сейчас произойдет перезагрузка страницы.');
			SEORegComplete();
			$.popup({target: $CompWin, open: true});
			if(window.sendform) clearTimeout(window.sendform);
			window.sendform = setTimeout(function () {
				$form.submit();
			}, 1200);
		}

		return false;
	}).on('click', '.captcha .refresh', function() {
		var $this = $(this);
		$.ajax({url: "/ajax/get.new.captcha.code.php"}).done(function (data) {
			var capurl = '/bitrix/tools/captcha.php?captcha_code=';
			$this.siblings('.im').find('img').attr("src", capurl + data);
			$this.siblings('.im').find('[name=capcha_sid]').val(data);
		});
		return false;
	});
}
