import bcrypt from 'bcrypt';
import { user_model } from './mongodb/models/user';
import { email_regex } from './utils';

export async function register_user(email: string, password: string): Promise<{ error: string }> {
	const email_error = await verify_email(email);
	const password_error = verify_password(password);

	if (email_error) {
		return { error: email_error };
	}

	if (password_error) {
		return { error: password_error };
	}

	const salt_rounds = 10;
	const hashed_password = await bcrypt.hash(password, salt_rounds);

	const user = new user_model({ email, password: hashed_password });

	try {
		await user.save();
		return { error: '' };
	} catch (error: { code: number } | any) {
		if (error.code === 11_000) {
			return { error: 'Diese E-Mail-Adresse ist bereits registriert' };
		}
		return { error: 'Fehler beim Registrieren des Benutzers' };
	}
}

export async function verify_email(email: string): Promise<string> {
	if (!email) {
		return 'Email ist erforderlich';
	}

	if (!new RegExp(email_regex).exec(email)) {
		return 'Bitte geben Sie eine gültige E-Mail-Adresse ein';
	}

	const previous_user = await user_model.findOne({ email });

	if (previous_user) {
		return 'Diese E-Mail-Adresse ist bereits registriert';
	}

	return '';
}

export function verify_password(password: string): string {
	if (!password) {
		return 'Passwort ist erforderlich';
	}

	if (password.length < 8) {
		return 'Passwort muss mindestens 8 Zeichen lang sein';
	}

	return '';
}
