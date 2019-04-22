# Wearables Research - PHP Web Server

# Deployment
* Push your changes to the remote repository (GitHub):
```
$ git push origin <branch_name>
```
* SSH into `context-aware.sandbox.csun.edu`
```
$ ssh <your_username>@context-aware.sandbox.csun.edu
```
* From your user root, switch to the webserver folder:
```
$ cd /var/www/html
```
* Switch to the root user. You'll be prompted for your password:
```
$ sudo su
```
* Pull from the remote repository. It is currently named `origin`. You'll be prompted for your GitHub login:
```
$ git pull origin master
```

If you're looking to serve a new branch that isn't `master`, first fetch the remote branch:
```
$ git fetch origin
```

Now you should be able to create a new branch that tracks that remote branch:
```
$ git checkout -b my_branch_name origin/my_branch_name
```

Otherwise, if that branch already exists locally on the context-aware server, just pull the changes:
```
$ git checkout my_branch_name
$ git pull origin my_branch_name
```
