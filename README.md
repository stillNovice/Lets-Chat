# Lets-Chat
A group chat web application that can run on multiple clients on same network. Made with Love using Node.js, Express.js, Socket.io, Jquery-emoji-picker, HTML and CSS.

# Installation
### Windows
```sh
$ git clone https://github.com/stillNovice/Lets-Chat.git
$ cd Lets-Chat
$ npm install
$ xcopy node_modules\jquery-emoji-picker\css public\css\
$ xcopy node_modules\jquery-emoji-picker\js public\js\
$ node app.js

```
### Linux
```sh
$ git clone https://github.com/stillNovice/Lets-Chat.git
$ cd Lets-Chat
$ npm install
$ mkdir public/css && cp -r node_modules/jquery-emoji-picker/css/* public/css/
$ mkdir public/js && cp -r node_modules/jquery-emoji-picker/js/* public/js/
$ node app.js

```
# Usage
1. Open Chrome
2. Go to localhost:8478
3. Enter the name you wish to appear in the Chat section
4. Tell your friends and make them join too (if they are on the same network).
5. Enjoy

# What's new here :
1. Online/Away functionality. (All the online users are shown with a green online dots left of their names, and all the offline users have yellow dots).
2. Emoji Picker to add emojis along with text messages.
