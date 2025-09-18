// data/inMemoryStore.js
const users = [{
    id: 'rz8x9ao4',
    name: 'kiran',
    email: 'kiran@event.in',
    password: '$2b$10$sLhpXpl13SAhTsHPeoJvyebm49esujE6dqyYKIOYRhKcAaNtB/M4a',
    role: 'admin'
  },{
    id: 'rz8x9ao5',
    name: 'kiran',
    email: 'kiranm121998@gmail.com',
    password: '$2b$10$sLhpXpl13SAhTsHPeoJvyebm49esujE6dqyYKIOYRhKcAaNtB/M4a',
    role: 'admin'
  }];      // Stores user objects { id, username, email, passwordHash, role }
const events = [{
    id: '5nc5up7f',
    event_name: 'Testing Event API Try 1',
    description: 'Testing events api for the first time',
    date: '20-10-2025',
    time: '08:30',
    location: 'Yadgir',
    createdBy: 'kiran',
    participants: []
  }];     // Stores event objects { id, event_id, date, time, description, participants: [] }
const role = "user"

module.exports = { users, events, role };
