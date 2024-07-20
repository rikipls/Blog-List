export interface BlogData {
  id: string,
  title: string
  author?: string,
  url: string
  likes: number
  user: BlogUserData
}

export interface NewBlogData {
  title: string,
  author?: string,
  url: string
  likes?: number
}

export interface UserData {
  id: string
  name: string,
  username: string
  token: string
}

export interface BlogUserData {
  id: string,
  name: string,
  username: string
}
