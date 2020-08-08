export default function convertHoursToMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number); //split divide a string pelo :, map pega cada item e transforma em um Number, desestrutura o array pra pegar cada parte
  const timeInMinutes = hours * 60 + minutes;

  return timeInMinutes;
}
