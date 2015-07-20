Deployment Instructions
====================

These instructions are for deploying the Northwind website on a machine using Visual Studio. If you would like to run the website on IIS, you will need to modify the instructions a bit.

1. Go to https://github.com/JarvisJ/North-PM
2. Click the "Download Zip" button.
3. Unzip the downloaded file.
4. Open Northwind.sln in Visual Studio.
	+ I developed the project on VS 2013. 
	+ Deployment could be complicated if run on a different version of Visual Studio.
5. Modify the connection strings in the web.config file to point to your Northwind database.
	+ The data source value in the NorthwindDbContext connection string is set to "GALENA-PC\SQLEXPRESS", which will need to be changed.
6. Click the run/debug button.

Known Bugs
---------------------

* Depending on the width of your browser, the Bar Chart may overlap with the data table.