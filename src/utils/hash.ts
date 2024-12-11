import * as bcrypt from 'bcrypt';

export default class Hash {
  public static async make(password: string) {
    const salt = await bcrypt.genSalt();
    const res = await bcrypt.hash(String(password), salt);
    return res;
  }

  public static async compare(
    password: string,
    hash: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  public static base64Encrypt(string: string) {
    return Buffer.from(string).toString('base64');
  }

  public static base64Decrypt(string: string) {
    return Buffer.from(string, 'base64').toString('utf8');
  }
}
