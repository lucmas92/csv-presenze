export const getWeekDates = (start: Date) => {
    const days = []

    for (let i = 0; i < 5; i++) {
        const d = new Date(start)
        d.setDate(start.getDate() + i)

        days.push(d.toISOString().split('T')[0])
    }

    return days
}

export const getCurrentWeek = () => {
    const now = new Date()

    const day = now.getDay()
    const diff = now.getDate() - day + (day === 0 ? -6 : 1)

    const monday = new Date(now.setDate(diff))

    const days = []

    for (let i = 0; i < 5; i++) {
        const d = new Date(monday)
        d.setDate(monday.getDate() + i)
        days.push(d.toISOString().split('T')[0])
    }

    return days
}

export const getWeekFromMonday = (monday:string) => {
    const start = new Date(monday)
    const days = []

    for (let i = 0; i < 5; i++) {
        const d = new Date(start)
        d.setDate(start.getDate() + i)
        days.push(d.toISOString().split('T')[0])
    }

    return days
}

