const registerBodyValidation = (body) => {
    const allowedBody = ["name", "email", "password"]
    const bodyKeys = Object.keys(body)
    const isValid = bodyKeys.every(key => allowedBody.includes(key))
    if (!isValid) {
        return {
            status: false,
            message: "Invalid request body"
        }
    }
    if (!body.name || !body.email || !body.password) {
        return {
            status: false,
            message: "Request Body must contain 'name', 'email', and 'password'"
        }
    }
    if (!nameValidation(body.name)) {
        return {
            status: false,
            message: "Name should contain only alphabets and spaces"
        }
    }

    if (!emailValidation(body.email)) {
        return {
            status: false,
            message: "Invalid email format"
        }
    }

    if (!passwordValidation(body.password)) {
        return {
            status: false,
            message: "Password must be 8-15 characters long, include at least one uppercase letter, one lowercase letter, one digit, and one special character"
        }
    }
    return { status: true }
}

const loginBodyValidation = (body) => {
    const allowedBody = ["email", "password"]
    const bodyKeys = Object.keys(body)
    const isValid = bodyKeys.every(key => allowedBody.includes(key))
    if (!isValid) {
        return {
            status: false,
            message: "Invalid request body"
        }
    }
    if (!body.email || !body.password) {
        return {
            status: false,
            message: "Request Body must contain 'email' and 'password'"
        }
    }
    if (!emailValidation(body.email)) {
        return {
            status: false,
            message: "Invalid email format"
        }
    }
    if (!passwordValidation(body.password)) {
        return {
            status: false,
            message: "Password must be 8-15 characters long, include at least one uppercase letter, one lowercase letter, one digit, and one special character"
        }
    }
    return { status: true }
}

function emailValidation(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

function passwordValidation(password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/
    return passwordRegex.test(password)
}

function nameValidation(name) {
    const nameRegex = /^[a-zA-Z\s]+$/
    return nameRegex.test(name)
}


const createEventBodyValidation = (body) => {
    const allowedBody = ["event_name", "description", "date", "time", "location"]
    const bodyKeys = Object.keys(body)
    const isValid = bodyKeys.every(key => allowedBody.includes(key))
    if (!isValid) {
        return {
            status: false,
            message: "Invalid request body"
        }
    }

    if (bodyKeys.length !== allowedBody.length) {
        return {
            status: false,
            message: "Request Body must contain 'event_name', 'description', 'date', 'time', and 'location'"
        }
    }

    if (!eventNameValidation(body.event_name)) {
        return { status: false, message: "Invalid name" }
    }

    if (!descriptionValidation(body.description)) {
        return { status: false, message: "Description should be less than or equal to 250 characters" }
    }

    if (!timeValidation(body.time)) {
        return { status: false, message: "Time should be in HH:MM 24-hour format" }
    }
    if (!locationValidation(body.location)) {
        return { status: false, message: "Location is required" }
    }

    const isValidDate = dateValidation(body.date)
    if (isValidDate.status === false) {
        return isValidDate
    }

    return { status: true }

}

const updateEventBodyValidation = (body) => {
    const allowedBody = ["event_name", "description", "date", "time", "location"]
    const bodyKeys = Object.keys(body)
    const isValid = bodyKeys.every(key => allowedBody.includes(key))
    if (!isValid) {
        return { status: false, message: "Invalid request body" }
    }

    if (bodyKeys.length === 0) {
        return { status: false, message: "Request body cannot be empty" }
    }

    if (body.event_name !== undefined && !eventNameValidation(body.event_name)) {
        return { status: false, message: "Invalid name" }
    }

    if (body.description !== undefined && !descriptionValidation(body.description)) {
        return { status: false, message: "Description should be less than or equal to 250 characters" }
    }

    if (body.date !== undefined) {
        const isValidDate = dateValidation(body.date)
        if (isValidDate.status === false) {
            return isValidDate
        }
    }

    if (body.time !== undefined && !timeValidation(body.time)) {
        return { status: false, message: "Time should be in HH:MM 24-hour format" }
    }

    if (body.location !== undefined && !locationValidation(body.location)) {
        return { status: false, message: "Location should be a non-empty string" }
    }
    return { status: true}
}

function eventNameValidation(event_name) {
    const nameRegex = /^[a-zA-Z0-9\s]+$/
    return nameRegex.test(event_name)
}

function descriptionValidation(des) {
    return des.length <= 250
}

function dateValidation(dateStr) {
  // Check format: DD-MM-YYYY
  const regex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-(19|20)\d{2}$/;
  const match = dateStr.match(regex);
  if (!match) return {status:false,message:"Date should be in DD-MM-YYYY format"};

  const [_, dayStr, monthStr, yearStr] = match
  const day = parseInt(dayStr, 10);
  const month = parseInt(monthStr, 10);
  const year = parseInt(yearStr, 10);


  // Validate ranges
  if (year < 1900 || year > 2100 || month < 1 || month > 12 || day < 1 || day > 31) return false;

  // Create date object and check if it's a real date
  const dateObj = new Date(year, month - 1, day);
  if (
    dateObj.getFullYear() !== year ||
    dateObj.getMonth() !== month-1 ||
    dateObj.getDate() !== day
  ) return {status:false,message:"Please provide a valid date in DD-MM-YYYY format"};

  // Check if it's a future date
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Strip time
  if (dateObj <= today) return {status:false,message:"Only Future date's are accepted"};

  return true;
}

function timeValidation(time) {
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/
    return timeRegex.test(time)
}

function locationValidation(location) {
    if(typeof(location) === 'string'){
        return location.trim().length > 0
    } else {
        return false
    }
    
}

module.exports = { registerBodyValidation, loginBodyValidation, createEventBodyValidation, updateEventBodyValidation }
