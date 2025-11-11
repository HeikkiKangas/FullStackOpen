interface BmiValues {
  value1: number;
  value2: number;
}

const parseArguments = (args: string[]): BmiValues => {
  if (args.length < 4) throw new Error('Not enough arguments');
  if (args.length > 4) throw new Error('Too many arguments');

  if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
    return {
      value1: Number(args[2]),
      value2: Number(args[3])
    };
  } else {
    throw new Error('Provided values were not numbers!');
  }
};

const calculateBmi = (height: number, weight: number): string => {
  const heightMeters = height / 100;
  const bmi = weight / (heightMeters * heightMeters);
  let txt: string;
  if (bmi < 16) {
    txt = 'Underweight (Severe thinness)';
  } else if (bmi < 17) {
    txt = 'Underweight (Moderate thinness)';
  } else if (bmi < 18.5) {
    txt = 'Underweight (Mild thinness)';
  } else if (bmi < 25) {
    txt = 'Normal range';
  } else if (bmi < 30) {
    txt = 'Overweight (Pre-obese)';
  } else if (bmi < 35) {
    txt = 'Obese (Class I)';
  } else if (bmi < 40) {
    txt = 'Obese (Class II)';
  } else {
    txt = 'Obese (Class III)';
  }
  return txt;
};

try {
  const { value1, value2 } = parseArguments(process.argv);
  console.log(calculateBmi(value1, value2));
} catch (e) {
  let errorMessage = 'Something went wrong.';
  if (e instanceof Error) {
    errorMessage += 'Error: ' + e.message;
  }
  console.log(errorMessage);
}

export default calculateBmi;
