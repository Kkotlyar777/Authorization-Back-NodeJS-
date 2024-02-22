import express from 'express';
import { PrismaClient } from '@prisma/client';
// КОРС НУЖЕН ДЛЯ СОЕДИНЕНИЯ С ФРОНТОМ
import cors from 'cors';

// ИНИЦИАЛИЗАЦИЯ ПРИЛОЖЕНИЯ
const prisma = new PrismaClient();
const app = express();
const PORT = 4000;

// MIDDLEWARES
app.use(cors());
app.use(express.json());

// РЕГИСТРАЦИЯ
app.post('/api/register', async (req, res) => {
	// ИНИЦИАЛИЗАЦИЯ ТОГО, ЧТО ПОЛУЧАЕМ
	const { email, name, password } = req.body;
	if (!email) {
		return res.status(400).send('Аккаунт с таким E-mail!');
	} else if (!name) {
		return res.status(400).send('Вы не ввели имя!');
	} else if (!password) {
		return res.status(400).send('Вы не ввели пароль!');
	}
	try {
		const createdRow = await prisma.Auth.create({
			data: {
				email,
				name,
				password,
			},
		});

		res.json(createdRow);
	} catch (error) {
		res.status(400).send({ message: error });
	}
});

// ЛОГИН
app.post('/api/login', async (req, res) => {
	// ИНИЦИАЛИЗАЦИЯ ТОГО, ЧТО ПОЛУЧАЕМ
	const { name, password, email } = req.body;
	// проверка на не совпадение(ошибки)
	try {
		let user = await prisma.Auth.findFirst({ where: { name } });

		if (!user) {
			return res
				.status(400)
				.json(
					'Такого пользователя не существует. Проверьте правильность введнных вами данных!'
				);
		} else if (password !== user.password) {
			return res
				.status(400)
				.json('Пароль не соответствует указанному вами при регистрации!');
		} else {
			res.json('Добро пожаловать: ' + user.email);
		}
	} catch (error) {
		res.json({ message: error });
	}
});
// ГУГЛ
app.post('/api/google-auth', async (req, res) => {
	const { credential, client_id } = req.body;
	try {
		const ticket = await client.verifyIdToken({
			idToken: credential,
			audience: client_id,
		});
		const payload = ticket.getPayload();
		const userid = payload['sub'];
		res.status(200).json({ payload });
	} catch (err) {
		res.status(400).json({ err });
	}
});

const server = app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
});
