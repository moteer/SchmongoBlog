web: java $JAVA_OPTS  -jar build/libs/*.war --spring.profiles.active=prod,heroku --server.port=$PORT --spring.data.mongodb.database=$(echo "$MONGODB_URI" | sed "s/^.*:[0-9]*\///g")
