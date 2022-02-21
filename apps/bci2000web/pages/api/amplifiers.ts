//? Sends amplifier configuration
import amplifiers from "../../server/config/amplifiers.json";
export default function handler(req, res) {
  res.json(amplifiers);
}
