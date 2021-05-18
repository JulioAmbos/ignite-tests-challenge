import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserError } from "./CreateUserError"
import { CreateUserUseCase } from "./CreateUserUseCase"

let createUserUseCase : CreateUserUseCase
let inMemoryUsersRepository : InMemoryUsersRepository

describe ('Create User', () => {
    beforeEach (() => { 
        inMemoryUsersRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    });

    it('Should be able to create a new user', async () => {
        
        const user = await createUserUseCase.execute({ 
            name: 'User test',
            email: 'test@email.com',
            password: 'password',
        });

        expect(user).toHaveProperty('id')        
   });

   it('Should not be able to create a user with an email already registered', async () => {
       
        expect(async () => {
         const user =  await createUserUseCase.execute({
             name: 'User test',
             email: 'test@email.com',
             password: 'password',
         });
         
         await createUserUseCase.execute(user);
         await createUserUseCase.execute(user);
        }).rejects.toBeInstanceOf(CreateUserError)
        
   });

});