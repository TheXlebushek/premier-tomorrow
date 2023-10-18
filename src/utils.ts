/**
 * Chooses the right one in dependence of the number
 * @param value how much
 * @param wordOne word for one
 * @param wordTwo word for two
 * @param wordFive word for five
 * @returns correct word
 */
export function num2Word(
    value: number,
    wordOne: string,
    wordTwo: string,
    wordFive: string
): string {
    value = Math.abs(value);
    if (value > 10 && value < 20) return wordFive;
    value = value % 10;
    if (value > 1 && value < 5) return wordTwo;
    if (value == 1) return wordOne;
    return wordFive;
}
