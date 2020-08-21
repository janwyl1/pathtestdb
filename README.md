# Pathology Tests Database

<img
  width="100%"
  alt=""
  src="https://raw.githubusercontent.com/janwyl1/pathtestdb/master/pathtestsdb_screen.PNG"
/>

## About
Provides up to date test information for lab / clinical staff. The aim of the database is to save time/money by reducing the delay caused by lack of information e.g:

### Problem 1:

A request comes into the lab asking for a test called 'Coeliac Screen'. We don't recognise the name of this test so we're unsure of how to process it (it appears on our system as an 'ATTG').

Without the database:  
+ Ask the person next to you what it is
+ If they don't know ask the next person
+ Continue escalating to more senior colleague until you get the answer

This is disruptive as it distracts a number of people from their work. It's not uncommon to have 3 or more people all trying to find the answer. This happens multiple times per day, and it's often the same test names appearing time and again. Answers are often subjective.

With the database:  
+ Type the alias into the database: Coeliac
+ Any potential matches will show up: ATTG
+ If no matches found, follow the pre-database process but add the alias to the database once we've found the answer. This will save time for anyone that runs into the same issue in the future.
+ Answers have been validated by senior staff members

### Problem 2:

Phlebotomist has been asked to take blood from a patient, but they are not sure which container to use.

Without the database:    
+ Ask colleagues
+ Phone the lab

With the database:  
+ Type the code, name or alias into the database
+ Any potential matches will show up

## Instructions

#### Clone the repo 
```
git clone https://github.com/janwyl1/pathtestdb.git
```

Or download and extract the zip file

#### Start the development server
```
npm start
```

#### Run tests
Start the development server and visit localhost:3000/test/testrunner.html for browser based tests

#### Generate Documentation
```
jsdoc js/pathology_tests.js
```
Docs are saved in 'out' folder by default

#### Gulp tasks
```
gulp
```
Default task. Creates production build (saved to 'dist' folder), starts the server, opens the browser to localhost:3000, and watches for changes to HTML/CSS/JS files. You can run each of these individually e.g. 

```
gulp build
gulp startServer
gulp open
gulp watch
```

##  Credits
+ Developers - James and Kevin 
+ Clinicians - Tom, Janet, Anne and Louise
+ Images/Icon - Freepik.com
+ Font - Google Fonts