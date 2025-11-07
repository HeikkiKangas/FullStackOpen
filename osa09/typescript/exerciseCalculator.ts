interface ExerciseResult {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

interface ExerciseValues {
  target: number;
  hours: number[];
}

const parseArgs = (args: string[]): ExerciseValues => {
  if (args.length < 4) throw new Error('Not enough arguments');
  for (let i = 2; i < args.length; i++) {
    if (isNaN(Number(args[i]))) {
      throw new Error('Provided values were not numbers!')
    }
  }
  return {
    target: Number(args[2]),
    hours: args.slice(3).map(n => Number(n))
  }
}

const calculateExercises = (hours: number[], target: number): ExerciseResult => {
  const average = hours.reduce((a, b) => a + b, 0) / hours.length
  const roundedAverage = Math.round(average)

  let success: boolean, rating: number, ratingDescription: string;

  if (roundedAverage > target) {
    success = true;
    rating = 3;
    ratingDescription = 'Great'
  } else if (roundedAverage === target) {
    success = true;
    rating = 2;
    ratingDescription = 'Not great, not terrible'
  } else {
    success = false;
    rating = 1;
    ratingDescription = 'Terrible'
  }

  return {
    periodLength: hours.length,
    trainingDays: hours.filter(h => h > 0).length,
    success,
    rating,
    ratingDescription,
    target,
    average
  }
}

try {
  const { target, hours } = parseArgs(process.argv);
  console.log(calculateExercises(hours, target))
} catch (e) {
  let errorMessage = 'Something went wrong.';
  if (e instanceof Error) {
    errorMessage += 'Error: ' + e.message;
  }
  console.log(errorMessage);
}
