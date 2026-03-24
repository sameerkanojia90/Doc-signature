require('dotenv').config();
const User = require("../models/User");
const Court = require("../models/Court");
const nodemailer = require("nodemailer");
const bcrypt = require('bcrypt');

exports.login = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "Invalid credentials" });
        }

        if (role !== user.role) {
            return res.json({ success: false, message: "Please Select a valid role" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.json({ success: false, message: "Invalid Password" });
        }

        req.session.user = {
            _id: user._id,
            email: user.email,
            role: user.role,
            courtId: user.courtId 
        };

        res.json({
            success: true,
            message: "Login successful",
            user
        });

    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
//court  create


exports.court = async (req, res) => {
    try {
        const { name, location, description } = req.body;
        console.log(req.body);

        const newCourt = new Court({
            name,
            location,
            description,
            members: []
        });

        const saveCourt = await newCourt.save();

        res.status(201).json({
            success: true,
            message: "Court created successfully",
            data: saveCourt
        });
    } catch (err) {
        console.log(err);

        if (err.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Court name must be unique"
            });
        }

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}
//count get courts
exports.getCourts = async (req, res) => {
    try {
        const courts = await Court.find();

        const courtsWithCounts = await Promise.all(
            courts.map(async (court) => {
                const readers = await User.countDocuments
                    ({
                        courtId: court._id,
                        role: "Reader"
                    });
                const officers = await User.countDocuments
                    ({
                        courtId: court._id,
                        role: "Officer"
                    });

                return {
                    _id: court._id,
                    name: court.name,
                    location: court.location,
                    description: court.description,
                    readers,
                    officers,
                };
            })
        );

        res.json({ success: true, data: courtsWithCounts });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};




exports.addMember = async (req, res) => {
    try {
        const { courtId } = req.params;
        const { email, pass, role } = req.body;

        console.log("Add member ", req.body);

        const adminId = req.user._id;

        if (req.user.role !== "Admin") {
            return res.status(403).json({
                success: false,
                message: "Only admin can add members"
            });
        }

        const court = await Court.findById(courtId);
        if (!court) {
            return res.status(404).json({
                success: false,
                message: "Court not found"
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "This email is already registered"
            });
        }

        const hashedPassword = await bcrypt.hash(pass, 10);

        const newUser = new User({
            email,
            password: hashedPassword,
            role,
            courtId,
            createdBy: adminId
        });

        await newUser.save();

        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASS
            }
        });

        await transporter.sendMail({
            from: '"Court Admin" <admin7612@gmail.com>',
            to: email.trim(),
            subject: "Your Court Login Credentials",
            text: `You have been added as ${role} in court ${court.name}.
Email: ${email}
Password: ${pass}

Created by Admin ID: ${adminId}`
        });

        res.status(201).json({
            success: true,
            message: "Member added successfully",
            createdBy: adminId
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};



exports.stateUpdate = async (req, res) => {
    try {
        const courtsCount = await Court.countDocuments();
        const readersCount = await User.countDocuments({ role: "Reader" });
        const officersCount = await User.countDocuments({ role: "Officer" });

        res.json({
            courts: courtsCount,
            readers: readersCount,
            officers: officersCount,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

exports.deleteCourt = async (req, res) => {
    try {
        const { id } = req.params;
        await Court.findByIdAndDelete(id);
        await User.deleteMany({ courtId: id });

        res.json({
            success: true,
            message: "Court and its members delete successfully"
        });
    } catch (err) {
        console.error(err);
        res.status(500).json(
            {
                success: false,
                message: "Error deleting court"
            });
    }
}
exports.getCourtById = async (req, res) => {
    try {
        const { id } = req.params;
        const court = await Court.findById(id);
        if (!court) {
            return res.status(404).json
                ({
                    success: false,
                    message: "Court not found"
                });
        }

        const members = await User.find({ courtId: id }).select("email role -_id");

        const readersCount = members.filter(m => m.role === "Reader").length;
        const officersCount = members.filter(m => m.role === "Officer").length;

        const documentsSigned = court.documents?.filter(d => d.isSigned).length || 0;
        const documentsNotSigned = (court.documents?.length || 0) - documentsSigned;

        res.json({
            success: true,
            data: {
                ...court.toObject(),
                members,
                readersCount,
                officersCount,
                documentsSigned,
                documentsNotSigned
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


exports.getCourtsWithOfficers = async (req, res) => {
  try {
    const courts = await Court.find().lean();
    const officers = await User.find({ role: "Officer" }).lean();
    console.log(officers);

    const courtsWithOfficers = courts.map((court) => {
      const courtOfficers = officers.filter(
        (o) => o.courtId && o.courtId.toString() === court._id.toString()
      );

      return {
        ...court,
        officers: courtOfficers,
      };
    });

    res.status(200).json({
      success: true,
      courts: courtsWithOfficers,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};