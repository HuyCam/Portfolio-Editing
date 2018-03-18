var pageData = (function() {
    var template = {
      editContent: '<div id="edit-container" class="container"><div class="text-holder"><h1>Edit Text</h1><textarea name="" id="edit-text" class="form-control"></textarea><button id="edit-btn" class="btn btn-primary">Change</button></div></div>'  
    };
    
    return {
        getTemplate: function() {
            return template.editContent;
        }
    };
})();

var UICtrl = (function() {
    return {
        addEditBox: function(html) {
          $('body').prepend(html);
        },
        removeElement: function(element) {
            $(element).remove();
        }
    };
})();
var controller = (function (data, UI) {
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
    navigations: '.navigations',
    editBtn: '#edit-btn',
    editText: '#edit-text',
    editContainer:  '#edit-container'
  };
  function editTextCtr(e) {
      ele = e.target;
      // Check if element content text
      if (ele.textContent && (ele.nodeName == 'H1' || ele.nodeName == 'H2' || ele.nodeName == 'H3' || ele.nodeName == 'H4' || ele.nodeName == 'H5' || ele.nodeName == 'P')) {
          var content;
          // Get edit box template
          var template = data.getTemplate();
          console.log(template);
          // Add edit box template to UI
          UI.addEditBox(template);
          $(DOMString.editText)[0].focus();
          // Add event to submit change
          $(DOMString.editBtn).on('click', function() {
              content = $(DOMString.editText).val();
              // Remove event
              $(DOMString.editBtn).off('click');
              // remove edit box
              UI.removeElement(DOMString.editContainer);
              // Add that text value to element target
              ele.textContent = content;
          });
          
          
          
      }
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
        // Add event to edit text content
        $('#main').on('dblclick', editTextCtr);
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
        // Remove event dblclick to edit text content
        $('#main').off('dblclick');
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
})(pageData, UICtrl);

controller.init();