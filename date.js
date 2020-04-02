

module.exports = {
    getDate: () => new Date().toLocaleDateString('en-Us', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    }),

    getDay: () => new Date().toLocaleDateString('en-US', { weekday: 'long' })
}