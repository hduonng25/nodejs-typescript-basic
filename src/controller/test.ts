import { success } from '~/result';

export async function test() {
    const mess: string = 'hduong';
    return success.ok(mess);
}
