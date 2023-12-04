SER-531-HomicideTrackerAndAnalyser
=======================
## Introduction
Homicide tracker and analyser is a web application that allows users to view and analyse homicide data for United States. The app uses SPARQL queries to retrieve data from an RDF instance file created from homicide and hate crime databases. The app also allows users to view the homicide data in a tabular format.

# Preprocessing of Dataset
The databases were preprocessed using Python pandas (SourceCode/Data Preprocessing/combine.py) where unwanted data was filtered out and data was optimised, after which it was made into one combined database. The RDF instance file was created from this combined database using Celfie in Protege. The transformation rules used for creating the RDF instance file are present in the SourceCode/Data Preprocessing/rules.json file.

# Setting up the Fuseki Server in AWS EC2
1. Create an AWS EC2 instance
2. Install Java 8
3. Download Apache Jena Fuseki
4. Start Fuseki server
5. Create a dataset
6. Upload the RDF instance file to the dataset


ssh -i key.pem ec2-user@54.191.86.183
cd apache-jena-fuseki-4.10.0/
java -jar fuseki-server.jar --update --mem /homicide_tracker_and_analyser (For creating the dataset)
java -jar fuseki-server.jar --update --mem /homicide_tracker_and_analyser /homicide_tracker_and_analyser.owl (For uploading the RDF instance file to the dataset) or after fuseki server is up, add the data (rdf_final.rdf present in the ontologies folder).

http://54.191.86.183:3030 (Fuseki endpoint)

# Setting up the web application in AWS EC2 (React based)
1. Create an AWS EC2 instance
2. Install Node.js
3. Install npm
4. Install yarn
5. Install git
6. Clone the repository
7. Install the dependencies
8. Start the application


We have used React for the front end and Node.js for the backend. We are using the AWS hosted EC2 instance with Fuseki to respond to the SPARQL queries. The React application is hosted on localhost. The React application is configured to send the SPARQL queries to the Fuseki server. The Fuseki server responds to the SPARQL queries and the React application displays the results.