import numpy
import pika
import os
import json
from pyspark import SparkConf, SparkContext
from pyspark.sql import HiveContext, Row
from pyspark.sql.functions import col
from pyspark.mllib.recommendation import ALS, MatrixFactorizationModel, Rating


conf = SparkConf().setAppName("ALSPrediction_Server")
sc = SparkContext(conf=conf)
sqlContext = HiveContext(sc)
taghashes = sqlContext.sql("select * from tag_hash")
#taghashes.cache()

model = MatrixFactorizationModel.load(sc, "hdfs:///ALS.model")

#Enable the Logging***************
#sc.setLogLevel("INFO")

# rabbit Method
connection = pika.BlockingConnection(pika.ConnectionParameters(host='student60', port='5672'))
channel = connection.channel()
channel.queue_declare(queue='rpc_queue')



def on_request(ch, method, props, body):
    #n = int(bodry)
    #print(" [.] fib(%s)" % n)
    #response = recommend(n)
    print(body)
    response = 'No idea'
    request = json.loads(str(body))
    if(request.get('type') == 0):
        response = recommend(request.get('id'))
    else:
        response = recommendPosts(request.get('id'))

    #response = "HELLO"
    ch.basic_publish(exchange='',
                     routing_key=props.reply_to,
                     properties=pika.BasicProperties(correlation_id = \
                                                         props.correlation_id),
                     body=response)
    ch.basic_ack(delivery_tag = method.delivery_tag)