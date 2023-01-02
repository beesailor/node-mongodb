const express = require('express');
const authenticate = require('../authenticate');
const cors = require('./cors');
const Favorite = require('../models/favorite');
const favoriteRouter = express.Router();
favoriteRouter
    .route('/')
    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Favorite.find({ user: req.user._id })
            .populate('user')
            .populate('campsites')
            .then((favorites) => {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json(favorites)
            })
            .catch(err => next(err));
    })
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({user: req.user._id})
        .then((favorite) => {
            if (favorite) {
                req.body.forEach((e) => {
                    if (!favorite.campsites.includes(e._id)) {
                        favorite.campsites.push(e._id)
                    }
                })
                favorite.save()
                    .then((favorite) => {
                        res.statusCode = 200
                        res.setHeader('Content-type', 'application/json')
                        res.json(favorite)
                    })
                    .catch((err) => next (err))
            } else {
                Favorite.create({user: req.user._id})
                    .then(favorite => {
                        req.body.forEach((e) => {favorite.campsites.push(e._id)})
                        favorite
                            .save()
                            .then(favorite => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(favorite)
                            })
                            .catch(err => next(err));
                })
                .catch(err => next(err))
            }
        })
        .catch(err => next(err));   
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.setHeader('Conttent-Type', 'text/plain');
    res.end('PUT operation not supported on /favorites');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOneAndDelete({user: req.user._id})
    .then(favorite => {
        res.statusCode = 200;
        if (favorite) {
            res.setHeader('Content-Type', 'application/json');
            res.json(favorite);
        } else {
            res.setHeader('Content-Type', 'text/plain');
            res.end('You do not have any favorites to delete.')
        };
    })
    .catch(err => next(err));
})

favoriteRouter.route('/:campsiteId')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'text/plain');
    res.end('GET operation not supported on /favorites');
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({user: req.user._id})
    .then(favorite =>  {
        if (favorite) {
            if (!favorite.campsites.includes(req.params.campsiteId)) {  
                favorite.campsites.push(req.params.campsiteId)
                favorite.save()
                .then(favorite => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'text/plain');
                    res.json(favorite)
                })
                .catch(err => (err));
            } else {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/plain');
                res.end('That campsite is already in the list of favorites');
            }
        } else {
            Favorite.create({user: req.user._id, campsites: [req.params.campsiteId]})
                .then(favorite => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                })
                .catch(err => next(err));
        }
    })   
})     

.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.setHeader('Conttent-Type', 'text/plain');
    res.end('PUT operation not supported on /favorites/${req.params.campsiteID}');
})

.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({user: req.user._id})
    .then(favorite =>{
        if (favorite) {
            if (favorite.campsites.includes(req.params.campsiteId)) {
                favorite.campsites = favorite.campsites.filter((campsite) => campsite.toString() !== req.params.campsiteId);
                favorite.save()
                .then(favorite => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'text/plain');
                    res.json(favorite);
                })
                .catch(err => next(err));
            } else {
                res.statusCode = 200
                res.setHeader('Content-Type', 'text/plain');
                res.end('This campsite is not included in your favorites.');
            }
        } else {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain');
            res.end('You do not have any favorites to delete.');
        }
    })
    .catch(err => next(err));
});

module.exports = favoriteRouter;