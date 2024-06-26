---
type: post
title: 'Как пройти код ревью'
description: 'hi'
pubDate: 'May 31 2024'
published: false
---

> возможно удалить, мб этот пост и не нужен

1. На тестовом/стейджинг окружении должна быть проверена каждая спецификация задачи;
2. PR должен быть небольшого размера. В идеале 100-200 строк, максимум 1000 строк в крайних случаях;
3. PR должен относится к одному конкретному изменению, которое легко описать одним предложением или меньше;
4. PR включает описание или ссылку на тикет в системе трекинга;

## PR flow

1. Все PR создаются в ветке `main`;
2. каждый PR должен быть связан с тикетом или иметь описание того, что именно было сделано;
3. если были созданы или изменены компоненты пользовательского интерфейса:
   1. на этом PR создается ярлык `preview*`, он нужен для того, чтобы вывести код в среду предварительного просмотра;
   2. должен быть прикреплен файл `.stories.tsx`;
4. каждый PR создается из шаблона, поэтому рекомендуется перепроверять каждый элемент перед отправкой на рецензию.

Например, у вас есть задача «создать новый визуальный A/B-тест 2 экранов на воронке». Вы можете разделить эту задачу на 4 независимых PR:

1. настроить AB-тест;
2. создать экран №1;
3. создать экран №2;
4. интегрировать все экраны с AB-тестом.

Конечно, вы сами решаете, как правильно обращаться с PR. Основная причина введения этих правил - сделать рецензирование кода более удобным. Чем меньше PR, тем проще и быстрее процесс рецензирования.
