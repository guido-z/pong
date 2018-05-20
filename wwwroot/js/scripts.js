window.onload = () => {
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');

    const configuration = {
        backgroundColor: 'black',
        viewPort: {
            height: canvas.getAttribute('height'),
            width: canvas.getAttribute('width')
        },
        targetFramerate: 16
    };

    const game = new Game(configuration, ctx);
    game.init();
    game.run();
};