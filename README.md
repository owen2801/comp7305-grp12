COMP7305 Group12 - Stack Overflow Data Analysis

#####Dataset Location######
hdfs:///stackoverflow/TrainPosts26G.xml


#####Software Installation######

-----To install Docker

1. curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
2. sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
3. sudo apt-get update
4. apt-cache policy docker-ce
5. sudo apt-get install -y docker-ce
6. check docker status with: sudo systemctl status docker


-----To install RabbitMQ

1. docker run -d --name rabbitmq --publish 5671:5671 \
 --publish 5672:5672 --publish 4369:4369 --publish 25672:25672 --publish 15671:15671 --publish 15672:15672 \
rabbitmq:management



-----To install Hive
1. sudo wget http://apache.website-solution.net/hive/hive-1.2.2/apache-hive-1.2.2-bin.tar.gz

2. sudo vim /etc/profile & sudo vim ~/.bashrc
Add:
export HIVE_HOME=/opt/apache-hive-1.2.2-bin
export PATH=$PATH:$HIVE_HOME/bin
source /etc/profile

3. sudo vim /opt/apache-hive-1.2.2-bin/bin/hive-config.sh
Add:
export HADOOP_HOME=/opt/hadoop-2.7.5

4. sudo chown -R  hduser:hadoop ./apache-hive-1.2.2-bin
hadoop fs -mkdir -p /user/hive/warehouse
hadoop fs -mkdir -p /user/hive/tmp
hadoop fs -mkdir -p /user/hive/log
hadoop fs -chmod -R 777 /user/hive/warehouse
hadoop fs -chmod -R 777 /user/hive/tmp
hadoop fs -chmod -R 777 /user/hive/log

5. sudo vim /opt/apache-hive-1.2.2-bin/conf/hive-site.xml
Amend:
<property>  
    <name>hive.exec.scratchdir</name>  
    <value>/user/hive/tmp</value>  
</property>
<property>  
    <name>hive.querylog.location</name>  
    <value>/user/hive/log/hadoop</value>  
    <description>Location of Hive run time structured logfile</description>  
</property>
<property>  
    <name>javax.jdo.option.ConnectionUserName</name>  
    <value>root</value>  
    <description>Username touse against metastore database</description>  
</property> 
<property>  
    <name>javax.jdo.option.ConnectionPassword</name>  
    <value>root</value>  
    <description>password to useagainst metastore database</description>  
</property> 
<property>
    <name>hive.exec.local.scratchdir</name>
    <value>/opt/apache-hive-1.2.2-bin/tmp/${user.name}</value>
    <description>Local scratch space for Hive jobs</description>
</property>

6. cd /opt/apache-hive-1.2.2-bin/conf
mv hive-env.sh.template hive-env.sh
sudo vim hive-env.sh
Add:
HADOOP_HOME=/opt/hadoop-2.7.5
export HIVE_CONF_DIR=/opt/apache-hive-1.2.2-bin/conf
export SPARK_HOME=/opt/spark-2.2.1-bin-hadoop2.7

7. Run Hive:
/opt/apache-hive-1.2.2-bin/bin/hive


-----To install Sqoop

1. Download sqoop from [here](http://archive.apache.org/dist/sqoop/1.4.6/)

2. cd /home/lina/Software/Hadoop/
tar xzf sqoop-1.4.6.bin__hadoop-2.0.4-alpha.tar.gz -C /opt/Hadoop/

3. cd /opt/Hadoop
mv sqoop-1.4.6.bin__hadoop-2.0.4-alpha sqoop-1.4.6

4. sudo vi ~/.bashrc 
   export SQOOP_HOME=/opt/Hadoop/sqoop-1.4.6
   export PATH=$PATH:$SQOOP_HOME/bin 
   source ~/.bashrc
5. cd /opt/Hadoop/sqoop-1.4.6/conf
cp sqoop-env-template.sh sqoop-env.sh

6. download mysql-connector-java-5.1.42-bin.jar into /opt/Hadoop/sqoop-1.4.6/lib/

7. Testing with sqoop version

 
-----To install MySQL

1. sudo apt-get install mysql-server

2. Run MySQL: mysql -u root -proot


-----To install Electron
1. Download and install nodejs on your local machine from https://nodejs.org/en/
2. There are 2 options as described below:
**Option 1. (Only support MacOS) Run the image directly on a MacOS machine

Download the repository from https://github.com/owen2801/comp7305-grp12.git
Open the "dist" folder, click "comp7305-grp12-1.0.0.dmg"
Move the "comp7305-grp12.app" to Application Folder

**Option 2. Run from the source code

#### Clone this repository or download directly git clone https://github.com/owen2801/comp7305-grp12.git ####
or
download from https://github.com/owen2801/comp7305-grp12.git
#### Go into the repository ####
cd comp7305-grp12
#### Install dependencies ####
npm install
#### Run the app ####
npm start


#####Train Model######
-----To train model
(File name:ALS_train.scala; Location: hduser@student33 desktop)

1. Open Spark Shell command:
/opt/spark-2.2.1-bin-hadoop2.7/bin/spark-shell --master yarn --num-executors 12 --executor-cores 2 --executor-memory 2G

2. Run train model in scala command:
:load ALS_train.scala


-----Configuration files
/etc/xen-tools/xen-tools.conf
/opt/hadoop-2.7.5/etc/hadoop/mapred-site.xml
/opt/hadoop-2.7.5/etc/hadoop/yarn-site.xml

#####Start Server######

/opt/spark-2.2.1-bin-hadoop2.7/bin/spark-submit --master yarn PredictionService.py