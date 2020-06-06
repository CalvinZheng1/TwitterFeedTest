const Twitter = require('twitter');

module.exports = (app, io) => {
    let twitter = new Twitter({
        consumer_key: process.env.REACT_APP_CONSUMER_KEY,
        consumer_secret: process.env.REACT_APP_CONSUMER_SECRET,
        access_token_key: process.env.REACT_APP_TWITTER_ACCESS_TOKEN_KEY,
        access_token_secret: process.env.REACT_APP_TWITTER_ACCESS_TOKEN_SECRET
    });

    let socketConnection;
    let twitterStream;

   let twitterID = '1169723316669566976'
   let twitterID2 = '724478906829426688'

    const stream = () => {
        console.log('Resuming for ' + twitterID);
        twitter.stream('statuses/filter', { follow: twitterID }, (stream) => {
            stream.on('data', (tweet) => {
                sendMessage(tweet);
            });

            stream.on('error', (error) => {
                console.log(error);
            });

            twitterStream = stream;
        });
    }

    const stream2 = () => {
        console.log('Resuming for ' + twitterID2);
        twitter.stream('statuses/filter', { follow: twitterID2 }, (stream) => {
            stream.on('data', (tweet) => {
                sendMessage(tweet);
            });

            stream.on('error', (error) => {
                console.log(error);
            });

            twitterStream = stream;
        });
    }

    //Establishes socket connection.
    io.on("connection", socket => {
        socketConnection = socket;
        stream();
        stream2();
        socket.on("connection", () => console.log("Client connected"));
        socket.on("disconnect", () => console.log("Client disconnected"));
    });

    const sendMessage = (msg) => {
        if (msg.text.includes('RT')) {
            return;
        }
        socketConnection.emit("tweets", msg);
    }
};