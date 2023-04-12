const defaultOptions = {
    linkClass: '.card',
    minWidth: 1023, //gallery min Width
    minHeight: 600, //gallery min Height
    showingCount: 4, // how many images will be shown
    currentIndex: 0, // starting image,
    orientation: 'Horizontal'  // Horizontal || Vertical
}; 

const explosionClassName = 'explosion';
const explosionOpenedClassName = 'explosionOpened';
const explosionOpeningClassName = 'explosionOpening';

const explosionSummaryClassName = 'explosionSummary';
const explosionControlsClassName = 'explosionControls';
const explosionImagesClassName = 'explosionImages';

const explosionSummaryContentClassName = 'explosionSummaryContent';
const explosionTitleClassName = 'explosionTitle';
const explosionDescriptionClassName = 'explosionDescription';
const explosionImageClassName = 'explosionImage';

const explosionCloseClassName = 'explosionClose';
const explosionNavsClassName = 'explosionNavs';

const explosionNavClassName = 'explosionNav'; 
const explosionNavPrevClassName = 'explosionNavPrev';
const explosionNavNextClassName = 'explosionNavNext';
const explosionCouterClassName = 'explosionCounter';
const explosionNavDisabledClassName = 'explosionNavDisabled';

const explosionPrevHiddenImageClassName = 'explosionImage_PrevHidden';
const explosionPrevShowingImageClassName = 'explosionImage_PrevShowing';
const explosionActiveImageClassName = 'explosionImage_Active';
const explosionNextShowingImageClassName = 'explosionImage_NextShowing';
const explosionNextHiddenImageClassName = 'explosionImage_NextHidden';

