const { users } = require('../data/inMemoryStore')
const request = require('supertest');
const app = require('../app')

const api_key = process.env.X_API_KEY;
let token = ""

describe('Users', () => {

    beforeEach(() => {
        users.length = 0;  // Clear in-memory users before each test
    });

    describe('Register', () => {
        it('should register user successfully', async () => {
            const res = await request(app)
                .post('/users/register')
                .set('x-api-key', api_key)
                .send({ name: 'John Doe', email: 'john@example.com', password: 'Pass123!' });

            expect(res.status).toBe(200);
            expect(res.body.message).toBe('User registered successfully');
            expect(users.length).toBe(1);
            expect(users[0].password).not.toBe('Pass123!');  // Ensure password is hashed
        });

        it('Should throw error if email already exists', async () => {
            users.push({ email: "kiranm121998@gmail.com" });
            const res = await request(app)
                .post('/users/register')
                .set('x-api-key', api_key)
                .send({ name: 'Kiran', email: 'kiranm121998@gmail.com', password: 'Kiran@123' });

            expect(res.status).toBe(400)
            expect(res.body.message).toBe('User already exists with this email')
        })

        it('Should throw an error if password is not provided', async () => {
            const res = await request(app)
                .post('/users/register')
                .set('x-api-key', api_key)
                .send({ name: 'Kiran', email: 'kiranm121998@gmail.com' })

            expect(res.status).toBe(400)
            expect(res.body.message).toBe("Request Body must contain 'name', 'email', and 'password'")
        })

    });


    describe('Login', () => {
        it('should login successfully and return token', async () => {
            const bcrypt = require('bcrypt');
            const hashedPassword = await bcrypt.hash('Pass123!', 10);

            users.push({ id: 'user-1', email: 'john@example.com', password: hashedPassword });

            const res = await request(app)
                .post('/users/login')
                .set('x-api-key', api_key)
                .send({ email: 'john@example.com', password: 'Pass123!' });

            expect(res.status).toBe(200);
            expect(res.body.data).toHaveProperty('token');
        });

        it('should throw error for wrong password', async () => {
            const bcrypt = require('bcrypt');
            const hashedPassword = await bcrypt.hash('Pass123!', 10);

            users.push({ id: 'user-1', email: 'john@example.com', password: hashedPassword });

            const res = await request(app)
                .post('/users/login')
                .set('x-api-key', api_key)
                .send({ email: 'john@example.com', password: 'Pass123!1' });

            expect(res.status).toBe(400);
            expect(res.body.message).toBe("Invalid password");
        });

        it('should throw error for wrong email', async () => {
            const bcrypt = require('bcrypt');
            const hashedPassword = await bcrypt.hash('Pass123!', 10);

            users.push({ id: 'user-1', email: 'john@example.com', password: hashedPassword });

            const res = await request(app)
                .post('/users/login')
                .set('x-api-key', api_key)
                .send({ email: 'john@example.co', password: 'Pass123!' });

            expect(res.status).toBe(400);
            expect(res.body.message).toBe("User does not exist with this email");
        });
    })

});

