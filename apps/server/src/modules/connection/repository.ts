export type RepositoryFindOptions = { skip?: number; take?: number }

type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>
}
export interface Repository<T, Y> {
  count(args: Y): Promise<number>

  find(options: RepositoryFindOptions, args: Y): Promise<T[]>
}
