<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# DEV

1. Clone the proyect
2. copy the __.env.template__ and rename to __.env__
```
cp .env.template .env
```

3. Generate seed JWT:
```
node -e "console.log(require('crypto').randomBytes(32).toString('base64'));"
```

4. Execute
```
yarn or npm install
```

5. Run container DB
```
docker-compose up -d
```

6. run app:
```
yarn start:dev
```

7. Graphql PlayGround
```
localhost:3000/graphql
```