describe('Events', () => {

    beforeEach(async () => {
        await users.push({
            id: 'rz8x9ao4',
            name: 'kiran',
            email: 'kiran@event.in',
            password: '$2b$10$sLhpXpl13SAhTsHPeoJvyebm49esujE6dqyYKIOYRhKcAaNtB/M4a',
            role: 'admin'
        })

        await users.push({
            id: 'rz8x9ao5',
            name: 'kiran',
            email: 'kiran@gmail.com',
            password: '$2b$10$sLhpXpl13SAhTsHPeoJvyebm49esujE6dqyYKIOYRhKcAaNtB/M4a',
            role: 'user'
        })

        const res = await request(app)
            .post('/users/login')
            .set('x-api-key', api_key)
            .send({ email: 'kiran@event.in', password: 'Kiran@123' });
        token = res.body.data.token

    })

    describe('Create Event API', () => {
        it('Should create event successfully', async () => {
            const res = await request(app)
                .post('/events/')
                .set('x-api-key', api_key)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    event_name: 'Testing Event API Try 1',
                    description: 'Testing events api for the first time',
                    date: '20-10-2025',
                    time: '08:30',
                    location: 'Yadgir'
                })
            expect(res.status).toBe(200)
            expect(res.body.message).toBe("Event Created Successfully")
        })

        it('Should throw an error if any body is missing', async () => {
            const res = await request(app)
                .post('/events/')
                .set('x-api-key', api_key)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    event_name: 'Testing Event API Try 1',
                    description: 'Testing events api for the first time',
                    time: '08:30',
                    location: 'Yadgir'
                })
            expect(res.status).toBe(400)
            expect(res.body.message).toBe("Request Body must contain 'event_name', 'description', 'date', 'time', and 'location'")
        })

        it('Should throw an error if the user has no access to create an event', async () => {

            const res1 = await request(app)
                .post('/users/login')
                .set('x-api-key', api_key)
                .send({ email: 'kiran@gmail.com', password: 'Kiran@123' });
            token = res1.body.data.token

            const res = await request(app)
                .post('/events/')
                .set('x-api-key', api_key)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    event_name: 'Testing Event API Try 1',
                    description: 'Testing events api for the first time',
                    time: '08:30',
                    location: 'Yadgir'
                })
            expect(res.status).toBe(403)
            expect(res.body.message).toBe("You do not have permission to create an event. Only administrators are allowed to perform this action.")
        })
    })

    describe('Get Events API', () => {
        let event_id = ""
        it('Should get all events successfully', async () => {
            const res = await request(app)
                .get('/events/')
                .set('x-api-key', api_key)
                .set('Authorization', `Bearer ${token}`)
            expect(res.status).toBe(200)
            event_id = res.body.data.events[0].id
        })

        it('Should get all events successfully', async () => {
            const res = await request(app)
                .get('/events/')
                .set('x-api-key', api_key)
                .set('Authorization', `Bearer ${token}`)
                .send({ name: "Kiran" })
            expect(res.status).toBe(400)
            expect(res.body.message).toBe("Request body should be empty")
        })

        it('Should get the event based on the id', async () => {
            const res = await request(app)
                .get(`/events/${event_id}`)
                .set('x-api-key', api_key)
                .set('Authorization', `Bearer ${token}`)

            expect(res.status).toBe(200)
            expect(res.body.data.event.id).toBe(event_id)
        })

        it('Should throw an error if the given id is wrong', async () => {
            const res = await request(app)
                .get(`/events/rz8x9ao6`)
                .set('x-api-key', api_key)
                .set('Authorization', `Bearer ${token}`)
            expect(res.status).toBe(404)
            expect(res.body.message).toBe("No event found with this ID")
        })

        it('Should throw an error if the request body is given', async () => {
            const res = await request(app)
                .get(`/events/${event_id}`)
                .set('x-api-key', api_key)
                .set('Authorization', `Bearer ${token}`)
                .send({ name: "Kiran" })
            expect(res.status).toBe(400)
            expect(res.body.message).toBe("Request body should be empty")
        })

        it('Should throw an error if the user doesnt have admin access', async () => {
            const res1 = await request(app)
                .post('/users/login')
                .set('x-api-key', api_key)
                .send({ email: 'kiran@gmail.com', password: 'Kiran@123' })
            token = res1.body.data.token
            const res = await request(app)
                .get(`/events/${event_id}`)
                .set('x-api-key', api_key)
                .set('Authorization', `Bearer ${token}`)
            expect(res.status).toBe(403)
            expect(res.body.message).toBe("You do not have permission to create an event. Only administrators are allowed to perform this action.")
        })
    })

    describe('Update Events API', ()=>{
        let event_id = ""
        it('Should update the event based on the id', async () => {
            const res1 = await request(app)
                .get('/events/')
                .set('x-api-key', api_key)
                .set('Authorization', `Bearer ${token}`)
            event_id = res1.body.data.events[0].id
            const res = await request(app)
                .patch(`/events/${event_id}`)
                .set('x-api-key', api_key)
                .set('Authorization', `Bearer ${token}`)
                .send({event_name:"Testing",description:"testing the description", date:"18-10-2025", time:"09:00", location: "Hydrabad"});
            expect(res.status).toBe(200)
            expect(res.body.message).toBe("Event Updated Successfully")
        })

        it('Should throw an error id the Event_id is wrong', async()=>{
            const res = await request(app)
                .patch(`/events/rz8x9ao6`)
                .set('x-api-key', api_key)
                .set('Authorization', `Bearer ${token}`)
                .send({event_name:"Testing",description:"testing the description", date:"18-10-2025", time:"09:00", location: "Hydrabad"});
            expect(res.status).toBe(404)
            expect(res.body.message).toBe("No event found with this ID")
        })

        it('Should throw an error if the request body is empty', async ()=>{
             const res1 = await request(app)
                .get('/events/')
                .set('x-api-key', api_key)
                .set('Authorization', `Bearer ${token}`)
            event_id = res1.body.data.events[0].id
            const res = await request(app)
                .patch(`/events/${event_id}`)
                .set('x-api-key', api_key)
                .set('Authorization', `Bearer ${token}`)
                .send({});
            expect(res.status).toBe(400)
            expect(res.body.message).toBe("Request body cannot be empty")
        })

        it('Should throw an error if the user doesnt have access permission', async ()=>{
            const res1 = await request(app)
                .post('/users/login')
                .set('x-api-key', api_key)
                .send({ email: 'kiran@gmail.com',password: "Kiran@123"})
            token = res1.body.data.token
            const res = await request(app)
                .patch(`/events/${event_id}`)
                .set('x-api-key', api_key)
                .set('Authorization', `Bearer ${token}`)
                .send({event_name:"Testing",description:"testing the description", date:"18-10-2025", time:"09:00", location: "Hydrabad"});
            expect(res.status).toBe(403)
            expect(res.body.message).toBe("You do not have permission to create an event. Only administrators are allowed to perform this action.")
        })
    })

    describe('Delete Events API', ()=>{
        let event_id = ""
        it('Should delete the event based on the id', async () => {
            const res1 = await request(app)
                .get('/events/')
                .set('x-api-key', api_key)
                .set('Authorization', `Bearer ${token}`)
            event_id = res1.body.data.events[0].id
            const res = await request(app)
                .delete(`/events/${event_id}`)
                .set('x-api-key', api_key)
                .set('Authorization', `Bearer ${token}`)
            expect(res.status).toBe(200)
            expect(res.body.message).toBe("Event Deleted Successfully")
        })

        it('Should throw an error if event_id is wrong', async ()=>{
            const res = await request(app)
                .delete(`/events/rz8x9ao6`)
                .set('x-api-key', api_key)
                .set('Authorization', `Bearer ${token}`)
            expect(res.status).toBe(404)
            expect(res.body.message).toBe("No event found with this ID")
        })

        it('Should throw an error if request body is provided', async()=>{
            const res = await request(app)
                .delete(`/events/rz8x9ao6`)
                .set('x-api-key', api_key)
                .set('Authorization', `Bearer ${token}`)
                .send({ name: "Kiran" })
            expect(res.status).toBe(400)
            expect(res.body.message).toBe("Request body should be empty")
        })

        it('Should throw an error id user doesnt have an access', async()=>{
            const res1 = await request(app)
                .post('/users/login')
                .set('x-api-key', api_key)
                .send({ email: 'kiran@gmail.com',password:'Kiran@123'})
            token = res1.body.data.token
            const res = await request(app)
                .delete(`/events/rz8x9ao6`)
                .set('x-api-key', api_key)
                .set('Authorization', `Bearer ${token}`)
            expect(res.status).toBe(403)
            expect(res.body.message).toBe("You do not have permission to create an event. Only administrators are allowed to perform this action.")
        })
    })

    describe('Register to an event', ()=>{
        let event_id = ""
        it('Should register to an event successfully', async () => {
            const res1 = await request(app)
                .get('/events/')
                .set('x-api-key', api_key)
                .set('Authorization', `Bearer ${token}`)
            event_id = res1.body.data.events[0].id
            const res = await request(app)
                .post(`/events/${event_id}/register`)
                .set('x-api-key', api_key)
                .set('Authorization', `Bearer ${token}`)
            expect(res.status).toBe(200)
            expect(res.body.message).toBe("Event Registered Successfully")
        })
        it('Should throw an error if the event_id is wrong', async ()=>{
            const res = await request(app)
                .post(`/events/rz8x9ao6/register`)
                .set('x-api-key', api_key)
                .set('Authorization', `Bearer ${token}`)
            expect(res.status).toBe(404)
            expect(res.body.message).toBe("No event found with this ID")
        })
        it('Should throw an error if the user has already registered', async ()=>{
            const res1 = await request(app)
                .get('/events/')
                .set('x-api-key', api_key)
                .set('Authorization', `Bearer ${token}`)
            event_id = res1.body.data.events[0].id
            const res = await request(app)
                .post(`/events/${event_id}/register`)
                .set('x-api-key', api_key)
                .set('Authorization', `Bearer ${token}`)
            expect(res.status).toBe(400)
            expect(res.body.message).toBe("You have already registered for this event")
        })
    })

    describe('Get registered events', ()=>{
        it('Should get all the registered events of a user', async ()=>{
            const res1 = await request(app)
                .get('/events/')
                .set('x-api-key', api_key)
                .set('Authorization', `Bearer ${token}`)
            event_id = res1.body.data.events[0].id
            const res2 = await request(app)
                .post(`/events/${event_id}/register`)
                .set('x-api-key', api_key)
                .set('Authorization', `Bearer ${token}`)
            const res = await request(app)
                .get('/bookings/')
                .set('x-api-key', api_key)
                .set('Authorization', `Bearer ${token}`)
            expect(res.status).toBe(200)
            expect(res.body.data.events.length).toBe(1)
        })
    })

    describe('Cancel Registed Event', ()=>{
        it('Should cancel the registered event successfully', async ()=>{
            const res3 = await request(app)
                .get('/bookings/')
                .set('x-api-key', api_key)
                .set('Authorization', `Bearer ${token}`)
            const booking_id = res3.body.data.events[0].id
            const res = await request(app)
                .put(`/bookings/${booking_id}/cancel`)
                .set('x-api-key', api_key)
                .set('Authorization', `Bearer ${token}`)
            expect(res.status).toBe(200)
            expect(res.body.message).toBe("Booking Canceled Successfully")
        })
    })
})
