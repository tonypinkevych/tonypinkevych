import * as React from 'react'

function* progress(): Generator<number, number, number> {
  let input: number | undefined = yield

  while (true) {
    console.log('!!!', input);
    input = yield input
  }
}

type Unsubscribe = () => void
type Animation = {
  animateTo: () => void
  onProgress: (callback: (progress: number) => void) => Unsubscribe
}

const useProgress = () => {
  return progress()
}

export const Flow: React.FC = () => {
  const animation = useProgress()

  React.useEffect(() => {
    console.log(animation.next(0))
    console.log(animation.next(10))
    console.log(animation.next(20))
  }, [])

  return (
    <div>
      this is a parent
      <Child />
    </div>
  )
}

export const Child: React.FC = () => {
  return <div>this is a child</div>
}
