const express = require('express');
const sqlite = require('sqlite3').verbose();
const cors = require('cors');
const port = 3001;

const app = express();
const db = new sqlite.Database('database.db');


app.use(cors());
app.use(express.json());

app.get('/items', (req, res) => {
    db.all('SELECT * FROM products', [], (error, data) => {
        if(error) {
            console.error(error);
        } else {
            res.send(data);
        }
    })
})

app.get('/items/:id', (req, res) => {
    const id = req.params.id;

    db.get('SELECT * FROM products WHERE id = ?', [id], (error, data) => {
        if(error) {
            console.error(error);
        } else {
            res.send(data);
        }
    })
})

app.get('/basket', (req, res) => {
    db.all('SELECT * FROM basket', [], (error, data) => {
        if(error) {
            console.error(error);
        } else {
            res.send(data);
        }
    })
})

app.post('/createitem', (req, res) => {
    const { name, price, img, description } = req.body;
    
    db.run('INSERT INTO products (name, price, img, description) VALUES (?, ?, ?, ?)', [name, price, img, description], (error) => {
        if (error) {
            console.error(error);
        } else {
            res.send('created');
        }
    } )
})

app.put('/update', (req, res) => {
    const { id, name, price, img, description } = req.body;

    db.run('UPDATE products SET name = ?, price = ?, img = ?, description = ? WHERE id = ?', [name, price, img, description, id], (error) => {
        if (error) {
            console.error(error);
        } else {
            res.send('updated');
        }
    })
})

app.delete('/delete', (req, res) => {
    const { id } = req.body;

    db.run('DELETE FROM products WHERE id = ?', [id], (error, data) => {
        if (error) {
            console.error(error);
        } else {
            res.send('deleted');
        }
    })  
})

app.post('/', (req, res) => {
    const { id, name, price, img } = req.body;

    db.get('SELECT count FROM basket WHERE product_id = ?', [id], (err, data) => {
        if(err) {
            console.log(err);
        } else {
            console.log(data);
            if (!data) {
                const count = 1;
                db.run('INSERT INTO basket (product_id, name, price, img, count) VALUES (?, ?, ?, ?, ?)', [id, name, price, img, count], (error) => {
                    if (error) {
                        console.error(error);
                    } else {
                        res.send('added');
                    }
                } )
            } else {
                const newCount = data.count + 1;
                db.run('UPDATE basket SET count = ? WHERE product_id = ?', [newCount, id], (error, data) => {
                    if(error) {
                        console.error(error);
                    } else {
                        res.send('added');
                    }
                })
            }
        }
    })
})

app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
})
