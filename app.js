const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const PORT = process.env.PORT || 3000

const app = express()

const items = ['Buy food', 'Cook food', 'Eat food']
const list = []

app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
app.use(express.static('public'))

mongoose.connect('mongodb://localhost:27017/todolistDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name field is required']
    }
})

const Item = mongoose.model('Item', itemSchema)

const buy = new Item({ name: 'Buy food' })
const cook = new Item({ name: 'Cook food' })
const eat = new Item({ name: 'Eat food' })
const defaults = [buy, cook, eat]

// Item.insertMany([buy, cook, eat], (err) => {
//     err ? console.error(err) : console.log('Items saved successfully.')
// })

const listSchema = new mongoose.Schema({
    name: {
        type: String
    },
    items: [itemSchema]
})

const List = mongoose.model('List', listSchema)

app.get('/', (req, res) => {

    Item.find((err, items) => {
        if (!err) {
            res.render('list', { title: 'Today', items })
        }
    })
})

app.get('/:route', (req, res) => {
    const route = req.params.route
    List.findOne({ name: route }, (err, match) => {
        if (!err) {
            if (!match) {
                // Create a new list
                const list = new List({ name: route, items: [] })
                list.save()
                res.redirect('/' + route)
            } else {
                // Show existing list
                res.render('list', { title: route, items: match.items })
            }
        }
    })
})

// app.post('/', (req, res) => {
//     const name = req.body.item
//     if (req.body.list === 'Work') {
//         list.push(name)
//         res.redirect('/work')
//     } else {
//         const item = new Item({ name })
//         item.save()
//         res.redirect('/')
//     }
// })

app.post('/', (req, res) => {
    const name = req.body.item
    const listName = req.body.list
    const item = new Item({ name })

    if ( listName === 'Today') {
        item.save()
        res.redirect('/')
    } else {
        console.log(listName)
        List.findOne({ name: listName }, (err, match) => {
            if (!err) {
                match.items.push(item)
                match.save()
                res.redirect('/' + listName)
            }
        })
    }
})

app.post('/delete', (req, res) => {
    const id = req.body.item
    // Item.deleteOne({_id: id}, (err) => console.error(err))
    Item.findByIdAndRemove(id, (err) => {
        if (!err) {
            console.log('Item successfully removed!')
        }
    })
     res.redirect('/')
})

// app.get('/work', (req, res) => {
//     const title = 'Work List'
//     res.render('list', { title, items: list })
// })

app.get('/about', (req, res) => {
    res.render('about')
})

app.listen(PORT, () => console.log(`Listening at: http://localhost:${PORT}/`))