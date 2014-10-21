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
## Every time you deploy
* Commit the relevant changes to git
* scale the website to prepare for deployment:
```bash
azure site scale mode standard <SITE_NAME>
```
* Push to the 'azure' remote
```bash
git push azure master
```
* Scale your site back down so that its not using your azure credit!
```bash
azure site scale mode free <SITE_NAME>
```

## Other useful info on the deployed site

* In order to snoop around the deployed server, go to <SITE_NAME>.scm.azurewebsites.net and log in using your azure git username and password. There you can go to the powershell debug console and look at the file system of the website. 

* To see if there is anything different between your local repo and the repo in the azure website, call:
```bash
git diff master azure/master
```
