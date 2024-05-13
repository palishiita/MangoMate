// server/data/index.js

// using mongoose to input data (users and post)

import mongoose from "mongoose";

// USER
const userIds = [
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
];

export const users = [
    {
        _id: userIds[0],
        firstName: "Maya",
        lastName: "Walczik",
        email: "aaaaaaa@gmail.com",
        password: "$2b$10$dsasdgsagasda//G9JxQ4bQ8KXf4OAIe/X/AK9skyWUy",
        picturePath: "p11.jpeg",
        friends: [],
        location: "San Fran, CA",
        occupation: "Software Engineer",
    },
    {
        _id: userIds[1],
        firstName: "Steve",
        lastName: "Ralph",
        email: "thataaa@gmail.com",
        password: "$!FEAS@!O)_IDJda//G9JxQ4bQ8KXf4OAIe/X/AK9skyWUy",
        picturePath: "p3.jpeg",
        friends: [],
        location: "New York, CA",
        occupation: "Economist",
    },
    {
        _id: userIds[2],
        firstName: "Tom",
        lastName: "Harrison",
        email: "someguy@gmail.com",
        password: "da39a3ee5e6b4b0d3255bfef95601890afd80709",
        picturePath: "p4.jpeg",
        friends: [],
        location: "Canada",
        occupation: "Data Scientist Hacker",
    },
    {
        _id: userIds[3],
        firstName: "Whatcha",
        lastName: "Doing",
        email: "whatchadoing@gmail.com",
        password: "$2b$10$dsasdgsagasda//G9JxQ4bQ8KXf4OAIe/X/AK9skyWUy",
        picturePath: "p6.jpeg",
        friends: [],
        location: "Korea",
        occupation: "Educator",
    },
    {
        _id: userIds[4],
        firstName: "Jane",
        lastName: "Doe",
        email: "janedoe@gmail.com",
        password: "$2b$10$dsasdgsagasda//G9JxQ4bQ8KXf4OAIe/X/AK9skyWUy",
        picturePath: "p5.jpeg",
        friends: [],
        location: "Utah, CA",
        occupation: " Machine Learning Engineer",
    },
    {
        _id: userIds[5],
        firstName: "Harvey",
        lastName: "Dunn",
        email: "harveydunn@gmail.com",
        password: "$2b$10$dsasdgsagasda//G9JxQ4bQ8KXf4OAIe/X/AK9skyWUy",
        picturePath: "p7.jpeg",
        friends: [],
        location: "Los Angeles, CA",
        occupation: "Journalist",
    },
    {
        _id: userIds[6],
        firstName: "Carly",
        lastName: "Vowel",
        email: "carlyvowel@gmail.com",
        password: "$2b$10$dsasdgsagasda//G9JxQ4bQ8KXf4OAIe/X/AK9skyWUy",
        picturePath: "p8.jpeg",
        friends: [],
        location: "Chicago, IL",
        occupation: "Nurse",
    },
    {
        _id: userIds[7],
        firstName: "Jessica",
        lastName: "Dunn",
        email: "jessicadunn@gmail.com",
        password: "$2b$10$dsasdgsagasda//G9JxQ4bQ8KXf4OAIe/X/AK9skyWUy",
        picturePath: "p9.jpeg",
        friends: [],
        location: "Washington, DC",
        occupation: "A Student",
    },

];


