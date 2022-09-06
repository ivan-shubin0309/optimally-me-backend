**Prerequisites**

```
nest-cli
aws-sam-cli
docker
sequelize-cli
```


**New entity creation**

`nest generate app <entity-name>`

After running command above new folder named entity-name will be created. There will be tsconfig.app.json file inside apps/entity-name/ folder. In config we must change outDir like in snippet below.

original tsconfig:
`"outDir": "../../dist/apps/<entity-name>"`

should be:
`"outDir": "../../dist/apps"`

After that new function should be added to template.yaml and Makefile.

**Database migrations and seeds**

```
npx sequelize db:seed --seed <seed-name> --url mysql://<user>:<password>@<host>:<port>/<db-name> --debug
npx sequelize db:migrate --url mysql://<user>:<password>@<host>:<port>/<db-name>
```

**Docker setup**

```
docker network create <network-name>
docker run --name mysql --net <network-name> -e MYSQL_ROOT_PASSWORD=<password> -v /storage/mysql-storage/datadir:/var/lib/mysql -d mysql
docker run -d --name redis --net <network-name> redis/redis-stack-server:latest
```

**Testing the API Gateway Endpoint locally**

```
NODE_ENV=<env> sam local start-api --docker-network <network-name> --warm-containers LAZY
NODE_ENV=local sam local start-lambda --docker-network <network-name> --warm-containers LAZY --host <docker-network-host>
nest build <entity-name> --watch
```

.aws-sam folder should be deleted for this to work. sam firstly look into that folder when starting local api.

**Build with custom env**

`sudo sam build -u --skip-pull-image --container-env-var NODE_ENV=example`


**Deployment**

```
sam build
sam deploy
```
