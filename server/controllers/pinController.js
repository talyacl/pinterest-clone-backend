const Pin = require('../models/Pin');
require('dotenv').config();
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


exports.createPin = async (req, res) => {
    const { title, description } = req.body;
    const user = req.user.id;

    try {
        const result = await cloudinary.uploader.upload(req.file.path);
        const newPin = new Pin({
            title,
            description,
            imageUrl: result.secure_url,
            user,
        });
        await newPin.save();
        res.json(newPin);
    } catch (error) {
        console.error(error.stack);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getPins = async (req, res) => {
    try {
        const pins = await Pin.find().populate('user', ['username']);
        res.json(pins);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};

exports.getPin = async (req, res) => {
    const id = req.params.id;
    try {
        const pin = await Pin.findById(id).populate('user', ['username']);
        if (!pin) {
            return res.status(404).json({ message: 'Pin not found' });
        }
        res.json(pin);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};

exports.deletePin = async (req, res) => {
    const id = req.params.id;
    try {
        const pin = await Pin.findById(id);
        if (!pin) {
            return res.status(404).json({ message: 'Pin not found' });
        }
        if (pin.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }
        await pin.remove();
        res.json({ message: 'Pin removed' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};

exports.updatePin = async (req, res) => {
    const id = req.params.id;
    const { title, description } = req.body;
    try {
        let pin = await Pin.findById(id);
        if (!pin) {
            return res.status(404).json({ message: 'Pin not found' });
        }
        if (pin.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }
        const result = await cloudinary.uploader.upload(req.file.path);
        const updatedPin = {
            title,
            description,
            imageUrl: result.secure_url,
        };
        pin = await Pin.findByIdAndUpdate(id, { $set: updatedPin }, { new: true });
        res.json(pin);
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
}