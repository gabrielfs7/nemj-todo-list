# INSTALL EXPRESS

$ npm install -g express
$ npm install -g express-generator

# CREATE APPLICATION

$ express nodewebapp

# INSTALL MONGODB

$ brew update
$ brew install mongodb

# CREATE MONGO DATABASE

$ sudo mkdir /data/db
$ sudo mongod
$ mongo

use nodewebappdb (inside mondo console)


# INSTALL PROJECT DEPENDENCIES

$ npm install
$ npm install mongoose --save
$ npm install body-parser --save
$ npm install method-override --save

# TEST WORKING

$ npm start

Access in the browser: http://127.0.0.1:3000/


# INSTALL SASS

$ gem install sass

# RUNNING GULP TASKS

$ gulp bower
$ gulp icons
$ gulp css

# INSTALL COMPASS (Framework for Sass)

gem update --system
gem install compass