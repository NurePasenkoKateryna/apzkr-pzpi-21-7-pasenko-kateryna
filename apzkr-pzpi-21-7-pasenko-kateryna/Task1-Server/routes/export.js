const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Event = require('../models/Event');
const Seat = require('../models/Seat');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');
const Band = require("../models/Band");
const User = require("../models/User");
const Ticket = require("../models/Ticket");

router.get('/event', async (req, res) => {
    try {
        const events = await Event.find().populate('genre').populate('band').populate('seats').exec();

        const workbook = xlsx.utils.book_new();

        const eventSheetData = events.map(event => ({
            "Назва": event.name,
            "Опис": event.description,
            "Жанр": event.genre ? event.genre.name : '',
            "Локація": event.location,
            "Гурт": event.band ? event.band.name : '',
            "Дата": event.date,
            "Кількість місць": event.seatCount
        }));
        const eventSheet = xlsx.utils.json_to_sheet(eventSheetData);
        xlsx.utils.book_append_sheet(workbook, eventSheet, 'Events');

        let seatSheetData = [];
        events.forEach(event => {
            const eventSeats = event.seats.map(seat => ({
                "Назва": event.name,
                "Тип": seat.seatType,
                "Ціна": seat.price
            }));
            seatSheetData = seatSheetData.concat(eventSeats);
        });

        const seatSheet = xlsx.utils.json_to_sheet(seatSheetData);
        xlsx.utils.book_append_sheet(workbook, seatSheet, 'Seats');

        const filePath = path.join(__dirname, '..', 'exports', 'events_and_seats.xlsx');
        xlsx.writeFile(workbook, filePath);

        res.setHeader('Content-Disposition', 'attachment; filename="events_and_seats.xlsx"');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.sendFile(filePath);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/bands', async (req, res) => {
    try {
        const bands = await Band.find().populate('events').populate('genre').exec();

        const workbook = xlsx.utils.book_new();

        const bandSheetData = bands.map(band => ({
            "Назва": band.name,
            "Опис": band.description,
            "Жанр": band.genre ? band.genre.name : 'N/A',
            "Події": band.events.map(event => event.name).join(', ')
        }));

        const bandSheet = xlsx.utils.json_to_sheet(bandSheetData);
        xlsx.utils.book_append_sheet(workbook, bandSheet, 'Bands');

        const filePath = path.join(__dirname, '..', 'exports', 'bands.xlsx');
        xlsx.writeFile(workbook, filePath);

        res.setHeader('Content-Disposition', 'attachment; filename="bands.xlsx"');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.sendFile(filePath);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/users', async (req, res) => {
    try {
        const users = await User.find().populate('tickets').exec();
        const workbook = xlsx.utils.book_new();
        const userSheetData = users.map(user => {
            let roleTranslation;
            switch (user.role) {
                case 'admin':
                    roleTranslation = 'Адміністратор';
                    break;
                case 'user':
                    roleTranslation = 'Користувач';
                    break;
                case 'member':
                    roleTranslation = 'Член гурту';
                    break;
                default:
                    roleTranslation = user.role;
            }

            return {
                "Ім'я": user.firstName,
                "Прізвище": user.lastName,
                "Пошта": user.email,
                "Роль": roleTranslation,
                "Квитки": user.tickets.map(ticket => ticket._id).join(', ')
            };
        });
        const userSheet = xlsx.utils.json_to_sheet(userSheetData);
        xlsx.utils.book_append_sheet(workbook, userSheet, 'Users');

        const filePath = path.join(__dirname, '..', 'exports', 'users.xlsx');
        xlsx.writeFile(workbook, filePath);

        res.setHeader('Content-Disposition', 'attachment; filename="users.xlsx"');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.sendFile(filePath);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
