[![gulp-frontend-tools](https://david-dm.org/apkawa/gulp-frontend-tools.svg)](https://david-dm.org/apkawa/gulp-frontend-tools)

[![Build Status](https://travis-ci.org/Apkawa/gulp-frontend-tools.svg?branch=master)](https://travis-ci.org/Apkawa/gulp-frontend-tools)

# Структура проектов

* { project_name }
    * app - исходники
        * images
            * sprites - спрайты
        * public - файлы которые нужно копировать в dist. 
            Копируются относительно dist/, могут перезаписать существующие
        * scripts
            * entry - точки входа для webpack
        * styles - стили
        * templates - nunjucks/jinja2 шаблоны, .j2, .jinja2, .html
        * templates_context - контекст шаблонов, .json, .yaml, .js.
        
    * dist - собранные файлы
        * js
        * css
        * templates - собранные шаблоны
        * index.html - список html файлов
       
        

# Сборка проекта



# contribute
    
    npm install

    npm install babel-cli
    
    npm run watch