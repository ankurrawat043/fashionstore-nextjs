import cimage from "@/img.json";

export default function handler(req, res) {
  res.status(200).json(cimage);
}
