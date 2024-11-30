export abstract class PasswordHasher {
  abstract hashPassword(password: string): Promise<string>
  abstract comparePasswords(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean>
}
