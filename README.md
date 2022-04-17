# quiz-platform
A platform which provides services for online quizs. React Typscript + Node Express


# Run program
## front end

cd frontend
npm i
npm run dev

## back end

```shell
# init database
cd backend
npm i
cd db
npx sequelize-cli db:create # create local db
npx sequelize-cli db:migrate # migrate models

# run backend
cd .. # go back to backend dir
npm run dev
```

## open http://localhost:8080 or http://localhost:8080/admin for admin page