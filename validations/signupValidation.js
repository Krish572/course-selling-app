const {z} = require("zod");

const signupSchema = z.object({
        email: z.string().email(),
        firstName: z.string().min(3, {message: "First Name mush contains more than 3 character"}),
        lastName: z.string().min(3, {message: "Last Name must contain more than 3 characters"}),
        password: z.string().min(8, {message: "Password mush have 6 or more characters"})
    })

module.exports = { signupSchema };