export const posts = [
    {
      _id: new mongoose.Types.ObjectId(),
      userId: userIds[1],
      firstName: "Steve",
      lastName: "Ralph",
      location: "New York, CA",
      description: "Yummy delicious food!!",
      picturePath: "post1.jpeg",
      userPicturePath: "p3.jpeg",
      likes: [
        { userId: userIds[0], liked: true },
        { userId: userIds[2], liked: true },
        { userId: userIds[3], liked: true },
        { userId: userIds[4], liked: true }
      ],
      comments: [
        {
          _id: new mongoose.Types.ObjectId(),
          userId: userIds[5],
          userFirstName: "Jane",
          userLastName: "Doe",
          userPicturePath: "p5.jpeg",
          commentText: "This is an amazing post, Steve!",
          createdAt: new Date(),
          replies: [
            {
              _id: new mongoose.Types.ObjectId(),
              userId: userIds[1],
              userFirstName: "Steve",
              userLastName: "Ralph",
              userPicturePath: "p6.jpeg",
              replyText: "Thanks, Jane!",
              createdAt: new Date()
            }
          ]
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    },

    {
        _id: new mongoose.Types.ObjectId(),
        userId: userIds[0],
        firstName: "Maya",
        lastName: "Walczik",
        location: "San Fran, CA",
        description: "eggs for breakfast!",
        picturePath: "post2.jpg",
        userPicturePath: "p11.jpeg",
        likes: [
        { userId: userIds[1], liked: true },
        { userId: userIds[2], liked: false }
        ],
        comments: [
        {
            _id: new mongoose.Types.ObjectId(),
            userId: userIds[1],
            userFirstName: "Steve",
            userLastName: "Ralph",
            userPicturePath: "p3.jpeg",
            commentText: "Awesome, Maya!",
            createdAt: new Date(),
            replies: [
            {
                _id: new mongoose.Types.ObjectId(),
                userId: userIds[2],
                userFirstName: "Tom",
                userLastName: "Harrison",
                userPicturePath: "p4.jpeg",
                replyText: "Mouth watering xD",
                createdAt: new Date()
            }
            ]
        }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
    },

    {
        _id: new mongoose.Types.ObjectId(),
        userId: userIds[2],
        firstName: "Tom",
        lastName: "Harrison",
        location: "Canada, CA",
        description: "Party on my mind!",
        picturePath: "post3.jpg",
        userPicturePath: "p4.jpeg",
        likes: [
        { userId: userIds[0], liked: true },
        { userId: userIds[1], liked: true }
        ],
        comments: [],
        createdAt: new Date(),
        updatedAt: new Date()
    },

    {
        _id: new mongoose.Types.ObjectId(),
        userId: userIds[3],
        firstName: "Whatcha",
        lastName: "Doing",
        location: "Korea, CA",
        description: "This amazing firework up the sky!",
        picturePath: "post4.jpg",
        userPicturePath: "p6.jpeg",
        likes: [
        { userId: userIds[0], liked: true },
        { userId: userIds[4], liked: true }
        ],
        comments: [],
        createdAt: new Date(),
        updatedAt: new Date()
    },

    {
        _id: new mongoose.Types.ObjectId(),
        userId: userIds[4],
        firstName: "Jane",
        lastName: "Doe",
        location: "Utah, CA",
        description: "Carnivals!",
        picturePath: "post5.jpg",
        userPicturePath: "p5.jpeg",
        likes: [
        { userId: userIds[3], liked: true }
        ],
        comments: [],
        createdAt: new Date(),
        updatedAt: new Date()
    },

    {
        _id: new mongoose.Types.ObjectId(),
        userId: userIds[5],
        firstName: "Harvey",
        lastName: "Dunn",
        location: "Los Angeles, CA",
        description: "Sunset over the city skyline is just unbeatable!",
        picturePath: "post6.jpg",
        userPicturePath: "p7.jpeg",
        likes: [
          { userId: userIds[1], liked: true },
          { userId: userIds[3], liked: true }
        ],
        comments: [
          {
            _id: new mongoose.Types.ObjectId(),
            userId: userIds[0],
            userFirstName: "Maya",
            userLastName: "Walczik",
            userPicturePath: "p11.jpeg",
            commentText: "Wow, that’s gorgeous! 🌇",
            createdAt: new Date(),
            replies: []
          }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
    },

    {
        _id: new mongoose.Types.ObjectId(),
        userId: userIds[6],
        firstName: "Carly",
        lastName: "Vowel",
        location: "Chicago, IL",
        description: "Wedding Season yo!",
        picturePath: "post7.jpg",
        userPicturePath: "p8.jpeg",
        likes: [
          { userId: userIds[5], liked: true },
          { userId: userIds[7], liked: true }
        ],
        comments: [
          {
            _id: new mongoose.Types.ObjectId(),
            userId: userIds[3],
            userFirstName: "Whatcha",
            userLastName: "Doing",
            userPicturePath: "p6.jpeg",
            commentText: "WOHOOO!",
            createdAt: new Date(),
            replies: []
          }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      },


      {
        _id: new mongoose.Types.ObjectId(),
        userId: userIds[7],
        firstName: "Jessica",
        lastName: "Dunn",
        location: "Washington, DC",
        description: "Congratulations Mr and Mrs Thomson!!!",
        picturePath: "post8.jpg",
        userPicturePath: "p9.jpeg",
        likes: [
          { userId: userIds[6], liked: true },
          { userId: userIds[4], liked: true }
        ],
        comments: [
          {
            _id: new mongoose.Types.ObjectId(),
            userId: userIds[2],
            userFirstName: "Tom",
            userLastName: "Harrison",
            userPicturePath: "p4.jpeg",
            commentText: "Cheers mate! Congrats on the wedding Jay.",
            createdAt: new Date(),
            replies: []
          }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
    }      
];
