var pageData = (function () {
    // create a socialIcon object which keep the data of the object icon on the page (at the footer)
    function SocialIcon(id, type) {
        this.id = id;
        switch (type) {
            case 'facebook': 
                this.classType = 'fa-facebook-square';
                break;
            case 'twitter':
                this.classType = 'fa-twitter-square';
                break;
            case 'linkedin':
                this.classType = 'fa-linkedin';
                break; 
            default:
                this.classType ='unknown';
        }
    }
    
    var template = {
        editContent: '<div id="edit-container" class="container"><div class="text-holder"><h1>Edit Text</h1><textarea name="" id="edit-text" class="form-control"></textarea><button id="edit-btn" class="btn btn-primary">Change</button></div></div>',
        brandContent: '<div id="edit-container" class="container"><div class="text-holder"><h2>Enter Your Brand Name</h2><textarea name="" id="edit-text" class="form-control"></textarea><button id="edit-btn" class="btn btn-primary">Change</button></div></div>',
        choiceContent: '<div id="edit-container" class="container"><div class="text-holder"><h2 class="warning">Before you processing any further, keep in mind that this will be the final state of your site. No more editting will be conducted on this site.</h2><div class="choices"><div class="row"><div class="col-xs-6"><input type="button" name="yes" value="yes"/></div><div class="col-xs-6"><input type="button" name="no" value="no"/></div></div></div></div></div>'
    };

    var data = {
        socialIconObj: []  
    }
    
    return {
        getTemplate: function () {
            return template.editContent;
        },
        getBrandContent: function() {
            return template.brandContent;
        },
        getChoiceContent: function() {
            return template.choiceContent;
        },
        menuOpen: false,
        collectionImageTarget: '',
        // get the socialIconObj array from data object
        getSocialIcons: function() {
            return data.socialIconObj;
        },
        // add a new social button object in the socialIconObj array
        addSocialIconObj: function(type) {
            // create an id
            let id;
            if (data.socialIconObj.length == 0) {
                id = 0;
            } else {
                let lastObject = data.socialIconObj[data.socialIconObj.length - 1];
                id = lastObject.id + 1;
            } 
            
            var newSocial = new SocialIcon(id, type);
            data.socialIconObj.push(newSocial);
            return newSocial;
        },
        // create a socialIcon HTML element from the socialIcon object
        createSocialEle: function (socialObj) {
            
            let divContainer = document.createElement('div');
            divContainer.className = 'soc-container';
            
            let a = document.createElement('a');
            a.href = 'http://';
            
            let ele = document.createElement('i');
            ele.className = 'fab ' + socialObj.classType;
            ele.id = socialObj.id;
            
            a.appendChild(ele);
            divContainer.appendChild(a);
            
            return divContainer;
        },
        deleteSocialData: function(id) {
            let targetIndex;
            data.socialIconObj.forEach(function(cur, i) {
                if (cur.id === parseInt(id)) {
                    targetIndex = i;
                } 
            });
            let deletedObj = data.socialIconObj.splice(targetIndex, 1);
        },
        
        // method for devleloper
        getData: function() {
            return data;
        }
    };
})();

