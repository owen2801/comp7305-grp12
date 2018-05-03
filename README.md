# COMP7305 Group12 - Stack Overflow Data Analysis

**The Dataset We Used**

Download from [here](https://archive.org/details/stackexchange)

In our case, we only use part of the dataset to train our model (total 26gb, select posts data from 2008 to 2014)

**Installation Step**

For more detailed installaton, please take a look at [INSTALLATION.md](INSTALLATION.md)

***Step 1***. Make sure the spark server is running

```bash
# After login to student33 machine, type the below command
/opt/spark-2.2.1-bin-hadoop2.7/bin/spark-submit --master yarn PredictionService.py
# Then all the prerequise packages will run
```

***Step 2***. Download and install nodejs on your local machine from [here](https://nodejs.org/en/)

***Step 3***. There are 2 options as described below:

Option 1. (Only support MacOS) Run the image directly on a MacOS machine

```bash
Download the repository from https://github.com/owen2801/comp7305-grp12.git
Open the "dist" folder, click "comp7305-grp12-1.0.0.dmg"
Move the "comp7305-grp12.app" to Application Folder
```

Option 2. Run from the source code

```bash
# Clone this repository or download directly
git clone https://github.com/owen2801/comp7305-grp12.git
or
download from https://github.com/owen2801/comp7305-grp12.git
# Go into the repository
cd comp7305-grp12
# Install dependencies
npm install
# Run the app, please be reminded to start the server service first
npm start
```
