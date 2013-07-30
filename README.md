google-map-demo
===============

Real Time Traffic on Google Map

Steps to run

1. Set up apache to log user lat/long in apache access log files. Instructions are available at http://2mohitarora.blogspot.com/2013/07/log-user-lat-and-long-in-apache-log.html
2. Set up logstash to send log file events to redis (Detailed instructions will be posted soon)
3. npm install
4. node app.js
5. Hit localhost:3000
6. Hit the application deployed on (or passing via) apache configured in step 1
7. See the magic


How to setup logstash:

# Install Java
$ yum install java-1.7.0-openjdk -y

# Create a directory to install logstash
$ mkdir /opt/logstash

# Install logstash
$ cd /opt/logstash
$ wget https://logstash.objects.dreamhost.com/release/logstash-1.1.13-monolithic.jar -O logstash.jar

# Create a directory for logstash configuration
$ mkdir /etc/logstash

# Create a directory for logstash logs
$ mkdir /var/log/logstash

# Create a file for logstash configuration
$ touch /etc/logstash/shipper.conf

# Add following configuration to /etc/logstash/shipper.conf

input {
     file {
         type => "test"
         path => ["/var/log/httpd/access_log"]
         debug => true
     }
}
filter {
    grep {
       type => "test"
         match => [ "@message", "(.+)" ]
         add_tag => [ "grepped" ]
    }
    date {
         type => "test"
         timestamp => "ISO8601"
         add_tag => [ "dated" ]
    }
    grok {
         type => "test"
         tags => "dated"
         pattern => "%{COMBINEDAPACHELOG}"
    }
}
output {
     stdout {
          debug => true
     }
     redis {
         host => "grouper.redistogo.com"
         data_type => "channel"
         key => "logstash"
         password => "000548c2b12beffac99de909eb4b2df4"
         port => "9487"
     }
}

# Running logstash
java -jar /opt/logstash/logstash.jar agent -v -f /etc/logstash/shipper.conf --log /var/log/logstash/shipper.log &