var UICtrl = (function () {
    var DOMString = {
        dot: '.dot',
        slide: '.slide',
        sideMenu: '#side-menu',
        sideMenuBtn: '#side-menu button.edit',
        main: '#main',
        edit: '#edit',
        closeBtn: '#close-btn',
        navBar: '#navbar',
        navigations: '.navigations',
        editBtn: '#edit-btn',
        editText: '#edit-text',
        editContainer: '#edit-container',
        choices: '#edit-container .choices',
        picHolder : '.pics-holder',
        collection: '.collection',
        imageHolder: '.image-holder',
        pictures: '.pictures',
        collectionImages: '#collection-images',
        mainBtn: '#main-btn',
        backgroundSelector: '#background-selector',
        backgroundGallery: '#background-gallery',
        mainPage: '.main-page',
        nav: 'nav',
        socialEditor: '#side-menu .available',
        socialIco: '#side-menu .social-ico'
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
        // gather info about provided source of images and then render a pop up option with background images for user to select.
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
        },
        // insert the socialIcon to page
        insertSocialIcon: function(socialEle) {
            let targetEle = document.querySelector('footer .social');
            targetEle.appendChild(socialEle);
        },
        // append the social icon editor (control social link href) in the side menu
        insertSocialEditor: function(type, id) {
             let mainNode = document.querySelector('#side-menu #footer-edit .available');
            
            let p = document.createElement('p');
            p.className = 'soc-container'
            p.textContent = type.charAt(0).toUpperCase() + type.slice(1) + ' link: ';
            
            let span = document.createElement('span');
            span.setAttribute('social-id', id);
            span.setAttribute('contenteditable', 'true');
            span.className = 'link';
            span.textContent = 'http://';
            
            let svg = document.createElement('i');
            svg.setAttribute('data-fa-transform', 'grow-6 right-6');
            svg.className = 'fas fa-minus-circle';
            p.appendChild(span);
            p.appendChild(svg);
            mainNode.appendChild(p);
        },
        // delete social ico in side menu or main page
        deleteSocialIco: function(id, option) {
            switch (option) {
                case 'side menu':
                    break;
                case 'main page':
                    let social = document.querySelector('footer .social');
                    let socialIcoContainer = document.getElementById(id).parentNode.parentNode;
                    social.removeChild(socialIcoContainer);
                    break;
            }
        }
    };
})();
var controller = (function (data, UI) {
    var interValCtr;
    // Handle all the class names I want to control
    var DOMString = UI.getDOMString();

    function updateText(ele) {
        content = $(DOMString.editText).val();
        // Remove event
        $(DOMString.editBtn).off('click');
        $(DOMString.editText).off('keydown');
        // remove edit box
        UI.removeElement(DOMString.editContainer);
        // Add that text value to element target
        ele.textContent = content;
    }

    function editTextCtr(e) {
        e.preventDefault();
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
            $(DOMString.editBtn).on('click', function(){
                updateText(ele);
            });
            $(DOMString.editText).on('keydown', function (e) {
                var x = e.keyCode;
                if (x === 13) {
                    updateText(ele);
                }
            });
        }
    }

    // This controll to change the background using
    // provided images of background
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
    
    

    // control the button change in edit menu
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
    
    // this function will link the contenteditable span link in edit menu
    // to the social url in the main porfolio
    function embedLink(e) {
        const ele = e.target;
        if (e.type === 'focusout') {
            const attr = ele.getAttribute('social-id');
            let ico = document.getElementById(attr);
            const mainEle = document.getElementById(attr).parentNode;
            mainEle.href= ele.textContent;

            // disable hight light corresponding social icon
            ico.style.color = '';
        } else if (e.type === 'keydown' && e.key === 'Enter') {
            e.preventDefault()
            console.log(e.key);
            e.target.blur();
        }
    }
    
    // append social link editor to side menu
    function appendSocialEditor(socialObj) {
        let type = socialObj.classType.split('-')[1];
        let id = socialObj.id;
        
        UI.insertSocialEditor(type, id);
    }
    
    // when focus on social icon in side menu, social icon in the main page is highlight with cholate color
    function socialLinkEdit(e) {
        const ele = e.target;
        
        if (ele.className == 'link') {
        const attr = ele.getAttribute('social-id');
        const ico = document.getElementById(attr);
        
        // hight light corresponding social icon
        ico.style.color = 'chocolate';
        }
    }
    
    // this function will add social icon to side menu and and social icon to main page
    function addSocialLink(type) {
        // add a social button correspondingly to that clicked button on the main page
        let newSocialIco = data.addSocialIconObj(type);
        appendSocialIcon(newSocialIco);

        // add a editor which will pair with the social button on the main page
        appendSocialEditor(newSocialIco);
    }
    
    function handleAddSocial(e) {
        
        /* since the event target is fired on svg inconsistently, I have to check if it is fired on svg element or path (which is child node of svg element) to find correct span */
        let span;
        if (e.target.parentNode.getAttribute('type')) {
            span = e.target.parentNode;
        } 
        else if (e.target.parentNode.parentNode.getAttribute('type')) {
            span = e.target.parentNode.parentNode;
        }
        
        const type = span.getAttribute('type');
        // determine if the selected node is right, which means its parent node of parent node has the type attribute
        if (type) {
           addSocialLink(type);
        }    
    }
    
    // event handler to handle delete button of a social editor
    // in the #side-menu #footer-edit .available
    function handlerDeleteSocialIco(e) {
        let ele;
        // in this case, in font awesome, what we clicked on is the <path> element which is a child of <svg>, so ownerSVG is the parent node of that element. ownerSVG contains all of hte <i> element contains.
        if (e.target.nodeName == 'path') {
            ele = e.target.parentNode.parentNode.parentNode;
        } else if (e.target.nodeName == 'svg' ) {
            ele = e.target;
        }
        // check the type of the font-awesome if it match the delete button
        if (ele && ele.classList[1] == 'fa-minus-circle') {
            let prevSibling = ele.previousSibling;
            let parentNode = ele.parentNode;
            let grandPartenNode = parentNode.parentNode;
            let id = prevSibling.getAttribute('social-id');
            
            // delete social ico in main page
            UI.deleteSocialIco(id, 'main page');
            
            // delete social ico object in data
            data.deleteSocialData(id);
            
            // delete social editor in side menu
            grandPartenNode.removeChild(parentNode);
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

            // Stop interval which will slide through content at the client section
            stopInterval();

            // Add event: double click to edit text, make changeBtn
            $(DOMString.main).on('dblclick', editTextCtr);
            $(DOMString.sideMenuBtn).on('click', makeChangeBtn);
            
            /* modify social icon event */
            // !!!!!!!!!!! THESE EVENTS NEEDED TO BE TAKE OF WHEN FINALLIZE THE PAGE
            $(DOMString.socialEditor).focusout(embedLink);
            $(DOMString.socialEditor).on('keydown', embedLink);
            $(DOMString.socialEditor).on('focusin', socialLinkEdit);
            $(DOMString.socialEditor).on('click', _.debounce(handlerDeleteSocialIco, 150));
            // add social media 
            $(DOMString.socialIco).on('click', handleAddSocial);
            /* end of modify social icon event */
            

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
            $(DOMString.socialEditor).off('focusout');
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

    // this get choice run to get user choice when a warning pops up
    function getChoice(e) {
        let choice = e.target.getAttribute('name');
        if (choice.toUpperCase() === 'YES') {
            return 1;
        } else {
            return 0;
        }
    }
    
    function removeEditingFeature() {
        UI.removeElement(DOMString.sideMenu);
        
        // remove all the event in editing features
        $(DOMString.socialEditor).off('focusout');
        $(DOMString.socialEditor).off('keydown');
        $(DOMString.socialEditor).off('focusin');
        $(DOMString.socialEditor).off('click');
        // add social media 
        $(DOMString.socialIco).off('click');
        
         // menu
        $(DOMString.edit).off('click');

        // close btn
        $(DOMString.closeBtn).off('click');
    }
    
    // finalize will be invoked when user want to finalize their web page,
    // which put their web page to the final state, no more editing.
    function finalize() {
        console.log('finalize is running...');
        let body = document.querySelector('body');
        let sideMenu = document.getElementById('side-menu');
        let edit = document.getElementById('edit');
        let warningPopUp = data.getChoiceContent();
        let brand = data.getBrandContent();
        UI.addHTMLTemplate('body', warningPopUp);
        
        $(DOMString.choices).on('click', function(e) {
           let choice = getChoice(e);
            UI.removeElement(DOMString.editContainer);
            if (choice == 1) {
                $(DOMString.choices).off('click');
                
                UI.addHTMLTemplate('body', brand);
                // Add event to submit change
                $(DOMString.editBtn).on('click', function(){
                updateText(edit);
                });
                $(DOMString.editText).on('keydown', function (e) {
                var x = e.keyCode;
                if (x === 13) {
                updateText(edit);
                }
                closeMenu();
                removeEditingFeature();
                edit.id = 'brand-name';
                edit.href="#";
            });
            }
        });
    }
    // Handle all events happen in the DOM
    var eventHandler = (function () {
        // controll dot in the slides
        $(DOMString.dot).on('click', function (e) {
            var index = $(this).attr('index');
            showSlides(parseInt(index));
        });

        // menu
        $(DOMString.edit).on('click', expandMenu);

        // close btn
        $(DOMString.closeBtn).on('click', closeMenu);

        // window onscroll to change background-color on navigation bar
        $(window).on('scroll', navigationCtrl);

        // navigation bar click
        $(DOMString.main + ' ' + DOMString.navigations).on('click', navigationScroll);
        $(DOMString.mainBtn).on('click', navigationScroll);
        
        // collection display on respectively name button
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
        
        // finalize the webpage
        $('#side-menu #edit-finalize button').on('click', finalize);
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
    
    // create new social icon object, add it to data storage and append it to html page
    function appendSocialIcon(socialObj) {
        console.log('run');
        UI.insertSocialIcon(data.createSocialEle(socialObj));

    }
    
    
    
    initIntro = (function() {
        let instruction = ['<div class="text-holder"><h1>Instruction</h1></div><div class="content-holder"><div class="instruction"><p>Click "Edit" on the left right corner the edit the page</p><p>After the edit menu bar opens, you can make change to the text content on the page by double click on it</p><p>In the edit menu bar, there are options that you can change background images, background color, add social buttons, etc</p><p class="warning">After all the change you make, click finalize button. Keep in mind that after finalize the page, no more editing will be able to make on the page.</p></div></div></div>'];
       
        count = 0;
        // introduction to the page
     function nextIntro() {
            let parentNode = document.querySelector('#edit-container .intro');
            while (parentNode.firstChild) {
                parentNode.removeChild(parentNode.firstChild);
            }
            
         if (instruction[count]) {
             console.log('adding instruction');
             let content = document.querySelector('#edit-container .intro');
             content.insertAdjacentHTML('afterbegin', instruction[count]);
             count++;
         } else {
             let content = document.querySelector('#edit-container');
             content.parentNode.removeChild(content);
             $('#edit-container .choices input').off('click');
         }      
        }
        
        return {
            onClickNext: function() {
                 $('#edit-container .choices input').on('click', nextIntro);
            }
        };
    })();
    
    function startInterval() {
        interValCtr = setInterval(autoSlide, 3000);
    }

    function stopInterval() {
        clearInterval(interValCtr);
    }

    //!!!!!!!!! Testing purpose, deleted this if finished a complete product
    // end testing
    return {
        init: function () {
            showSlides(0);
            startInterval();
            UI.hideCollections();
            
            // create 3 social icon and append to html page
            addSocialLink('facebook');
            addSocialLink('twitter');
            addSocialLink('linkedin');
            
            // initial intro function
            initIntro.onClickNext();
        }
    };
})(pageData, UICtrl);

controller.init();