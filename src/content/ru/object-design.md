---
type: post
title: 'Дизайн объектов'
description: 'hi'
pubDate: 'Jul 13 2024'
published: false
---

Продумай дизайн объектов сначала. По мотивам задачи из прототипов фигмы.

Была задача – переписать код импортирования прототипов из Фигмы в модель данных Аниникса с версии 1 на версию 2. В новой моделе данных поменялось API. С первого взгляда задача выглядит несложно – нужно всего лишь написать маппер из одного формата в другой. Но загвоздка была в том, что первая версия была написана процедурно, то есть каждый шаг был просто описан длинным полотном кода. Я помню как я писал это в первый раз, получилось очень быстро. Но при появлении багов нужно было тратить время, чтобы провести дебаггинг и найти нужный кусок кода. Кое-как мы доделали первую версию. Но прошло пол года, проект развивается и нужно решать баги, которые были при первоначальном решении.

Вначале я начал работать в лоб: просто начать писать функции и смотреть, что из них получается. Но потом понял, что сложность процедурного кода такая, что сложно вообще собрать его в голове. После этого разбил на функции, получились теже яйца, только в профиль. И после этого я уже подумал, что так продолжаться не может и решил сделать нормаль. Сел, продумал сущности, которые у меня есть, подумал как они должны себя вести, то есть сделал дизайн. И после этого работа пошла как нужно: быстро, если встречались баги, то сразу было понятно почему они возникают. То есть можно было не дебажить код, а угадывать в каком месте поведение работает неверно. И самое прекрасное – кода получилось сильно меньше.

Как итог себе на будущее – всегда начинать с дизайна, даже если кажется, что это простой маппер данных.
