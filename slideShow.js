var controller = (function () {
    var interValCtr;
  // Handle all the class names I want to control
  var DOMString = {
    dot: '.dot',
    slide: '.slide',
    sideMenu: '#side-menu',
    main: '#main',
    edit: '#edit',
    closeBtn: '#close-btn',
    navBar: '#navbar',
    navigations: '.navigations'
  }
  
  var expandMenu = function() {
        let main, nav, menuWidth, body, mainPage; 
        main= document.querySelector(DOMString.main);
        nav = document.querySelector('nav'); 
        mainPage = document.querySelector('.main-page');
        body = document.querySelector('body');
        menuWidth = (body.offsetWidth/100) * 20;

        // make menu width to 20% of body
        document.querySelector(DOMString.sideMenu).style.width = '20%';
        main.style.marginLeft = menuWidth + 'px';

        // make navigation bar as the same width as main page and
        // also indent as the same space as main page
        nav.style.width = (body.offsetWidth - 250) + 'px';
        nav.style.left = menuWidth + 'px';
      
        // Stop interval
        stopInterval();
    };
    
    var closeMenu = function() {
        var main, nav;
        main= document.querySelector(DOMString.main);
        nav = document.querySelector('nav'); 
        // menu back to 0
        document.querySelector(DOMString.sideMenu).style.width = 0;
        // main margin back to normal
        main.style.marginLeft = 0;
        // navigation width and lef offset back to normal
        nav.style.left = 0;
        nav.style.width = '100%';
        // start interval
        startInterval();
    };
    
    function navigationCtrl() {
        let $nav = $(DOMString.navBar);
        if (window.pageYOffset > 150) {
            $nav.css('background-color', 'rgb(55, 60, 68)');   
        } else {
            $nav.css('background-color', '');
        }
    }
  // Handle all events happen in the DOM
    var eventHandle = (function() {
        // controll dot in the slides
        $(DOMString.dot).on('click', function(e) {
          var index = $(this).attr('index');
          showSlides(parseInt(index));
        }); 
        // menu
        $(DOMString.edit).on('click', expandMenu);
        // close btn
        $(DOMString.closeBtn).on('click', closeMenu);
        // window onscroll to change background-color
        $(window).on('scroll', navigationCtrl);
        // navigation bar click
        $(DOMString.main + ' ' + DOMString.navigations).on('click', function(e) {
            let href = e.target.getAttribute('href');
            console.log(href);
            $('html, body').animate({
            scrollTop: $(href).offset().top
            }, 500);
            });
    })();
    
  // slide show control
  var showSlides = function(index){
    $(".slide").hide();
    $(".dot").attr("class", "dot");
    var selectorText = ".slide:eq(" + index + ")";
    var dotsSelector = ".dot:eq(" + index + ")";
    $(selectorText).fadeIn(700);
    $(dotsSelector).toggleClass("active");
  }

  var autoSlide = function(){
    var $dot = $(DOMString.dot);
    var $currentDot = $dot.parent().find('span.active');
    var index = parseInt($currentDot.attr('index'));
    if (index >= $dot.length - 1) {
      index = -1;
    }
    showSlides(index + 1);
  };
    
    function startInterval() {
        interValCtr = setInterval(autoSlide, 3000);
    }
    
    function stopInterval() {
        clearInterval(interValCtr);
    }
    
  return {
    init: function(){
      showSlides(0);
      startInterval();
    }
  };
})();
controller.init();