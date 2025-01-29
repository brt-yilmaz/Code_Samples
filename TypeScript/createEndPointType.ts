type User = {
  name: string
  age: number
}

type Order = {
  id: number
  date: string
}

type Data = {
  user: User | null
  order: Order | null
}

type RequestConstants = keyof Data

type Pending = {
  state: `${Uppercase<RequestConstants>}_PENDING`
}

type Err = {
  state: `${Uppercase<RequestConstants>}_ERROR`
  error: string
}

type Success = {
  [K in RequestConstants]: {
    state: `${Uppercase<K>}_SUCCESS`
    data: NonNullable<Data[K]>
  }
}[RequestConstants]
