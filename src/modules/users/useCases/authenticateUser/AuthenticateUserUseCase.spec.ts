import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe('Authenticate User', () => { 
    beforeEach(() => {
       inMemoryUsersRepository = new InMemoryUsersRepository();
       createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
       authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
    });

    it('should be able to authenticate user', async () => {
        await createUserUseCase.execute({
            name: "User test",
            email: "test@email.com",
            password: "password",
        });

        const userAuthenticated = await authenticateUserUseCase.execute({ 
            email: "test@email.com",
            password: "password", 
        });

        expect (userAuthenticated).toHaveProperty('token');
    });

    it('Should not be able no authenticate a nonexistent user', () => { 
        expect(async () => {
            await authenticateUserUseCase.execute({ 
             email: "false@email.com",
             password: "password",
            })
            
        }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
    });

    it( 'Should not be able to authenticate user with incorrect password', () => { 
       expect(async () => {
           const user = {
               name: 'user', 
               email: 'user@email.com',
               password: 'correct',
           }

           await createUserUseCase.execute(user);
           await authenticateUserUseCase.execute({
               email: 'user.email',
               password: 'wrong',
           });           
       }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError); 
    })
})