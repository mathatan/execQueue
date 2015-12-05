global.SRC_FOLDER = 'src';
global.BUILD_FOLDER = 'build';
global.RELEASE_FOLDER = 'release';
global.TMP_FOLDER = 'tmp';

global.config = {
    paths: {
        src: {
            scripts: SRC_FOLDER + '/src/**/*.js',
            karmaConf : 'karma.conf.js',
            browserify : ['./bower_components', './src'],
            withWrapper: './withWrapper.js',
            withoutWrapper: './withoutWrapper.js'
        },
        dest: {
            build: {
                scripts: BUILD_FOLDER
            },
            release: {
                scripts: RELEASE_FOLDER
            }
        }
    },
    filenames: {
        build: {
            withWrapper: 'withWrapper.js',
            withoutWrapper: 'withoutWrapper.js'
        },
        release: {
            withWrapper: 'withWrapper.min.js',
            withoutWrapper: 'withoutWrapper.min.js'
        }
    }
};
