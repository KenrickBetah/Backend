const hostname = '127.0.0.1'
const port = '3000'

const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const errorhandler = require('errorhandler')
const db = require('./db')

app.use(morgan('dev'))

app.use(express.urlencoded( { extended : true } ))
app.use(express.json())

// Display the data in postgres
app.get('/', async (req, res) => {
    try {
        const result = await db.query(
            `SELECT * 
            FROM students
            ORDER BY id ASC`)
        res.status(200).json({
            status: "success",
            data: result.rows,
        })
    }catch (err) {
        console.error(err)
        res.status(500).send('Internal Server Error')
    }
})

// Adding data to postgres
app.post('/students', async (req, res) => {
    const {name, address} = req.body
    try{
        const result = await db.query(
            `INSERT into students (name, address)
            values ('${name}', '${address}')`
        )
        res.status(200).json({
            status: 'Success',
            message: 'Data has been insert successfully',
        })
    }catch (err) {
        console.error(err)
        res.status(500).send('Internal Server Error')
    }
})

// Display data from postgres by id
app.get('/students/:id', async (req, res) => {
    const id = req.params.id
    try{
        const result = await db.query(
            `SELECT * FROM students WHERE id = '${id}'`
        )
        if (result.rows.length === 0){
            res.status(404).json({
                status: 'Failed',
                message: 'There is no data for this id'
            })
        }else(
            res.status(200).json({
                status:'Success',
                message: 'Data has been fetch successfully',
                data: result.rows,
            })
        )
    }catch(err){
        console.error(err)
        res.status(500).send('Failed to fetch data')
    }
})

// Updating data on postgres by id
app.put('/students/:id', async (req,res)=>{
    const id = req.params.id
    const { name, address } = req.body

    if (!name || !address){
        return res.status(400).send('please provide name and address')
    }
    try{
        const result = await db.query(
            `UPDATE students
            SET name= '${name}', address= '${address}'
            WHERE id = '${id}'`
        )
        res.status(200).json({
            status: 'Success',
            message: 'Data has been updated'
        })
    }catch (err){
        console.error(err)
        res.status(500).send('Failed to update students data')
    }
})

// Deleting data from postgres by id
app.delete('/students/:id', async (req, res) => {
    const id = req.params.id
    try{
        const result = await db.query(
            `DELETE FROM students
            WHERE id = '${id}'`
        )
        res.status(200).json({
            status: 'Success',
            message: 'Data has been deleted from query',
        })
    }catch (err){
        console.error(err)
        res.status(500).send('Failed to delete the student data')
    }
})

app.use((req, res, next) =>
    res.status(404).json({
        status: 'Error',
        message: 'Resource not found',
    })
)

app.listen(port, () =>
    console.log(`Server is running at http://${hostname}:${port}`))