class ExplositionGallery {
    constructor(element, options = defaultOptions){
       this.gallery = element;
       this.options = {
           ...defaultOptions,
           ...options
       };
       this.links = this.gallery.querySelectorAll(this.options.linkClass); //All cards with images

       this.minWidth = options.minWidth;
       this.minHeight = options.minHeight;
       this.showingCount = options.showingCount;
       this.currentIndex = options.currentIndex;
       this.orientation = options.orientation;
       this.size = this.links.length; //size of gallery

       this.initModalWindow();  //create the modal-window gallery with images over starting gallery
       this.setEvents(); // events for modal gallery
    

    }
    initModalWindow(){
        this.modalWindow = document.createElement('div');
        this.modalWindow.classList.add(explosionClassName);
        this.modalWindow.innerHTML = `
            <div class="${explosionSummaryClassName}">
                <div class="${explosionSummaryContentClassName}">
                    <h2 class="${explosionTitleClassName}"></h2>
                    <p class="${explosionDescriptionClassName}"></p>
                </div>
            </div>
            <div class="${explosionControlsClassName}">
                <button class="${explosionCloseClassName}"></button>
                <div class="${explosionNavsClassName}">
                    <button class="${explosionNavClassName} ${explosionNavPrevClassName}"></button>
                    <div class="${explosionCouterClassName}">1/${this.size}</div>
                    <button class="${explosionNavClassName} ${explosionNavNextClassName}"></button>
                </div>
            </div>
            <div class="${explosionImagesClassName}">
                ${  
                    Array.from(this.links).map((elem)=>{
                       return `
                       <img 
                            class="${explosionImageClassName}" 
                            src="${elem.getAttribute('href')}" 
                            alt="${elem.dataset.title}" 
                            data-title="${elem.dataset.title}" 
                            data-description="${elem.dataset.description}" 
                       />`
                    }).join('')
                }
            </div>
        `;
        document.body.append(this.modalWindow); //append modal gallery to body
        
        this.explosionImages = this.modalWindow.querySelectorAll(`.${explosionImageClassName}`);
        this.explosionControlNode = this.modalWindow.querySelector(`.${explosionControlsClassName}`);
        this.explosionNavs = this.modalWindow.querySelector(`.${explosionNavsClassName}`);
        this.explosionControlPrevNode = this.modalWindow.querySelector(`.${explosionNavPrevClassName}`);
        this.explosionControlNextNode = this.modalWindow.querySelector(`.${explosionNavNextClassName}`);
        this.explosionControlCloseNode = this.modalWindow.querySelector(`.${explosionCloseClassName}`);
        this.explosionCouter = this.modalWindow.querySelector(`.${explosionCouterClassName}`);
        this.explosionSummary = this.modalWindow.querySelector(`.${explosionSummaryClassName}`);
        this.explosionTitle = this.modalWindow.querySelector(`.${explosionTitleClassName}`);
        this.explosionDescription = this.modalWindow.querySelector(`.${explosionDescriptionClassName}`);

    }
    setEvents(){
        this.throttledResize = throttle(this.resize, 200);
        window.addEventListener('resize', this.throttledResize);

        this.gallery.addEventListener('click', this.activateGallery );  //to activate gallery
        this.explosionNavs.addEventListener('click', this.switchImage ); //to switch image
        this.explosionControlCloseNode.addEventListener('click', this.closeModal ); // to close modal gallery
        window.addEventListener('keydown', this.keyDown ); //to be able to change images from the keyboard
    }
    resize = () => {
        //handler callback for event "resize"
        if (this.modalWindow.classList.contains(explosionOpenedClassName)){
            this.setInitSizesToImages();
            this.setGalleryStyles();

        }
    }
    keyDown = (event) => {
        //handler callback for event "keydown"
        if (this.modalWindow.classList.contains(explosionOpenedClassName)){
            if (event.key === 'Escape'){
                this.closeModal();
            }
            if (event.key === 'ArrowUp'){
                if (this.currentIndex === 0){
                    return;
                }
                this.currentIndex--;
                this.switchChanges();
            }
            if (event.key === 'ArrowDown'){
                if (this.currentIndex === this.size-1){
                    return;
                }
                this.currentIndex++;
                this.switchChanges();
            }
        }
    }
    closeModal = () => {
        this.setInitPositionsToImages(); //to return images to their starting position

        this.explosionImages.forEach((elem)=>{
            elem.style.opacity = 1;
        });

        //hide summary
        this.explosionSummary.style.width = '0px';
        this.explosionControlNode.marginTop = '3000px'; 

         //hide modal gallery
        fadeOut(this.modalWindow, 500, () => {
            this.modalWindow.classList.remove(explosionOpenedClassName);
        })
        
    }
    switchImage = (event) => {
        event.preventDefault();

        const button = event.target.closest('button');

        if (!button){
            return;
        }
        
        if (button.classList.contains(explosionNavPrevClassName) && this.currentIndex > 0){
            this.currentIndex--;
        }
        if ( (button.classList.contains(explosionNavNextClassName)) && (this.currentIndex < (this.size-1)) ){
            this.currentIndex++;
        }
        //aplly changes with new currentIndex 
        this.switchChanges();
    }
    activateGallery = (event) => {
        //handler callback for event "click" on gallery
        event.preventDefault();
        const link = event.target.closest('a'); //find <a> that was clicked
        if (!link){
            return
        }
        this.currentIndex = Array.from(this.links).findIndex((elem) => {
            return link === elem; //find current elem from all images
        });
        this.modalWindow.classList.add(explosionOpeningClassName);
        fadeIn(this.modalWindow, 50, () => {
            //open modal gallery
            this.modalWindow.classList.remove(explosionOpeningClassName);
            this.modalWindow.classList.add(explosionOpenedClassName);
            this.switchChanges();
        })
        //copy size and position coords of startind images for modal gallery images
        this.setInitSizesToImages();
        this.setInitPositionsToImages();
    }
    setInitSizesToImages(){
        this.links.forEach( (elem, index)=>{
            const data = elem.getBoundingClientRect();
            this.explosionImages[index].style.width = data.width + 'px';
            this.explosionImages[index].style.height = data.height + 'px';
        });
    }
    setInitPositionsToImages(){
        this.links.forEach( (elem, index)=>{
            const data = elem.getBoundingClientRect();
            this.setPositionStyle( this.explosionImages[index], data.left, data.top );
        });
    }
    setPositionStyle(element, x, y){
        element.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
    }
    switchChanges(){
        //set changes
        this.setCurrentState();
        this.switchDisabledNav();
        this.changeCounter();
        this.changeSummary();
    }
    switchDisabledNav(){
        //set "disable" to prev and next button if necessary
        if ( this.currentIndex === 0 && !this.explosionControlPrevNode.disabled ){
            this.explosionControlPrevNode.disabled = true;
        }
        if ( this.currentIndex > 0 && this.explosionControlPrevNode.disabled ){
            this.explosionControlPrevNode.disabled = false;
        }
        if ( this.currentIndex === this.size-1 && !this.explosionControlNextNode.disabled ){
            this.explosionControlNextNode.disabled = true;
        }
        if ( this.currentIndex < this.size-1 && this.explosionControlNextNode.disabled ){
            this.explosionControlNextNode.disabled = false;
        }
    }
    setCurrentState(){
         //create Arrays of 5 categories with images: 
        // - previous hidden images, 
        // - previous visible images 
        // - current active image 
        // - next visible images
        // - next hidden images
        this.explosionPrevHiddenImages = [];
        this.explosionPrevShowingImages = [];
        this.explosionActiveImages = [];
        this.explosionNextShowingImages = [];
        this.explosionNextHiddenImages = [];
        this.currentIndex;
        this.showingCount;

         //and fill this arrays
        this.explosionImages.forEach((elem, index) => {
            if( (index < ((this.currentIndex) - this.showingCount))  ){
                this.explosionPrevHiddenImages.unshift(elem);
            } else if( (index < this.currentIndex) && (index >= this.currentIndex - this.showingCount) ){
                this.explosionPrevShowingImages.unshift(elem);
            } else if(index === this.currentIndex){
                this.explosionActiveImages.push(elem);
            } else if(index <= this.currentIndex + this.showingCount){
                this.explosionNextShowingImages.push(elem);
            } else if (index > this.currentIndex + this.showingCount){
                this.explosionNextHiddenImages.push(elem);
            }    
        })
        //set css for elements of this arrays 
        this.setGalleryStyles();
    }
    setGalleryStyles(){
        //set gallery css-styles for card images with transform (translate3d), scale and opacity
        const imageWidth = this.links[0].offsetWidth;
        const imageHeight = this.links[0].offsetHeight;
        const modalWidth = Math.max(this.minWidth, window.innerWidth);
        const modalHeight = Math.max(this.minHeight, window.innerHeight);


        if (this.orientation == 'Horizontal'){
            const newTop = (modalHeight-imageHeight)/2;
            const newLeft = imageWidth;
            this.explosionPrevHiddenImages.forEach((elem)=> {
                this.setImageStyles(elem, {
                    top: 0,
                    left: -modalWidth,
                    opacity: 0.1,
                    zIndex: 1,
                    scale: 0.4
                });
            });
            this.setImageStyles(this.explosionPrevShowingImages[0], {
                top: newTop,
                left: newLeft,
                opacity: 0.4,
                zIndex: 4,
                scale: 0.75
            });
            this.setImageStyles(this.explosionPrevShowingImages[1], {
                top: newTop,
                left: 0.8*newLeft,
                opacity: 0.3,
                zIndex: 3,
                scale: 0.6
            });
            this.setImageStyles(this.explosionPrevShowingImages[2], {
                top: newTop,
                left: 0.5*newLeft,
                opacity: 0.2,
                zIndex: 2,
                scale: 0.5
            });
            this.setImageStyles(this.explosionPrevShowingImages[3], {
                top: newTop,
                left: 0.3*newLeft,
                opacity: 0.1,
                zIndex: 1,
                scale: 0.4
            });
            this.setImageStyles(this.explosionActiveImages[0], {
                top: newTop,
                left: (modalWidth - imageWidth)/2,
                opacity: 1,
                zIndex: 5,
                scale: 1.3
            });
            this.setImageStyles(this.explosionNextShowingImages[0], {
                top: newTop,
                left: 2*newLeft,
                opacity: 0.4,
                zIndex: 4,
                scale: 0.75
            });
            this.setImageStyles(this.explosionNextShowingImages[1], {
                top: newTop,
                left: 2.3*newLeft,
                opacity: 0.3,
                zIndex: 3,
                scale: 0.6
            });
            this.setImageStyles(this.explosionNextShowingImages[2], {
                top: newTop,
                left: 2.5*newLeft,
                opacity: 0.2,
                zIndex: 2,
                scale: 0.45
            });
            this.setImageStyles(this.explosionNextShowingImages[3], {
                top: newTop,
                left: 2.8*newLeft,
                opacity: 0.1,
                zIndex: 1,
                scale: 0.4
            });
            this.explosionNextHiddenImages.forEach((elem)=> {
                this.setImageStyles(elem, {
                    top: 0,
                    left: 2*modalWidth,
                    opacity: 0.1,
                    zIndex: 1,
                    scale: 0.4
                });
            });
        } else if (this.orientation == 'Vertical') {
            //move previous hidden images to top off the screen
            this.explosionPrevHiddenImages.forEach((elem)=> {
                this.setImageStyles(elem, {
                    top: -modalHeight,
                    left: 0.3*modalWidth,
                    opacity: 0.1,
                    zIndex: 1,
                    scale: 0.4
                });
            });

            //previous visible images
            this.setImageStyles(this.explosionPrevShowingImages[0], {
                top: (modalHeight-imageHeight),
                left: 0.30*modalWidth,
                opacity: 0.4,
                zIndex: 4,
                scale: 0.75
            });
            this.setImageStyles(this.explosionPrevShowingImages[1], {
                top: 0.35*modalHeight,
                left: 0.11*modalWidth,
                opacity: 0.3,
                zIndex: 3,
                scale: 0.6
            });
            this.setImageStyles(this.explosionPrevShowingImages[2], {
                top: 0.09*modalHeight,
                left: 0.15*modalWidth,
                opacity: 0.2,
                zIndex: 2,
                scale: 0.5
            });
            this.setImageStyles(this.explosionPrevShowingImages[3], {
                top: -0.3*imageHeight,
                left: 0.28*modalWidth,
                opacity: 0.1,
                zIndex: 1,
                scale: 0.4
            });

            //current active image
            this.setImageStyles(this.explosionActiveImages[0], {
                top: (modalHeight - imageHeight)/2,
                left: (modalWidth - imageWidth)/2,
                opacity: 1,
                zIndex: 5,
                scale: 1.2
            });

            //next visible images
            this.setImageStyles(this.explosionNextShowingImages[0], {
                top: 0,
                left: 0.5*modalWidth,
                opacity: 0.4,
                zIndex: 4,
                scale: 0.75
            });
            this.setImageStyles(this.explosionNextShowingImages[1], {
                top: 0.12*modalHeight,
                left: 0.7*modalWidth,
                opacity: 0.3,
                zIndex: 3,
                scale: 0.6
            });
            this.setImageStyles(this.explosionNextShowingImages[2], {
                top: 0.46*modalHeight,
                left: 0.67*modalWidth,
                opacity: 0.2,
                zIndex: 2,
                scale: 0.45
            });
            this.setImageStyles(this.explosionNextShowingImages[3], {
                top: 0.67*modalHeight,
                left: 0.53*modalWidth,
                opacity: 0.1,
                zIndex: 1,
                scale: 0.4
            });

            //move next hidden images to down off the screen
            this.explosionNextHiddenImages.forEach((elem)=> {
                this.setImageStyles(elem, {
                    top: 1.5*modalHeight,
                    left: 0.3*modalWidth,
                    opacity: 0.1,
                    zIndex: 1,
                    scale: 0.4
                });
            });

        }
           

        this.setControlStyles(
            this.explosionControlNode, 
            {
                marginTop: (modalHeight - imageHeight*1.2)/2,
                height: imageHeight * 1.2
            }
        )
    }

