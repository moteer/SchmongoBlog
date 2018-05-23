web: java $JAVA_OPTS -Xmx256m -jar build/libs/*.war --spring.profiles.active=prod,heroku --server.port=$PORT --spring.data.mongodb.database=$(echo "$MONGODB_URI" | sed "s/^.*:[0-9]*\///g")
