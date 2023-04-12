let explosionGallery = new ExplositionGallery(
    document.querySelector('.gallery'),
    {
        linkClass: '.card',
        minWidth: 1023,
        minHeight: 600,
        showingCount: 4, 
        currentIndex: 0, 
        orientation: 'Vertical' // Horizontal || Vertical
    }
);

const gallery_horizontal = document.querySelector('#gallery_horizontal');
const gallery_vertical = document.querySelector('#gallery_vertical');

gallery_horizontal.addEventListener('click', function(){
    //delete prev gallery
    explosionGallery.deleteGallery();
    explosionGallery = null;

    //add new gallery
    explosionGallery = new ExplositionGallery(
        document.querySelector('.gallery'),
        {
            linkClass: '.card',
            minWidth: 1023,
            minHeight: 600,
            showingCount: 4, 
            currentIndex: 0, 
            orientation: 'Horizontal'
        }
    );
    this.classList.add('gallery__button_active');
    gallery_vertical.classList.remove('gallery__button_active');
})

gallery_vertical.addEventListener('click', function(){
    //delete prev gallery
    explosionGallery.deleteGallery();
    explosionGallery = null;

    //add new gallery
    explosionGallery = new ExplositionGallery(
        document.querySelector('.gallery'),
        {
            linkClass: '.card',
            minWidth: 1023,
            minHeight: 600,
            showingCount: 4, 
            currentIndex: 0, 
            orientation: 'Vertical'
        }
    );
    this.classList.add('gallery__button_active');
    gallery_horizontal.classList.remove('gallery__button_active');
})