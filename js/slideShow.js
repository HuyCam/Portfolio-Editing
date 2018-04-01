var pageData = (function () {
    var template = {
        editContent: '<div id="edit-container" class="container"><div class="text-holder"><h1>Edit Text</h1><textarea name="" id="edit-text" class="form-control"></textarea><button id="edit-btn" class="btn btn-primary">Change</button></div></div>'
    };

    return {
        getTemplate: function () {
            return template.editContent;
        },
        menuOpen: false,
        collectionImageTarget: '',
    };
})();

var UICtrl = (function () {
    var DOMString = {
        dot: '.dot',
        slide: '.slide',
        sideMenu: '#side-menu',
        sideMenuBtn: '#side-menu button',
        main: '#main',
        edit: '#edit',
        closeBtn: '#close-btn',
        navBar: '#navbar',
        navigations: '.navigations',
        editBtn: '#edit-btn',
        editText: '#edit-text',
        editContainer: '#edit-container',
        picHolder : '.pics-holder',
        collection: '.collection',
        imageHolder: '.image-holder',
        pictures: '.pictures',
        collectionImages: '#collection-images',
        mainBtn: '#main-btn',
        backgroundSelector: '#background-selector',
        backgroundGallery: '#background-gallery',
        mainPage: '.main-page',
        nav: 'nav'
    };

    return {
        addHTMLTemplate: function (selector ,html) {
            $(selector).prepend(html);
        },
        appendDOMnode: function (parent, DOM) {
          $(parent).append(DOM);  
        },
        removeElement: function (element) {
            $(element).remove();
        },
        expendMenu: function () {
            let main, nav, menuWidth, body, mainPage;
            main = document.querySelector(DOMString.main);
            nav = document.querySelector('nav');
            mainPage = document.querySelector('.main-page');
            body = document.querySelector('body');
            sideMenu = document.querySelector(DOMString.sideMenu);
            menuWidth = (body.offsetWidth / 100) * 20;

            // make menu width to 20% of body
            sideMenu.style.width = '20%';
            console.log(sideMenu);
            // change main page width
            main.style.marginLeft = menuWidth + 'px';

            // make navigation bar as the same width as main page and
            // also indent as the same space as main page
            nav.style.width = (body.offsetWidth - menuWidth) + 'px';
            nav.style.left = menuWidth + 'px';

            // Overflow control
            sideMenu.style.overflowY = 'hidden';
            setTimeout(function () {
                sideMenu.style.overflowY = 'auto'
            }, 500);
            
            // add editable class to collections
            $(DOMString.imageHolder).find('img').toggleClass('editable');
        },
        closeMenu: function () {
            var main, nav;
            main = document.querySelector(DOMString.main);
            nav = document.querySelector(DOMString.nav);
            sideMenu = document.querySelector(DOMString.sideMenu);
            // menu width back to 0
            sideMenu.style.overflowY = 'hidden';
            sideMenu.style.width = 0;
            // main margin back to normal
            main.style.marginLeft = 0;
            // navigation width and lef offset back to normal
            nav.style.left = 0;
            nav.style.width = '100%';
            
            // remove editable class from colelctions
            $(DOMString.imageHolder).find('img').toggleClass('editable');
        },
        getDOMString: function () {
            return DOMString;
        },
        collectionDisplay: function (e) {
            e.preventDefault();
            let ele = e.target;
            let collections = $(DOMString.collection);
            let index = parseInt(ele.getAttribute('number')) - 1;
            let pic = $(DOMString.pictures + ':eq(' + index + ')');
            collections.removeClass('active');
            e.target.classList.toggle('active');
            $(DOMString.pictures).fadeOut(500);
            pic.delay(400).fadeIn(500);
            console.log('collection Display is triger');
        },
        backgroundImage: function (e) {
            e.preventDefault();
            let div = document.createElement('div');
            let divChild = document.createElement('div');
            divChild.setAttribute('class', 'background-holder');
            div.setAttribute('id', 'background-gallery');
            $.getJSON('data/image-JSON.json').done(function (data) {
                console.log(data);
                data.forEach(function (cur) {
                    let img = document.createElement('img');
                    img.setAttribute('src', cur.source);
                    img.setAttribute('title', 'Author: ' + cur.author);
                    img.setAttribute('class', 'img-rounded img-responsive');
                    divChild.appendChild(img);
                });
            }).fail(function () {
                console.log('Can not load JSON');
            });
            div.appendChild(divChild);
            $('body').prepend(div);
        },
        hideCollections: function () {
            $(DOMString.pictures).hide();
            $(DOMString.pictures + ':eq(0)').show();
        }

    };
})();
var controller = (function (data, UI) {
    var interValCtr;
    // Handle all the class names I want to control
    var DOMString = UI.getDOMString();

    function updateText() {
        content = $(DOMString.editText).val();
        // Remove event
        $(DOMString.editBtn).off('click');
        // remove edit box
        UI.removeElement(DOMString.editContainer);
        // Add that text value to element target
        ele.textContent = content;
    }

    function editTextCtr(e) {
        ele = e.target;
        // Check if element content text
        if (ele.textContent && (ele.nodeName == 'H1' || ele.nodeName == 'H2' || ele.nodeName == 'H3' || ele.nodeName == 'H4' || ele.nodeName == 'H5' || ele.nodeName == 'P')) {
            var content;
            // Get edit box template
            var template = data.getTemplate();
            // Add edit box template to UI
            UI.addHTMLTemplate('body', template);
            $(DOMString.editText)[0].focus();
            // Add event to submit change
            $(DOMString.editBtn).on('click', updateText);
            $(DOMString.editText).on('keydown', function (e) {
                var x = e.keyCode;
                if (x === 13) {
                    updateText();
                }
            });
        }
    }

    function backgroundChange(e) {
        let ele = e.target;
        if (ele.nodeName == 'IMG') {
            let source = ele.getAttribute('src');
            let url = 'url("' + source + '")';
            $(DOMString.mainPage).css('background-image', url);
        }
        // remove event
        $(DOMString.backgroundGallery).off('click');
        $(DOMString.backgroundGallery).remove();
    }

    function backgroundGallery(e) {
        // get and display background images
        UI.backgroundImage(e);

        // add Event Listener to background change
        $(DOMString.backgroundGallery).on('click', backgroundChange);
    }

    function makeChangeBtn(e) {
        let $targetChange;
        let ele = e.target;
        let parentID = ele.parentNode.getAttribute('id');
        let targetID = parentID.split('-')[0];
        let $inputVal = $('#' + parentID).find('input');
        let value = $inputVal.val();

        // if it is main control then have special edit
        if (targetID == 'main') {
            $targetChange = $('#' + targetID + ' a.btn');
            $targetChange.text(value);
        } else {
            $targetChange = $('#' + targetID);
            $targetChange.css('background-color', value);
        }
    }
    
    function imageCollectionSelect(e) {
        let ele = e.target;
        let parent = ele.parentNode;
        
        // if it is image then open pop up window
        if (parent.className === 'image-holder') {
            // create contain DOM node
            let main = document.createElement('div');
            let div = document.createElement('div');
            main.setAttribute('id', 'collection-images');
            div.setAttribute('class', 'image-box');
            
            //render all images
            $.getJSON('data/collections.json').done(function (data) {
            data.forEach(function(cur) {
               let img = document.createElement('img');
                img.setAttribute('src', cur.src);
                div.appendChild(img);
            });
            }).fail(function () {
            console.log('Can not load collections.json');
            });
            
            // display all content
            main.appendChild(div);
            UI.appendDOMnode(DOMString.picHolder, main);
            
            // save the target
            data.collectionImageTarget = ele;
            
        } // if it is image in pop up window then change image source of event target
        else if (parent.className === 'image-box') {
            let newSRC = ele.getAttribute('src');
            data.collectionImageTarget.setAttribute('src', newSRC);
            UI.removeElement(DOMString.collectionImages);
            data.collectionImageTarget = '';
        }
    }
    var expandMenu = function () {
        if (!data.menuOpen) {
            // Expend menu
            UI.expendMenu();

            // Stop interval
            stopInterval();

            // Add event
            $(DOMString.main).on('dblclick', editTextCtr);
            $(DOMString.sideMenuBtn).on('click', makeChangeBtn);

            // set menuOpen to true indicates that menu is already open
            data.menuOpen = true;
        }
    };

    var closeMenu = function () {
        if (data.menuOpen) {
            // close menu
            UI.closeMenu();
            // start interval
            startInterval();
            // Remove event
            $(DOMString.main).off('dblclick');
            // set menuOpen to false after closing
            data.menuOpen= false;
        }
    };

    function navigationCtrl() {
        let $nav = $(DOMString.navBar);
        if (window.pageYOffset > 150) {
            $nav.css('background-color', 'rgb(55, 60, 68)');
        } else {
            $nav.css('background-color', '');
        }
    }

    // scrolling when click on the button or navigation bar
    function navigationScroll(e) {
        let href = e.target.getAttribute('href');
        $('html, body').animate({
            scrollTop: ($(href).offset().top - 70) // 70 is the height of the navigation bar
        }, 500);
    }

    // Handle all events happen in the DOM
    var eventHandle = (function () {
        // controll dot in the slides
        $(DOMString.dot).on('click', function (e) {
            var index = $(this).attr('index');
            showSlides(parseInt(index));
        });

        // menu
        $(DOMString.edit).on('click', expandMenu);

        // close btn
        $(DOMString.closeBtn).on('click', closeMenu);

        // close background gallery
        // window onscroll to change background-color on navigation bar
        $(window).on('scroll', navigationCtrl);

        // navigation bar click
        $(DOMString.main + ' ' + DOMString.navigations).on('click', navigationScroll);
        $(DOMString.mainBtn).on('click', navigationScroll);
        
        // collection display on respectively name tag
        $(DOMString.collection).on('click', UI.collectionDisplay);

        // background img select 
        $(DOMString.backgroundSelector).on('click', backgroundGallery);

        // window on change (resize)
        window.onresize = function (e) {
            if (data.menuOpen) {
                data.menuOpen = false;
                expandMenu();
            }
        };
        
        // choose images from collection
        $(DOMString.picHolder).on('click', imageCollectionSelect)
    })();

    // slide show control
    var showSlides = function (index) {
        $(".slide").hide();
        $(".dot").attr("class", "dot");
        var selectorText = ".slide:eq(" + index + ")";
        var dotsSelector = ".dot:eq(" + index + ")";
        $(selectorText).fadeIn(700);
        $(dotsSelector).toggleClass("active");
    }

    var autoSlide = function () {
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

    // Testing purpose, deleted this if finished a complete product
    function jsonTesting() {
        $.getJSON('data/collections.json').done(function (data) {
            console.log(data);
        }).fail(function () {
            console.log('Can not load JSON');
        });
    }
    // end testing
    return {
        init: function () {
            showSlides(0);
            startInterval();
            UI.hideCollections();
            expandMenu();
            jsonTesting();
        }
    };
})(pageData, UICtrl);

controller.init();
