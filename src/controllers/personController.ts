import crypto from 'crypto'
import { Request, Response } from 'express'
import { userDataPools } from '../data/userDataPools'
import { ApiResponse, Person } from '../types'

// Типы для данных пользователя
interface UserDataPools {
  maleFirstNames: string[]
  femaleFirstNames: string[]
  nameTitles: {
    male: string[]
    female: string[]
  }
  lastNames: string[]
  passwordPool: string[]
  countries: string[]
  cities: string[]
  timezones: Array<{ offset: string; description: string }>
  streets: string[]
  states: string[]
  phoneFormats: string[]
  nationalityCodes: string[]
}

// Вспомогательные функции
function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

function generateRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function generatePhoneNumber(format: string): string {
  return format.replace(/#/g, () => generateRandomNumber(0, 9).toString())
}

function generateHashes(
  password: string,
  salt: string,
): { md5: string; sha1: string; sha256: string } {
  const md5 = crypto
    .createHash('md5')
    .update(password + salt)
    .digest('hex')
  const sha1 = crypto
    .createHash('sha1')
    .update(password + salt)
    .digest('hex')
  const sha256 = crypto
    .createHash('sha256')
    .update(password + salt)
    .digest('hex')
  return { md5, sha1, sha256 }
}

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

function generateIdNumber(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const numbers = '0123456789'
  let result = ''

  for (let i = 0; i < 7; i++) {
    result += numbers[Math.floor(Math.random() * numbers.length)]
  }
  result += letters[Math.floor(Math.random() * letters.length)]

  return result
}

function generateUsername(firstName: string, lastName: string): string {
  const adjectives = ['happy', 'clever', 'swift', 'brave', 'calm', 'wild']
  const nouns = ['tiger', 'eagle', 'wolf', 'lion', 'bear', 'fox']
  const adjective = getRandomItem(adjectives)
  const noun = getRandomItem(nouns)
  const number = generateRandomNumber(1, 999)
  return `${adjective}${noun}${number}`
}

// Генерация одного пользователя
function generateRandomUser(): Person {
  const gender = Math.random() > 0.5 ? 'male' : 'female'
  const firstName = getRandomItem(
    gender === 'male'
      ? (userDataPools as UserDataPools).maleFirstNames
      : (userDataPools as UserDataPools).femaleFirstNames,
  )
  const title = getRandomItem((userDataPools as UserDataPools).nameTitles[gender])
  const lastName = getRandomItem((userDataPools as UserDataPools).lastNames)

  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`
  const password = getRandomItem((userDataPools as UserDataPools).passwordPool)
  const salt = Math.random().toString(36).substring(2, 10)
  const hashes = generateHashes(password, salt)
  const username = generateUsername(firstName, lastName)
  const country = getRandomItem((userDataPools as UserDataPools).countries)
  const city = getRandomItem((userDataPools as UserDataPools).cities)
  const timezone = getRandomItem((userDataPools as UserDataPools).timezones)

  const birthDate = new Date(
    Date.now() - generateRandomNumber(18, 80) * 365 * 24 * 60 * 60 * 1000,
  )
  const registerDate = new Date(
    Date.now() - generateRandomNumber(0, 10) * 365 * 24 * 60 * 60 * 1000,
  )

  const pictureNum = generateRandomNumber(1, 99)

  return {
    gender,
    name: {
      title,
      first: firstName,
      last: lastName,
    },
    location: {
      street: {
        number: generateRandomNumber(1, 9999),
        name: getRandomItem((userDataPools as UserDataPools).streets),
      },
      city,
      state: getRandomItem((userDataPools as UserDataPools).states),
      country,
      postcode: generateRandomNumber(10000, 99999),
      coordinates: {
        latitude: (Math.random() * 180 - 90).toFixed(4),
        longitude: (Math.random() * 360 - 180).toFixed(4),
      },
      timezone,
    },
    email,
    login: {
      uuid: generateUUID(),
      username,
      password,
      salt,
      md5: hashes.md5,
      sha1: hashes.sha1,
      sha256: hashes.sha256,
    },
    dob: {
      date: birthDate.toISOString(),
      age: Math.floor(
        (Date.now() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000),
      ),
    },
    registered: {
      date: registerDate.toISOString(),
      age: Math.floor(
        (Date.now() - registerDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000),
      ),
    },
    phone: generatePhoneNumber(
      getRandomItem((userDataPools as UserDataPools).phoneFormats),
    ),
    cell: generatePhoneNumber(
      getRandomItem((userDataPools as UserDataPools).phoneFormats),
    ),
    id: {
      name: 'PPS',
      value: generateIdNumber(),
    },
    picture: {
      large: `https://randomuser.me/api/portraits/${
        gender === 'male' ? 'men' : 'women'
      }/${pictureNum}.jpg`,
      medium: `https://randomuser.me/api/portraits/med/${
        gender === 'male' ? 'men' : 'women'
      }/${pictureNum}.jpg`,
      thumbnail: `https://randomuser.me/api/portraits/thumb/${
        gender === 'male' ? 'men' : 'women'
      }/${pictureNum}.jpg`,
    },
    nat: getRandomItem((userDataPools as UserDataPools).nationalityCodes),
  }
}

// Контроллеры для API
const getAllPersons = (req: Request, res: Response): void => {
  try {
    const count = parseInt(req.query.results as string) || 10
    const page = parseInt(req.query.page as string) || 1
    const limit = Math.min(count, 500) // Максимум 500 пользователей

    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit

    const users: Person[] = []
    for (let i = 0; i < limit; i++) {
      users.push(generateRandomUser())
    }

    const response: ApiResponse<Person> = {
      results: users,
      info: {
        seed: 'custom-' + Date.now(),
        results: limit,
        page,
        version: '1.4',
      },
    }

    res.json(response)
  } catch (error) {
    console.error('Error generating users:', error)
    res.status(500).json({ error: 'Ошибка при генерации пользователей' })
  }
}

const getRandomPerson = (req: Request, res: Response): void => {
  try {
    const user = generateRandomUser()
    const response: ApiResponse<Person> = {
      results: [user],
      info: {
        seed: 'random-' + Date.now(),
        results: 1,
        page: 1,
        version: '1.4',
      },
    }

    res.json(response)
  } catch (error) {
    console.error('Error generating random user:', error)
    res.status(500).json({ error: 'Ошибка при генерации случайного пользователя' })
  }
}

const getPersonById = (req: Request, res: Response): void => {
  try {
    const id = req.params.id
    const user = generateRandomUser()

    // Добавляем ID в данные пользователя для примера
    user.id.value = id + user.id.value.substring(id.length)

    const response: ApiResponse<Person> = {
      results: [user],
      info: {
        seed: `id-${id}`,
        results: 1,
        page: 1,
        version: '1.4',
      },
    }

    res.json(response)
  } catch (error) {
    console.error('Error generating user by ID:', error)
    res.status(500).json({ error: 'Ошибка при генерации пользователя по ID' })
  }
}

const searchPersons = (req: Request, res: Response): void => {
  try {
    const { gender, nat, results = '10' } = req.query

    let filteredUsers: Person[] = []
    const count = Math.min(parseInt(results as string), 100)

    for (let i = 0; i < count; i++) {
      let user = generateRandomUser()

      // Применяем фильтры если указаны
      if (gender && user.gender !== (gender as string).toLowerCase()) {
        i-- // Пропускаем этот результат
        continue
      }

      if (nat && user.nat !== (nat as string).toUpperCase()) {
        i--
        continue
      }

      filteredUsers.push(user)
    }

    const response: ApiResponse<Person> = {
      results: filteredUsers,
      info: {
        seed: 'search-' + Date.now(),
        results: filteredUsers.length,
        page: 1,
        version: '1.4',
      },
    }

    res.json(response)
  } catch (error) {
    console.error('Error searching users:', error)
    res.status(500).json({ error: 'Ошибка при поиске пользователей' })
  }
}

export default {
  getAllPersons,
  getRandomPerson,
  getPersonById,
  searchPersons,
  generateRandomUser,
}
