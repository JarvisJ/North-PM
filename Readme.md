Deployment Instructions
====================

These instructions are for deploying the Northwind website on a machine using Visual Studio. If you would like to run the website on IIS, you will need to modify the instructions a bit.

1. Go to https://github.com/JarvisJ/North-PM
2. Click the "Download Zip" button.
3. Unzip the downloaded file.
4. Open Northwind.sln in Visual Studio.
	+ This project was developed in VS 2013. 
	+ Deployment may be complicated if run on a different version of Visual Studio.
	+ Eg, you will need to need to install the Entity Framework if running a version of VS prior to 2013.
5. Modify the connection strings in the web.config file to point to your Northwind database.
	+ The data source value in the NorthwindDbContext connection string is set to "GALENA-PC\SQLEXPRESS", which will need to be changed.
6. Click the run/debug button.

I do not think anything else needs to be installed on your machine, but please let me know if you run into any difficulties.

The website itself is, hopefully, fairly self explanatory. One thing that might be overlooked is the search box at the top of the webpage, which can be used to filter the supplier table.

Known Bugs
---------------------

* Depending on the width of your browser, the Bar Chart may overlap with the data table.