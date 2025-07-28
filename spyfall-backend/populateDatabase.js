const mongoose = require('mongoose');
const Ad = require('./models/Ad');

mongoose.connect('mongodb+srv://gamingtycoon25:ojNKo63pHY3FyVCD@spyfall.7qbq9pk.mongodb.net/?retryWrites=true&w=majority&appName=Spyfall', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

const sampleAds = [
  {
    title: 'Sample Ad 1',
    content: 'This is a sample ad content.',
    url: 'https://example.com',
    image: 'https://example.com/image1.jpg',
    status: 'active',
  },
  {
    title: 'Sample Ad 2',
    content: 'This is another sample ad content.',
    url: 'https://example.com',
    image: 'https://example.com/image2.jpg',
    status: 'active',
  },
];

Ad.insertMany(sampleAds)
  .then(() => {
    console.log('Sample ads inserted successfully');
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('Error inserting sample ads:', err);
    mongoose.connection.close();
  });
