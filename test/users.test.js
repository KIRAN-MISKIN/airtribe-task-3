const { register, login } = require('../controller/users')
const { users } = require('../data/inMemoryStore')
const statusCodes = require('../config/statusCodes')

jest.mock('../utils/responseHandler', () => ({
    responseHandler: jest.fn((res, status, data) => res.status(status).json(data)),
}));

jest.mock('../utils/validations', () => ({
    registerBodyValidation: jest.fn(),
    loginBodyValidation: jest.fn(),
}));

jest.mock('bcrypt')
jest.mock('jsonwebtoken');
jest.mock('../utils/idGenerator')
jest.mock('../utils/assignRole')

const { registerBodyValidation, loginBodyValidation } = require('../utils/validations');
const { responseHandler } = require('../utils/responseHandler');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { userIdGenerator } = require('../utils/idGenerator');
const { assignRole } = require('../utils/assignRole');

describe('Auth Controller - register & login', () => {
    let req, res;

    beforeEach(() => {
        users.length = 0;
        req = { body: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    describe('register', () => {
        it('should register user successfully', async () => {
            req.body = { name: "kiran", email: "kiran@ex.com", password: "Kiran@123" }

            registerBodyValidation.mockResolvedValue({ status: true });
            userIdGenerator.mockReturnValue('user-1');
            assignRole.mockReturnValue('user')
            bcrypt.hashSync = jest.fn().mockReturnValue('hashedPassword');

            await register(req, res);

            expect(users.length).toBe(1);
            expect(users[0]).toEqual({
                id: 'user-1',
                name: 'kiran',
                email: 'kiran@ex.com',
                password: 'hashedPassword',
                role: 'user'
            });
            expect(responseHandler).toHaveBeenCalledWith(res, statusCodes.SUCCESS, { message: 'User registered successfully' });
        })

        it('should throw error if only name is provided', async () => {
            req.body = { name: "john" }
            registerBodyValidation.mockResolvedValue({ status: false, message: "Validation Error" });
            await expect(register(req, res)).rejects.toThrow('Validation Error')
        })

        it('should throw error if only name and email is provided', async () => {
            req.body = { name: "john", email: "kiran@ex.com" }
            registerBodyValidation.mockResolvedValue({ status: false, message: "Validation Error" })
            await expect(register(req, res)).rejects.toThrow('Validation Error')
        })

        it('should throw error if invalid email is provided', async () => {
            req.body = { name: "john", email: "kiranex.com" };  // No password provided
            registerBodyValidation.mockResolvedValue({ status: false, message: "Request Body must contain 'name', 'email', and 'password'" });

            await expect(register(req, res)).rejects.toThrow("Request Body must contain 'name', 'email', and 'password'");
        });

        it('Should throw an error if the password is just number', async () => {
            req.body = { name: "Kiran", email: "kiran@gmail.com", password: "12345" }
            registerBodyValidation.mockResolvedValue({ status: false, message: "Password must be 8-15 characters long, include at least one uppercase letter, one lowercase letter, one digit, and one special character" })
            await expect(register(req, res)).rejects.toThrow("Password must be 8-15 characters long, include at least one uppercase letter, one lowercase letter, one digit, and one special character")
        })

        it('Should throw an error if the email is already registered', async () => {
            users.push({ email: "kiranm121998@gmail.com" })
            req.body = { name: "Kiran", email: "kiranm121998@gmail.com", password: "Kiran@123" },
                registerBodyValidation.mockResolvedValue({ status: true })
            await expect(register(req, res)).rejects.toThrow("User already exists with this email")
        })

    })

    describe('login()', () => {
        it('should login successfully and return a token', async () => {
            req.body = { email: 'john@example.com', password: 'Pass123!' };

            loginBodyValidation.mockResolvedValue({ status: true });
            const hashedPassword = 'hashedPassword';

            users.push({ id: 'user-1', email: 'john@example.com', password: hashedPassword });

            bcrypt.compare = jest.fn().mockResolvedValue(true);
            jwt.sign = jest.fn().mockReturnValue('jwt-token');

            await login(req, res);

            expect(responseHandler).toHaveBeenCalledWith(res, statusCodes.SUCCESS, { token: 'jwt-token' });
        });

        it('should throw error if login body validation fails', async () => {
            req.body = { email: '' };

            loginBodyValidation.mockResolvedValue({ status: false, message: 'Validation failed' });

            await expect(login(req, res)).rejects.toThrow('Validation failed');
        });

        it('should throw error if user not found', async () => {
            req.body = { email: 'nonexistent@example.com', password: 'Pass123!' };

            loginBodyValidation.mockResolvedValue({ status: true });

            await expect(login(req, res)).rejects.toThrow('User does not exist with this email');
        });

        it('should throw error if password is invalid', async () => {
            req.body = { email: 'john@example.com', password: 'WrongPass!' };

            loginBodyValidation.mockResolvedValue({ status: true });
            users.push({ id: 'user-1', email: 'john@example.com', password: 'hashedPassword' });

            bcrypt.compare = jest.fn().mockResolvedValue(false);

            await expect(login(req, res)).rejects.toThrow('Invalid password');
        });
    });
})
