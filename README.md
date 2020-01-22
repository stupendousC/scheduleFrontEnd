# SCHEDULE PLUS PLUS
### Front end website for admin and employee use

This is my capstone project for <a href="https://adadevelopersacademy.org">Ada Developers Academy</a>.  I made this in 4 weeks, and that includes the front end (what you see right here), and the [back end](https://github.com/stupendousC/schedule).  

The front end is written in Javascript with React, and it's deployed via AWS S3, you can find it [here](http://schedplusplus.s3-website-us-west-2.amazonaws.com/).

The back end is written in Java using the Spring Boot framework, plus PostgreSQL database.  Deployed via AWS Elastic Beanstalk [here](http://schedplusplusbackend.us-west-2.elasticbeanstalk.com).

***

## WHAT DOES SCHEDULE PLUS PLUS DO?

This website is inspired by my time working at a temp staffing agency.  Whenever a client contacts the agency requesting someone to work a shift, the office would consult the master calendar and start calling employees one by one until they get a 'yes'.  Yes they do text and email too, but the nature of a temp staffing agency sometimes does necessitate urgent responses and that's why phone calls are a big part of their daily workload.

I myself was an employee, and if I'm further down the line, then I won't get a chance at these shifts if someone else got called first.  So coming from an employee's perspective, FOMO (Fear of Missing Out) does plague me especially since my last name starts with W.

What about for the people at the office?  Surely they can automate some of their phone tasks and individual texts, thus free themselves up for other things.  

1. If such an app exists, that would automatically generate a list of which employees are available, and texts them all for you, wouldn't that be great?  

2. Also, the employees can just grab the shifts on a first come first serve basis, that way they get an equal chance of work, wouldn't that be awesome too?  

3. And what if, instead of employees individually emailing in their own availability schedules, they can just manage their own days on/off via their own employee dashboard, wouldn't that also be just wonderful?

YES, YES, and YES!  Says Schedule Plus Plus, and that is what I set out to do.

***

## HOW TO SET UP ON MY OWN COMPUTER?
Requirements: You need a Twilio account if you want to enable texting, which YOU DO.
You need some way of deploying it, I used AWS 3S

1. git clone it

1B. You need environment variables!

2. npm install

3. npm run deploy

4. yarn build

5. npm run

6. deploy on AWS 3S
