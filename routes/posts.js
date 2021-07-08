const router = require('express').Router();
const verify = require('./verify_token');

router.get('/', verify, (req,res) => {
    res.json({
        posts: {
            title: 'My first post', 
            description: 'sample post ',
        }}
    );
});

module.exports = router;