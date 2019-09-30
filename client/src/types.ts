export interface ICity {
  __typename: 'City'
  id: string
  name: string
}

export interface IPost {
  __typename: 'Post'
  body: string
  city: ICity
  createdAt: string
  id: string
  title: string
  userId: string
}
