const connectionString = "mongodb+srv://vincey:vincey123@harmonycluster.itr8g.mongodb.net/HarmonyApp?retryWrites=true&w=majority";
const mongoose = require('mongoose')

const userSchema = require('./Schema/userSchema.js')
const collectionSchema = require('./Schema/collectionSchema.js')
const songSchema = require('./Schema/songSchema.js')

const User = mongoose.model('user', userSchema, 'user')
const Collection = mongoose.model('collection', collectionSchema, 'collection')
const Song = mongoose.model('song', songSchema, 'song')

async function createUser(name, password, email, dob) { //User CRUD methods: Create
  return new User({
    name,
    password,
    email,
    dob
  }).save()
}

async function findUser(userObject) { //User CRUD methods: Retrieve
  return await User.findOne(userObject)
}

async function createCollection(name, description, songList) {
  return new Collection({
    name,
    description,
    songList
  }).save()
}

async function findCollection(collectionObject) {
  return await Collection.findOne(collectionObject)
}

async function createSong(title, artist, album, embedLink, imageLink) {
  return new Song({
    title,
    artist,
    album,
    embedLink,
    imageLink
  }).save()
}

async function findSong(songObject) { 
  return await Song.findOne(songObject)
}

(async () => {
  const connector = mongoose.connect(connectionString)
  const name = process.argv[2]
  const description = process.argv[3]

  let collection = await connector
  .then(async () => {
    return findCollection({name: name})
  })
  .catch(error => {console.log(error)});

  if (!collection) {
    collection = await createCollection(name, description)
  }

  collection = await findCollection({name: name})
  song = await findSong({title: "Holding On To You"})
  collection.songList.push(song.id)
  song = await findSong({title: "Saturday Nights"})
  collection.songList.push(song.id)
  await collection.save()

  collection = await findCollection({name: name})
  console.log(collection)

  mongoose.connection.close()
  process.exit(0)
})() //This syntax defines and runs a function simultaneously
