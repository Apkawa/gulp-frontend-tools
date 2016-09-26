# Структура проектов

* { project_name }
    * app - исходники
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
## Сборка для продакшена
`./build.sh` - скрипт, который пересобирает фронтэнд для продакшена

## Разработка
Запуск дев сервера для проекта u24-desktop

    gulp --project example serve
    
Запуск дев сервера для проекта u24-mobile

    gulp --project example serve


# Основные требования к стилю кода.

https://github.com/airbnb/javascript


Вкратце

* Не используем тернарные операторы
* все if должны быть с фигурными скобками
* если переменная является jQuery селектором, то она начинается с $, только в этом случае!



