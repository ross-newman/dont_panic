# Dont Panic
This is not a test, well actually it is but lets run with it.

This MangoDB search function queries a back end database for names. Below are the setup and install instructions for running this sample code application

## Test Environment

The host OS for the purpose of testing wast Windows 10 x64 and the setup instructions below are for this host only but can easily be run under UNIX/ Linux or OS X.

Instaled components
* MongoDB Comunity Server (3.6.5)
* MongoDB Community Stable Edition (1.13.1)
> NOTE: When installing MongoDB Community Server under Windows 10 you may get an error installing Compass. Deselect Compass and reinstall. Use the stand alone installer to install Compass to resolve this issue.

### Node.JS and MongoDB setup
To setup the server under Windows 10 first create the database directory the run ther server:
```
md \data\db
"C:\Program Files\MongoDB\Server\3.6\bin\mongod.exe"
```
All other dependancies are described in [package.json](./package.json). All front end depandancies are also instaled using bowser.
```
npm install
```
