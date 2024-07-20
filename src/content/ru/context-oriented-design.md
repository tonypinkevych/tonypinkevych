---
type: post
title: 'Контекстно-ориентированное проектирование в реакт'
description: 'hi'
pubDate: 'Jul 20 2024'
published: true
---

# Контекстно-ориентированное проектирование в реакт

Многие программисты на реакте грешат тем, что перемешивают логику и рендеринг UI в одном компоненте. Оно и не удивительно, реакт позволяет это делать на интуитивном уровне. Мне такой подход тоже нравится, можно быстро проектировать системы, но на больших проектах он мало эффективен. Например когда нужно вынести некоторые компоненты в storybook, приходится выдумывать каким же образом отделить UI от логики. Появляются дополнительные proxy компоненты, которые используют хук, получают из него нужные данные и дальше прокидывают эти данные в UI компоненты.

Когда подобное разделение начало повторяться снова и снова, я начал думать как его улучшить. Пришёл, как я его назвал, к «контекстно-ориентированному проектированию». Его смысл заключается в том, чтобы двигать как можно больше логики в контексты. И после использовать эти контексты в компонентах. Давайте посмотрим на простом примере, допустим есть компонент:

```tsx
type Book = {
  id: string
  title: string
}

const Books: React.FC = () => {
  const { data: books, isLoading } = useGetBooks()
  const { mutateAsync: deleteBook } = useDeleteBook()

  if (isLoading) {
    return <p>Loading...</p>
  }

  return (
    <ul>
      {books.map((book) => (
        <li key={book.id}>
          {book.title}
          <button onClick={() => deleteBook(book.id)}>Delete</button>
        </li>
      ))}
    </ul>
  )
}
```

Компонент для примера взят простой и достаточно распространённый. Он через аналогичный к react query хуку получает список книг, выводит книги на экран и позволяет удалить любую книгу из коллекции.

Но что, если в команду приходит новый человек и он не знает, что можно делать с коллекцией книг, или с каждой книгой по-отдельности? Решение выглядит несложно – нужно создать объекты `Books` и `Book`, которые смогут вобрать в себя все необходимые методы. Тогда при вызове `new Book(bookId).`, или `new Books().` мы получим список действий, которые мы можем использовать.

То есть код можно переделать на:

```diff
type Book = {
  id: string
  title: string
}

const Books: React.FC = () => {
  const { data: books, isLoading } = useGetBooks()
  const { mutateAsync: deleteBook } = useDeleteBook()
+  const [books] = React.useState(Books)

  if (isLoading) {
    return <p>Loading...</p>
  }

  return (
    <ul>
      {books.map((book) => (
        <li key={book.id}>
          {book.title}
-          <button onClick={() => deleteBook(book.id)}>Delete</button>
+          <button onClick={() => books.delete(book.id)}>Delete</button>
        </li>
      ))}
    </ul>
  )
}
```

Но он плох тем, что нам нужно помнить о создании дополнительных объектов и это также влияет на производительность всего приложения. Поэтому давайте создадим контекст и вытащим всю логику в него:

```tsx
type Book = {
  id: string
  title: string
}

type Books = {
  isLoading: boolean
  list: Book[]
  delete: (bookId: string) => void
}

const BooksContext = React.createContext<Books>(null as any)

export const useBooks = (): Books => {
  const context = React.useContext(BooksContext)

  if (context == null) {
    throw new Error('You can use useBooks only within BooksProvider')
  }

  return context
}

export const ApiBooksProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data, isLoading } = useGetBooks()
  const { mutateAsync: deleteBook } = useDeleteBook()

  return (
    <BooksContext.Provider
      value={{
        isLoading,
        list: data,
        delete: deleteBook,
      }}
    >
      {children}
    </BooksContext.Provider>
  )
}
```

И переделаем наш компонент на использование контекста:

```tsx
const BooksList: React.FC = () => {
  const books = useBooks()

  if (books.isLoading) {
    return <p>Loading...</p>
  }

  return (
    <ul>
      {books.list.map((book) => (
        <li key={book.id}>
          {book.title}
          <button onClick={books.delete}>Delete</button>
        </li>
      ))}
    </ul>
  )
}

// app.tsx
const App: React.FC = () => {
  return (
    <ApiBooksProvider>
      <BooksList />
    </ApiBooksProvider>
  )
}
```

С декларацией контекста кода стало значительно больше, но теперь вся логика связанная с книгами находится в одном месте. А если мы посмотрим на сам компонент, то он стал сильно проще. Представьте, что таких компонентов у вас множество по всему приложению, тогда контекст приносит значительную пользу.

Также при вызове `books.` мы получим список всех доступных свойств и методов.

И при таком подходе реализаций интерфейса `Books` может быть сколько угодно. Допустим для тестового окружения можно создать контекст, который будет хранить данные локально и не делать никаких вызовов по сети. Или можно расширить контекст добавив параметром ссылку на API:

```tsx
const ApiBooksProvider: React.FC<{
  baseUrl: string
  children: React.ReactNode
}> = ({ baseUrl, children }) => {
  // rest of the code
}

// app.tsx
const App: React.FC = () => {
  return (
    <ApiBooksProvider baseUrl="https://your-production-api.com">
      <BooksList />
    </ApiBooksProvider>
  )
}

// app.test.tsx
const App: React.FC = () => {
  return (
    <ApiBooksProvider baseUrl="https://your-mock-api.com">
      <BooksList />
    </ApiBooksProvider>
  )
}
```

## Производительность

Возникает вопрос о производительности, потому что при изменении контекста заново будет рендерится всё дерево компонентов. Чтобы оптимизировать рендеры нужно переносить провайдер максимально близко к месту, где он используется. То есть не оборачивать всё приложение, а обернуть только коллекцию книг, например (обратите внимание на расположение `ApiBooksProvider` в дереве):

```tsx
// app.tsx (before)
const App: React.FC = () => {
  return (
    <ApiBooksProvider>
      <Wrapper1>
        <Wrapper2>
          <Wrapper3>
            <BooksList />
          </Wrapper3>
        </Wrapper2>
      </Wrapper1>
    </ApiBooksProvider>
  )
}

// app.tsx (after)
const App: React.FC = () => {
  return (
    <Wrapper1>
      <Wrapper2>
        <Wrapper3>
          <ApiBooksProvider>
            <BooksList />
          </ApiBooksProvider>
        </Wrapper3>
      </Wrapper2>
    </Wrapper1>
  )
}
```

## Выводы

Данный подход отлично себя показал на больших объёмах кода (проекты с миллионами строк и более). Он позволяет привнести «объектно-ориентированное» мышление и упростить работу с кодом. Все сущности и методы к ним собраны в одном месте и новичок сразу может понять, что ему разрешено делать, а что запрещено: API контекста сам описывает то, что нужно.

И самое удобное в том, что при таком подходе мы можем конфигурировать, расширять и заменять контексты как хотим.
