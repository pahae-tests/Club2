export default function handler(req, res) {
    const { code } = req.body;
    return res.status(200).json(code === "uXjW908mLkJQ" ? "success" : "failed");
}