    setImageStyles(element, {top, left, opacity, zIndex, scale}){
        if (!element){
            return
        }
        element.style.opacity = opacity;
        element.style.transform = `translate3d(${left.toFixed(1)}px, ${top.toFixed(1)}px, 0) scale(${scale})`;
        element.style.zIndex = zIndex;
    }
    setControlStyles(element, {marginTop, height}){
        element.style.marginTop = marginTop + 'px';
        element.style.height = height + 'px';
    }
    changeCounter(){
        this.explosionCouter.innerHTML = `${this.currentIndex+1}/${this.size}`;
    }
    changeSummary(){
        const content = this.explosionImages[this.currentIndex].dataset;
        this.explosionTitle.innerHTML = content.title;
        this.explosionDescription.innerHTML = content.description;
        this.explosionSummary.style.width = '40%';
    }
    deleteGallery(){
        this.modalWindow.innerHTML = '';
        this.modalWindow.remove();
    }
}


// Helpers

function fadeIn(elem, time, callback){
    elem.style.opacity = 0;
    elem.style.transition = `opacity ${time}ms ease`;
    setTimeout( () => {
        elem.style.opacity = 1;
    }, 0);
    if (callback){
        setTimeout(callback, time);
    }
}

function fadeOut(elem, time, callback){
    elem.style.opacity = 1;
    elem.style.transition = `opacity ${time}ms ease`;
    setTimeout( () => {
        elem.style.opacity = 0;
    }, 0);
    if (callback){
        setTimeout(callback, time);
    }
}

function throttle(callback, delay = 200) {
    let isWaiting = false;
    let savedArgs = null;
    let savedThis = null;
    return function wrapper(...args) {
        if (isWaiting) {
            savedArgs = args;
            savedThis = this;
            return;
        }

        callback.apply(this, args);

        isWaiting = true;
        setTimeout(() => {
            isWaiting = false;
            if (savedThis) {
                wrapper.apply(savedThis, savedArgs);
                savedThis = null;
                savedArgs = null;
            }
        }, delay);
    }
}


