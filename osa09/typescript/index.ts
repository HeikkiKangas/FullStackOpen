import express from 'express';
import calculateBmi from "./bmiCalculator";
import calculateExercises from "./exerciseCalculator";
const app = express();

app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  const { height, weight } = req.query;
  if (!height || !weight || isNaN(Number(height)) || isNaN(Number(weight))) {
    res.send({ error: 'malformed parameters' });
  }
  const result = calculateBmi(Number(height), Number(weight));
  res.send({ height, weight, bmi: result });
});

app.post('/exercises', (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { daily_exercises, target } = req.body;
  if (!daily_exercises || !target) {
    res.status(400).send({ error: 'missing parameters' });
  } else if (isNaN(Number(target))) {
    res.status(400).send({ error: 'malformed parameters' });
  }
  const hours = daily_exercises as number[];
  hours.forEach((exercise) => {
    if (isNaN(Number(exercise))) {
      res.status(400).send({ error: 'malformed parameters' });
    }
  });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const result = calculateExercises(daily_exercises, target);
  res.send(result);
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});