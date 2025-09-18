const userIdGenerator = ()=>{
    const id = Math.random().toString(36).substring(2,10)
    return id
}

const eventIdGenerator = ()=>{
    const id = Math.random().toString(36).substring(2,10)
    return id
}

module.exports = {userIdGenerator,eventIdGenerator}
