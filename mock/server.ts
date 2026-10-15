import { createServer } from "http"

function nextWeekday(day: 2 | 5): Date {
	const d = new Date()
	d.setHours(19, 0, 0, 0)
	const diff = (day - d.getDay() + 7) % 7 || 7
	d.setDate(d.getDate() + diff)
	return d
}

const icon = "https://www.meetup.com/favicon.ico"

const data = [
	{
		title: "Mingle Mania",
		link: "https://www.meetup.com/utrechters/events/mock-tuesday",
		date: nextWeekday(2),
		icon
	},
	{
		title: "First Friday's drinks",
		link: "https://www.meetup.com/utrechters/events/mock-friday",
		date: nextWeekday(5),
		icon
	}
].sort((a, b) => a.date.getTime() - b.date.getTime())

createServer((req, res) => {
	if (req.url === "/events") {
		res.setHeader("Content-Type", "application/json")
		res.end(JSON.stringify(data))
	} else {
		res.writeHead(404)
		res.end()
	}
}).listen(3001, () => console.log("mock API on :3001"))
