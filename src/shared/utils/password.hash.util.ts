import * as argon2 from "argon2";

async function hash(password: string) {
	return await argon2.hash(password);
}
async function verify(hashed: string, password: string) {
	return await argon2.verify(hashed, password);
}

export { hash, verify };
