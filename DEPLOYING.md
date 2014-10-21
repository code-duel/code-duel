# Deploying

The following steps will allow you to deploy code-duel in azure.

## On your first time deploying

* Install the azure cli with:
```bash
npm install -g azure-cli
```
* Download credentials with:
```bash
azure account download
```
* Import them for use with the cli 
```bash
azure account import <FILE_PATH>
```
* Make sure that the current field of the Bizspark account is set to true:
```bash
azure account list
```
* cd into your directory
* Create a new azure website (within your code-duel directory). This will add azure as a remote in git:
```bash
azure site create <NAME_OF_SITE> --git
```
* Add the node environmental variable for production with:
```bash
azure site config add NODE_ENV=production
```
* 
