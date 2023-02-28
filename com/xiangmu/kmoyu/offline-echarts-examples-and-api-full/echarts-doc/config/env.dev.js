const path = require('path');

module.exports = {
    galleryViewPath: 'http://localhost:8086/echarts-website/examples/${lang}/view.html?c=',
    galleryEditorPath: 'http://localhost:8086/echarts-website/examples/${lang}/editor.html?c=',
    websitePath: 'http://localhost:8086/echarts-website',


    imagePath: 'asset/img/',
    gl: {
        imagePath: 'asset/gl/img/'
    },

    releaseDestDir: path.resolve(__dirname, '../public'),
    ecWWWGeneratedDir: path.resolve(__dirname, '../../echarts-www/_generated')
};