# Deployment

This is a deployment guide for the CMPUT 401 Virtual Gym project on an instance running Ubuntu 18.04. It is based on
[this deployment guide](https://www.digitalocean.com/community/tutorials/how-to-set-up-django-with-postgres-nginx-and-gunicorn-on-ubuntu-18-04).

## Setup

### 1. Install required dependencies

```shell
sudo apt install python3-pip python3-dev libpq-dev postgresql postgresql-contrib nginx
sudo add-apt-repository ppa:deadsnakes/ppa
sudo apt-get install python3.8
sudo snap install --classic heroku
```

### 2. Add an ssh key to your instance

Add an ssh key to your instance if you haven't already done so with this [guide](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account).

## Part 1: Deploying the backend

### 1. Clone repository to `~/`

```shell
git clone git@github.com:UAlberta-CMPUT401/virtual-gym.git
```

### 2. Installing backend dependencies

```shell
# cd into the server directory
cd ~/virtual-gym/server

# Create a venv
virtualenv venv --python=python3

# Activate your virtual environment
virtualenv venv --python=python3

# Install Python dependencies
pip install -r requirements.txt

```

### 3. Set up postgres user

```shell
# Start psql
sudo -u postgres psql

# Create database
CREATE DATABASE vg_db;

# Create user and password 
CREATE USER hero WITH PASSWORD 'VGdash123#';

# Grant database permissions to the new user
GRANT ALL PRIVILEGES ON DATABASE vg_db TO hero;

# Exit (ctrl+D)
```

### 4. Modify properties in Django settings
Head to `~/virtual-gym/server/virtualgym/settings.py` with the text editor of your choice and modify the "DATABASES" property like so.

```
...
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'vg_db',
        'USER': 'hero',
        'PASSWORD': 'VGdash123#',
        'HOST': 'localhost',
        'PORT': 5432,
    }
}
...
```
You may choose to use any database name, username, or password of your choice, just make sure it matches the database credentials you created in step 3.

Next, set debug to false

```
...
DEBUG = false
...
```

Finally, add the domain or ip address of the server you want to serve this application from to the "ALLOWED_HOSTS" list.

```
...
ALLOWED_HOSTS = [your_server_domain_or_ip]
...
```

### 5. Set up Django project

Some housekeeping we need to do with the Django project after we create our database. 

```shell
cd ~/virtual-gym/server/virtualgym

# Migrate your database
python3 manage.py makemigrations
python3 manage.py migrate

# Create a superuser (You will need this if you want to access the Django admin panel)
python3 manage.py createsuperuser

# Collect static files 
python3 manage.py collectstatic
```

### 6. Configure Gunicorn
Head to `/etc/systemd/system/gunicorn.socket` or create the file if it does not exist. Modify it with your text editor of choice like so (with sudo). 

```
[Unit]
Description=gunicorn socket

[Socket]
ListenStream=/run/gunicorn.sock

[Install]
WantedBy=sockets.target
```

Head to `/etc/systemd/system/gunicorn.service` or create the file if it does not exist. Modify it with your text editor of choice like so (with sudo). Replace "ubuntu" with the username you're currently using on your ubuntu command line.

```
[Unit]
Description=gunicorn daemon
Requires=gunicorn.socket
After=network.target

[Service]
User=ubuntu
Group=www-data
WorkingDirectory=/home/ubuntu/virtual-gym/server/virtualgym
ExecStart=/home/ubuntu/virtual-gym/server/server/virtualgym/venv/bin/gunicorn \
          --access-logfile - \
          --workers 3 \
          --bind unix:/run/gunicorn.sock \
          virtualgym.wsgi:application

[Install]
WantedBy=multi-user.target
```

Now, head back to the command line and run the following commands.

```shell
# Restart the daemon
sudo systemctl daemon-reload

# Start the gunicorn socket
sudo systemctl start gunicorn.socket

# enable the gunicorn socket
sudo systemctl enable gunicorn.socket

```

### 7. Configure Nginx

Head to `/etc/nginx/sites-available/virtualgym` or create the file if it does not exist. Modify it with your text editor of choice like so (with sudo). Replace "your_server_domain_or_ip" with the domain or ip address of the server you want to serve the application from.  

```
server {
    listen 80;
    listen [::]:80;
    server_name your_server_domain_or_ip;

    location = /favicon.ico { access_log off; log_not_found off; }
    location /static/ {
        root /home/ubuntu/virtual-gym/server/virtualgym;
    }

    location / {
        include proxy_params;
        proxy_pass http://unix:/run/gunicorn.sock;
    }
}
```
Head back to the command line and run the following commands.

```shell

# Test nginx for syntax errors
sudo nginx -t

# Restarting Nginx
sudo systemctl restart nginx

# Allowing regular traffic
sudo ufw allow 'Nginx Full'

```

You should now be able to access the backend Django application by requesting your server domain or ip from a browser. This concludes the 

## Part 2: Deploying the frontend

### 1. Create a Heroku account

You can create a Heroku account [here](https://signup.heroku.com/) if you don't already have one. Otherwise login to your Heroku account

### 2. Install Heroku's command line tool

```shell
# Install the heroku CL tool
sudo snap install --classic heroku
```

### 3. Login to Heroku from the command line

```shell
heroku login -i
```

You will now be prompted to enter your Heroku credentials

### 4. Create your Heroku application

Run the following command to create your application, you can replace "your-app-name" with the name you want to call the app. Keep in mind this name will be seen by end users.

```shell
heroku create your-app-name
```

### 5. Log into Heroku and add the React buildpack

Log into Heroku, and go to your application settings. You should see an option to add a buildpack

![image](https://user-images.githubusercontent.com/43189616/161120584-937fbd03-b9b3-4820-abf6-e9b11cded6a6.png)

Select "Add buildpack" and add `https://buildpack-registry.s3.amazonaws.com/buildpacks/mars/create-react-app.tgz` as your first buildpack. Select "Save Changes".

### 6. Push to Heroku master

Go to the root of the virtual-gym repository, which should be `~/virtual-gym` and use this command to push.

```shell
git subtree push --prefix client heroku master
```

It will take a few minutes to build, afterwards you'll be able to access your application from the browser, the url will be in the terminal output. If you want to make changes to the frontend, make sure to commit your changes and run `git subtree push --prefix client heroku master` to apply your changes. 

## Part 3: Setting up Google Cloud Platform for Google Auth

This step is **required** for the Google Auth functionalites (Login/SignUp using Google Account) to work.

### 1. Create Project 

Go to the Google Cloud Platform [Credentials Page](https://console.developers.google.com/apis/credentials). On the right, you can see the option to ```CREATE PROJECT```. Click on it to get to the **New Project** page. On this page, you have to fill `Project Name` and `Location`. Now, click on `Create` to generate a new project.

### 2. Create OAuth client ID

Now, you are back at the **Credentials Page** in the previous step. Click `Create credentials` and choose `OAuth client ID` If this is the first time you are on this screen and you do not have `OAuth Consent Screen` yet, you have to register the **Consent Screen** before you can move on. This part is straight forward as you only have to fill in information that is related to the app.
<br/>

After you are done registering the **Consent Screen**, you can go back and create `OAuth client ID` In the `OAuth client ID` screen, choose `Web Application` in the `Application Type` input field. Now you have to fill in the ```Name``` for your token. 
<br/>

Under `Authorized JavaScript origins`, click `ADD URI`. If you are working with `local`, enter the address of your **local frontend address** (e.g. `http://localhost:3000`). In addition, for this to work on the **production address**, add new URI and fill it with your **production address** (e.g. `http://virtual-gym-dashboard.herokuapp.com`). Under `Authorized redirect URIs`, you fill in the same addresses you have for `Authorized JavaScript origins`.
<br/>

If the app is not working, please consider adding a `/` at the end of the `Authorized redirect URIs`.
<br/>

Now, click `SAVE` and you should be provided with the `Client ID`.

### 3. Add Client ID to the frontend application

Under the root directory of the proect, go to `client/src/utils/` and look for `config.js` file. Replace the `clientId` variable with the `Client ID` you generated from previous step.
<br/>

You should be able to have **Google Auth** to work in the app now.


## Troubleshooting

### 1. Troubleshooting Postgresql

You can check the status of Postgresql like so.

```shell
sudo systemctl status postgresql
```

You can start and enable Postgresql with these commands.

```shell
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

Also make sure that the `DATABASE` properties in your Django project's `settings.py` is configured correctly.

### 2. Troubleshooting Nginx

You can access Nginx's error logs with this command.

```shell
sudo tail -F /var/log/nginx/error.log
```

If you change the Nginx server block configurations, you can test and restart nginx with the following commands.

``` shell
sudo nginx -t && sudo systemctl restart nginx
```

### 3. Troubleshooting Gunicorn

You can check the status of your `gunicorn.socket`.

```shell
sudo systemctl status gunicorn.socket
```

You can use this to check the logs of gunicorn.

```shell
sudo journalctl -u gunicorn

```

You can use this to check the logs of `gunicorn.socket`.

```shell
sudo journalctl -u gunicorn.socket
```

If you make changes to your `gunicorn.socket' or 'gunicorn.service', you will need to reload your daemon and restart the processes like so.

```shell
sudo systemctl daemon-reload
sudo systemctl restart gunicorn.socket gunicorn.service
```

If you make changes to your Django applications, you will need to restart gunicorn like so for the changes to apply.

```shell
sudo systemctl restart gunicorn
```

### 4. Troubleshooting Heroku

You can view your Heroku logs from your Heroku application's dashboard on the browser. Alternatively, you can also view them from the CL with `heroku logs --tail`. You can also reference the [Heroku docs](https://devcenter.heroku.com/categories/reference) for more information.

### 5. Further troubleshooting

Here are more logging tools that you can use.

```shell
# Check the Nginx process logs
sudo journalctl -u nginx

# Check the Nginx access logs
sudo less /var/log/nginx/access.log

# Check the Nginx error logs
sudo less /var/log/nginx/error.log

# Check the Gunicorn application logs
sudo journalctl -u gunicorn

# Check the Gunicorn socket logs
sudo journalctl -u gunicorn.socket
```

This deployment guide is based off [here](https://www.digitalocean.com/community/tutorials/how-to-set-up-django-with-postgres-nginx-and-gunicorn-on-ubuntu-18-04#step-11-troubleshooting-nginx-and-gunicorn). You can use this as a reference if you're still running into issues. 


### Changing IP Addresses:
The frontend components make API calls to the backend components. To change between development and production addresses, go to the file config.js in `client/src/utils/config.js`

Change thes `address` variable to either `devAddress` or `productionAddress` as needed.
