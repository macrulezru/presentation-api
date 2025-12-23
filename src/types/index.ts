export interface Product {
  id: number
  title: string
  description: string
  price: number
  discountPercentage: number
  rating: number
  stock: number
  brand?: string
  category: string
  thumbnail: string
  images: string[]
  tags?: string[]
}

export interface PersonName {
  title: string
  first: string
  last: string
}

export interface PersonLocation {
  street: {
    number: number
    name: string
  }
  city: string
  state: string
  country: string
  postcode: number | string
  coordinates: {
    latitude: string
    longitude: string
  }
  timezone: {
    offset: string
    description: string
  }
}

export interface PersonLogin {
  uuid: string
  username: string
  password: string
  salt: string
  md5: string
  sha1: string
  sha256: string
}

export interface PersonDob {
  date: string
  age: number
}

export interface PersonPicture {
  large: string
  medium: string
  thumbnail: string
}

export interface PersonId {
  name: string
  value: string
}

export interface Person {
  gender: 'male' | 'female'
  name: PersonName
  location: PersonLocation
  email: string
  login: PersonLogin
  dob: PersonDob
  registered: PersonDob
  phone: string
  cell: string
  id: PersonId
  picture: PersonPicture
  nat: string
}

export interface ApiResponse<T> {
  results: T[]
  info: {
    seed: string
    results: number
    page: number
    version: string
  }
}

export interface ProductsResponse {
  products: Product[]
  total: number
  skip: number
  limit: number
}
