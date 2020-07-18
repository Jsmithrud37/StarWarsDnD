// const router = require('express').Router();
// import Contact from '../models/Contact.model';

// router.route('/').get((req, res) => {
// 	Contact.find()
// 		.sort({ name: 1 })
// 		.then((contacts) => res.json(contacts))
// 		.catch((err) => res.status(400).json('Error: ' + err));
// });

// router.route('/add').post((req, res) => {
// 	const name = req.body.name;
// 	const race = req.body.race;
// 	const gender = req.body.gender;
// 	const affiliations = req.body.affiliations;

// 	const newContact = new Contact({ name, race, gender, affiliations });

// 	newContact
// 		.save()
// 		.then(() => res.json(`Add contact: ${name}`))
// 		.catch((err) => res.status(400).json('Error: ' + err));
// });

// router.route('/:id').get((req, res) => {
// 	Contact.findById(req.params.id)
// 		.then((contact) => res.json(contact))
// 		.catch((err) => res.status(400).json('Error: ' + err));
// });

// router.route('/:id').delete((req, res) => {
// 	Contact.findByIdAndDelete(req.params.id)
// 		.then(() => res.json(`Deleted contact: ${req.body.name}`))
// 		.catch((err) => res.status(400).json('Error: ' + err));
// });

// router.route('/update/:id').post((req, res) => {
// 	Contact.findById(req.params.id)
// 		.then((contact) => {
// 			contact.name = req.body.name;
// 			contact.race = req.body.race;
// 			contact.gender = req.body.gender;
// 			contact.affiliations = req.body.affiliations;

// 			contact
// 				.save()
// 				.then(() => res.json(`Updated contact: ${req.body.name}`))
// 				.catch((err) => res.status(400).json('Error: ' + err));
// 		})
// 		.catch((err) => res.status(400).json('Error: ' + err));
// });

// module.exports = router;
