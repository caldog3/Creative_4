const express = require('express');
const bodyParser = require('body-parser');

const app = express();
// to use bodyParser
// to accept incoming POST requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//sets up a directory caled "public" that will serve, just like an ordinary web server
app.use(express.static('public'))

let items = [];
let id = 0;

app.get('/api/items', (req, res) => {
  res.send(items);
});

app.post('/api/items', (req, res) => {
  id = id + 1;
  let item = {id:id, text:req.body.text, bally:req.body.bally, priority:req.body.priority, completed: req.body.completed};
  items.push(item);
  res.send(item);
});

app.put('/api/items/:id', (req, res) => {
  let id = parseInt(req.params.id);
  let itemsMap = items.map(item => { return item.id; });
  let index = itemsMap.indexOf(id);
  let item = items[index];
  item.completed = req.body.completed;
  item.priority = req.body.priority;
  item.bally = req.body.bally;
  item.text = req.body.text;
  // handle drag and drop re-ordering
  if (req.body.orderChange) {
    let indexTarget = itemsMap.indexOf(req.body.orderTarget);
    items.splice(index,1);
    items.splice(indexTarget,0,item);
  }
  res.send(item);
});

app.delete('/api/items/:id', (req, res) => {
  let id = parseInt(req.params.id);
  let removeIndex = items.map(item => { return item.id; }).indexOf(id);
  if (removeIndex === -1) {
    res.status(404).send("Sorry, that item doesn't exist");
    return;
  }
  items.splice(removeIndex, 1);
  res.sendStatus(200);
});



app.listen(3004, () => console.log('Server listening on port 3004!'))
