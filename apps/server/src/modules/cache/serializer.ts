export abstract class Serializer<T> {
  abstract encode(item: T): string
  abstract decode(str: string): T
}
