import * as bcrypt from 'bcrypt';

export default class Hash {
  // static readonly saltRounds = 11;

  public static async make(password: string) {
    const salt = await bcrypt.genSalt();
    console.log('passwordsss', String(password));
    const res = await bcrypt.hash(String(password), salt);
    console.log('res', res);
    return res;
  }

  public static async compare(
    password: string,
    hash: string,
  ): Promise<boolean> {
    // console.log('password', password);
    // hash = hash.replace(/^\$2y(.+)$/i, '$2a$1');
    return bcrypt.compare(password, hash);
  }

  public static base64Encrypt(string: string) {
    return Buffer.from(string).toString('base64');
  }

  public static base64Decrypt(string: string) {
    return Buffer.from(string, 'base64').toString('utf8');
  }
}
