/* eslint-disable no-case-declarations */

export function evaluateSensor({ sensor, reference }): {
  name: string
  evaluation: string
} {
  const { variant, name, data } = sensor
  const average =
    data.reduce((sum, reading) => sum + reading.value, 0) / data.length

  switch (variant) {
    case 'thermometer':
      const diff = Math.sqrt(
        data.reduce(
          (accumulator, d) => accumulator + Math.pow(d.value - average, 2),
          0,
        ) / data.length,
      )

      let evaluation = ''
      if (Math.abs(average - reference.temperature) <= 0.5 && diff < 3) {
        evaluation = 'ultra precise'
      } else if (
        Math.abs(average - reference.temperature) <= 0.5 &&
        average < 5
      ) {
        evaluation = 'very precise'
      } else {
        evaluation = 'precise'
      }

      return { name, evaluation }

    case 'humidity':
      const humidityInRange = data.every(
        (d) => Math.abs(d.value - reference.humidity) <= 1,
      )
      return { name, evaluation: humidityInRange ? 'keep' : 'discard' }

    case 'monoxide':
      const carbonMonoxideInRange = data.every(
        (d) => Math.abs(d.value - reference.carbonMonoxide) <= 3,
      )
      return {
        name,
        evaluation: carbonMonoxideInRange ? 'keep' : 'discard',
      }
  }
}
