# MiniTMS Project (Mini Transportation Management System Project)
### Old Pain Points
  - There is no proof of the exact time when a driver picks up and drops off goods. Because the driver will send a confirmation for pick-up and drop-off at any time they want, logistics admins must follow.
  - Pick-up and drop-off times from the driver are not real-time.

### New Solutions
  - Make an application that allows drivers to submit evidence of pickup and drop-off goods, including real-time times, to the operating database.
  - It takes no more than 2 minutes to complete the application loop.

I used Retool (backend workflow, graphic interface, and frontend software development).

### This image is the first page of the mobile application for drivers.

![miniTMS1](https://github.com/petchanawat/MiniTMS/assets/158483894/9cdb4d48-575f-48d5-a7ae-2c296f01a8bd)


### This image is the second page of the mobile application for choosing the driver's name, password, and date of pick-up and drop-off of goods.

![miniTMS2](https://github.com/petchanawat/MiniTMS/assets/158483894/f9c894e0-946a-4ed9-8d46-8a6ab09a6cf6)


### This image is the main page of the mobile application for showing and interacting with drivers. When they pick up or drop off goods, they have to attach an evidence image of at least three.
### Click switch for submit, then the timestamp will be sent to Airtable's operating database, and the image will be sent to Retool's database list. [listData.js](https://github.com/petchanawat/MiniTMS/blob/main/listData.js) is the script for GET data from the operating database; 1 record has to be unpivot to 2 because it has a 2-point pick-up and drop-off.

![miniTMS3](https://github.com/petchanawat/MiniTMS/assets/158483894/8402612c-ef8c-4249-945a-c5f1155c1b48)


### This image is a confirmation of the update of data that drivers did to the operating database. [updateData.js](https://github.com/petchanawat/MiniTMS/blob/main/updateData.js) is the script for GET data and then PATCH data from the user interface to the operating database.

 ![miniTMS5](https://github.com/petchanawat/MiniTMS/assets/158483894/f876ccf1-2fc9-41e9-a1b1-8166095465e7)


### Drivers will do so until the last drop-off point of the day at the end of the day and do so again tomorrow.






