const User = require("../models/User");
const bcrypt = require("bcrypt");

const seedAdmin = async () => {
    try {
        const adminEmail = "sameerkanojia933@gmail.com";

        const admin = await User.findOne({ role: "Admin" });

        if (!admin) {
            const hashedPassword = await bcrypt.hash("123456", 10);

            await User.create({
                email: adminEmail,
                password: hashedPassword,
                role: "Admin"
            });

            console.log(" Default Admin Created");
        } else {
            console.log(" Admin already exists");
        }
    } catch (error) {
        console.log(" Error creating admin:", error.message);
    }
};

module.exports = seedAdmin;