const express = require('express');
const mysql = require('mysql2');
const bodyParser = require("body-parser");

const app = express();
const _PORT = 5050;

const connection = mysql.createConnection({
	host: process.env.HOST,
	user: process.env.USER,
	database: process.env.DATABASE,
	password: process.env.PASSWORD
});

connection.connect(function(err) {
	if (err) return console.error("Erorr: " + err.message);
	console.log('Connected!');
});

app.use(bodyParser.json());

app.listen(_PORT, () => {
	console.log("Server is running with port " + _PORT);
});

app.get('/albums-db', (req, res) => { //это на запрос всех альбомов
	const sql = 'SELECT * FROM albums';

	connection.query(sql, (err, result) => {
		if (err) {
			console.error('Error ' + err.message);
			return;
		}
		res.send(result);
	});
});

app.get('/albums-db/:id', (req, res) => {
	const albumId = req.params.id;
	const sql = `SELECT * FROM albums WHERE id=${albumId}`;

	connection.query(sql, (err, result) => {
		if (err) {
			console.error('Error ' + err.message);
			return;
		}

		if (result) {
			res.send(result);
		}
	});
})

app.post('/albums-db', (req, res) => {
	if(!req.body) return res.sendStatus(400);
	const requestData = req.body;

	console.log(requestData);

	const sql = `INSERT INTO albums (title, artist, cover, tracksRating, atmosphereRating, bitsRating, textRating, rating) VALUES ('${requestData.title}', '${requestData.artist}', '${requestData.cover}', ${requestData.tracksRating}, ${requestData.atmosphereRating}, ${requestData.bitsRating}, ${requestData.textRating}, ${requestData.rating})`;

	connection.query(sql, (err, result) => {
		if (err) {
			console.error('Error: ' + err.message);
			return;
		}
		res.send(result);
	});
});

app.post('/albums-db/:id', (req, res) => {
	const albumId = req.params.id;
	const requestData = req.body;
	console.log(requestData);

	const sql = `UPDATE albums SET likedTracks='${requestData.newLikedTracks}' WHERE id=${albumId}`;

	connection.query(sql, (err, result) => {
		if (err) {
			console.error('Error ' + err.message);
			return;
		}

		if (result) {
			res.send(result);
		}
	});
})